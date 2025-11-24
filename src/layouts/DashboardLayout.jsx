import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, Bus, FileText, Settings, Bell, User, LogOut, Wrench, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { useEffect, useState } from "react"
import icon from "@/components/Icon"
import { BaseUrl } from "@/lib/BaseUrl"
import { getImageUrl } from "@/lib/utils"

export default function DashboardLayout() {
    const location = useLocation()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const loadUser = () => {
            try {
                const storedUser = localStorage.getItem("user")
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser)
                    setUser(parsedUser)
                }
            } catch (error) {
                console.error("DashboardLayout: Error loading user", error)
                localStorage.removeItem("user")
                setUser(null)
            }
        }

        loadUser()

        window.addEventListener("userUpdated", loadUser)
        return () => window.removeEventListener("userUpdated", loadUser)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/login")
    }

    const isActive = (path) => {
        return location.pathname === path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }

    const NavLinks = ({ onLinkClick }) => (
        <>
            <Link
                to="/dashboard"
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard')}`}
                onClick={onLinkClick}
            >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
            </Link>

            <Link
                to="/dashboard/inventory"
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard/inventory')}`}
                onClick={onLinkClick}
            >
                <Bus className="w-4 h-4" />
                Inventario
            </Link>

            <Link
                to="/dashboard/repuestos"
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard/repuestos')}`}
                onClick={onLinkClick}
            >
                <Wrench className="w-4 h-4" />
                Repuestos
            </Link>
        </>
    )

    return (
        <div className="min-h-screen flex bg-background">
            <aside className="w-64 border-r bg-card hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b">
                    <div className="flex items-center gap-2">
                        <div className="h-12 w-12 flex items-center justify-center overflow-hidden rounded-lg bg-white p-1 flex-shrink-0">
                            <img src={icon.logo} alt="Logo Yutong" className="h-full w-full object-contain" />
                        </div>
                        <span className="font-bold">Catalog Inventory</span>
                    </div>
                </div>

                <div className="flex-1 py-6 px-4 space-y-1">
                    <p className="px-2 text-xs font-semibold text-muted-foreground mb-2">Panel de Admin</p>
                    <NavLinks onLinkClick={() => { }} />
                </div>

                <div className="p-4 border-t">
                    <Link to="/dashboard/profile" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard/profile')}`}>
                        <User className="w-4 h-4" />
                        Mi Perfil
                    </Link>
                </div>
            </aside>

            {/* Mobile Navigation Sheet */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetContent side="left" className="w-64 p-0">
                    <SheetHeader className="h-16 flex items-center px-6 border-b">
                        <div className="flex items-center gap-2">
                            <div className="h-12 w-12 flex items-center justify-center overflow-hidden rounded-lg bg-white p-1 flex-shrink-0">
                                <img src={icon.logo} alt="Logo Yutong" className="h-full w-full object-contain" />
                            </div>
                            <SheetTitle className="font-bold">Catalog Inventory</SheetTitle>
                        </div>
                    </SheetHeader>
                    <div className="flex-1 py-6 px-4 space-y-1">
                        <p className="px-2 text-xs font-semibold text-muted-foreground mb-2">Panel de Admin</p>
                        <NavLinks onLinkClick={() => setMobileMenuOpen(false)} />
                    </div>
                    <div className="p-4 border-t">
                        <Link
                            to="/dashboard/profile"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard/profile')}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <User className="w-4 h-4" />
                            Mi Perfil
                        </Link>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <header className="h-16 border-b bg-card flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <h1 className="font-semibold text-lg">
                            {location.pathname.includes('inventory') ? 'Gestión de Flota' :
                                location.pathname.includes('repuestos') ? 'Catálogo de Repuestos' :
                                    location.pathname.includes('profile') ? 'Perfil de Usuario' : 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <Button variant="ghost" size="icon">
                            <Bell className="w-5 h-5" />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={getImageUrl(user?.imagen)}
                                            alt={user?.nombre}
                                            className="object-cover"
                                        />
                                        <AvatarFallback>{user?.nombre?.[0]}{user?.apellido?.[0]}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.nombre} {user?.apellido}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Perfil</span>
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Configuración</span>
                                </DropdownMenuItem> */}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-red-500 focus:text-red-500 cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar Sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
