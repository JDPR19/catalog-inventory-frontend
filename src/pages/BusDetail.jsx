import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Upload, Save, X, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { BaseUrl } from "@/lib/BaseUrl"

const formSchema = z.object({
    modelo: z.string().min(2, "El nombre del modelo es requerido"),
    marca: z.string().min(2, "La marca es requerida"),
    uso: z.string().optional(),
    descripcion: z.string().optional(),
    motor: z.string().optional(),
    puertas: z.string().optional(),
    asientos: z.string().optional(),
    transmision: z.string().optional(),
    combustible: z.string().optional(),
    neumaticos: z.string().optional(),
    direccion: z.string().optional(),
})

export default function BusDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const isEditMode = Boolean(id)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            modelo: "",
            marca: "",
            uso: "",
            descripcion: "",
            motor: "",
            puertas: "",
            asientos: "",
            transmision: "",
            combustible: "",
            neumaticos: "",
            direccion: "",
        },
    })

    useEffect(() => {
        if (isEditMode) {
            fetchBusData()
        }
    }, [id])

    const fetchBusData = async () => {
        try {
            const response = await fetch(`${BaseUrl}/autobuses/${id}`)
            if (response.ok) {
                const data = await response.json()
                form.reset({
                    modelo: data.modelo || "",
                    marca: data.marca || "",
                    uso: data.uso || "",
                    descripcion: data.descripcion || "",
                    motor: data.motor || "",
                    puertas: data.puertas || "",
                    asientos: data.asientos || "",
                    transmision: data.transmision || "",
                    combustible: data.combustible || "",
                    neumaticos: data.neumaticos || "",
                    direccion: data.direccion || "",
                })
                if (data.imagen) {
                    setImagePreview(`${BaseUrl}/uploads/${data.imagen}`)
                }
            }
        } catch (error) {
            console.error("Error fetching bus:", error)
            toast.error("Error al cargar los datos del autobús")
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const onSubmit = async (values) => {
        setLoading(true)
        try {
            const formData = new FormData()
            Object.keys(values).forEach(key => {
                formData.append(key, values[key] || "")
            })
            if (imageFile) {
                formData.append("imagen", imageFile)
            }

            const url = isEditMode
                ? `${BaseUrl}/autobuses/${id}`
                : `${BaseUrl}/autobuses`

            const method = isEditMode ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                body: formData,
            })

            if (response.ok) {
                toast.success(isEditMode ? "Autobús actualizado correctamente" : "Autobús registrado correctamente")
                setTimeout(() => navigate("/dashboard/inventory"), 1000)
            } else {
                const errorData = await response.json()
                toast.error(errorData.message || "Error al guardar el autobús")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Error de conexión. Verifica que el servidor esté activo.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {isEditMode ? "Editar Modelo de Autobús" : "Registrar Nuevo Modelo de Autobús"}
                    </h2>
                    <p className="text-muted-foreground">Complete la información técnica y general del vehículo.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate("/dashboard/inventory")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar
                    </Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={loading}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? "Guardando..." : "Guardar Modelo"}
                    </Button>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    {/* Información General */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información General</CardTitle>
                            <CardDescription>Detalles básicos del modelo.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="modelo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre del Modelo *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: ZK6129H" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="marca"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Marca *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Yutong" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="uso"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Uso</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Turismo, Urbano, Interurbano" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="descripcion"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descripción Breve</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Bus de lujo para viajes largos" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Imagen */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Imagen del Autobús</CardTitle>
                            <CardDescription>Sube una imagen del modelo.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {imagePreview && (
                                    <div className="relative w-full max-w-md">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg border"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={() => {
                                                setImageFile(null)
                                                setImagePreview(null)
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                        <div className="p-4 bg-primary/10 rounded-full text-primary">
                                            <Upload className="h-8 w-8" />
                                        </div>
                                        <h3 className="font-semibold text-lg">Haz clic para seleccionar una imagen</h3>
                                        <p className="text-sm text-muted-foreground">PNG, JPG, WEBP hasta 10MB</p>
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Especificaciones Técnicas */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Especificaciones Técnicas</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="motor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Motor</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Cummins ISDe245" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="transmision"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Transmisión</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Manual, 6 velocidades" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="asientos"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Asientos</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: 49" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="puertas"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Puertas</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: 2" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="combustible"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Combustible</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Diesel" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="neumaticos"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Neumáticos</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: 295/80R22.5" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="direccion"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dirección</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Hidráulica" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                </form>
            </Form>
        </div>
    )
}
