import { useState } from "react"
import { ArrowLeft, Download, Printer, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router-dom"

export default function QRCodeGenerator() {
    const [qrType, setQrType] = useState("link")

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/dashboard/inventory">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Generador de Código QR</h2>
                    <p className="text-muted-foreground">Modelo: Yutong ZK6129H</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Preview Column */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="overflow-hidden">
                        <div className="aspect-square bg-white p-8 flex items-center justify-center border-b">
                            {/* Placeholder QR */}
                            <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                [QR CODE PREVIEW]
                            </div>
                        </div>
                        <div className="p-4 bg-muted/50">
                            <h3 className="font-semibold text-center mb-2">Yutong ZK6129H</h3>
                            <p className="text-xs text-center text-muted-foreground">Escanea para ver ficha técnica</p>
                        </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-2">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            <Download className="mr-2 h-4 w-4" /> Descargar
                        </Button>
                        <Button variant="outline" className="w-full">
                            <Printer className="mr-2 h-4 w-4" /> Imprimir
                        </Button>
                    </div>
                </div>

                {/* Configuration Column */}
                <div className="md:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Personalizar Información del QR</CardTitle>
                            <CardDescription>
                                Seleccione el tipo de información que desea incrustar en el código QR.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <RadioGroup defaultValue="link" onValueChange={setQrType} className="space-y-4">
                                <div className="flex items-start space-x-3 space-y-0">
                                    <RadioGroupItem value="link" id="link" className="mt-1" />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="link" className="font-medium text-base">
                                            Enlazar a ficha técnica móvil
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Genera un enlace directo a la página de especificaciones del modelo ZK6129H.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 space-y-0">
                                    <RadioGroupItem value="details" id="details" className="mt-1" />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="details" className="font-medium text-base">
                                            Mostrar detalles de la unidad
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Incrusta información clave como el VIN y número de chasis en el QR.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 space-y-0">
                                    <RadioGroupItem value="custom" id="custom" className="mt-1" />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="custom" className="font-medium text-base">
                                            Datos personalizados
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Ingrese un enlace o texto personalizado para el código QR.
                                        </p>
                                    </div>
                                </div>
                            </RadioGroup>

                            {qrType === 'custom' && (
                                <div className="pt-4 animate-in fade-in slide-in-from-top-2">
                                    <Label htmlFor="custom-text">Enlace o texto personalizado</Label>
                                    <Input id="custom-text" placeholder="https://yutong.com.ve/promocion" className="mt-2" />
                                </div>
                            )}

                            <div className="pt-6 flex justify-end">
                                <Button variant="secondary">
                                    <RefreshCw className="mr-2 h-4 w-4" /> Actualizar QR
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
