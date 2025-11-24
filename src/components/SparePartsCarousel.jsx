import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { BaseUrl } from "@/lib/BaseUrl";
import { getImageUrl } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function SparePartsCarousel({ parts }) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: "start" },
        [Autoplay({ delay: 3500, stopOnInteraction: true })]
    );

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [selectedPart, setSelectedPart] = useState(null);

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

    if (!parts || parts.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No hay repuestos disponibles en este momento.
            </div>
        );
    }

    return (
        <>
            <div className="relative">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-6">
                        {parts.map((part) => (
                            <div
                                key={part.id}
                                className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                            >
                                <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all h-[400px] bg-card">
                                    <div className="w-full h-[250px] bg-muted flex items-center justify-center overflow-hidden">
                                        {part.imagen ? (
                                            <img
                                                src={getImageUrl(part.imagen)}
                                                alt={part.nombre}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${part.imagen ? 'hidden' : ''}`}>
                                            <Package className="h-20 w-20 text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col justify-between h-[150px]">
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 line-clamp-1">{part.nombre}</h3>
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                {part.categoria}
                                            </span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full mt-3"
                                            onClick={() => setSelectedPart(part)}
                                        >
                                            Ver Detalles
                                        </Button>
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

            {/* Detail Modal */}
            <Dialog open={selectedPart !== null} onOpenChange={() => setSelectedPart(null)}>
                <DialogContent className="max-w-lg sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl md:text-2xl">{selectedPart?.nombre}</DialogTitle>
                        <DialogDescription>
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                {selectedPart?.categoria}
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {selectedPart?.imagen && (
                            <div className="w-full h-48 sm:h-64 md:h-80 bg-muted rounded-lg overflow-hidden flex items-center justify-center p-4">
                                <img
                                    src={getImageUrl(selectedPart.imagen)}
                                    alt={selectedPart.nombre}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                {!selectedPart?.imagen && (
                                    <Package className="h-20 w-20 text-slate-400" />
                                )}
                            </div>
                        )}
                        <div>
                            <h4 className="font-semibold mb-2">Descripción</h4>
                            <p className="text-muted-foreground text-sm">
                                {selectedPart?.descripcion || "No hay descripción disponible para este repuesto."}
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
