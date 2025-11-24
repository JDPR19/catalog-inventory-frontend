import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { BaseUrl } from "@/lib/BaseUrl"
import { Link, useNavigate } from "react-router-dom"
import { Bus, Mail, Lock, AlertCircle } from "lucide-react"

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(""); // Clear error when user types
    };

    const validateForm = () => {
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
            const response = await fetch(`${BaseUrl}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Save token to localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                // Redirect to dashboard
                navigate("/dashboard");
            } else {
                setError(data.message || "Error al iniciar sesión");
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
                        <div className="bg-blue-50 text-blue-950  p-2 rounded-lg">                           <Bus className="h-8 w-8" />
                        </div>
                        <span className="text-2xl font-bold">Yutong Venezuela</span>
                    </Link>
                </div>

                <Card className="shadow-2xl border-slate-700">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
                        <CardDescription className="text-center">
                            Ingresa tus credenciales para acceder al panel
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
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-950 hover:bg-blue-800 text-white"
                                disabled={loading}
                            >
                                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                            </Button>

                            <div className="text-center text-sm text-muted-foreground">
                                ¿No tienes una cuenta?{" "}
                                <Link to="/register" className="text-blue-950 dark:text-white hover:text-blue-800 dark:hover:text-gray-200 font-medium">
                                    Regístrate aquí
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
