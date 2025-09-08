"use client"

import type React from "react"
import { Suspense } from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, AlertCircle, Upload, X, ImageIcon, Plus, Building2 } from "lucide-react"
import { motion } from "framer-motion"
import { GlobalHeader } from "@/components/GlobalHeader"
import { toast } from "sonner"
import { useOwners, usePropertyMutations } from "@/hooks"
import Image from "next/image"

const propertySchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  address: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(200, "La dirección no puede exceder 200 caracteres"),
  price: z
    .number()
    .min(1000000, "El precio debe ser mayor a $1.000.000")
    .max(1000000000, "El precio no puede exceder $1.000.000.000"),
  codeInternal: z
    .string()
    .min(3, "El código debe tener al menos 3 caracteres")
    .max(20, "El código no puede exceder 20 caracteres"),
  year: z
    .number()
    .min(1900, "El año debe ser mayor a 1900")
    .max(new Date().getFullYear() + 5, "El año no puede ser futuro"),
  idOwner: z.string().min(1, "Debe seleccionar un propietario"),
  traces: z
    .array(
      z.object({
        name: z.string().min(1, "El nombre de la transacción es requerido"),
        value: z.number().min(1, "El valor debe ser mayor a 0"),
        tax: z.number().min(0, "El impuesto debe ser mayor o igual a 0"),
        dateSale: z.string().min(1, "La fecha es requerida"),
      }).refine((data) => data.tax <= data.value, {
        message: "El impuesto no puede ser mayor al valor",
        path: ["tax"],
      }),
    )
    .optional(),
})

type PropertyFormData = z.infer<typeof propertySchema>

function CreatePropertyPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedOwnerId = searchParams.get("ownerId")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [submissionStep, setSubmissionStep] = useState("")
  
  // Obtener lista de propietarios desde la API
  const { owners, loading: ownersLoading, error: ownersError } = useOwners()
  
  // Obtener mutaciones de Redux
  const { createProperty, uploadPropertyImage, createPropertyTrace } = usePropertyMutations()

  console.log(owners)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      address: "",
      price: 0,
      codeInternal: "",
      year: new Date().getFullYear(),
      idOwner: preselectedOwnerId || "",
      traces: [],
    },
  })

  const {
    fields: traceFields,
    append: appendTrace,
    remove: removeTrace,
  } = useFieldArray({
    control,
    name: "traces",
  })

  // Efecto para preseleccionar el propietario cuando se carguen los datos
  useEffect(() => {
    if (preselectedOwnerId && owners.length > 0) {
      const ownerExists = owners.find(owner => owner.id === preselectedOwnerId)
      if (ownerExists) {
        setValue("idOwner", preselectedOwnerId)
      }
    }
  }, [preselectedOwnerId, owners, setValue])

  // Funciones para manejar imágenes
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    files.forEach((file) => {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error(`El archivo ${file.name} no es una imagen válida`)
        return
      }
      
      // Validar tamaño (2MB máximo)
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`La imagen ${file.name} es demasiado grande (máximo 2MB)`)
        return
      }
      
      // Agregar archivo a la lista
      setSelectedImages(prev => [...prev, file])
      
      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreviews(prev => [...prev, result])
      }
      reader.readAsDataURL(file)
    })
    
    // Limpiar el input
    event.target.value = ''
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const addTrace = () => {
    appendTrace({
      name: "",
      value: 0,
      tax: 0,
      dateSale: new Date().toISOString().split("T")[0],
    })
  }

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)

    try {
      console.log("Creando propiedad con datos:", data)
      setSubmissionStep("Creando propiedad...")

      // Crear la propiedad usando Redux
      const createdProperty = await createProperty({
        name: data.name,
        address: data.address,
        price: data.price,
        codeInternal: data.codeInternal,
        year: data.year,
        idOwner: data.idOwner,
      }).unwrap()

      if (!createdProperty || !createdProperty.id) {
        throw new Error("No se pudo crear la propiedad")
      }

      console.log("Propiedad creada exitosamente:", createdProperty)

      // Subir imágenes si hay alguna seleccionada
      if (selectedImages.length > 0) {
        setSubmissionStep("Subiendo imágenes...")
        
        let uploadedImages = 0
        let failedImages = 0

        for (const imageFile of selectedImages) {
          try {
            await uploadPropertyImage({
              propertyId: createdProperty.id,
              file: imageFile,
              isPrimary: uploadedImages === 0 // La primera imagen es la principal
            }).unwrap()
            uploadedImages++
          } catch (error) {
            console.error("Error al subir imagen:", error)
            failedImages++
          }
        }

        if (failedImages > 0) {
          toast.warning(`Propiedad creada, pero ${failedImages} imagen(es) no se pudieron subir`)
        } else {
          toast.success(`Propiedad creada exitosamente con ${uploadedImages} imagen(es)`)
        }
      }

      // Crear traces si hay alguno
      if (data.traces && data.traces.length > 0) {
        setSubmissionStep("Creando transacciones...")
        
        let createdTraces = 0
        let failedTraces = 0

        for (const trace of data.traces) {
          try {
            const traceData = {
              name: trace.name,
              value: trace.value,
              tax: trace.tax,
              dateSale: new Date(trace.dateSale).toISOString(),
              idProperty: createdProperty.id,
            }

            await createPropertyTrace(traceData).unwrap()
            createdTraces++
          } catch (error) {
            console.error("Error al crear trace:", error)
            failedTraces++
          }
        }

        if (failedTraces > 0) {
          toast.warning(`Propiedad creada, pero ${failedTraces} transacción(es) no se pudieron crear`)
        } else if (createdTraces > 0) {
          toast.success(`Propiedad creada exitosamente con ${createdTraces} transacción(es)`)
        }
      }

      if (selectedImages.length === 0 && (!data.traces || data.traces.length === 0)) {
        toast.success("Propiedad creada exitosamente")
      }

      // Redirect to property detail page
      router.push(`/property/${createdProperty.id}`)
    } catch (error) {
      console.error("Error al crear la propiedad:", error)
      toast.error("Error al crear la propiedad")
    } finally {
      setIsSubmitting(false)
      setSubmissionStep("")
    }
  }


  return (
    <div className="min-h-screen ">
      {/* Header */}
      <GlobalHeader
        title="Crear Nueva Propiedad"
        subtitle="Registra una nueva propiedad en el sistema"
      />

      <div className="container mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Building2 className="w-6 h-6" />
                  <span>Información Básica</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Nombre de la Propiedad *
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Ej: Villa Moderna en Las Condes"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400"
                    />
                    {errors.name && (
                      <div className="flex items-center space-x-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.name.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Code Internal */}
                  <div className="space-y-2">
                    <Label htmlFor="codeInternal" className="text-white">
                      Código Interno *
                    </Label>
                    <Input
                      id="codeInternal"
                      {...register("codeInternal")}
                      placeholder="Ej: LC-VM-001"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400"
                    />
                    {errors.codeInternal && (
                      <div className="flex items-center space-x-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.codeInternal.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Owner */}
                  <div className="space-y-2">
                    <Label className="text-white">Propietario *</Label>
                    <Select
                      onValueChange={(value) => setValue("idOwner", value)}
                      defaultValue={preselectedOwnerId || ""}
                      disabled={ownersLoading}
                    >
                      <SelectTrigger className="w-full bg-white/5 border-white/20 text-white focus:border-amber-400">
                        <SelectValue placeholder={ownersLoading ? "Cargando propietarios..." : "Seleccionar propietario"} />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-white/20 backdrop-blur-sm">
                        {ownersLoading ? (
                          <div className="px-2 py-1.5 text-sm text-white/60">
                            Cargando propietarios...
                          </div>
                        ) : ownersError ? (
                          <div className="px-2 py-1.5 text-sm text-red-400">
                            Error al cargar propietarios
                          </div>
                        ) : owners.length === 0 ? (
                          <div className="px-2 py-1.5 text-sm text-white/60">
                            No hay propietarios disponibles
                          </div>
                        ) : (
                          owners.map((owner) => (
                            <SelectItem
                              key={owner.id}
                              value={owner.id}
                              className="text-white hover:bg-white/10"
                            >
                              {owner.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.idOwner && (
                      <div className="flex items-center space-x-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.idOwner.message}</span>
                      </div>
                    )}
                    {ownersError && (
                      <div className="flex items-center space-x-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>Error al cargar propietarios: {ownersError ? (typeof ownersError === 'string' ? ownersError : 'Error desconocido') : 'Error desconocido'}</span>
                      </div>
                    )}
                  </div>


                  {/* Price */}
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-white">
                      Precio (CLP) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      {...register("price", { valueAsNumber: true })}
                      placeholder="Ej: 850000000"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400"
                    />
                    {errors.price && (
                      <div className="flex items-center space-x-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.price.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Year */}
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-white">
                      Año de Construcción *
                    </Label>
                    <Input
                      id="year"
                      type="number"
                      {...register("year", { valueAsNumber: true })}
                      placeholder="Ej: 2020"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400"
                    />
                    {errors.year && (
                      <div className="flex items-center space-x-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.year.message}</span>
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
                      placeholder="Ej: Av. Las Condes 12450, Las Condes, Santiago"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400 min-h-[80px]"
                    />
                    {errors.address && (
                      <div className="flex items-center space-x-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.address.message}</span>
                      </div>
                    )}
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Images Section */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <ImageIcon className="w-6 h-6" />
                  <span>Imágenes de la Propiedad</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="images-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-white/20 hover:border-white/40 rounded-lg p-8 text-center transition-colors">
                      <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
                      <p className="text-white mb-2">Haz clic para subir imágenes</p>
                      <p className="text-white/60 text-sm">JPG, PNG hasta 2MB cada una</p>
                    </div>
                  </Label>
                  <input
                    id="images-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {imagePreviews.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">
                      Imágenes seleccionadas ({imagePreviews.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            width={400}
                            height={128}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {selectedImages[index]?.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Traces Section */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Historial de Transacciones</span>
                  <Button type="button" onClick={addTrace} size="sm" className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Transacción
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {traceFields.length > 0 ? (
                  <div className="space-y-4">
                    {traceFields.map((field, index) => (
                      <div key={field.id} className="bg-white/5 rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-medium">Transacción {index + 1}</h4>
                          <Button
                            type="button"
                            onClick={() => removeTrace(index)}
                            size="sm"
                            variant="outline"
                            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-white">Nombre de la Transacción</Label>
                            <Input
                              {...register(`traces.${index}.name`)}
                              placeholder="Ej: Compra inicial"
                              className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400"
                            />
                            {errors.traces?.[index]?.name && (
                              <div className="flex items-center space-x-2 text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.traces[index]?.name?.message}</span>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-white">Fecha</Label>
                            <Input
                              type="date"
                              {...register(`traces.${index}.dateSale`)}
                              className="bg-white/5 border-white/20 text-white focus:border-amber-400"
                            />
                            {errors.traces?.[index]?.dateSale && (
                              <div className="flex items-center space-x-2 text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.traces[index]?.dateSale?.message}</span>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-white">Valor (CLP)</Label>
                            <Input
                              type="number"
                              {...register(`traces.${index}.value`, { valueAsNumber: true })}
                              placeholder="0"
                              className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400"
                            />
                            {errors.traces?.[index]?.value && (
                              <div className="flex items-center space-x-2 text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.traces[index]?.value?.message}</span>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-white">Impuesto (CLP)</Label>
                            <Input
                              type="number"
                              {...register(`traces.${index}.tax`, { valueAsNumber: true })}
                              placeholder="0"
                              className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400"
                            />
                            {errors.traces?.[index]?.tax && (
                              <div className="flex items-center space-x-2 text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.traces[index]?.tax?.message}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/60 text-center py-8">
                    No hay transacciones registradas. Haz clic en &quot;Agregar Transacción&quot; para comenzar.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-4">
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
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
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
                    <span>Crear Propiedad</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default function CreatePropertyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
          <p className="text-white/60">Cargando...</p>
        </div>
      </div>
    }>
      <CreatePropertyPageContent />
    </Suspense>
  )
}
