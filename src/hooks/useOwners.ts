import { useState, useEffect } from 'react';
import { ownerService } from '../services';
import { Owner } from '../interfaces';

interface UseOwnersState {
  owners: Owner[];
  loading: boolean;
  error: string | null;
}

export function useOwners() {
  const [state, setState] = useState<UseOwnersState>({
    owners: [],
    loading: true,
    error: null,
  });

  const fetchOwners = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const owners = await ownerService.getAllOwners();
      setState({ owners: owners || [], loading: false, error: null });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar los propietarios',
      }));
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  return { ...state, refetch: fetchOwners };
}
