import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import QRCode from "qrcode"
import { Download, ArrowLeft, Printer, QrCode as QrIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BaseUrl } from "@/lib/BaseUrl"
import { getImageUrl } from "@/lib/utils"

export default function QRCodePage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [bus, setBus] = useState(null)
    const [loading, setLoading] = useState(true)
    const [qrGenerated, setQrGenerated] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const canvasRef = useRef(null)

    const publicUrl = `${window.location.origin}/autobus/${id}`

    useEffect(() => {
        fetchBusData()
    }, [id])

    const fetchBusData = async () => {
        try {
            const response = await fetch(`${BaseUrl}/autobuses/${id}`)
            if (response.ok) {
                const data = await response.json()
                setBus(data)
            }
        } catch (error) {
            console.error("Error fetching bus:", error)
        } finally {
            setLoading(false)
        }
    }

    const [qrDataUrl, setQrDataUrl] = useState(null)

    const generateQR = () => {
        const qrOptions = {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'H'
        }

        // Generar en canvas principal
        if (canvasRef.current && publicUrl) {
            QRCode.toCanvas(canvasRef.current, publicUrl, qrOptions, (error) => {
                if (error) {
                    console.error('Error generating QR:', error)
                } else {
                    setQrGenerated(true)
                }
            })
        }

        // Generar Data URL para impresión
        QRCode.toDataURL(publicUrl, qrOptions, (error, url) => {
            if (error) {
                console.error('Error generating QR Data URL:', error)
            } else {
                setQrDataUrl(url)
            }
        })
    }

    const handleDownloadQR = () => {
        if (!qrGenerated) return
        setShowPreview(true)
    }

    const confirmDownload = () => {
        if (!qrDataUrl) return

        try {
            const link = document.createElement("a")
            link.download = `QR-${bus.marca}-${bus.modelo}.png`
            link.href = qrDataUrl
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setShowPreview(false)
        } catch (error) {
            console.error("Error downloading QR:", error)
            alert("Error al descargar el QR.")
        }
    }

    const handlePrint = () => {
        if (qrGenerated) {
            window.print()
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Cargando...</p>
            </div>
        )
    }

    if (!bus) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <p className="text-muted-foreground">Autobús no encontrado</p>
                <Button onClick={() => navigate("/dashboard/inventory")}>
                    Volver al inventario
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between print:hidden">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Código QR</h2>
                    <p className="text-muted-foreground">
                        {bus.marca} {bus.modelo}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate("/dashboard/inventory")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                    </Button>
                    {qrGenerated && (
                        <>
                            <Button variant="outline" onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" /> Imprimir
                            </Button>
                            <Button onClick={handleDownloadQR} className="bg-blue-600 hover:bg-blue-700">
                                <Download className="mr-2 h-4 w-4" /> Descargar QR
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* QR Code Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Código QR</CardTitle>
                        <CardDescription>
                            {qrGenerated
                                ? "Escanea este código para ver la información del vehículo"
                                : "Genera el código QR para este vehículo"
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300">
                            <canvas ref={canvasRef} className={!qrGenerated ? "opacity-0" : ""} />
                            {!qrGenerated && (
                                <div className="w-[300px] h-[300px] flex items-center justify-center">
                                    <p className="text-muted-foreground text-center">
                                        Haz clic en "Generar QR" para crear el código
                                    </p>
                                </div>
                            )}
                        </div>

                        {!qrGenerated ? (
                            <Button
                                onClick={generateQR}
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <QrIcon className="mr-2 h-5 w-5" />
                                Generar Código QR
                            </Button>
                        ) : (
                            <div className="text-center space-y-1">
                                <p className="text-sm font-medium">URL del QR:</p>
                                <p className="text-xs text-muted-foreground break-all px-4">
                                    {publicUrl}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Bus Info Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Vista Previa</CardTitle>
                        <CardDescription>
                            Esto es lo que verán al escanear el QR
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {bus.imagen && (
                            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center h-80">
                                <img
                                    src={getImageUrl(bus.imagen)}
                                    alt={bus.modelo}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div>
                            <h3 className="text-xl font-bold">{bus.marca} {bus.modelo}</h3>
                            {bus.uso && (
                                <p className="text-sm text-muted-foreground">{bus.uso}</p>
                            )}
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {bus.asientos && (
                                <div>
                                    <p className="text-muted-foreground">Asientos</p>
                                    <p className="font-medium">{bus.asientos}</p>
                                </div>
                            )}
                            {bus.combustible && (
                                <div>
                                    <p className="text-muted-foreground">Combustible</p>
                                    <p className="font-medium">{bus.combustible}</p>
                                </div>
                            )}
                            {bus.motor && (
                                <div>
                                    <p className="text-muted-foreground">Motor</p>
                                    <p className="font-medium">{bus.motor}</p>
                                </div>
                            )}
                            {bus.transmision && (
                                <div>
                                    <p className="text-muted-foreground">Transmisión</p>
                                    <p className="font-medium">{bus.transmision}</p>
                                </div>
                            )}
                        </div>

                        <Separator />

                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-center text-blue-900 dark:text-blue-100 font-medium">
                                💡 Visita nuestra plataforma para más información y catálogo completo
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full space-y-4">
                        <h3 className="text-xl font-bold">Previsualización del QR</h3>
                        <div className="flex justify-center bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                            {qrDataUrl ? (
                                <img src={qrDataUrl} alt="QR Preview" className="w-full h-full object-contain" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                            ) : (
                                <p>Generando previsualización...</p>
                            )}
                        </div>
                        <div className="text-sm text-muted-foreground text-center">
                            <p className="font-medium">{bus.marca} {bus.modelo}</p>
                            <p className="text-xs mt-1">Tamaño: 300x300 px</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setShowPreview(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                onClick={confirmDownload}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Descargar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Version - Solo título y QR */}
            {qrGenerated && (
                <>
                    <style>{`
                        @media print {
                            @page {
                                size: A4;
                                margin: 0;
                            }
                            body * {
                                visibility: hidden;
                            }
                            .print-content, .print-content * {
                                visibility: visible;
                            }
                            .print-content {
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                                height: 100vh;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                        }
                    `}</style>
                    <div className="hidden print:flex print-content">
                        <div className="text-center space-y-12">
                            <div>
                                <h1 className="text-6xl font-bold mb-4">{bus.marca} {bus.modelo}</h1>
                                {bus.uso && <p className="text-3xl text-gray-600">{bus.uso}</p>}
                            </div>

                            <div className="flex justify-center">
                                {qrDataUrl && (
                                    <img
                                        src={qrDataUrl}
                                        alt="QR Code"
                                        style={{ border: '4px solid #e5e7eb', borderRadius: '8px', width: '300px', height: '300px' }}
                                    />
                                )}
                            </div>

                            <div>
                                <p className="text-2xl font-semibold">Escanea para ver información completa</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
