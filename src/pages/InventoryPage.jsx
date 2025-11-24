import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Search, Pencil, Trash2, Download, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BaseUrl } from "@/lib/BaseUrl"
import { getImageUrl } from "@/lib/utils"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import axios from "@/lib/axios"

export default function InventoryPage() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const [buses, setBuses] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleteId, setDeleteId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    useEffect(() => {
        fetchBuses()
    }, [])

    // ---------- API ----------
    const fetchBuses = async () => {
        try {
            const { data } = await axios.get("/autobuses")
            setBuses(data)
        } catch (error) {
            console.error("Error fetching buses:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/autobuses/${id}`)
            setBuses(buses.filter(bus => bus.id !== id))
            setDeleteId(null)
        } catch (error) {
            console.error("Error deleting bus:", error)
        }
    }

    // ---------- PDF Generation ----------
    const handleDownloadPDF = async (bus) => {
        try {
            const { default: jsPDF } = await import('jspdf')
            const doc = new jsPDF()
            const pageWidth = doc.internal.pageSize.getWidth()
            const pageHeight = doc.internal.pageSize.getHeight()
            let yPos = 20

            // Título principal
            doc.setFontSize(26)
            doc.setFont(undefined, 'bold')
            doc.text(`${bus.marca} ${bus.modelo}`, pageWidth / 2, yPos, { align: 'center' })
            yPos += 12

            // Uso (si existe)
            if (bus.uso) {
                doc.setFontSize(14)
                doc.setFont(undefined, 'normal')
                doc.setTextColor(59, 130, 246)
                doc.text(bus.uso, pageWidth / 2, yPos, { align: 'center' })
                yPos += 12
            }

            doc.setTextColor(0, 0, 0)

            // Descripción
            if (bus.descripcion) {
                doc.setFontSize(10)
                doc.setTextColor(80, 80, 80)
                const descLines = doc.splitTextToSize(bus.descripcion, pageWidth - 40)
                doc.text(descLines, pageWidth / 2, yPos, { align: 'center' })
                yPos += (descLines.length * 5) + 15
                doc.setTextColor(0, 0, 0)
            }

            // Imagen del vehículo con borde redondeado
            if (bus.imagen) {
                try {
                    const imgUrl = getImageUrl(bus.imagen)
                    const img = new Image()
                    img.crossOrigin = 'anonymous'
                    await new Promise((resolve) => {
                        img.onload = () => {
                            const maxWidth = 140
                            const maxHeight = 100
                            let imgWidth = maxWidth
                            let imgHeight = (img.height * maxWidth) / img.width
                            if (imgHeight > maxHeight) {
                                imgHeight = maxHeight
                                imgWidth = (img.width * maxHeight) / img.height
                            }
                            const imgX = (pageWidth - imgWidth) / 2
                            // Dibujar borde gris redondeado
                            doc.setDrawColor(120, 120, 120)
                            doc.roundedRect(imgX - 2, yPos - 2, imgWidth + 4, imgHeight + 4, 4, 4)
                            // Añadir la imagen
                            doc.addImage(img, 'JPEG', imgX, yPos, imgWidth, imgHeight)
                            yPos += imgHeight + 15
                            resolve()
                        }
                        img.onerror = () => {
                            console.error('Error loading image for PDF')
                            resolve()
                        }
                        img.src = imgUrl
                    })
                } catch (error) {
                    console.error('Error processing image for PDF:', error)
                }
            }

            // Separador
            doc.setDrawColor(200, 200, 200)
            doc.line(20, yPos, pageWidth - 20, yPos)
            yPos += 15

            // Especificaciones Técnicas
            doc.setFontSize(16)
            doc.setFont(undefined, 'bold')
            doc.text('Especificaciones Técnicas', 20, yPos)
            yPos += 10
            doc.setFontSize(11)
            doc.setFont(undefined, 'normal')

            const specs = [
                { label: 'Asientos', value: bus.asientos },
                { label: 'Puertas', value: bus.puertas },
                { label: 'Motor', value: bus.motor },
                { label: 'Transmisión', value: bus.transmision },
                { label: 'Combustible', value: bus.combustible },
                { label: 'Neumáticos', value: bus.neumaticos },
                { label: 'Dirección', value: bus.direccion },
            ]

            const colWidth = (pageWidth - 40) / 2
            let col = 0
            specs.forEach(spec => {
                if (spec.value) {
                    const xPos = 20 + (col * colWidth)
                    doc.setFont(undefined, 'bold')
                    doc.setTextColor(60, 60, 60)
                    doc.text(`${spec.label}:`, xPos, yPos)
                    doc.setFont(undefined, 'normal')
                    doc.setTextColor(0, 0, 0)
                    const valueLines = doc.splitTextToSize(String(spec.value), colWidth - 10)
                    doc.text(valueLines, xPos, yPos + 5)
                    col++
                    if (col >= 2) {
                        col = 0
                        yPos += 16
                    }
                }
            })
            if (col !== 0) yPos += 16

            // Footer CTA
            yPos = pageHeight - 35
            doc.setFillColor(239, 246, 255)
            doc.roundedRect(15, yPos - 5, pageWidth - 30, 28, 3, 3, 'F')
            doc.setFontSize(11)
            doc.setFont(undefined, 'bold')
            doc.setTextColor(30, 64, 175)
            doc.text('Visita nuestra plataforma para más información', pageWidth / 2, yPos + 5, { align: 'center' })
            doc.setFont(undefined, 'normal')
            doc.setFontSize(9)
            doc.setTextColor(60, 60, 60)
            doc.text('Catálogo completo de vehículos y repuestos disponibles', pageWidth / 2, yPos + 13, { align: 'center' })

            // Guardar PDF
            doc.save(`Ficha-${bus.marca}-${bus.modelo}.pdf`)
        } catch (error) {
            console.error('Error generating PDF:', error)
            alert('Error al generar el PDF: ' + error.message)
        }
    }

    const filteredBuses = buses.filter(bus =>
        bus.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.marca?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Pagination logic
    const totalPages = Math.ceil(filteredBuses.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedBuses = filteredBuses.slice(startIndex, endIndex)

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Cargando autobuses...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Modelos de Autobuses Registrados</h2>
                <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate("/dashboard/inventory/new")}
                >
                    <Plus className="mr-2 h-4 w-4" /> Registrar Nuevo Autobús
                </Button>
            </div>

            <div className="flex items-center py-4 bg-card p-4 rounded-lg border">
                <Search className="w-4 h-4 text-muted-foreground mr-2" />
                <Input
                    placeholder="Buscar por marca o modelo..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="max-w-sm border-none focus-visible:ring-0 px-0"
                />
            </div>

            <div className="rounded-md border bg-card overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px]">IMAGEN</TableHead>
                            <TableHead>MARCA</TableHead>
                            <TableHead>MODELO</TableHead>
                            <TableHead>USO</TableHead>
                            <TableHead className="text-center">ASIENTOS</TableHead>
                            <TableHead className="text-right">ACCIONES</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedBuses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    No se encontraron autobuses
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedBuses.map(bus => (
                                <TableRow key={bus.id}>
                                    <TableCell>
                                        <div className="w-40 h-28 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                                            <img
                                                src={bus.imagen ? getImageUrl(bus.imagen) : "/images/placeholder-bus.png"}
                                                alt={bus.modelo}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{bus.marca}</TableCell>
                                    <TableCell className="text-muted-foreground">{bus.modelo}</TableCell>
                                    <TableCell className="text-sm max-w-[150px] truncate" title={bus.uso}>{bus.uso || "-"}</TableCell>
                                    <TableCell className="text-sm text-center max-w-[100px] truncate" title={bus.asientos}>{bus.asientos || "-"}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => navigate(`/dashboard/inventory/edit/${bus.id}`)} title="Editar">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(bus.id)} title="Eliminar">
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDownloadPDF(bus)} title="Descargar PDF">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => navigate(`/dashboard/inventory/qr/${bus.id}`)} title="Generar QR">
                                                <QrCode className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, filteredBuses.length)} de {filteredBuses.length} resultados
                </div>
                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className="w-8 h-8 p-0"
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente
                        </Button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El autobús será eliminado permanentemente de la base de datos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDelete(deleteId)}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
