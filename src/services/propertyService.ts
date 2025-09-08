import { apiClient } from './apiClient';
import { Property } from '../interfaces';
import { 
  PropertyCreateDto, 
  PropertyUpdateDto, 
  PropertyResponseDto, 
  PropertyWithDetailsDto, 
  PropertyFilters 
} from './types';

export class PropertyService {
  private static instance: PropertyService;
  private client = apiClient;

  constructor() {
    // Constructor vacío, usamos la instancia singleton del cliente
  }

  static getInstance(): PropertyService {
    if (!PropertyService.instance) {
      PropertyService.instance = new PropertyService();
    }
    return PropertyService.instance;
  }

  /**
   * Obtener todas las propiedades con filtros opcionales
   * @param filters - Filtros de búsqueda
   */
  async getAllProperties(filters?: PropertyFilters): Promise<PropertyWithDetailsDto[] | null> {
    let endpoint = '/Property';
    
    if (filters) {
      const queryParams = new URLSearchParams();
      
      if (filters.Name) queryParams.append('Name', filters.Name);
      if (filters.Address) queryParams.append('Address', filters.Address);
      if (filters.MinPrice !== undefined) queryParams.append('MinPrice', filters.MinPrice.toString());
      if (filters.MaxPrice !== undefined) queryParams.append('MaxPrice', filters.MaxPrice.toString());
      
      if (queryParams.toString()) {
        endpoint += `?${queryParams.toString()}`;
      }
    }

    return await this.client.request<PropertyWithDetailsDto[]>(endpoint);
  }

  /**
   * Obtener una propiedad por ID
   * @param id - ID de la propiedad (24 caracteres)
   */
  async getPropertyById(id: string): Promise<PropertyWithDetailsDto | null> {
    if (!id || id.length !== 24) {
      throw new Error('El ID debe tener exactamente 24 caracteres');
    }
    return await this.client.request<PropertyWithDetailsDto>(`/Property/${id}`);
  }

  /**
   * Crear una nueva propiedad
   * @param propertyData - Datos de la propiedad a crear
   */
  async createProperty(propertyData: PropertyCreateDto): Promise<Property | null> {
    return await this.client.request<Property>('/Property', {
      method: 'POST',
      body: propertyData
    });
  }

  /**
   * Actualizar una propiedad existente
   * @param id - ID de la propiedad (24 caracteres)
   * @param propertyData - Datos actualizados de la propiedad
   */
  async updateProperty(id: string, propertyData: PropertyUpdateDto): Promise<boolean> {
    if (!id || id.length !== 24) {
      throw new Error('El ID debe tener exactamente 24 caracteres');
    }
    
    try {
      const result = await this.client.request(`/Property/${id}`, {
        method: 'PUT',
        body: propertyData
      });
      
      // Si llegamos aquí sin error, la actualización fue exitosa
      return true;
    } catch (error) {
      console.error('Error updating property:', error);
      return false;
    }
  }

  /**
   * Eliminar una propiedad
   * @param id - ID de la propiedad (24 caracteres)
   */
  async deleteProperty(id: string): Promise<boolean> {
    if (!id || id.length !== 24) {
      throw new Error('El ID debe tener exactamente 24 caracteres');
    }
    
    try {
      const result = await this.client.request(`/Property/${id}`, {
        method: 'DELETE'
      });
      
      // Si llegamos aquí sin error, la eliminación fue exitosa
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      return false;
    }
  }

  /**
   * Buscar propiedades por nombre
   * @param name - Nombre de la propiedad
   */
  async searchPropertiesByName(name: string): Promise<PropertyWithDetailsDto[] | null> {
    return await this.getAllProperties({ Name: name });
  }

  /**
   * Buscar propiedades por dirección
   * @param address - Dirección de la propiedad
   */
  async searchPropertiesByAddress(address: string): Promise<PropertyWithDetailsDto[] | null> {
    return await this.getAllProperties({ Address: address });
  }

  /**
   * Buscar propiedades por rango de precio
   * @param minPrice - Precio mínimo
   * @param maxPrice - Precio máximo
   */
  async searchPropertiesByPriceRange(minPrice?: number, maxPrice?: number): Promise<PropertyWithDetailsDto[] | null> {
    return await this.getAllProperties({ MinPrice: minPrice, MaxPrice: maxPrice });
  }
}

// Instancia singleton para uso directo
export const propertyService = PropertyService.getInstance();
