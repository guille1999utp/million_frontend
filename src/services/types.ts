// DTOs para Owner
export interface OwnerCreateDto {
  name?: string;
  address?: string;
  photo?: string;
  birthday: string;
}

export interface OwnerUpdateDto {
  name?: string;
  address?: string;
  photo?: string;
  birthday: string;
}

export interface OwnerWithPropertiesDto {
  id?: string;
  name?: string;
  address?: string;
  photo?: string;
  birthday: string;
  properties?: PropertyWithDetailsDto[];
}

// DTOs para Property
export interface PropertyCreateDto {
  name?: string;
  address?: string;
  price: number;
  codeInternal?: string;
  year: number;
  idOwner?: string;
}

export interface PropertyUpdateDto {
  name?: string;
  address?: string;
  price: number;
  codeInternal?: string;
  year: number;
  idOwner?: string;
}

export interface PropertyResponseDto {
  id?: string;
  idOwner?: string;
  name?: string;
  address?: string;
  price: number;
  imageUrl?: string;
}

export interface PropertyWithDetailsDto {
  id?: string;
  name?: string;
  address?: string;
  price: number;
  codeInternal?: string;
  year: number;
  idOwner?: string;
  owner?: OwnerInfoDto;
  images?: PropertyImageDto[];
  traces?: PropertyTraceDto[];
}

export interface OwnerInfoDto {
  id?: string;
  name?: string;
  address?: string;
  photo?: string;
  birthday: string;
}

// DTOs para PropertyImage
export interface PropertyImageCreateDto {
  file?: string;
  enabled: boolean;
  idProperty?: string;
}

export interface PropertyImageUpdateDto {
  file?: string;
  enabled: boolean;
  idProperty?: string;
}

export interface PropertyImageDto {
  id?: string;
  file?: string;
  enabled: boolean;
  idProperty?: string;
}

// DTOs para PropertyTrace
export interface PropertyTraceCreateDto {
  dateSale: string;
  value: number;
  tax: number;
  name?: string;
  idProperty?: string;
}

export interface PropertyTraceUpdateDto {
  dateSale: string;
  value: number;
  tax: number;
  name?: string;
  idProperty?: string;
}

export interface PropertyTraceDto {
  id?: string;
  dateSale: string;
  name?: string;
  value: number;
  tax: number;
  idProperty?: string;
}

// Filtros para búsquedas
export interface PropertyFilters {
  Name?: string;
  Address?: string;
  MinPrice?: number;
  MaxPrice?: number;
}

// Tipos de respuesta de la API
export interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
