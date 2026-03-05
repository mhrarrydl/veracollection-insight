import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "@/context/DataContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import ProdukPage from "./pages/master/ProdukPage";
import KategoriPage from "./pages/master/KategoriPage";
import SupplierPage from "./pages/master/SupplierPage";
import AkunPage from "./pages/master/AkunPage";
import PenjualanPage from "./pages/transaksi/PenjualanPage";
import PembelianPage from "./pages/transaksi/PembelianPage";
import PengeluaranPage from "./pages/transaksi/PengeluaranPage";
import PengeluaranHarianPage from "./pages/transaksi/PengeluaranHarianPage";
import LabaRugiPage from "./pages/laporan/LabaRugiPage";
import ArusKasPage from "./pages/laporan/ArusKasPage";
import RekapBulananPage from "./pages/laporan/RekapBulananPage";
import RekapTahunanPage from "./pages/laporan/RekapTahunanPage";
import RekapProdukPage from "./pages/laporan/RekapProdukPage";
import HealthAnalysis from "./pages/HealthAnalysis";
import DanaDaruratPage from "./pages/DanaDaruratPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Route guard: only owner can access
function OwnerOnly({ children }: { children: React.ReactNode }) {
  const { role } = useAuth();
  if (role === "karyawan") return <Navigate to="/transaksi/penjualan" replace />;
  return <>{children}</>;
}

// Route guard: must be authenticated
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Memuat...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Memuat...</div>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      
      {/* Protected routes */}
      <Route path="/" element={<RequireAuth><OwnerOnly><Index /></OwnerOnly></RequireAuth>} />
      
      {/* Master Data - Owner only */}
      <Route path="/master-data/produk" element={<RequireAuth><ProdukPage /></RequireAuth>} />
      <Route path="/master-data/kategori" element={<RequireAuth><OwnerOnly><KategoriPage /></OwnerOnly></RequireAuth>} />
      <Route path="/master-data/supplier" element={<RequireAuth><OwnerOnly><SupplierPage /></OwnerOnly></RequireAuth>} />
      <Route path="/master-data/akun" element={<RequireAuth><OwnerOnly><AkunPage /></OwnerOnly></RequireAuth>} />
      
      {/* Transaksi - Penjualan accessible by all */}
      <Route path="/transaksi/penjualan" element={<RequireAuth><PenjualanPage /></RequireAuth>} />
      <Route path="/transaksi/pembelian" element={<RequireAuth><OwnerOnly><PembelianPage /></OwnerOnly></RequireAuth>} />
      <Route path="/transaksi/pengeluaran" element={<RequireAuth><OwnerOnly><PengeluaranPage /></OwnerOnly></RequireAuth>} />
      <Route path="/transaksi/pengeluaran-harian" element={<RequireAuth><OwnerOnly><PengeluaranHarianPage /></OwnerOnly></RequireAuth>} />
      
      {/* Laporan - Owner only */}
      <Route path="/laporan/laba-rugi" element={<RequireAuth><OwnerOnly><LabaRugiPage /></OwnerOnly></RequireAuth>} />
      <Route path="/laporan/arus-kas" element={<RequireAuth><OwnerOnly><ArusKasPage /></OwnerOnly></RequireAuth>} />
      <Route path="/laporan/rekap-bulanan" element={<RequireAuth><OwnerOnly><RekapBulananPage /></OwnerOnly></RequireAuth>} />
      <Route path="/laporan/rekap-tahunan" element={<RequireAuth><OwnerOnly><RekapTahunanPage /></OwnerOnly></RequireAuth>} />
      <Route path="/laporan/rekap-produk" element={<RequireAuth><OwnerOnly><RekapProdukPage /></OwnerOnly></RequireAuth>} />
      
      {/* Analisis & Dana Darurat - Owner only */}
      <Route path="/analisis" element={<RequireAuth><OwnerOnly><HealthAnalysis /></OwnerOnly></RequireAuth>} />
      <Route path="/dana-darurat" element={<RequireAuth><OwnerOnly><DanaDaruratPage /></OwnerOnly></RequireAuth>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
