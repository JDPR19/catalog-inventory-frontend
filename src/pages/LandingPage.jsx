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
                        {/* <Link to="/login">
                            <Button>Iniciar Sesión</Button>
                        </Link> */}
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src={icon.entrada2}
                            alt="Yutong Bus Hero"
                            className="w-full h-full object-cover brightness-50"
                        />
                    </div>
                    <div className="relative z-10 container px-4">
                        <h1 className="text-5xl md:text-7xl font-extrabold mt-28 tracking-tight text-white">
                            Movilidad que Transforma
                        </h1>
                        <p className="text-lg md:text-xl max-w-2xl mx-auto mt-24 text-gray-100">
                            Descubre la ingeniería, diseño y tecnología que nos posicionan como líderes en soluciones de transporte para Venezuela.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 mt-28 mb-12">
                            <Button
                                size="lg"
                                className="bg-blue-950 hover:bg-blue-800 text-white border-none rounded-full px-8"
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = icon.ficha3;
                                    link.download = 'Ficha-Modelo-ZK6907H.jpg';
                                    link.click();
                                }}
                            >
                                ZK6907H
                            </Button>
                            <Button
                                size="lg"
                                className="bg-blue-950 hover:bg-blue-800 text-white border-none rounded-full px-8"
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = icon.ficha1;
                                    link.download = 'Ficha-Modelo-ZK6852HG.jpg';
                                    link.click();
                                }}
                            >
                                ZK6852HG
                            </Button>
                            <Button
                                size="lg"
                                className="bg-blue-950 hover:bg-blue-800 text-white border-none rounded-full px-8"
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = icon.ficha2;
                                    link.download = 'Ficha-Modelo-ZK6729D2.jpg';
                                    link.click();
                                }}
                            >
                                ZK6729D2
                            </Button>
                            <Button
                                size="lg"
                                className="bg-blue-950 hover:bg-blue-800 text-white border-none rounded-full px-8"
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = icon.ficha4;
                                    link.download = 'Ficha-Modelo-ZK6126HG.jpg';
                                    link.click();
                                }}
                            >
                                ZK6126HG
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Flota Completa Section - Dynamic Carousel */}
                <section id="modelos" className="py-20 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-4">Nuestra Flota</h2>
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
                            <li>Comercializacionyutong@gmail.com</li>
                        </ul>

                        <h4 className="font-bold mb-4 mt-2">Soporte Técnico</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li>Oficina de Tecnología Información y Comunicación</li>
                            <li>oticyutong@gmail.com</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Síguenos</h4>
                        <div className="flex gap-4">

                            {/* Tiktok Link */}
                            <a
                                href="https://www.tiktok.com/@plantayutong_ve?_r=1&_t=ZM-91hdWxFniih"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors p-2"
                            >
                                <img src={icon.tiktok} alt="Tiktok" className="w-full h-full object-contain" />
                            </a>
                            {/* instagram Link */}
                            <a
                                href="https://www.instagram.com/plantayutong_ve?igsh=NTFjMmZ5MWphOHZh"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors p-2"
                            >
                                <img src={icon.instragran2} alt="Instagram" className="w-full h-full object-contain" />
                            </a>
                            {/* gmail Link */}
                            <a
                                href="mailto:Comercializacionyutong@gmail.com?subject=Solicitud%20de%20información&body=Hola,%20quisiera%20saber%20más%20sobre..."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors p-2"
                            >
                                <img src={icon.gmail} alt="Gmail" className="w-full h-full object-contain" />
                            </a>
                            {/* whatsapp Link */}
                            <a
                                href="https://wa.me/584125288171?text=Hola,%20necesito%20información%20sobre%20Catalog%20Inventory"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors p-2"
                            >
                                <img src={icon.whatsapp} alt="WhatsApp" className="w-full h-full object-contain" />
                            </a>
                        </div>
                        <div className="flex gap-4 mt-4">
                            {/* Telegrama Link */}
                            <a
                                href="https://t.me/BadOmensDEV"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors p-2"
                            >
                                <img src={icon.telegrama} alt="Telegrama" className="w-full h-full object-contain" />
                            </a>
                            {/* whatsapp Link */}
                            <a
                                href="https://wa.me/584121698315?text=Hola,%20necesito%20información%20sobre%20Catalog%20Inventory%20Soporte%20BadDevPrograming"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors p-2"
                            >
                                <img src={icon.whatsapp} alt="WhatsApp" className="w-full h-full object-contain" />
                            </a>
                            {/* GitHub Link */}
                            <a
                                href="https://cvjdpr.vercel.app/"
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
