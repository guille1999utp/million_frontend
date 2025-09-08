import { useState, useEffect, useCallback } from 'react';
import { propertyService } from '../services';
import { PropertyWithDetailsDto } from '../services/types';

interface UsePropertyDetailState {
  property: PropertyWithDetailsDto | null;
  loading: boolean;
  error: string | null;
}

export function usePropertyDetail(propertyId: string) {
  const [state, setState] = useState<UsePropertyDetailState>({
    property: null,
    loading: true,
    error: null,
  });

  const fetchPropertyDetail = useCallback(async () => {
    if (!propertyId) {
      setState({
        property: null,
        loading: false,
        error: 'ID de propiedad no proporcionado',
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const property = await propertyService.getPropertyById(propertyId);

      setState({
        property,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar la propiedad',
      }));
    }
  }, [propertyId]);

  useEffect(() => {
    fetchPropertyDetail();
  }, [propertyId, fetchPropertyDetail]);

  return { ...state, refetch: fetchPropertyDetail };
}
