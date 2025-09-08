import { useState, useEffect } from 'react';
import { propertyService } from '../services';
import { PropertyWithDetailsDto } from '../services/types';

interface FeaturedPropertiesData {
  properties: PropertyWithDetailsDto[];
  loading: boolean;
  error: string | null;
}

export function useFeaturedProperties(limit: number = 4) {
  const [data, setData] = useState<FeaturedPropertiesData>({
    properties: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        const properties = await propertyService.getAllProperties();
        
        if (properties) {
          // Tomar solo las primeras N propiedades
          const featuredProperties = properties.slice(0, limit);
          setData({
            properties: featuredProperties,
            loading: false,
            error: null,
          });
        } else {
          setData({
            properties: [],
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Error al cargar propiedades destacadas',
        }));
      }
    };

    fetchFeaturedProperties();
  }, [limit]);

  return data;
}
