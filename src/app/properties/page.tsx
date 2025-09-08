"use client"

import { useState, useMemo } from "react"
import { priceRanges } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Home, Building2, ArrowRight, Menu, Users, Plus } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { FilterState, PropertyFilters } from "@/components/Property/filters"
import { PropertyCard } from "@/components/Property/card"
import AnimatedButton from "@/components/AnimatedButton/AnimatedButton"
import { useProperties } from "@/hooks"
import { Property } from "@/lib/data"
import { PropertyWithDetailsDto } from "@/services/types"

// Función para convertir PropertyWithDetailsDto a Property
const adaptPropertyForCard = (apiProperty: PropertyWithDetailsDto): Property => {
  console.log(apiProperty.traces?.[0]?.name)
  return {
    image: apiProperty.images ? apiProperty.images[0].file : '',
    trace: apiProperty.traces?.[0]?.name || '',
    idProperty: apiProperty.id || '',
    name: apiProperty.name || 'Sin nombre',
    address: apiProperty.address || 'Sin dirección',
    price: apiProperty.price || 0,
    codeInternal: apiProperty.codeInternal || '',
    year: apiProperty.year || 0,
    idOwner: apiProperty.idOwner || '',
    description: `Propiedad en ${apiProperty.address}`,
    bedrooms: 3, // Valores por defecto ya que no vienen en la API
    bathrooms: 2,
    area: 120,
    propertyType: 'Casa',
    features: ['Jardín', 'Garaje', 'Piscina']
  };
};

export default function HomePage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    propertyType: "Todos",
    priceRange: "Todos los precios",
    address: "",
  })

  // Convertir filtros de UI a filtros de API
  const apiFilters = useMemo(() => {
    const apiFilters: any = {};
    
    if (filters.search) {
      apiFilters.Name = filters.search;
    }
    
    if (filters.address) {
      apiFilters.Address = filters.address;
    }
    
    if (filters.priceRange !== "Todos los precios") {
      const selectedRange = priceRanges.find((range) => range.label === filters.priceRange);
      if (selectedRange) {
        apiFilters.MinPrice = selectedRange.min;
        apiFilters.MaxPrice = selectedRange.max;
      }
    }
    
    return apiFilters;
  }, [filters]);

  // Usar el hook de propiedades con los filtros de la API
  const { properties, loading, error, totalCount } = useProperties(apiFilters);

  const handleClearFilters = () => {
    setFilters({
      search: "",
      propertyType: "Todos",
      priceRange: "Todos los precios",
      address: "",
    })
  }

  return (
    <div className="min-h-screen ">
      <div className=" flex items-center space-x-4 gap-4 bg-[#141313] px-6 py-4">
        <AnimatedButton
          label="Crear Propiedad"
          route="/property/create"
          animateOnScroll={false}
          delay={0.15}
        />

        <AnimatedButton
          label="Crear Dueño"
          route="/owner/create"
          animateOnScroll={false}
          delay={0.3}
        />

        <AnimatedButton
          label="Ver Propietarios"
          route="/owners"
          animateOnScroll={false}
          delay={0.3}
        />
      </div>

      <section className=" relative pb-10">
        <div className="relative z-10  mx-auto px-6 space-y-12">
          <PropertyFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={handleClearFilters}
            resultsCount={totalCount}
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
                <p className="text-white/60">Cargando propiedades...</p>
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center py-16"
              >
                <Building2 className="w-16 h-16 text-red-400 mx-auto mb-6" />
                <h3 className="text-2xl font-light text-white mb-4">
                  Error al cargar propiedades
                </h3>
                <p className="text-white/60 mb-8 max-w-md mx-auto">
                  {error}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  Reintentar
                </Button>
              </motion.div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {properties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/property/${property.id}`}>
                      <PropertyCard property={adaptPropertyForCard(property)} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center py-16"
              >
                <Building2 className="w-16 h-16 text-white/30 mx-auto mb-6" />
                <h3 className="text-2xl font-light text-white mb-4">
                  No se encontraron propiedades
                </h3>
                <p className="text-white/60 mb-8 max-w-md mx-auto">
                  Intenta ajustar los filtros de búsqueda para encontrar más
                  resultados
                </p>
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  Limpiar Filtros
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
