import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bus, Cog, Info, ExternalLink, Home } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { BaseUrl } from "@/lib/BaseUrl"
import { getImageUrl } from "@/lib/utils"

export default function PublicBusDetail() {
    const { id } = useParams();
    const [bus, setBus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBus = async () => {
            try {
                const response = await fetch(`${BaseUrl}/autobuses/${id}`);
                if (!response.ok) {
                    throw new Error("No se pudo cargar la información del autobús");
                }
                const data = await response.json();
                setBus(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBus();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-muted-foreground">Cargando información...</p>
                </div>
            </div>
        );
    }

    if (error || !bus) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center gap-4">
                <p className="text-destructive font-medium">Error: {error || "Autobús no encontrado"}</p>
                <Link to="/">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al Inicio
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {/* Navbar */}
            <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
                        <Bus className="h-6 w-6" />
                        <span>Yutong Venezuela</span>
                    </Link>
                    <Link to="/">
                        <Button variant="ghost" size="sm">
                            <Home className="mr-2 h-4 w-4" />
                            Inicio
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-8 space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        {bus.marca} {bus.modelo}
                    </h1>
                    {bus.uso && (
                        <p className="text-xl text-blue-600 dark:text-blue-400 font-medium">
                            {bus.uso}
                        </p>
                    )}
                    {bus.descripcion && (
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {bus.descripcion}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Imagen */}
                    <div className="space-y-4">
                        <Card className="overflow-hidden shadow-lg">
                            <div className="aspect-video relative bg-muted">
                                <img
                                    src={bus.imagen ? getImageUrl(bus.imagen) : "/images/placeholder-bus.png"}
                                    alt={`${bus.marca} ${bus.modelo}`}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Especificaciones Técnicas */}
                    <Card className="shadow-lg">
                        <CardHeader className="bg-blue-50 dark:bg-blue-950">
                            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                                <Cog className="h-5 w-5" />
                                Especificaciones Técnicas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 gap-4">
                                {bus.asientos && (
                                    <div className="p-3 rounded-lg bg-muted/50 border">
                                        <p className="text-xs text-muted-foreground mb-1">Asientos</p>
                                        <p className="font-semibold text-lg">{bus.asientos}</p>
                                    </div>
                                )}
                                {bus.puertas && (
                                    <div className="p-3 rounded-lg bg-muted/50 border">
                                        <p className="text-xs text-muted-foreground mb-1">Puertas</p>
                                        <p className="font-semibold text-lg">{bus.puertas}</p>
                                    </div>
                                )}
                                {bus.motor && (
                                    <div className="p-3 rounded-lg bg-muted/50 border col-span-2">
                                        <p className="text-xs text-muted-foreground mb-1">Motor</p>
                                        <p className="font-semibold">{bus.motor}</p>
                                    </div>
                                )}
                                {bus.transmision && (
                                    <div className="p-3 rounded-lg bg-muted/50 border">
                                        <p className="text-xs text-muted-foreground mb-1">Transmisión</p>
                                        <p className="font-semibold">{bus.transmision}</p>
                                    </div>
                                )}
                                {bus.combustible && (
                                    <div className="p-3 rounded-lg bg-muted/50 border">
                                        <p className="text-xs text-muted-foreground mb-1">Combustible</p>
                                        <p className="font-semibold">{bus.combustible}</p>
                                    </div>
                                )}
                                {bus.neumaticos && (
                                    <div className="p-3 rounded-lg bg-muted/50 border">
                                        <p className="text-xs text-muted-foreground mb-1">Neumáticos</p>
                                        <p className="font-semibold">{bus.neumaticos}</p>
                                    </div>
                                )}
                                {bus.direccion && (
                                    <div className="p-3 rounded-lg bg-muted/50 border">
                                        <p className="text-xs text-muted-foreground mb-1">Dirección</p>
                                        <p className="font-semibold">{bus.direccion}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Call to Action */}
                <Card className="shadow-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                    <CardContent className="p-8 text-center space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                ¿Interesado en este modelo?
                            </h3>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Visita nuestra plataforma para ver el catálogo completo de vehículos,
                                repuestos disponibles y obtener más información sobre nuestros productos y servicios.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to="/">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <ExternalLink className="mr-2 h-5 w-5" />
                                    Ver Catálogo Completo
                                </Button>
                            </Link>
                            <Link to="/">
                                <Button size="lg" variant="outline">
                                    <Info className="mr-2 h-5 w-5" />
                                    Más Información
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="mt-12 text-center text-sm text-muted-foreground">
                    <Separator className="mb-4" />
                    <p> © 2025 Planta de Autobuses Yutong Venezuela. Todos los derechos reservados. Sistema de Gestión de Catálogo e Inventario</p>
                </div>
            </main>
        </div>
    );
}
