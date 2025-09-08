import { apiClient } from './apiClient';
import { PropertyImage } from '../interfaces';
import { 
  PropertyImageCreateDto, 
  PropertyImageUpdateDto, 
  PropertyImageDto 
} from './types';

export class PropertyImageService {
  private static instance: PropertyImageService;
  private client = apiClient;

  constructor() {
    // Constructor vacío, usamos la instancia singleton del cliente
  }

  static getInstance(): PropertyImageService {
    if (!PropertyImageService.instance) {
      PropertyImageService.instance = new PropertyImageService();
    }
    return PropertyImageService.instance;
  }

  /**
   * Obtener todas las imágenes de propiedades
   */
  async getAllPropertyImages(): Promise<PropertyImage[] | null> {
    return await this.client.request<PropertyImage[]>('/PropertyImage');
  }

  /**
   * Obtener una imagen de propiedad por ID
   * @param id - ID de la imagen (24 caracteres)
   */
  async getPropertyImageById(id: string): Promise<PropertyImage | null> {
    if (!id || id.length !== 24) {
      throw new Error('El ID debe tener exactamente 24 caracteres');
    }
    return await this.client.request<PropertyImage>(`/PropertyImage/${id}`);
  }

  /**
   * Crear una nueva imagen de propiedad
   * @param imageData - Datos de la imagen a crear
   */
  async createPropertyImage(imageData: PropertyImageCreateDto): Promise<PropertyImage | null> {
    return await this.client.request<PropertyImage>('/PropertyImage', {
      method: 'POST',
      body: imageData
    });
  }

  /**
   * Actualizar una imagen de propiedad existente
   * @param id - ID de la imagen (24 caracteres)
   * @param imageData - Datos actualizados de la imagen
   */
  async updatePropertyImage(id: string, imageData: PropertyImageUpdateDto): Promise<boolean> {
    if (!id || id.length !== 24) {
      throw new Error('El ID debe tener exactamente 24 caracteres');
    }
    
    try {
      await this.client.request(`/PropertyImage/${id}`, {
        method: 'PUT',
        body: imageData
      });
      // Si llegamos aquí sin error, la actualización fue exitosa
      // El endpoint PUT devuelve 204 (No Content), por lo que result será null
      // pero eso indica éxito, no fallo
      return true;
    } catch (error) {
      console.error('Error updating property image:', error);
      return false;
    }
  }

  /**
   * Eliminar una imagen de propiedad
   * @param id - ID de la imagen (24 caracteres)
   */
  async deletePropertyImage(id: string): Promise<boolean> {
    if (!id || id.length !== 24) {
      throw new Error('El ID debe tener exactamente 24 caracteres');
    }
    
    try {
      await this.client.request(`/PropertyImage/${id}`, {
        method: 'DELETE'
      });
      // Si llegamos aquí sin error, la eliminación fue exitosa
      // El endpoint DELETE devuelve 204 (No Content), por lo que result será null
      // pero eso indica éxito, no fallo
      return true;
    } catch (error) {
      console.error('Error deleting property image:', error);
      return false;
    }
  }

  /**
   * Subir imagen de propiedad (nueva imagen)
   * @param propertyId - ID de la propiedad
   * @param file - Archivo de imagen
   * @param enabled - Si la imagen está habilitada (por defecto true)
   */
  async uploadPropertyImage(propertyId: string, file: File, enabled: boolean = true): Promise<boolean> {
    const formData = new FormData();
    formData.append('propertyId', propertyId);
    formData.append('enabled', enabled.toString());
    formData.append('file', file);

    const result = await this.client.request('/PropertyImage/upload', {
      method: 'POST',
      body: formData,
      isFormData: true
    });

    return result !== null;
  }

  /**
   * Subir imagen para una imagen de propiedad existente
   * @param id - ID de la imagen de propiedad (24 caracteres)
   * @param file - Archivo de imagen
   * @param enabled - Si la imagen está habilitada (por defecto true)
   */
  async uploadImageToExistingPropertyImage(id: string, file: File, enabled: boolean = true): Promise<boolean> {
    if (!id || id.length !== 24) {
      throw new Error('El ID debe tener exactamente 24 caracteres');
    }

    const formData = new FormData();
    formData.append('file', file);

    const queryParams = new URLSearchParams();
    queryParams.append('enabled', enabled.toString());

    const result = await this.client.request(`/PropertyImage/${id}/upload?${queryParams.toString()}`, {
      method: 'POST',
      body: formData,
      isFormData: true
    });

    return result !== null;
  }

  /**
   * Habilitar/deshabilitar una imagen de propiedad
   * @param id - ID de la imagen (24 caracteres)
   * @param enabled - Estado de habilitación
   */
  async togglePropertyImageStatus(id: string, enabled: boolean): Promise<boolean> {
    if (!id || id.length !== 24) {
      throw new Error('El ID debe tener exactamente 24 caracteres');
    }

    // Primero obtenemos la imagen actual
    const currentImage = await this.getPropertyImageById(id);
    if (!currentImage) {
      throw new Error('Imagen no encontrada');
    }

    // Actualizamos solo el estado enabled
    return await this.updatePropertyImage(id, {
      file: currentImage.file,
      enabled: enabled,
      idProperty: currentImage.idProperty
    });
  }
}

// Instancia singleton para uso directo
export const propertyImageService = PropertyImageService.getInstance();
