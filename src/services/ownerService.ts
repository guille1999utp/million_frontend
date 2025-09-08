import { apiClient } from './apiClient';
import { Owner } from '../interfaces';
import { OwnerCreateDto, OwnerUpdateDto, OwnerWithPropertiesDto } from './types';

export class OwnerService {
  private static instance: OwnerService;
  private client = apiClient;

  constructor() {
    // Constructor vacío, usamos la instancia singleton del cliente
  }

  static getInstance(): OwnerService {
    if (!OwnerService.instance) {
      OwnerService.instance = new OwnerService();
    }
    return OwnerService.instance;
  }

  /**
   * Obtener todos los propietarios
   */
  async getAllOwners(): Promise<Owner[] | null> {
    return await this.client.request<Owner[]>('/Owner');
  }

  /**
   * Obtener un propietario por ID
   * @param id - ID del propietario (24 caracteres)
   */
  async getOwnerById(id: string): Promise<Owner | null> {
    if (!id || id.length !== 24) {
      throw new Error('El ID debe tener exactamente 24 caracteres');
    }
    return await this.client.request<Owner>(`/Owner/${id}`);
  }

  /**
   * Crear un nuevo propietario
   * @param ownerData - Datos del propietario a crear
   */
  async createOwner(ownerData: OwnerCreateDto): Promise<Owner | null> {
    return await this.client.request<Owner>('/Owner', {
      method: 'POST',
      body: ownerData
    });
  }

  /**
   * Actualizar un propietario existente
   * @param id - ID del propietario (24 caracteres)
   * @param ownerData - Datos actualizados del propietario
   */
  async updateOwner(id: string, ownerData: OwnerUpdateDto): Promise<boolean> {
    if (!id || id.length !== 24) {
      throw new Error('El ID debe tener exactamente 24 caracteres');
    }
    
    try {
      const result = await this.client.request(`/Owner/${id}`, {
        method: 'PUT',
        body: ownerData
      });
      
      // Si llegamos aquí sin error, la actualización fue exitosa
      // El endpoint PUT devuelve 204 (No Content), por lo que result será null
      // pero eso indica éxito, no fallo
      return true;
    } catch (error) {
      console.error('Error updating owner:', error);
      return false;
    }
  }

  /**
   * Eliminar un propietario
   * @param id - ID del propietario (24 caracteres)
   */
  async deleteOwner(id: string): Promise<boolean> {
    if (!id || id.length !== 24) {
      throw new Error('El ID debe tener exactamente 24 caracteres');
    }
    
    try {
      const result = await this.client.request(`/Owner/${id}`, {
        method: 'DELETE'
      });
      
      // Si llegamos aquí sin error, la eliminación fue exitosa
      // El endpoint DELETE también puede devolver 204 (No Content)
      return true;
    } catch (error) {
      console.error('Error deleting owner:', error);
      return false;
    }
  }

  /**
   * Obtener un propietario con sus propiedades
   * @param id - ID del propietario (24 caracteres)
   */
  async getOwnerWithProperties(id: string): Promise<OwnerWithPropertiesDto | null> {
    if (!id || id.length !== 24) {
      throw new Error('El ID debe tener exactamente 24 caracteres');
    }
    return await this.client.request<OwnerWithPropertiesDto>(`/Owner/${id}/with-properties`);
  }

  /**
   * Subir foto de un propietario
   * @param id - ID del propietario (24 caracteres)
   * @param file - Archivo de imagen
   */
  async uploadOwnerPhoto(id: string, file: File): Promise<boolean> {
    if (!id || id.length !== 24) {
      throw new Error('El ID debe tener exactamente 24 caracteres');
    }

    const formData = new FormData();
    formData.append('file', file);

    const result = await this.client.request(`/Owner/${id}/upload-photo`, {
      method: 'POST',
      body: formData,
      isFormData: true
    });

    return result !== null;
  }
}

// Instancia singleton para uso directo
export const ownerService = OwnerService.getInstance();
