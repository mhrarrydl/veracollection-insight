import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  Wallet,
  ShoppingCart,
  ShoppingBag,
  Receipt,
  FileText,
  TrendingUp,
  BarChart3,
  CalendarRange,
  PieChart,
  Activity,
  LogOut,
  ChevronDown,
  Shield,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import veraLogo from "@/assets/vera-logo.png";

interface NavGroup {
  label: string;
  items: { to: string; icon: React.ElementType; label: string }[];
}

const navGroups: NavGroup[] = [
  {
    label: "MENU UTAMA",
    items: [
      { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "MASTER DATA",
    items: [
      { to: "/master-data/produk", icon: Package, label: "Produk" },
      { to: "/master-data/kategori", icon: Tags, label: "Kategori" },
      { to: "/master-data/supplier", icon: Truck, label: "Supplier" },
      { to: "/master-data/akun", icon: Wallet, label: "Akun Keuangan" },
    ],
  },
  {
    label: "TRANSAKSI",
    items: [
      { to: "/transaksi/penjualan", icon: ShoppingCart, label: "Penjualan" },
      { to: "/transaksi/pembelian", icon: ShoppingBag, label: "Pembelian" },
      { to: "/transaksi/pengeluaran", icon: Receipt, label: "Pengeluaran" },
      { to: "/transaksi/pengeluaran-harian", icon: Clock, label: "Pengeluaran Harian" },
    ],
  },
  {
    label: "LAPORAN",
    items: [
      { to: "/laporan/laba-rugi", icon: FileText, label: "Laba Rugi" },
      { to: "/laporan/arus-kas", icon: TrendingUp, label: "Arus Kas" },
      { to: "/laporan/rekap-bulanan", icon: BarChart3, label: "Rekap Bulanan" },
      { to: "/laporan/rekap-tahunan", icon: CalendarRange, label: "Rekap Tahunan" },
      { to: "/laporan/rekap-produk", icon: PieChart, label: "Rekap Per Produk" },
    ],
  },
  {
    label: "KEUANGAN",
    items: [
      { to: "/dana-darurat", icon: Shield, label: "Dana Darurat" },
    ],
  },
  {
    label: "ANALISIS",
    items: [
      { to: "/analisis", icon: Activity, label: "Kesehatan Usaha" },
    ],
  },
];

export default function AppSidebar() {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(navGroups.map((g) => [g.label, true]))
  );

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[240px] bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-sidebar-border flex items-center gap-3">
        <img src={veraLogo} alt="Vera Collection" className="h-10 w-auto" />
        <div>
          <h1 className="text-sm font-bold text-sidebar-accent-foreground leading-tight">Vera Collection</h1>
          <p className="text-[10px] text-sidebar-foreground/50">Sistem Informasi Keuangan</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {navGroups.map((group) => {
          const isOpen = openGroups[group.label] ?? true;
          const hasActive = group.items.some((item) => location.pathname === item.to);

          return (
            <div key={group.label} className="mb-1">
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex items-center justify-between w-full px-2 py-1.5 text-[10px] font-semibold tracking-widest text-sidebar-foreground/40 uppercase hover:text-sidebar-foreground/60 transition-colors"
              >
                {group.label}
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    !isOpen && "-rotate-90"
                  )}
                />
              </button>

              {isOpen && (
                <div className="space-y-0.5 mt-0.5">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/30 hover:text-sidebar-accent-foreground transition-colors">
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
