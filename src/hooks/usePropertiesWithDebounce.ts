import { useState, useEffect, useCallback } from 'react';
import { propertyService } from '../services';
import { PropertyWithDetailsDto, PropertyFilters } from '../services/types';
import { useDebounce } from './useDebounce';

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

export function usePropertiesWithDebounce(filters?: UsePropertiesFilters) {
  const [state, setState] = useState<UsePropertiesState>({
    properties: [],
    loading: true,
    error: null,
    totalCount: 0,
  });

  // Debounce de los filtros por 500ms
  const debouncedFilters = useDebounce(filters, 500);

  const fetchProperties = useCallback(async (apiFilters: PropertyFilters) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

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
  }, []);

  useEffect(() => {
    // Convertir filtros del hook a filtros de la API
    const apiFilters: PropertyFilters = {};
    
    if (debouncedFilters?.Name) {
      apiFilters.Name = debouncedFilters.Name;
    }
    
    if (debouncedFilters?.Address) {
      apiFilters.Address = debouncedFilters.Address;
    }
    
    if (debouncedFilters?.MinPrice !== undefined) {
      apiFilters.MinPrice = debouncedFilters.MinPrice;
    }
    
    if (debouncedFilters?.MaxPrice !== undefined) {
      apiFilters.MaxPrice = debouncedFilters.MaxPrice;
    }

    fetchProperties(apiFilters);
  }, [debouncedFilters, fetchProperties]);

  return {
    ...state,
    refetch: () => fetchProperties({}),
  };
}
