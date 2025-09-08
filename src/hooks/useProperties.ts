import { useState, useEffect, useCallback, useRef } from 'react';
import { propertyService } from '../services';
import { PropertyWithDetailsDto, PropertyFilters } from '../services/types';

interface UsePropertiesState {
  properties: PropertyWithDetailsDto[];
  loading: boolean;
  error: string | null;
  totalCount: number;
}

interface UsePropertiesFilters {
  Name?: string;
  Address?: string;
  MinPrice?: number;
  MaxPrice?: number;
}

export function useProperties(filters?: UsePropertiesFilters) {
  const [state, setState] = useState<UsePropertiesState>({
    properties: [],
    loading: true,
    error: null,
    totalCount: 0,
  });

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Convertir filtros del hook a filtros de la API
      const apiFilters: PropertyFilters = {};
      
      if (filters?.Name) {
        apiFilters.Name = filters.Name;
      }
      
      if (filters?.Address) {
        apiFilters.Address = filters.Address;
      }
      
      if (filters?.MinPrice !== undefined) {
        apiFilters.MinPrice = filters.MinPrice;
      }
      
      if (filters?.MaxPrice !== undefined) {
        apiFilters.MaxPrice = filters.MaxPrice;
      }

      const properties = await propertyService.getAllProperties(apiFilters);

      setState({
        properties: properties || [],
        loading: false,
        error: null,
        totalCount: properties?.length || 0,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar propiedades',
      }));
    }
  }, [filters]);

  useEffect(() => {
    // Limpiar el timeout anterior si existe
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Crear un nuevo timeout para el debounce
    debounceRef.current = setTimeout(() => {
      fetchProperties();
    }, 500); // 500ms de debounce

    // Cleanup function para limpiar el timeout
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [fetchProperties]);

  return {
    ...state,
    refetch: fetchProperties,
  };
}
