import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { BaseUrl } from "@/lib/BaseUrl"
import { Link, useNavigate } from "react-router-dom"
import { Bus, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react"

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const validateForm = () => {
        // Name validation
        if (!formData.nombre.trim()) {
            setError("El nombre es requerido");
            return false;
        }
        if (formData.nombre.trim().length < 2) {
            setError("El nombre debe tener al menos 2 caracteres");
            return false;
        }

        // Last name validation
        if (!formData.apellido.trim()) {
            setError("El apellido es requerido");
            return false;
        }
        if (formData.apellido.trim().length < 2) {
            setError("El apellido debe tener al menos 2 caracteres");
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            setError("El correo electrónico es requerido");
            return false;
        }
        if (!emailRegex.test(formData.email)) {
            setError("Por favor ingresa un correo electrónico válido");
            return false;
        }

        // Password validation
        if (!formData.password) {
            setError("La contraseña es requerida");
            return false;
        }
        if (formData.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return false;
        }
        if (!/[A-Z]/.test(formData.password)) {
            setError("La contraseña debe contener al menos una letra mayúscula");
            return false;
        }
        if (!/[0-9]/.test(formData.password)) {
            setError("La contraseña debe contener al menos un número");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${BaseUrl}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                setError(data.message || "Error al registrar usuario");
            }
        } catch (err) {
            setError("Error de conexión. Verifica que el servidor esté activo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
                        <div className="bg-cyan-500 p-2 rounded-lg">
                            <Bus className="h-8 w-8" />
                        </div>
                        <span className="text-2xl font-bold">Yutong Venezuela</span>
                    </Link>
                </div>

                <Card className="shadow-2xl border-slate-700">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Crear Cuenta</CardTitle>
                        <CardDescription className="text-center">
                            Completa el formulario para registrarte
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-lg flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                                    <p className="text-sm">¡Registro exitoso! Redirigiendo al login...</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="nombre"
                                        name="nombre"
                                        type="text"
                                        placeholder="Juan"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="apellido">Apellido</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="apellido"
                                        name="apellido"
                                        type="text"
                                        placeholder="Pérez"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Mínimo 6 caracteres, debe incluir una mayúscula y un número
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-cyan-500 hover:bg-cyan-600"
                                disabled={loading || success}
                            >
                                {loading ? "Registrando..." : "Crear Cuenta"}
                            </Button>

                            <div className="text-center text-sm text-muted-foreground">
                                ¿Ya tienes una cuenta?{" "}
                                <Link to="/login" className="text-cyan-500 hover:text-cyan-400 font-medium">
                                    Inicia sesión aquí
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center mt-6">
                    <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">
                        ← Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
