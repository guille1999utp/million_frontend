"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Calendar,
  Building2,
  Plus,
  TrendingUp,
  DollarSign,
  BarChart3,
  Edit,
  Trash2,
  Home,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { GlobalHeader } from "@/components/GlobalHeader"
import Image from "next/image"
import { useOwnerWithProperties } from "@/hooks"
import { EditOwnerModal, DeleteOwnerModal } from "@/components/Owner"
import { DeletePropertyModal, EditPropertyModal } from "@/components/Property"
import { useState } from "react"
import { PropertyWithDetailsDto } from "@/services/types"

export default function OwnerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ownerId = params.id as string
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeletePropertyModalOpen, setIsDeletePropertyModalOpen] = useState(false)
  const [isEditPropertyModalOpen, setIsEditPropertyModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithDetailsDto | null>(null)

  const { owner, loading, error, refetch } = useOwnerWithProperties(ownerId)

  // Estados de loading y error
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
          <p className="text-white/60">Cargando información del propietario...</p>
        </div>
      </div>
    )
  }

  if (error || !owner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-light text-white">Propietario no encontrado</h1>
          <p className="text-white/60">{error || 'El propietario solicitado no existe'}</p>
          <Link href="/">
            <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Obtener propiedades del owner
  const properties = owner.properties || []

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

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

  const totalValue = properties.reduce((sum, property) => sum + (property.price || 0), 0)
  const averagePrice = properties.length > 0 ? totalValue / properties.length : 0

  // Calculate total transactions from traces
  const allTraces = properties.flatMap((property) => property.traces || [])
  const totalTransactions = allTraces.length

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <GlobalHeader
        title={owner.name || 'Propietario'}
        subtitle="Propietario"
      />

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Owner Profile Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <Card className="bg-gradient-to-r from-amber-900/50 to-black-900/20 border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-black-600/10" />
            <CardContent className="relative p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center overflow-hidden border-4 border-white/20">
                  {owner.photo ? (
                    <Image
                      src={owner.photo || "/placeholder.svg"}
                      alt={owner.name || "Propietario"}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Building2 className="w-16 h-16 text-white/60" />
                  )}
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{owner.name || 'Sin nombre'}</h2>
                    <Badge variant="secondary" className="bg-amber-600/20 text-amber-400 text-sm">
                      Propietario Inmobiliario
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-amber-400" />
                      <span>{owner.address || 'Sin dirección'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-amber-400" />
                      <span>Nacimiento: {formatDate(owner.birthday)}</span>
                    </div>
      
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={() => setIsEditModalOpen(true)}
                    variant="outline"
                    className="border-white/20 bg-white/5 text-white hover:bg-white/10 rounded-2xl h-11 font-semibold"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                  <Button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    variant="outline"
                    className="border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 rounded-2xl h-11 font-semibold"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar Propietario
                  </Button>
                  <Link href={`/property/create?ownerId=${owner.id}`}>
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-2xl h-11 font-semibold">
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Nueva Propiedad
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-amber-600/20 p-3 rounded-full">
                  <Building2 className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{properties.length}</div>
                  <div className="text-white/60 text-sm">Propiedades</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600/20 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{formatPrice(totalValue)}</div>
                  <div className="text-white/60 text-sm">Valor Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-600/20 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{formatPrice(averagePrice)}</div>
                  <div className="text-white/60 text-sm">Precio Promedio</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-600/20 p-3 rounded-full">
                  <BarChart3 className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{totalTransactions}</div>
                  <div className="text-white/60 text-sm">Transacciones</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">


          {/* Properties List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Propiedades ({properties.length})</span>
                  <Link href={`/property/create?ownerId=${owner.id}`}>
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white rounded-2xl h-11 font-semibold">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Propiedad
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {properties.length > 0 ? (
                  <div className="space-y-4">
                    {properties.map((property, index) => {
                      const primaryImage = property.images && property.images.length > 0 ? property.images[0] : null
                      const latestTrace = property.traces && property.traces.length > 0 ? property.traces[0] : null

                      return (
                        <motion.div
                          key={property.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group relative">
                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-10">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedProperty(property)
                                  setIsEditPropertyModalOpen(true)
                                }}
                                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-2 rounded-full"
                                title="Editar propiedad"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedProperty(property)
                                  setIsDeletePropertyModalOpen(true)
                                }}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-full"
                                title="Eliminar propiedad"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <Link href={`/property/${property.id}`} className="block">
                              <div className="flex md:flex-row flex-col gap-6">
                                <div className="w-28 h-28 bg-white/10 rounded-xl overflow-hidden flex-shrink-0">
                                  {primaryImage ? (
                                    <Image
                                      src={primaryImage.file || "/placeholder.svg"}
                                      alt={property.name || 'Propiedad'}
                                      width={112}
                                      height={112}
                                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Home className="w-10 h-10 text-white/40" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="text-white font-semibold text-lg group-hover:text-amber-400 transition-colors">
                                        {property.name || 'Sin nombre'}
                                      </h3>
                                      <p className="text-white/60 text-sm">{property.codeInternal || 'Sin código'}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2 text-white/70">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">{property.address || 'Sin dirección'}</span>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div>
                                      <span className="text-amber-400 font-semibold text-xl">
                                        {formatPrice(property.price || 0)}
                                      </span>
                                      {latestTrace && (
                                        <div className="text-white/50 text-xs">
                                          Última transacción: {latestTrace.name || 'Sin nombre'}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-4 text-white/60 text-sm">
                                      <span>{property.year || 'N/A'}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Building2 className="w-20 h-20 text-white/30 mx-auto mb-6" />
                    <h3 className="text-xl font-medium text-white mb-3">No hay propiedades registradas</h3>
                    <p className="text-white/60 mb-8 max-w-md mx-auto">
                      Este propietario aún no tiene propiedades asociadas. Comienza creando su primera propiedad.
                    </p>
                    <Link href={`/property/create?ownerId=${owner.id}`}>
                      <Button className="bg-gradient-to-r from-amber-600 to-blue-600 hover:from-amber-700 hover:to-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Primera Propiedad
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Edit Owner Modal */}
      {owner && (
        <EditOwnerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          owner={owner}
          onSuccess={() => {
            refetch()
            setIsEditModalOpen(false)
          }}
        />
      )}

      {/* Delete Owner Modal */}
      {owner && (
        <DeleteOwnerModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          owner={owner}
          onSuccess={() => {
            // Redirigir al inicio después de eliminar
            router.push('/')
          }}
        />
      )}

      {/* Delete Property Modal */}
      {selectedProperty && (
        <DeletePropertyModal
          isOpen={isDeletePropertyModalOpen}
          onClose={() => {
            setIsDeletePropertyModalOpen(false)
            setSelectedProperty(null)
          }}
          property={selectedProperty}
          onSuccess={() => {
            refetch()
            setIsDeletePropertyModalOpen(false)
            setSelectedProperty(null)
          }}
        />
      )}

      {/* Edit Property Modal */}
      {selectedProperty && (
        <EditPropertyModal
          isOpen={isEditPropertyModalOpen}
          onClose={() => {
            setIsEditPropertyModalOpen(false)
            setSelectedProperty(null)
          }}
          property={selectedProperty}
          onSuccess={() => {
            refetch()
            setIsEditPropertyModalOpen(false)
            setSelectedProperty(null)
          }}
        />
      )}
    </div>
  )
}
