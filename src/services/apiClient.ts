// Cliente de API sin hooks para usar en servicios
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-million-htf4bghdfsd5eadt.canadacentral-01.azurewebsites.net';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown | FormData;
  headers?: Record<string, string>;
  isFormData?: boolean;
}

export class ApiClient {
  private static instance: ApiClient;

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  async request<T>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<T | null> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const config: RequestInit = {
        method: options.method || 'GET',
        headers: {
          ...options.headers,
        },
      };

      // Configurar headers y body según el tipo de datos
      if (options.body && options.method !== 'GET') {
        if (options.isFormData || options.body instanceof FormData) {
          // Para FormData, no establecer Content-Type (el navegador lo hace automáticamente)
          config.body = options.body as BodyInit;
        } else {
          // Para JSON
          config.headers = {
            'Content-Type': 'application/json',
            ...options.headers,
          };
          config.body = JSON.stringify(options.body) as BodyInit;
        }
      } else if (!options.isFormData && !(options.body instanceof FormData)) {
        // Solo establecer Content-Type para JSON si no es FormData
        config.headers = {
          'Content-Type': 'application/json',
          ...options.headers,
        };
      }

      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Verificar si la respuesta tiene contenido
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      
      // Si es status 204 (No Content) o no hay contenido, retornar null
      if (response.status === 204 || contentLength === '0' || !contentType?.includes('application/json')) {
        return null;
      }

      // Solo intentar parsear JSON si hay contenido
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

// Instancia singleton para uso directo
export const apiClient = ApiClient.getInstance();
