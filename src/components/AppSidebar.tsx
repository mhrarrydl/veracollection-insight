import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  FileText,
  HeartPulse,
  Database,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/transaksi", icon: ArrowLeftRight, label: "Transaksi" },
  { to: "/laporan", icon: FileText, label: "Laporan" },
  { to: "/analisis", icon: HeartPulse, label: "Kesehatan Usaha" },
  { to: "/master-data", icon: Database, label: "Master Data" },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
          <span className="text-sidebar-primary-foreground font-bold text-sm">V</span>
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="font-bold text-sidebar-accent-foreground text-sm tracking-wide">
              VERACOLLECTION
            </h1>
            <p className="text-[10px] text-sidebar-foreground/60 tracking-widest uppercase">
              Keuangan
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="animate-fade-in">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-3 mb-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-sidebar-foreground/60 hover:bg-sidebar-accent/30 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Tutup Menu</span></>}
      </button>
    </aside>
  );
}
