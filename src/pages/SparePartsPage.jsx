import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Search, Pencil, Trash2, Download, Upload, FileSpreadsheet, Package } from "lucide-react"
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
import ExcelJS from 'exceljs'
import * as XLSX from 'xlsx'
import { toast } from "sonner"

export default function SparePartsPage() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [parts, setParts] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleteId, setDeleteId] = useState(null)
    const fileInputRef = useRef(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    useEffect(() => {
        fetchParts()
    }, [])

    const fetchParts = async () => {
        try {
            const { data } = await axios.get("/repuestos")
            setParts(data)
        } catch (error) {
            console.error("Error fetching spare parts:", error)
            toast.error("Error al cargar los repuestos")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/repuestos/${id}`)
            setParts(parts.filter(part => part.id !== id))
            setDeleteId(null)
            toast.success("Repuesto eliminado correctamente")
        } catch (error) {
            console.error("Error deleting spare part:", error)
            toast.error("Error al eliminar el repuesto")
        }
    }

    const handleExportExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook()
            const worksheet = workbook.addWorksheet('Repuestos')

            // Define columns
            worksheet.columns = [
                { header: '#', key: 'index', width: 10 },
                { header: 'Imagen', key: 'image', width: 20 },
                { header: 'Nombre', key: 'nombre', width: 30 },
                { header: 'Código', key: 'codigo', width: 15 },
                { header: 'Modelo', key: 'modelo', width: 20 },
                { header: 'Categoría', key: 'categoria', width: 20 },
                { header: 'Descripción', key: 'descripcion', width: 50 },
            ]

            // Add rows and images
            for (let i = 0; i < filteredParts.length; i++) {
                const part = filteredParts[i]
                const row = worksheet.addRow({
                    index: i + 1,
                    nombre: part.nombre,
                    codigo: part.codigo,
                    modelo: part.modelo,
                    categoria: part.categoria,
                    descripcion: part.descripcion
                })

                // Set row height for image visibility
                row.height = 90

                if (part.imagen) {
                    try {
                        const imageUrl = getImageUrl(part.imagen)
                        const response = await fetch(imageUrl)
                        const buffer = await response.arrayBuffer()

                        // Determine extension
                        const ext = part.imagen.split('.').pop().toLowerCase()
                        const validExts = ['png', 'jpeg', 'jpg', 'gif']
                        const imageExt = validExts.includes(ext) ? ext : 'jpeg'

                        const imageId = workbook.addImage({
                            buffer: buffer,
                            extension: imageExt === 'jpg' ? 'jpeg' : imageExt,
                        })

                        worksheet.addImage(imageId, {
                            tl: { col: 1, row: row.number - 1 },
                            ext: { width: 120, height: 120 },
                            editAs: 'oneCell'
                        })
                    } catch (err) {
                        console.error('Error loading image for excel', err)
                    }
                }
            }

            // Add Total Row
            worksheet.addRow({
                index: 'TOTAL',
                nombre: filteredParts.length
            })

            // Generate and download
            const buffer = await workbook.xlsx.writeBuffer()
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            const url = window.URL.createObjectURL(blob)
            const anchor = document.createElement('a')
            anchor.href = url
            anchor.download = 'Catalogo_Repuestos.xlsx'
            anchor.click()
            window.URL.revokeObjectURL(url)
            toast.success("Exportación completada con imágenes")
        } catch (error) {
            console.error("Error exporting excel:", error)
            toast.error("Error al exportar Excel")
        }
    }

    const handleImportExcel = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target.result
                const wb = XLSX.read(bstr, { type: 'binary' })

                // Try to find "REPUESTOS" sheet, otherwise use first sheet
                let wsname = wb.SheetNames.find(name => name.toUpperCase() === 'REPUESTOS')
                if (!wsname) {
                    wsname = wb.SheetNames[0]
                }

                const ws = wb.Sheets[wsname]
                const data = XLSX.utils.sheet_to_json(ws)

                console.log(`Leyendo hoja: ${wsname}`)
                console.log(`Registros encontrados: ${data.length}`)

                // Process and upload each item
                let successCount = 0
                let failCount = 0

                for (const item of data) {
                    // Map Excel columns to API fields - support both Spanish and uppercase variants
                    const payload = {
                        nombre: item.Nombre || item.NOMBRE || item.nombre,
                        categoria: item.Categoría || item.Categoria || item.CATEGORIA || item.categoria || 'Otros',
                        descripcion: item.Descripción || item.Descripcion || item.DESCRIPCION || item.descripcion,
                        codigo: item.Código || item.Codigo || item.CODIGO || item.codigo,
                        modelo: item.Modelo || item.MODELO || item.modelo
                    }

                    if (payload.nombre) {
                        try {
                            const formData = new FormData()
                            formData.append('nombre', payload.nombre)
                            formData.append('categoria', payload.categoria)
                            if (payload.descripcion) formData.append('descripcion', payload.descripcion)
                            if (payload.codigo) formData.append('codigo', payload.codigo)
                            if (payload.modelo) formData.append('modelo', payload.modelo)

                            await axios.post("/repuestos", formData, {
                                headers: { 'Content-Type': 'multipart/form-data' }
                            })
                            successCount++
                        } catch (err) {
                            // Continuar incluso si hay duplicados u otros errores
                            console.warn("Error importando item (posible duplicado):", payload.nombre, err.response?.data || err.message)
                            failCount++
                        }
                    }
                }

                // Mostrar resultado final
                if (failCount > 0) {
                    toast.success(`Importación completada: ${successCount} creados. ${failCount} omitidos (posibles duplicados).`)
                } else {
                    toast.success(`¡Importación exitosa! ${successCount} registros creados.`)
                }

                fetchParts()
            } catch (error) {
                console.error("Error parsing Excel:", error)
                toast.error("Error al procesar el archivo Excel.")
            }
        }
        reader.readAsBinaryString(file)
        e.target.value = null
    }

    // Predefined categories for spare parts
    const categories = [
        "Motor",
        "Transmisión",
        "Suspensión",
        "Frenos",
        "Eléctrico",
        "Carrocería",
        "Interior",
        "Accesorios",
        "Otros"
    ]

    const filteredParts = parts.filter(part => {
        const matchesSearch = part.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            part.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            part.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            part.modelo?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "all" || part.categoria === categoryFilter
        return matchesSearch && matchesCategory
    })

    // Pagination logic
    const totalPages = Math.ceil(filteredParts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedParts = filteredParts.slice(startIndex, endIndex)

    // Reset to page 1 when search or filter changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, categoryFilter])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Cargando repuestos...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Catálogo de Repuestos</h2>
                <div className="flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImportExcel}
                        className="hidden"
                        accept=".xlsx, .xls"
                    />
                    <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        title="Importar desde Excel"
                    >
                        <Upload className="mr-2 h-4 w-4" /> Importar
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleExportExcel}
                        title="Exportar a Excel"
                    >
                        <FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate("/dashboard/repuestos/new")}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Repuesto
                    </Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border">
                <div className="flex items-center flex-1">
                    <Search className="w-4 h-4 text-muted-foreground mr-2" />
                    <Input
                        placeholder="Buscar repuesto..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="border-none focus-visible:ring-0 px-0"
                    />
                </div>
                <div className="w-full sm:w-[200px] relative">
                    <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">Todas las categorías</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="rounded-md border bg-card overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">IMAGEN</TableHead>
                            <TableHead>NOMBRE</TableHead>
                            <TableHead>CÓDIGO</TableHead>
                            <TableHead>MODELO</TableHead>
                            <TableHead>CATEGORÍA</TableHead>
                            <TableHead>DESCRIPCIÓN</TableHead>
                            <TableHead className="text-right">ACCIONES</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedParts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                    No se encontraron repuestos
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedParts.map(part => (
                                <TableRow key={part.id}>
                                    <TableCell>
                                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden border border-gray-200 flex items-center justify-center">
                                            {part.imagen ? (
                                                <img
                                                    src={getImageUrl(part.imagen)}
                                                    alt={part.nombre}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className={`w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 ${part.imagen ? 'hidden' : ''}`}
                                            >
                                                <Package className="h-8 w-8" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{part.nombre}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{part.codigo || "-"}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{part.modelo || "-"}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            {part.categoria}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate" title={part.descripcion}>
                                        {part.descripcion || "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => navigate(`/dashboard/repuestos/edit/${part.id}`)} title="Editar">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(part.id)} title="Eliminar">
                                                <Trash2 className="h-4 w-4 text-destructive" />
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
                    Mostrando {startIndex + 1} a {Math.min(endIndex, filteredParts.length)} de {filteredParts.length} resultados
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
                            {(() => {
                                const pages = [];
                                const maxVisible = 5; // Máximo de páginas visibles

                                if (totalPages <= maxVisible + 2) {
                                    // Mostrar todas las páginas si son pocas
                                    for (let i = 1; i <= totalPages; i++) {
                                        pages.push(
                                            <Button
                                                key={i}
                                                variant={currentPage === i ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setCurrentPage(i)}
                                                className="w-8 h-8 p-0"
                                            >
                                                {i}
                                            </Button>
                                        );
                                    }
                                } else {
                                    // Mostrar paginación inteligente con "..."
                                    // Siempre mostrar primera página
                                    pages.push(
                                        <Button
                                            key={1}
                                            variant={currentPage === 1 ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(1)}
                                            className="w-8 h-8 p-0"
                                        >
                                            1
                                        </Button>
                                    );

                                    if (currentPage > 3) {
                                        pages.push(<span key="ellipsis1" className="px-2">...</span>);
                                    }

                                    // Páginas alrededor de la actual
                                    const start = Math.max(2, currentPage - 1);
                                    const end = Math.min(totalPages - 1, currentPage + 1);

                                    for (let i = start; i <= end; i++) {
                                        pages.push(
                                            <Button
                                                key={i}
                                                variant={currentPage === i ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setCurrentPage(i)}
                                                className="w-8 h-8 p-0"
                                            >
                                                {i}
                                            </Button>
                                        );
                                    }

                                    if (currentPage < totalPages - 2) {
                                        pages.push(<span key="ellipsis2" className="px-2">...</span>);
                                    }

                                    // Siempre mostrar última página
                                    pages.push(
                                        <Button
                                            key={totalPages}
                                            variant={currentPage === totalPages ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(totalPages)}
                                            className="w-8 h-8 p-0"
                                        >
                                            {totalPages}
                                        </Button>
                                    );
                                }

                                return pages;
                            })()}
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
                            Esta acción no se puede deshacer. El repuesto será eliminado permanentemente de la base de datos.
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
