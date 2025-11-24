import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, User, Mail, Lock, Save } from "lucide-react"
import { toast } from "sonner"
import axios from "@/lib/axios"
import { useNavigate } from "react-router-dom"

export default function ProfilePage() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)
    const fileInputRef = useRef(null)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser)
                setUser(parsedUser)
                setFormData({
                    nombre: parsedUser.nombre || "",
                    apellido: parsedUser.apellido || "",
                    email: parsedUser.email || "",
                    password: "",
                    confirmPassword: ""
                })
                if (parsedUser.imagen) {
                    setImagePreview(`http://localhost:4000/uploads/${parsedUser.imagen}`)
                }
            } catch (e) {
                console.error("Error parsing user from local storage", e)
                localStorage.removeItem("user")
                navigate("/login")
            }
        } else {
            navigate("/login")
        }
    }, [navigate])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error("Las contraseñas no coinciden")
            return
        }

        setLoading(true)

        try {
            const data = new FormData()
            data.append("nombre", formData.nombre)
            data.append("apellido", formData.apellido)
            data.append("email", formData.email)
            if (formData.password) {
                data.append("password", formData.password)
            }

            if (fileInputRef.current.files[0]) {
                data.append("imagen", fileInputRef.current.files[0])
            }

            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Sesión expirada. Por favor inicia sesión nuevamente.")
                navigate("/login")
                return
            }

            const response = await axios.put(`/auth/users/${user.id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            })

            const updatedUser = { ...user, ...response.data }

            if (!updatedUser.id) {
                throw new Error("Respuesta del servidor inválida");
            }

            localStorage.setItem("user", JSON.stringify(updatedUser))

            toast.success("Perfil actualizado correctamente")

            // Navigate away and back to force clean re-mount (same pattern as SparePartDetail)
            navigate("/dashboard")
            setTimeout(() => {
                navigate("/dashboard/profile")
            }, 100)

        } catch (error) {
            console.error("Error updating profile:", error)
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("Sesión expirada. Redirigiendo al login...")
                localStorage.removeItem("user")
                localStorage.removeItem("token")
                navigate("/login")
            } else {
                toast.error(error.response?.data?.message || "Error al actualizar el perfil")
            }
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-primary animate-pulse">Cargando perfil...</div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
                <p className="text-muted-foreground">
                    Administra tu información personal y preferencias
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Imagen de Perfil</CardTitle>
                        <CardDescription>
                            Sube una foto para personalizar tu experiencia
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-6">
                        <Avatar className="w-32 h-32 border-4 border-muted">
                            <AvatarImage src={imagePreview} className="object-cover" />
                            <AvatarFallback className="text-4xl">
                                {user.nombre?.[0]}{user.apellido?.[0]}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <Button variant="outline" onClick={() => fileInputRef.current.click()}>
                                <Upload className="mr-2 h-4 w-4" />
                                Cambiar Imagen
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Información Personal</CardTitle>
                        <CardDescription>
                            Actualiza tus datos básicos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            className="pl-9"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="apellido">Apellido</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="apellido"
                                            name="apellido"
                                            value={formData.apellido}
                                            onChange={handleChange}
                                            className="pl-9"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 pt-4 border-t">
                                <Label>Cambiar Contraseña (Opcional)</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        name="password"
                                        placeholder="Nueva contraseña"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="pl-9"
                                    />
                                </div>
                                <div className="relative mt-2">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirmar contraseña"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                >
                                    {loading ? "Guardando..." : "Guardar Cambios"}
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
