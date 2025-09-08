"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Home, Users, Upload, Check, AlertCircle, Building2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { toast } from "sonner"
import { ownerService } from "@/services"

const ownerSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  address: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(200, "La dirección no puede exceder 200 caracteres"),
  email: z.string().email("Ingrese un email válido").optional().or(z.literal("")),
  phone: z
    .string()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .max(15, "El teléfono no puede exceder 15 dígitos")
    .optional()
    .or(z.literal("")),
  birthday: z.string().min(1, "La fecha de nacimiento es requerida"),
  photo: z.string().optional(),
})

type OwnerFormData = z.infer<typeof ownerSchema>

export default function CreateOwnerPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStep, setSubmissionStep] = useState<string>("")
  const [photoPreview, setPhotoPreview] = useState<string>("")
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OwnerFormData>({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
      name: "",
      address: "",
      email: "",
      phone: "",
      birthday: "",
      photo: "",
    },
  })

  const onSubmit = async (data: OwnerFormData) => {
    setIsSubmitting(true)

    try {
      // Paso 1: Crear el propietario con información básica
      setSubmissionStep("Creando propietario...")
      
      const ownerData = {
        name: data.name,
        address: data.address,
        photo: "", // String vacío como especificaste
        birthday: new Date(data.birthday).toISOString()
      }

      console.log("Creando propietario con datos:", ownerData)
      
      const createdOwner = await ownerService.createOwner(ownerData)
      
      if (!createdOwner || !createdOwner.id) {
        throw new Error("No se pudo crear el propietario")
      }

      console.log("Propietario creado exitosamente:", createdOwner)

      // Paso 2: Subir la foto si se seleccionó una
      if (selectedPhotoFile && createdOwner.id) {
        setSubmissionStep("Subiendo foto...")
        console.log("Subiendo foto para el propietario:", createdOwner.id)
        
        const photoUploaded = await ownerService.uploadOwnerPhoto(createdOwner.id, selectedPhotoFile)
        
        if (!photoUploaded) {
          console.warn("No se pudo subir la foto, pero el propietario fue creado")
          toast.warning("Propietario creado, pero hubo un problema al subir la foto")
        } else {
          console.log("Foto subida exitosamente")
        }
      }

      toast.success("Propietario creado exitosamente")

      // Redirect to owner detail page
      router.push(`/owner/${createdOwner.id}`)
    } catch (error) {
      console.error("Error al crear el propietario:", error)
      toast.error("Error al crear el propietario")
    } finally {
      setIsSubmitting(false)
      setSubmissionStep("")
    }
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tamaño del archivo (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("El archivo debe ser menor a 5MB")
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
        setValue("photo", result)
      }
      reader.readAsDataURL(file)

      toast.success("Foto seleccionada correctamente")
    }
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
            <div className="flex md:flex-row flex-col items-start md:items-center space-x-4">
              <Button onClick={() => router.back()} variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h2 className="text-xl font-semibold text-white">Crear Nuevo Propietario</h2>
                <p className="text-white/60 text-sm">Registra un nuevo propietario en el sistema</p>
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

      <div className="container mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Users className="w-6 h-6" />
                <span>Formulario de Nuevo Propietario</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Photo Upload */}
                  <div className="md:col-span-2 flex justify-center">
                    <div className="space-y-4 text-center">
                      <div className="w-32 h-32 mx-auto bg-white/10 rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-white/20 hover:border-white/40 transition-colors">
                        {photoPreview ? (
                          <img
                            src={photoPreview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-12 h-12 text-white/40" />
                        )}
                      </div>
                      <div>
                        <Label htmlFor="photo-upload" className="cursor-pointer">
                          <div className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                            <Upload className="w-4 h-4" />
                            <span>Subir Foto</span>
                          </div>
                        </Label>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <p className="text-white/60 text-sm mt-2">
                          {selectedPhotoFile ? (
                            <div className="space-y-2">
                              <span className="text-green-400 block">
                                ✓ Foto seleccionada: {selectedPhotoFile.name}
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPhotoFile(null)
                                  setPhotoPreview("")
                                  setValue("photo", "")
                                }}
                                className="text-red-400 border-red-400/20 hover:bg-red-400/10"
                              >
                                Remover foto
                              </Button>
                            </div>
                          ) : (
                            "Opcional - JPG, PNG hasta 5MB"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

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
                    onClick={() => router.back()}
                    variant="outline"
                    className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
                    disabled={isSubmitting}
                  >
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
                        <span>{submissionStep || "Creando..."}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4" />
                        <span>Crear Propietario</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
