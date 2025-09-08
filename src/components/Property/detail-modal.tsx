"use client"

import type { Property } from "@/lib/data"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Bed, Bath, Square, Calendar, User, Phone, Mail, Heart } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface PropertyDetailModalProps {
  property: Property | null
  isOpen: boolean
  onClose: () => void
}

export function PropertyDetailModal({ property, isOpen, onClose }: PropertyDetailModalProps) {
  if (!property) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-card-foreground text-balance">{property.name}</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Image and basic info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={ "/placeholder.svg"}
                  alt={property.name}
                  width={800}
                  height={320}
                  className="w-full h-64 lg:h-80 object-cover"
                  priority
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-primary-foreground">{property.propertyType}</Badge>
                </div>
              </div>

            <div className="space-y-4">
              <div className="text-3xl font-bold text-primary">{formatPrice(property.price)}</div>

              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="text-balance">{property.address}</span>
              </div>

              {property.description && (
                <p className="text-card-foreground text-balance leading-relaxed">{property.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4">
                {property.bedrooms !== undefined && property.bedrooms > 0 && (
                  <div className="flex items-center">
                    <Bed className="w-5 h-5 mr-2 text-primary" />
                    <span className="text-card-foreground">
                      {property.bedrooms} {property.bedrooms === 1 ? "Dormitorio" : "Dormitorios"}
                    </span>
                  </div>
                )}
                <div className="flex items-center">
                  <Bath className="w-5 h-5 mr-2 text-primary" />
                  <span className="text-card-foreground">
                    {property.bathrooms} {property.bathrooms === 1 ? "Baño" : "Baños"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Square className="w-5 h-5 mr-2 text-primary" />
                  <span className="text-card-foreground">{property.area}m² construidos</span>
                </div>
                {property.year && (
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-primary" />
                    <span className="text-card-foreground">Año {property.year}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">Características</h3>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="border-border text-card-foreground">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator className="bg-border" />

          {/* Owner info */}
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-3">Información del Propietario</h3>
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-primary" />
                <span className="text-muted-foreground">ID Propietario: {property.idOwner}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-primary" />
                <span className="text-muted-foreground">+56 9 1234 5678</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-primary" />
                <span className="text-muted-foreground">contacto@inmobiliaria.cl</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Phone className="w-4 h-4 mr-2" />
              Contactar Agente
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-border text-card-foreground hover:bg-muted bg-transparent"
            >
              <Heart className="w-4 h-4 mr-2" />
              Agregar a Favoritos
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-border text-card-foreground hover:bg-muted bg-transparent"
            >
              <Mail className="w-4 h-4 mr-2" />
              Solicitar Información
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
