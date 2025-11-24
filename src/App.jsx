import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "@/pages/LandingPage"

import DashboardLayout from "@/layouts/DashboardLayout"
import InventoryPage from "@/pages/InventoryPage"
import BusDetail from "@/pages/BusDetail"
import QRCodePage from "@/pages/QRCodePage"
import PublicBusDetail from "@/pages/PublicBusDetail"
import SparePartsPage from "@/pages/SparePartsPage"
import SparePartDetail from "@/pages/SparePartDetail"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import ProfilePage from "@/pages/ProfilePage"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Toaster } from "sonner"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/autobus/:id" element={<PublicBusDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas Privadas (Dashboard) */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<div className="text-center mt-20 text-muted-foreground">Bienvenido al Panel de Administración</div>} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="inventory/new" element={<BusDetail />} />
            <Route path="inventory/edit/:id" element={<BusDetail />} />
            <Route path="inventory/qr/:id" element={<QRCodePage />} />

            {/* Repuestos */}
            <Route path="repuestos" element={<SparePartsPage />} />
            <Route path="repuestos/new" element={<SparePartDetail />} />
            <Route path="repuestos/edit/:id" element={<SparePartDetail />} />

            {/* Perfil */}
            <Route path="profile" element={<ProfilePage />} />

            {/* <Route path="reports" element={<ReportsPage />} /> */}
            {/* <Route path="settings" element={<SettingsPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  )
}

export default App
