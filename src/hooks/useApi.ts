import { useState, useEffect } from 'react';

// URL base de la API desde variable de entorno
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-million-htf4bghdfsd5eadt.canadacentral-01.azurewebsites.net';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any | FormData;
  headers?: Record<string, string>;
  isFormData?: boolean;
}

export function useApi<T>(endpoint: string, options: ApiOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

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
          config.body = options.body;
        } else {
          // Para JSON
          config.headers = {
            'Content-Type': 'application/json',
            ...options.headers,
          };
          config.body = JSON.stringify(options.body);
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

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (endpoint) {
      fetchData();
    }
  }, [endpoint]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Hook específico para hacer peticiones manuales
export function useApiRequest() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const request = async <T>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

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
          config.body = options.body;
        } else {
          // Para JSON
          config.headers = {
            'Content-Type': 'application/json',
            ...options.headers,
          };
          config.body = JSON.stringify(options.body);
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

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    request,
    loading,
    error,
  };
}

// Ejemplos de uso:
/*
// 1. Petición JSON normal
const { data, loading, error } = useApi<Property[]>('/properties');

// 2. Petición POST con JSON
const { request } = useApiRequest();
const createProperty = async (property: Property) => {
  const result = await request<Property>('/properties', {
    method: 'POST',
    body: property
  });
};

// 3. Petición con FormData (para subir archivos)
const uploadFile = async (file: File, propertyId: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('idProperty', propertyId);
  
  const result = await request<PropertyImage>('/property-images', {
    method: 'POST',
    body: formData,
    isFormData: true
  });
};

// 4. Petición con FormData usando useApi
const { data, loading, error } = useApi<PropertyImage[]>('/property-images', {
  method: 'POST',
  body: formData,
  isFormData: true
});
*/
