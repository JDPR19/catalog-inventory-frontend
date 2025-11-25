import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BaseUrl } from "@/lib/BaseUrl"
import { getImageUrl } from "@/lib/utils"

import axios from "@/lib/axios"
import { toast } from "sonner"

export default function SparePartDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEditing = !!id

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        nombre: "",
        categoria: "",
        descripcion: "",
        codigo: "",
        modelo: "",
        imagen: null
    })
    const [previewUrl, setPreviewUrl] = useState(null)

    // Predefined categories for spare parts
    const categories = [
        "Motor",
        "Transmisión",
        "Suspensión",
        "Frenos",
        "Eléctrico",
        "Carrocería",
        "Interior",
        "Accesorios",
        "Otros"
    ]

    useEffect(() => {
        if (isEditing) {
            fetchPart()
        }
    }, [id])

    const fetchPart = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`/repuestos/${id}`)
            setFormData({
                nombre: data.nombre,
                categoria: data.categoria,
                descripcion: data.descripcion || "",
                codigo: data.codigo || "",
                modelo: data.modelo || "",
                imagen: null // Don't set file object, just keep reference if needed or handle preview
            })
            if (data.imagen) {
                setPreviewUrl(getImageUrl(data.imagen))
            }
        } catch (error) {
            console.error("Error fetching part:", error)
            toast.error("Error al cargar el repuesto")
            navigate("/dashboard/repuestos")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleCategoryChange = (value) => {
        setFormData(prev => ({ ...prev, categoria: value }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({ ...prev, imagen: file }))
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const removeImage = () => {
        setFormData(prev => ({ ...prev, imagen: null }))
        setPreviewUrl(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = new FormData()
            data.append("nombre", formData.nombre)
            data.append("categoria", formData.categoria)
            data.append("descripcion", formData.descripcion)
            data.append("codigo", formData.codigo)
            data.append("modelo", formData.modelo)

            if (formData.imagen) {
                data.append("imagen", formData.imagen)
            }

            if (isEditing) {
                await axios.put(`/repuestos/${id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
                toast.success("Repuesto actualizado correctamente")
            } else {
                await axios.post("/repuestos", data, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
                toast.success("Repuesto creado correctamente")
            }
            navigate("/dashboard/repuestos")
        } catch (error) {
            console.error("Error saving part:", error)
            toast.error("Error al guardar el repuesto")
        } finally {
            setLoading(false)
        }
    }

    if (loading && isEditing && !formData.nombre) {
        return <div className="p-8 text-center">Cargando...</div>
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/repuestos")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">
                    {isEditing ? "Editar Repuesto" : "Nuevo Repuesto"}
                </h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información del Repuesto</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre del Repuesto</Label>
                            <Input
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Ej. Filtro de Aceite"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="codigo">Código</Label>
                                <Input
                                    id="codigo"
                                    name="codigo"
                                    value={formData.codigo}
                                    onChange={handleChange}
                                    placeholder="Ej. RP-001"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="modelo">Modelo</Label>
                                <Input
                                    id="modelo"
                                    name="modelo"
                                    value={formData.modelo}
                                    onChange={handleChange}
                                    placeholder="Ej. ZK6122H9"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="categoria">Categoría</Label>
                            <div className="relative">
                                <select
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                    value={formData.categoria}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Selecciona una categoría</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {/* Chevron down icon for styling */}
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                placeholder="Detalles técnicos, compatibilidad, etc."
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Imagen</Label>
                            <div className="flex items-center gap-4">
                                {previewUrl ? (
                                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50 text-muted-foreground">
                                        <Upload className="h-8 w-8" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="cursor-pointer"
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Formatos permitidos: JPG, PNG, WEBP.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => navigate("/dashboard/repuestos")}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                <Save className="mr-2 h-4 w-4" />
                                {loading ? "Guardando..." : "Guardar Repuesto"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
