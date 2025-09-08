// Exportar todos los servicios
import { ownerService, OwnerService } from './ownerService';
import { propertyService, PropertyService } from './propertyService';
import { propertyImageService, PropertyImageService } from './propertyImageService';
import { propertyTraceService, PropertyTraceService } from './propertyTraceService';

export { ownerService, propertyService, propertyImageService, propertyTraceService };
export { apiClient, ApiClient } from './apiClient';

// Exportar todos los tipos DTOs
export * from './types';

// Clase principal para manejar todos los servicios
export class ApiService {
  public readonly owner = ownerService;
  public readonly property = propertyService;
  public readonly propertyImage = propertyImageService;
  public readonly propertyTrace = propertyTraceService;

  private static instance: ApiService;

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }
}

// Instancia singleton para uso directo
export const apiService = ApiService.getInstance();
