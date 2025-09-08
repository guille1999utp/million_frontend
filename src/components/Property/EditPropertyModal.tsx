"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  X, 
  Plus, 
  Upload, 
  ImageIcon, 
  Trash2, 
  Edit,
  Check,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"
import { propertyService, propertyImageService, propertyTraceService } from "@/services"
import { PropertyWithDetailsDto } from "@/services/types"
import Image from "next/image"
import { z } from "zod"

// Schema de validación para PropertyTrace
const traceSchema = z.object({
  name: z.string().min(1, "El nombre de la transacción es requerido"),
  value: z.number().min(1, "El valor debe ser mayor a 0").max(1000000000, "El valor no puede exceder $1.000.000.000"),
  tax: z.number().min(0, "El impuesto debe ser mayor o igual a 0"),
  dateSale: z.string().min(1, "La fecha es requerida"),
}).refine((data) => data.tax <= data.value, {
  message: "El impuesto no puede ser mayor al valor",
  path: ["tax"],
})

interface EditPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  property: PropertyWithDetailsDto
  onSuccess: () => void
}

export function EditPropertyModal({ isOpen, onClose, property, onSuccess }: EditPropertyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStep, setSubmissionStep] = useState("")
  const [hasChanges, setHasChanges] = useState(false) // Rastrear si hubo cambios
  
  // Estados para imágenes
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState(property.images || [])
  
  // Estados para traces
  const [traces, setTraces] = useState(property.traces || [])
  const [newTrace, setNewTrace] = useState({
    name: "",
    value: 0,
    tax: 0,
    dateSale: new Date().toISOString().split("T")[0],
  })
  const [traceErrors, setTraceErrors] = useState<{
    name?: string
    value?: string
    tax?: string
    dateSale?: string
  }>({})

  // Estados para información básica
  const [propertyData, setPropertyData] = useState({
    name: property.name || "",
    address: property.address || "",
    price: property.price || 0,
    codeInternal: property.codeInternal || "",
    year: property.year || new Date().getFullYear(),
  })

  useEffect(() => {
    if (isOpen) {
      // Solo reinicializar si es la primera vez que se abre o si la propiedad cambió
      setExistingImages(property.images || [])
      setTraces(property.traces || [])
      setPropertyData({
        name: property.name || "",
        address: property.address || "",
        price: property.price || 0,
        codeInternal: property.codeInternal || "",
        year: property.year || new Date().getFullYear(),
      })
      setSelectedImages([])
      setImagePreviews([])
      setHasChanges(false) // Resetear el estado de cambios
    }
  }, [isOpen, property.id, property.address, property.codeInternal, property.images, property.name, property.price, property.traces, property.year])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`El archivo ${file.name} no es una imagen válida`)
        return
      }
      
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`La imagen ${file.name} es demasiado grande (máximo 2MB)`)
        return
      }
      
      setSelectedImages(prev => [...prev, file])
      setHasChanges(true) // Marcar que hubo cambios
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreviews(prev => [...prev, result])
      }
      reader.readAsDataURL(file)
    })
    
    event.target.value = ''
  }

  const removeNewImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = async (imageId: string) => {
    if (!imageId) return
    
    try {
      const success = await propertyImageService.deletePropertyImage(imageId)
      if (success) {
        setExistingImages(prev => prev.filter(img => img.id !== imageId))
        setHasChanges(true) // Marcar que hubo cambios
        toast.success("Imagen eliminada exitosamente")
        // No llamar onSuccess() aquí, solo actualizar el estado local
      } else {
        toast.error("Error al eliminar la imagen")
      }
    } catch (error) {
      console.error("Error al eliminar imagen:", error)
      toast.error("Error al eliminar la imagen")
    }
  }

  // Función para validar trace
  const validateTrace = (trace: typeof newTrace) => {
    try {
      traceSchema.parse(trace)
      setTraceErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: typeof traceErrors = {}
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof typeof errors] = err.message
          }
        })
        setTraceErrors(errors)
      }
      return false
    }
  }

  // Función para actualizar trace con validación
  const updateNewTrace = (field: keyof typeof newTrace, value: string | number) => {
    const updatedTrace = { ...newTrace, [field]: value }
    setNewTrace(updatedTrace)
    
    // Validar en tiempo real si hay algún valor
    if (updatedTrace.name.trim() || updatedTrace.value > 0 || updatedTrace.tax > 0 || updatedTrace.dateSale) {
      validateTrace(updatedTrace)
    } else {
      setTraceErrors({}) // Limpiar errores si está vacío
    }
  }

  const addTrace = () => {
    if (validateTrace(newTrace)) {
      setTraces(prev => [...prev, { ...newTrace, id: `temp-${Date.now()}` }])
      setHasChanges(true) // Marcar que hubo cambios
      setNewTrace({
        name: "",
        value: 0,
        tax: 0,
        dateSale: new Date().toISOString().split("T")[0],
      })
      setTraceErrors({}) // Limpiar errores
    }
  }

  const removeTrace = async (traceId: string) => {
    if (!traceId) return
    
    if (traceId.startsWith('temp-')) {
      // Es un trace nuevo, solo lo removemos del estado
      setTraces(prev => prev.filter(trace => trace.id !== traceId))
      setHasChanges(true) // Marcar que hubo cambios
    } else {
      // Es un trace existente, lo eliminamos de la API
      try {
        const success = await propertyTraceService.deletePropertyTrace(traceId)
        if (success) {
          setTraces(prev => prev.filter(trace => trace.id !== traceId))
          setHasChanges(true) // Marcar que hubo cambios
          toast.success("Transacción eliminada exitosamente")
          // No llamar onSuccess() aquí, solo actualizar el estado local
        } else {
          toast.error("Error al eliminar la transacción")
        }
      } catch (error) {
        console.error("Error al eliminar trace:", error)
        toast.error("Error al eliminar la transacción")
      }
    }
  }

  const handleClose = () => {
    // No permitir cerrar si está enviando
    if (isSubmitting) {
      return
    }
    
    // Si hubo cambios, notificar al componente padre para que actualice los datos
    if (hasChanges) {
      onSuccess()
    }
    onClose()
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // 1. Actualizar información básica de la propiedad
      setSubmissionStep("Actualizando información...")
      if (!property.id) {
        throw new Error("ID de propiedad no encontrado")
      }
      
      // Incluir el idOwner en los datos de actualización
      const updateData = {
        ...propertyData,
        idOwner: property.idOwner
      }
      
      const updateSuccess = await propertyService.updateProperty(property.id, updateData)
      if (!updateSuccess) {
        throw new Error("No se pudo actualizar la propiedad")
      }

      // 2. Subir nuevas imágenes
      if (selectedImages.length > 0) {
        setSubmissionStep("Subiendo nuevas imágenes...")
        let uploadedImages = 0
        let failedImages = 0

        for (const imageFile of selectedImages) {
          try {
            if (!property.id) continue
            const uploadResult = await propertyImageService.uploadPropertyImage(
              property.id,
              imageFile,
              true
            )
            if (uploadResult) {
              uploadedImages++
            } else {
              failedImages++
            }
          } catch (error) {
            console.error("Error al subir imagen:", error)
            failedImages++
          }
        }

        if (failedImages > 0) {
          toast.warning(`${uploadedImages} imagen(es) subidas, ${failedImages} fallaron`)
        } else {
          toast.success(`${uploadedImages} imagen(es) subidas exitosamente`)
        }
      }

      // 3. Crear nuevos traces
      const newTraces = traces.filter(trace => trace.id?.startsWith('temp-'))
      if (newTraces.length > 0) {
        setSubmissionStep("Creando nuevas transacciones...")
        let createdTraces = 0
        let failedTraces = 0

        for (const trace of newTraces) {
          try {
            if (!property.id) continue
            const traceData = {
              name: trace.name,
              value: trace.value,
              tax: trace.tax,
              dateSale: new Date(trace.dateSale).toISOString(),
              idProperty: property.id,
            }

            const traceResult = await propertyTraceService.createPropertyTrace(traceData)
            if (traceResult) {
              createdTraces++
            } else {
              failedTraces++
            }
          } catch (error) {
            console.error("Error al crear trace:", error)
            failedTraces++
          }
        }

        if (failedTraces > 0) {
          toast.warning(`${createdTraces} transacción(es) creadas, ${failedTraces} fallaron`)
        } else {
          toast.success(`${createdTraces} transacción(es) creadas exitosamente`)
        }
      }

      toast.success("Propiedad actualizada exitosamente")
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error al actualizar la propiedad:", error)
      toast.error("Error al actualizar la propiedad")
    } finally {
      setIsSubmitting(false)
      setSubmissionStep("")
    }
  }


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold flex items-center space-x-2">
            <Edit className="w-5 h-5 text-amber-400" />
            <span>Editar Propiedad</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Básica */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Nombre</Label>
                  <Input
                    value={propertyData.name}
                    onChange={(e) => setPropertyData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Código Interno</Label>
                  <Input
                    value={propertyData.codeInternal}
                    onChange={(e) => setPropertyData(prev => ({ ...prev, codeInternal: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Precio (CLP)</Label>
                  <Input
                    type="number"
                    value={propertyData.price}
                    onChange={(e) => setPropertyData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Año</Label>
                  <Input
                    type="number"
                    value={propertyData.year}
                    onChange={(e) => setPropertyData(prev => ({ ...prev, year: Number(e.target.value) }))}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Dirección</Label>
                <Textarea
                  value={propertyData.address}
                  onChange={(e) => setPropertyData(prev => ({ ...prev, address: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Imágenes Existentes */}
          {existingImages.length > 0 && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>Imágenes Existentes ({existingImages.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <Image
                        src={image.file || "/placeholder.svg"}
                        alt="Imagen de propiedad"
                        width={400}
                        height={128}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => image.id && removeExistingImage(image.id)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Subir Nuevas Imágenes */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Agregar Nuevas Imágenes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="new-images-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-white/20 hover:border-white/40 rounded-lg p-6 text-center transition-colors  w-full">
                    <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                    <p className="text-white text-sm">Haz clic para subir nuevas imágenes</p>
                    <p className="text-white/60 text-xs">JPG, PNG hasta 2MB cada una</p>
                  </div>
                </Label>
                <input
                  id="new-images-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {imagePreviews.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-white font-medium text-sm">
                    Nuevas imágenes ({imagePreviews.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={400}
                          height={96}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transacciones Existentes */}
          {traces.length > 0 && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <span>Transacciones Existentes ({traces.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {traces.map((trace) => (
                    <div key={trace.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-white font-medium">{trace.name}</div>
                        <div className="text-white/60 text-sm">
                          {new Date(trace.dateSale).toLocaleDateString()} - 
                          ${trace.value.toLocaleString()} - 
                          Impuesto: ${trace.tax.toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => trace.id && removeTrace(trace.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Agregar Nueva Transacción */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Agregar Nueva Transacción</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Nombre</Label>
                  <Input
                    value={newTrace.name}
                    onChange={(e) => updateNewTrace('name', e.target.value)}
                    placeholder="Ej: Compra inicial"
                    className="bg-white/5 border-white/20 text-white focus:border-amber-400"
                  />
                  {traceErrors.name && (
                    <div className="flex items-center space-x-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{traceErrors.name}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Fecha</Label>
                  <Input
                    type="date"
                    value={newTrace.dateSale}
                    onChange={(e) => updateNewTrace('dateSale', e.target.value)}
                    className="bg-white/5 border-white/20 text-white focus:border-amber-400"
                  />
                  {traceErrors.dateSale && (
                    <div className="flex items-center space-x-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{traceErrors.dateSale}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Valor (CLP)</Label>
                  <Input
                    type="number"
                    value={newTrace.value}
                    onChange={(e) => updateNewTrace('value', Number(e.target.value))}
                    placeholder="0"
                    className="bg-white/5 border-white/20 text-white focus:border-amber-400"
                  />
                  {traceErrors.value && (
                    <div className="flex items-center space-x-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{traceErrors.value}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Impuesto (CLP)</Label>
                  <Input
                    type="number"
                    value={newTrace.tax}
                    onChange={(e) => updateNewTrace('tax', Number(e.target.value))}
                    placeholder="0"
                    className="bg-white/5 border-white/20 text-white focus:border-amber-400"
                  />
                  {traceErrors.tax && (
                    <div className="flex items-center space-x-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{traceErrors.tax}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={addTrace}
                disabled={!newTrace.name.trim()}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Transacción
              </Button>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{submissionStep || "Actualizando..."}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>Actualizar Propiedad</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
