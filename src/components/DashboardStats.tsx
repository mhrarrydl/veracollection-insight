import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, CreditCard, Package } from "lucide-react";
import { formatCurrency, monthlySummaries } from "@/lib/data";

const current = monthlySummaries[monthlySummaries.length - 1];
const prev = monthlySummaries[monthlySummaries.length - 2];

function pctChange(cur: number, pre: number) {
  return ((cur - pre) / pre * 100).toFixed(1);
}

const stats = [
  {
    label: "Total Penjualan",
    value: formatCurrency(current.penjualan),
    change: pctChange(current.penjualan, prev.penjualan),
    icon: DollarSign,
    trend: current.penjualan >= prev.penjualan ? "up" : "down",
  },
  {
    label: "Total Pembelian",
    value: formatCurrency(current.pembelian),
    change: pctChange(current.pembelian, prev.pembelian),
    icon: ShoppingCart,
    trend: current.pembelian <= prev.pembelian ? "up" : "down",
  },
  {
    label: "Pengeluaran",
    value: formatCurrency(current.pengeluaran),
    change: pctChange(current.pengeluaran, prev.pengeluaran),
    icon: CreditCard,
    trend: current.pengeluaran <= prev.pengeluaran ? "up" : "down",
  },
  {
    label: "Laba Bersih",
    value: formatCurrency(current.laba),
    change: pctChange(current.laba, prev.laba),
    icon: Package,
    trend: current.laba >= prev.laba ? "up" : "down",
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="glass-card rounded-xl p-5 animate-fade-in"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </span>
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-primary" />
            </div>
          </div>
          <p className="text-xl font-bold text-foreground">{stat.value}</p>
          <div className="flex items-center gap-1 mt-2">
            {stat.trend === "up" ? (
              <TrendingUp className="w-3.5 h-3.5 text-success" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-destructive" />
            )}
            <span className={`text-xs font-medium ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
              {stat.change}%
            </span>
            <span className="text-xs text-muted-foreground">vs bulan lalu</span>
          </div>
        </div>
      ))}
    </div>
  );
}
