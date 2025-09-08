"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, Check, AlertCircle, X, Building2 } from "lucide-react"
import { toast } from "sonner"
import { ownerService } from "@/services"
import { OwnerWithPropertiesDto } from "@/services/types"
import Image from "next/image"

const ownerEditSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  address: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(200, "La dirección no puede exceder 200 caracteres"),
  birthday: z.string().min(1, "La fecha de nacimiento es requerida"),
})

type OwnerEditFormData = z.infer<typeof ownerEditSchema>

interface EditOwnerModalProps {
  isOpen: boolean
  onClose: () => void
  owner: OwnerWithPropertiesDto
  onSuccess: () => void
}

export function EditOwnerModal({ isOpen, onClose, owner, onSuccess }: EditOwnerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStep, setSubmissionStep] = useState<string>("")
  const [photoPreview, setPhotoPreview] = useState<string>("")
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OwnerEditFormData>({
    resolver: zodResolver(ownerEditSchema),
    defaultValues: {
      name: owner.name || "",
      address: owner.address || "",
      birthday: owner.birthday ? new Date(owner.birthday).toISOString().split('T')[0] : "",
    },
  })

  // Reset form when owner changes
  useEffect(() => {
    if (owner) {
      reset({
        name: owner.name || "",
        address: owner.address || "",
        birthday: owner.birthday ? new Date(owner.birthday).toISOString().split('T')[0] : "",
      })
      setPhotoPreview(owner.photo || "")
      setSelectedPhotoFile(null)
    }
  }, [owner, reset])

  const onSubmit = async (data: OwnerEditFormData) => {
    if (!owner.id) {
      toast.error("ID del propietario no encontrado")
      return
    }

    setIsSubmitting(true)

    try {
      // Paso 1: Actualizar información básica del propietario
      setSubmissionStep("Actualizando información...")
      
      const ownerData = {
        name: data.name,
        address: data.address,
        photo: owner.photo || "", // Mantener la foto actual por defecto
        birthday: new Date(data.birthday).toISOString()
      }

      console.log("Actualizando propietario con datos:", ownerData)
      
      const updateSuccess = await ownerService.updateOwner(owner.id, ownerData)
      
      if (!updateSuccess) {
        throw new Error("No se pudo actualizar el propietario")
      }

      console.log("Propietario actualizado exitosamente")

      // Paso 2: Subir nueva foto si se seleccionó una
      if (selectedPhotoFile && owner.id) {
        setSubmissionStep("Actualizando foto...")
        console.log("Subiendo nueva foto para el propietario:", owner.id)
        
        const photoUploaded = await ownerService.uploadOwnerPhoto(owner.id, selectedPhotoFile)
        
        if (!photoUploaded) {
          console.warn("No se pudo actualizar la foto, pero la información fue actualizada")
          toast.warning("Información actualizada, pero hubo un problema al actualizar la foto")
        } else {
          console.log("Foto actualizada exitosamente")
        }
      }

      toast.success("Propietario actualizado exitosamente")
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error al actualizar el propietario:", error)
      toast.error("Error al actualizar el propietario")
    } finally {
      setIsSubmitting(false)
      setSubmissionStep("")
    }
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tamaño del archivo (2MB máximo)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("El archivo debe ser menor a 2MB")
        return
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error("Solo se permiten archivos de imagen")
        return
      }

      // Guardar el archivo para subirlo después
      setSelectedPhotoFile(file)

      // Crear preview para mostrar en la UI
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPhotoPreview(result)
      }
      reader.readAsDataURL(file)

      toast.success("Foto seleccionada correctamente")
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedPhotoFile(null)
      setPhotoPreview(owner.photo || "")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Editar Propietario</span>
          </DialogTitle>
        </DialogHeader>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Photo Upload */}
              <div className="flex justify-center">
                <div className="space-y-4 text-center">
                  <div className="w-32 h-32 mx-auto bg-white/10 rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-white/20 hover:border-white/40 transition-colors">
                    {photoPreview ? (
                      <Image
                        src={photoPreview}
                        alt="Preview"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-12 h-12 text-white/40" />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors w-full">
                        <Upload className="w-4 h-4" />
                        <span>Cambiar Foto</span>
                      </div>
                    </Label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <p className="text-white/60 text-sm mt-2 text-center">
                      {selectedPhotoFile ? (
                        <span className="text-green-400">
                          ✓ Nueva foto seleccionada: {selectedPhotoFile.name}
                        </span>
                      ) : (
                        "Opcional - JPG, PNG hasta 2MB"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Nombre Completo *
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Ej: María González Pérez"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-emerald-400"
                  />
                  {errors.name && (
                    <div className="flex items-center space-x-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.name.message}</span>
                    </div>
                  )}
                </div>

                {/* Birthday */}
                <div className="space-y-2">
                  <Label htmlFor="birthday" className="text-white">
                    Fecha de Nacimiento *
                  </Label>
                  <Input
                    id="birthday"
                    type="date"
                    {...register("birthday")}
                    className="bg-white/5 border-white/20 text-white focus:border-emerald-400"
                  />
                  {errors.birthday && (
                    <div className="flex items-center space-x-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.birthday.message}</span>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address" className="text-white">
                    Dirección *
                  </Label>
                  <Textarea
                    id="address"
                    {...register("address")}
                    placeholder="Ej: Av. Las Condes 8500, Las Condes, Santiago"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-emerald-400 min-h-[80px]"
                  />
                  {errors.address && (
                    <div className="flex items-center space-x-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.address.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t border-white/10">
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
                  type="submit"
                  className="flex-1 bg-amber-700 hover:bg-amber-900 text-white"
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
                      <span>Actualizar Propietario</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
