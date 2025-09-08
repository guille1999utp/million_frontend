import { useState, useEffect } from 'react';
import { ownerService } from '../services';
import { OwnerWithPropertiesDto } from '../services/types';

interface UseOwnerWithPropertiesState {
  owner: OwnerWithPropertiesDto | null;
  loading: boolean;
  error: string | null;
}

export function useOwnerWithProperties(ownerId: string) {
  const [state, setState] = useState<UseOwnerWithPropertiesState>({
    owner: null,
    loading: true,
    error: null,
  });

  const fetchOwnerWithProperties = async () => {
    if (!ownerId) {
      setState({
        owner: null,
        loading: false,
        error: 'ID de propietario no proporcionado',
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const owner = await ownerService.getOwnerWithProperties(ownerId);

      setState({
        owner,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar el propietario',
      }));
    }
  };

  useEffect(() => {
    fetchOwnerWithProperties();
  }, [ownerId]);

  return { ...state, refetch: fetchOwnerWithProperties };
}
