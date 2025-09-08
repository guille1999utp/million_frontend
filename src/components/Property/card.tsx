"use client"

import type { Property } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Square } from "lucide-react"
import { motion } from "framer-motion"
import { getOwnerById } from "@/lib/data"
import Image from "next/image"

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const primaryImage = property.image
  const owner = getOwnerById(property.idOwner)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
    >
      <Card className="overflow-hidden bg-white/5 pt-0  border border-white/20 transition-all duration-300">
        <div className="relative overflow-hidden">
          <div className="w-full  h-48 bg-white/5 flex items-center justify-center overflow-hidden">
            {primaryImage ? (
              <Image
                 src={primaryImage || "/placeholder.svg"}
                alt={property.name}
                width={400}
                height={200}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center">
                <Square className="w-12 h-12 text-white/30" />
              </div>
            )}
          </div>

          <div className="absolute top-3 left-3">
            <Badge variant="outline" className="bg-black/50 text-white border-white/20 text-xs">
              {property.codeInternal}
            </Badge>
          </div>
        </div>

        <CardContent className="p-2 space-y-3">
          <div>
            <h3 className="font-semibold !text-2xl text-white line-clamp-1 text-balance group-hover:text-amber-800 transition-colors">
              {property.name}
            </h3>
            <div className="flex items-center text-white/60 text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{property.address}</span>
            </div>
            {owner && (
              <div className="flex items-center text-white/50 text-xs mt-1">
                <span>Propietario: {owner.name}</span>
              </div>
            )}
          </div>

          <div className="text-2xl font-bold text-amber-700">{formatPrice(property.price)}</div>

          {property.year && <div className="text-white/50 text-sm">Año de construcción: {property.year}</div>}
        </CardContent>
      </Card>
    </motion.div>
  )
}
