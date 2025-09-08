"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { propertyService } from "@/services"
import { PropertyWithDetailsDto } from "@/services/types"

interface DeletePropertyModalProps {
  isOpen: boolean
  onClose: () => void
  property: PropertyWithDetailsDto
  onSuccess: () => void
}

export function DeletePropertyModal({ isOpen, onClose, property, onSuccess }: DeletePropertyModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!property.id) {
      toast.error("ID de la propiedad no encontrado")
      return
    }

    setIsDeleting(true)

    try {
      console.log("Eliminando propiedad:", property.id)
      
      const deleteSuccess = await propertyService.deleteProperty(property.id)
      
      if (!deleteSuccess) {
        throw new Error("No se pudo eliminar la propiedad")
      }

      console.log("Propiedad eliminada exitosamente")
      toast.success("Propiedad eliminada exitosamente")
      
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error al eliminar la propiedad:", error)
      toast.error("Error al eliminar la propiedad")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-gray-900 border-red-500/20">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span>Confirmar Eliminación</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warning Message */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="text-red-400 font-semibold">¿Estás seguro de eliminar esta propiedad?</h3>
                <div className="text-white/80 text-sm space-y-1">
                  <p><strong>Propiedad:</strong> {property.name || 'Sin nombre'}</p>
                  <p><strong>Dirección:</strong> {property.address || 'Sin dirección'}</p>
                  <p><strong>Precio:</strong> ${property.price?.toLocaleString() || '0'}</p>
                  {property.traces && property.traces.length > 0 && (
                    <p className="text-amber-400">
                      <strong>⚠️ Advertencia:</strong> Esta propiedad tiene {property.traces.length} transacciones registradas.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Consequences */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Esta acción:</h4>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• Eliminará permanentemente la propiedad</li>
              <li>• No se puede deshacer</li>
              <li>• Eliminará todas las imágenes asociadas</li>
              {property.traces && property.traces.length > 0 && (
                <li className="text-amber-400">• Eliminará el historial de transacciones</li>
              )}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
              disabled={isDeleting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Eliminando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar Propiedad</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
