import { apiClient } from './apiClient';
import { PropertyTrace } from '../interfaces';
import { 
  PropertyTraceCreateDto, 
  PropertyTraceUpdateDto 
} from './types';

export class PropertyTraceService {
  private static instance: PropertyTraceService;
  private client = apiClient;

  constructor() {
    // Constructor vacío, usamos la instancia singleton del cliente
  }

  static getInstance(): PropertyTraceService {
    if (!PropertyTraceService.instance) {
      PropertyTraceService.instance = new PropertyTraceService();
    }
    return PropertyTraceService.instance;
  }

  /**
   * Obtener todos los rastros de propiedades
   */
  async getAllPropertyTraces(): Promise<PropertyTrace[] | null> {
    return await this.client.request<PropertyTrace[]>('/PropertyTrace');
  }

  /**
   * Obtener un rastro de propiedad por ID
   * @param traceId - ID del rastro (24 caracteres)
   */
  async getPropertyTraceById(traceId: string): Promise<PropertyTrace | null> {
    if (!traceId || traceId.length !== 24) {
      throw new Error('El ID debe tener exactamente 24 caracteres');
    }
    return await this.client.request<PropertyTrace>(`/PropertyTrace/${traceId}`);
  }

  /**
   * Obtener todos los rastros de una propiedad específica
   * @param propertyId - ID de la propiedad (24 caracteres)
   */
  async getPropertyTracesByPropertyId(propertyId: string): Promise<PropertyTrace[] | null> {
    if (!propertyId || propertyId.length !== 24) {
      throw new Error('El ID debe tener exactamente 24 caracteres');
    }
    return await this.client.request<PropertyTrace[]>(`/PropertyTrace/property/${propertyId}`);
  }

  /**
   * Crear un nuevo rastro de propiedad
   * @param traceData - Datos del rastro a crear
   */
  async createPropertyTrace(traceData: PropertyTraceCreateDto): Promise<PropertyTrace | null> {
    return await this.client.request<PropertyTrace>('/PropertyTrace', {
      method: 'POST',
      body: traceData
    });
  }

  /**
   * Actualizar un rastro de propiedad existente
   * @param id - ID del rastro (24 caracteres)
   * @param traceData - Datos actualizados del rastro
   */
  async updatePropertyTrace(id: string, traceData: PropertyTraceUpdateDto): Promise<boolean> {
    if (!id || id.length !== 24) {
      throw new Error('El ID debe tener exactamente 24 caracteres');
    }
    
    try {
      await this.client.request(`/PropertyTrace/${id}`, {
        method: 'PUT',
        body: traceData
      });
      // Si llegamos aquí sin error, la actualización fue exitosa
      // El endpoint PUT devuelve 204 (No Content), por lo que result será null
      // pero eso indica éxito, no fallo
      return true;
    } catch (error) {
      console.error('Error updating property trace:', error);
      return false;
    }
  }

  /**
   * Eliminar un rastro de propiedad
   * @param id - ID del rastro (24 caracteres)
   */
  async deletePropertyTrace(id: string): Promise<boolean> {
    if (!id || id.length !== 24) {
      throw new Error('El ID debe tener exactamente 24 caracteres');
    }
    
    try {
      await this.client.request(`/PropertyTrace/${id}`, {
        method: 'DELETE'
      });
      // Si llegamos aquí sin error, la eliminación fue exitosa
      // El endpoint DELETE devuelve 204 (No Content), por lo que result será null
      // pero eso indica éxito, no fallo
      return true;
    } catch (error) {
      console.error('Error deleting property trace:', error);
      return false;
    }
  }

  /**
   * Crear un rastro de venta para una propiedad
   * @param propertyId - ID de la propiedad
   * @param saleData - Datos de la venta
   */
  async createSaleTrace(
    propertyId: string, 
    saleData: {
      dateSale: string;
      value: number;
      tax: number;
      name: string;
    }
  ): Promise<PropertyTrace | null> {
    const traceData: PropertyTraceCreateDto = {
      ...saleData,
      idProperty: propertyId
    };

    return await this.createPropertyTrace(traceData);
  }

  /**
   * Obtener el historial completo de una propiedad
   * @param propertyId - ID de la propiedad (24 caracteres)
   */
  async getPropertyHistory(propertyId: string): Promise<PropertyTrace[] | null> {
    return await this.getPropertyTracesByPropertyId(propertyId);
  }

  /**
   * Calcular el total de impuestos de una propiedad
   * @param propertyId - ID de la propiedad (24 caracteres)
   */
  async calculateTotalTaxes(propertyId: string): Promise<number> {
    const traces = await this.getPropertyTracesByPropertyId(propertyId);
    
    if (!traces) {
      return 0;
    }

    return traces.reduce((total, trace) => total + trace.tax, 0);
  }

  /**
   * Calcular el valor total de ventas de una propiedad
   * @param propertyId - ID de la propiedad (24 caracteres)
   */
  async calculateTotalSalesValue(propertyId: string): Promise<number> {
    const traces = await this.getPropertyTracesByPropertyId(propertyId);
    
    if (!traces) {
      return 0;
    }

    return traces.reduce((total, trace) => total + trace.value, 0);
  }
}

// Instancia singleton para uso directo
export const propertyTraceService = PropertyTraceService.getInstance();
