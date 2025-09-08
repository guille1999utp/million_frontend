"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X, ChevronDown } from "lucide-react"
import { propertyTypes, priceRanges } from "@/lib/data"
import { motion } from "framer-motion"

export interface FilterState {
  search: string // Name en la API
  propertyType: string // No se usa en la API, se mantiene para UI
  priceRange: string // Se convierte a MinPrice/MaxPrice
  address: string // Address en la API
}

interface PropertyFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
  resultsCount: number
}

export function PropertyFilters({ filters, onFiltersChange, onClearFilters, resultsCount }: PropertyFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const hasActiveFilters =
    filters.search || filters.propertyType !== "Todos" || filters.priceRange !== "Todos los precios" || filters.address

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex md:items-center md:flex-row flex-col items-start gap-2">
              <Filter className="size-9 text-amber-900" />
              <h2 className="text-lg font-semibold text-white">Filtros de Búsqueda</h2>
              <span className="text-sm text-white/60">({resultsCount} propiedades encontradas)</span>
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-white/70 hover:text-white bg-white/5 border-white/20 hover:bg-white/10"
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpiar
                </Button>
              )}
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="lg:hidden text-white hover:bg-white/10"
                >
                {isExpanded ? (
                  <ChevronDown className="size-8 rotate-180 transition-transform" />
                ) : (
                  <ChevronDown className="size-8" />
                )}
                </Button>
            </div>
          </div>

          <div
            className={`grid gap-4 ${isExpanded ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-4"} 
                          ${!isExpanded && "hidden lg:grid"}`}
          >
            <div className="space-y-2">
              <Label htmlFor="search" className="text-base text-white">
                Buscar por nombre
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <Input
                  id="search"
                  placeholder="Ej: Villa moderna..."
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  className="pl-10  bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-base text-white">
                Buscar por dirección
              </Label>
              <Input
                id="address"
                placeholder="Ej: Las Condes, Providencia..."
                value={filters.address}
                onChange={(e) => updateFilter("address", e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400"
              />
            </div>


            <div className="space-y-2">
              <Label className="text-base text-white">Rango de precio</Label>
              <Select value={filters.priceRange} onValueChange={(value) => updateFilter("priceRange", value)}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white  focus:border-amber-700 min-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className=" border-white/20 backdrop-blur-sm rounded-2xl">
                  {priceRanges.map((range) => (
                    <SelectItem
                      key={range.label}
                      value={range.label}
                      className="text-white hover:bg-white/10 focus:bg-white/10"
                    >
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
