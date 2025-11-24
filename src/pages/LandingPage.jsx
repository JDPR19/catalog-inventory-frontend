import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import BusCarousel from "@/components/BusCarousel"
import SparePartsCarousel from "@/components/SparePartsCarousel"
import { BaseUrl } from "@/lib/BaseUrl"
import icon from '@/components/Icon';


export default function LandingPage() {
    const [buses, setBuses] = useState([]);
    const [spareParts, setSpareParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingParts, setLoadingParts] = useState(true);

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const response = await fetch(`${BaseUrl}/autobuses`);
                if (response.ok) {
                    const data = await response.json();
                    setBuses(data);
                }
            } catch (error) {
                console.error("Error fetching buses:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchSpareParts = async () => {
            try {
                const response = await fetch(`${BaseUrl}/repuestos`);
                if (response.ok) {
                    const data = await response.json();
                    setSpareParts(data);
                }
            } catch (error) {
                console.error("Error fetching spare parts:", error);
            } finally {
                setLoadingParts(false);
            }
        };

        fetchBuses();
        fetchSpareParts();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 flex items-center justify-center overflow-hidden rounded-lg bg-white p-1 flex-shrink-0">
                            <img src={icon.logo} alt="Logo Yutong" className="h-full w-full object-contain" />
                        </div>
                        <span className="font-bold text-base md:text-lg leading-tight">Planta de Autobuses Yutong Venezuela</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <a
                            href="#modelos"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('modelos')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="hover:text-primary transition-colors cursor-pointer"
                        >
                            Modelos
                        </a>
                        <a
                            href="#repuestos"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('repuestos')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="hover:text-primary transition-colors cursor-pointer"
                        >
                            Repuestos
                        </a>
                        <a
                            href="#contacto"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="hover:text-primary transition-colors cursor-pointer"
                        >
                            Contacto
                        </a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <Link to="/login">
                            <Button>Iniciar Sesión</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src={icon.entrada}
                            alt="Yutong Bus Hero"
                            className="w-full h-full object-cover brightness-50"
                        />
                    </div>
                    <div className="relative z-10 container px-4">
                        {/* <h2 className="text-sm font-bold tracking-widest mb-4 text-blue-950 uppercase">Yutong Venezuela</h2> */}
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white">
                            Movilidad que Transforma
                        </h1>
                        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-100">
                            Descubre la ingeniería, diseño y tecnología que nos posicionan como líderes en soluciones de transporte para Venezuela.
                        </p>
                        <Button size="lg" className="bg-blue-950 hover:bg-blue-800 text-white border-none rounded-full px-8">
                            EXPLORAR MODELOS
                        </Button>
                    </div>
                </section>

                {/* Flota Completa Section - Dynamic Carousel */}
                <section id="modelos" className="py-20 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-4">Nuestra Flota Completa</h2>
                            <p className="text-muted-foreground">Explora todas las opciones disponibles para tu empresa.</p>
                        </div>
                        {loading ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground animate-pulse">Cargando autobuses...</p>
                            </div>
                        ) : (
                            <BusCarousel buses={buses} />
                        )}
                    </div>
                </section>

                {/* Spare Parts Section - Dynamic Carousel */}
                <section id="repuestos" className="py-20 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-4">Catálogo de Repuestos</h2>
                            <p className="text-muted-foreground">Repuestos originales de alta calidad para mantener tu flota en óptimas condiciones.</p>
                        </div>
                        {loadingParts ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground animate-pulse">Cargando repuestos...</p>
                            </div>
                        ) : (
                            <SparePartsCarousel parts={spareParts} />
                        )}
                    </div>
                </section>
            </main>

            <footer id="contacto" className="bg-slate-900 text-white py-12">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="text-white p-1 rounded font-bold text-2xl">
                                <img src={icon.logo} alt="Logo Yutong" className="h-20 w-20 object-contain" />
                            </div>
                            <span className="font-bold text-lg"></span>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Liderando el camino en soluciones de transporte para Venezuela.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Navegación</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><a href="#" className="hover:text-white">Modelos</a></li>
                            <li><a href="#" className="hover:text-white">Planta</a></li>
                            <li><a href="#" className="hover:text-white">Post-Venta</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Contacto</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li>Av. Principal, Zona Industrial</li>
                            <li>San Felipe, Yaracuy, Venezuela</li>
                            <li>info@yutong.com.ve</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Síguenos</h4>
                        <div className="flex gap-4">
                            {/* GitHub Link */}
                            <a
                                href="https://github.com/JDPR19/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors p-2"
                            >
                                <img src={icon.git} alt="GitHub" className="w-full h-full object-contain" />
                            </a>
                            {/* LinkedIn Link */}
                            <a
                                href="https://www.linkedin.com/in/jesus-daniel-perdomo-b15578261/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors p-2"
                            >
                                <img src={icon.linkedin} alt="LinkedIn" className="w-full h-full object-contain" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
                    © 2025 Planta de Autobuses Yutong Venezuela. Todos los derechos reservados.
                </div>
            </footer>
        </div>
    );
}
