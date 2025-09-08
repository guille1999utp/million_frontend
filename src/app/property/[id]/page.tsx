"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { usePropertyDetail } from "@/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Home,
  User,
  History,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Building2,
  Users,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  const { property, loading, error } = usePropertyDetail(propertyId)

  // Estados de loading y error
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
          <p className="text-white/60">Cargando información de la propiedad...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-light text-white">Propiedad no encontrada</h2>
          <p className="text-white/60">{error || 'La propiedad solicitada no existe'}</p>
          <Link href="/">
            <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Obtener datos del property
  const owner = property.owner
  const images = property.images || []
  const traces = property.traces || []

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className=" backdrop-blur-sm border-b border-white/10 sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex md:items-center items-start md:flex-row flex-col space-x-4">
              <Button onClick={() => router.back()} variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-white">{property.name || 'Sin nombre'}</h1>
                <p className="text-white/60 text-sm">{property.codeInternal || 'Sin código'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/owners">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Users className="w-4 h-4 mr-2" />
                  Propietarios
                </Button>
              </Link>
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
        {/* Enhanced Image Carousel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <Card className="bg-white/5 border-white/10 overflow-hidden">
            <div className="relative h-96 md:h-[500px] group">
              {images.length > 0 ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, x: 300 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -300 }}
                      transition={{ duration: 0.3 }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={images[currentImageIndex].file || "/placeholder.png"}
                        alt={property.name || 'Propiedad'}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 cursor-pointer transform -translate-y-1/2 bg-amber-700 hover:bg-amber-900 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2  cursor-pointer transform -translate-y-1/2 bg-amber-700 hover:bg-amber-900 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Fullscreen Button */}
                  <button
                    onClick={() => setIsImageModalOpen(true)}
                    className="absolute top-4 right-4  cursor-pointer bg-amber-700 hover:bg-amber-900 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute top-4 left-4 bg-amber-700 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>

                  {/* Dot Indicators */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentImageIndex ? "bg-white scale-110" : "bg-white/40 hover:bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full bg-white/5">
                  <Home className="w-16 h-16 text-white/30" />
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="p-4  border-t border-white/10">
                <div className="flex space-x-2 overflow-x-auto p-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        index === currentImageIndex
                          ? "border-amber-800 scale-105"
                          : "border-white/20 hover:border-white/40"
                      }`}
                    >
                      <Image
                        src={image.file || "/placeholder.png"}
                        alt={`Vista ${index + 1}`}
                        width={80}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Detalles de la Propiedad</span>
                  <Badge variant="secondary" className="bg-amber-600/20 text-amber-400">
                    Casa
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 text-white/80">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    <span>{property.address || 'Sin dirección'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white/80">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <span>Año {property.year || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white/80">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    <span className="font-semibold text-lg">{formatPrice(property.price || 0)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-semibold text-white">{property.year || 'N/A'}</div>
                      <div className="text-white/60 text-sm">Año de Construcción</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-semibold text-white">{property.codeInternal || 'N/A'}</div>
                      <div className="text-white/60 text-sm">Código Interno</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property History */}
            {traces.length > 0 && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <History className="w-5 h-5" />
                    <span>Historial de Transacciones</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {traces.map((trace, index) => (
                      <motion.div
                        key={trace.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <div>
                          <h4 className="text-white font-medium">{trace.name || 'Sin nombre'}</h4>
                          <p className="text-white/60 text-sm">{formatDate(trace.dateSale)}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">{formatPrice(trace.value || 0)}</div>
                          {trace.tax && trace.tax > 0 && (
                            <div className="text-white/60 text-sm">Impuesto: {formatPrice(trace.tax)}</div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Owner Information */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            {owner && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Propietario</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
                      {owner?.photo ? (
                        <Image
                          src={owner.photo || "/placeholder.png"}
                          alt={owner.name || 'Propietario'}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <User className="w-8 h-8 text-white/60" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{owner?.name || 'Sin nombre'}</h3>
                      <p className="text-white/60 text-sm">Propietario</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-3 text-white/80">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span className="text-sm">{owner?.address || 'Sin dirección'}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-white/80">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span className="text-sm">Nacimiento: {owner?.birthday ? formatDate(owner.birthday) : 'N/A'}</span>
                    </div>
                  </div>

                  {owner?.id && (
                    <Link href={`/owner/${owner.id}`} className="block pt-4">
                      <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-2xl">
                        Ver Perfil Completo
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-6xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[currentImageIndex].file || "/placeholder.png"}
                alt={property.name || 'Propiedad'}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

