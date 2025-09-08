"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useOwners } from "@/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Home,
  Building2,
  Users,
  Search,
  User,
  MapPin,
  Calendar,
  Plus,
  Eye,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export default function OwnersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const { owners, loading, error, refetch } = useOwners()

  // Filtrar propietarios basado en el término de búsqueda
  const filteredOwners = owners.filter(owner =>
    owner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.address?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    // Extraer solo la parte de la fecha (YYYY-MM-DD) para evitar problemas de zona horaria
    const dateOnly = dateString.split('T')[0];
    const [year, month, day] = dateOnly.split('-').map(Number);
    
    // Crear fecha usando los componentes individuales para evitar problemas de zona horaria
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Estados de loading y error
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
          <p className="text-white/60">Cargando propietarios...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-light text-white">Error al cargar propietarios</h2>
          <p className="text-white/60">{error}</p>
          <Button onClick={() => refetch()} variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-sm border-b border-white/10 sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button onClick={() => router.back()} variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-white">Propietarios</h1>
                <p className="text-white/60 text-sm">Gestiona todos los propietarios del sistema</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/properties">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Building2 className="w-4 h-4 mr-2" />
                  Ver Propiedades
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Home className="w-4 h-4 mr-2" />
                  Inicio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Search and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar por nombre o dirección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-emerald-400"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-amber-600/20 text-amber-400">
              {filteredOwners.length} propietario{filteredOwners.length !== 1 ? 's' : ''}
            </Badge>
            <Link href="/owner/create">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Propietario
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Owners Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredOwners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOwners.map((owner, index) => (
                <motion.div
                  key={owner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        {/* Profile Photo */}
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/20">
                          {owner.photo ? (
                            <Image
                              src={owner.photo}
                              alt={owner.name || "Propietario"}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <User className="w-10 h-10 text-white/60" />
                          )}
                        </div>

                        {/* Owner Info */}
                        <div className="space-y-2">
                          <h3 className="text-white font-semibold text-lg group-hover:text-amber-400 transition-colors">
                            {owner.name || 'Sin nombre'}
                          </h3>
                          <Badge variant="secondary" className="bg-amber-600/20 text-amber-400 text-xs">
                            Propietario
                          </Badge>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 text-sm text-white/70 w-full">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-amber-400" />
                            <span className="truncate">{owner.address || 'Sin dirección'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-amber-400" />
                            <span>Nacimiento: {owner.birthday ? formatDate(owner.birthday) : 'N/A'}</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Link href={`/owner/${owner.id}`} className="w-full">
                          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white group-hover:bg-amber-500 transition-colors">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Perfil
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="w-20 h-20 text-white/30 mx-auto mb-6" />
              <h3 className="text-xl font-medium text-white mb-3">
                {searchTerm ? 'No se encontraron propietarios' : 'No hay propietarios registrados'}
              </h3>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                {searchTerm 
                  ? `No se encontraron propietarios que coincidan con "${searchTerm}". Intenta con otros términos de búsqueda.`
                  : 'Aún no hay propietarios registrados en el sistema. Comienza creando el primer propietario.'
                }
              </p>
              {!searchTerm && (
                <Link href="/owner/create">
                  <Button className="bg-gradient-to-r from-amber-600 to-blue-600 hover:from-amber-700 hover:to-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primer Propietario
                  </Button>
                </Link>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
