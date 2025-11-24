import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import { BaseUrl } from "@/lib/BaseUrl"

export default function BusCarousel({ buses }) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: "start" },
        [Autoplay({ delay: 3000, stopOnInteraction: true })]
    );

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    if (!buses || buses.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No hay autobuses disponibles en este momento.
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-6">
                    {buses.map((bus) => (
                        <div
                            key={bus.id}
                            className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                        >
                            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all h-[450px]">
                                <img
                                    src={
                                        bus.imagen
                                            ? `${BaseUrl}/uploads/${bus.imagen}`
                                            : "/images/placeholder-bus.png"
                                    }
                                    alt={bus.modelo}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6 text-white">
                                    <h3 className="text-2xl font-bold mb-2">{bus.modelo}</h3>
                                    <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                                        {bus.descripcion || "Autobús de alta calidad"}
                                    </p>
                                    <Link to={`/autobus/${bus.id}`}>
                                        <Button
                                            variant="outline"
                                            className="w-full bg-white text-black border-white hover:bg-gray-100 hover:text-black"
                                        >
                                            Ver Detalles
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-black shadow-lg border-gray-300"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-black shadow-lg border-gray-300"
                onClick={scrollNext}
                disabled={!canScrollNext}
            >
                <ChevronRight className="h-6 w-6" />
            </Button>
        </div>
    );
}
