import { useState, useEffect } from 'react';
import { ownerService, propertyService } from '../services';

interface StatsData {
  totalOwners: number;
  totalProperties: number;
  loading: boolean;
  error: string | null;
}

export function useStats() {
  const [stats, setStats] = useState<StatsData>({
    totalOwners: 0,
    totalProperties: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        // Obtener datos en paralelo
        const [owners, properties] = await Promise.all([
          ownerService.getAllOwners(),
          propertyService.getAllProperties(),
        ]);

        setStats({
          totalOwners: owners?.length || 0,
          totalProperties: properties?.length || 0,
          loading: false,
          error: null,
        });
      } catch (error) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Error al cargar estadísticas',
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
}
