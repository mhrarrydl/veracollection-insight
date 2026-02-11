import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProdukPage from "./pages/master/ProdukPage";
import KategoriPage from "./pages/master/KategoriPage";
import SupplierPage from "./pages/master/SupplierPage";
import AkunPage from "./pages/master/AkunPage";
import PenjualanPage from "./pages/transaksi/PenjualanPage";
import PembelianPage from "./pages/transaksi/PembelianPage";
import PengeluaranPage from "./pages/transaksi/PengeluaranPage";
import LabaRugiPage from "./pages/laporan/LabaRugiPage";
import ArusKasPage from "./pages/laporan/ArusKasPage";
import RekapBulananPage from "./pages/laporan/RekapBulananPage";
import HealthAnalysis from "./pages/HealthAnalysis";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Master Data */}
          <Route path="/master-data/produk" element={<ProdukPage />} />
          <Route path="/master-data/kategori" element={<KategoriPage />} />
          <Route path="/master-data/supplier" element={<SupplierPage />} />
          <Route path="/master-data/akun" element={<AkunPage />} />
          {/* Transaksi */}
          <Route path="/transaksi/penjualan" element={<PenjualanPage />} />
          <Route path="/transaksi/pembelian" element={<PembelianPage />} />
          <Route path="/transaksi/pengeluaran" element={<PengeluaranPage />} />
          {/* Laporan */}
          <Route path="/laporan/laba-rugi" element={<LabaRugiPage />} />
          <Route path="/laporan/arus-kas" element={<ArusKasPage />} />
          <Route path="/laporan/rekap-bulanan" element={<RekapBulananPage />} />
          {/* Analisis */}
          <Route path="/analisis" element={<HealthAnalysis />} />
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
