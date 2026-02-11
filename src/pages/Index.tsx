import AppLayout from "@/components/AppLayout";
import { monthlySummaries, formatCurrency, getHealthScore } from "@/lib/data";
import { DollarSign, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { cn } from "@/lib/utils";

const current = monthlySummaries[monthlySummaries.length - 1];
const prev = monthlySummaries[monthlySummaries.length - 2];
const pct = (cur: number, pre: number) => ((cur - pre) / pre * 100).toFixed(1);

const health = getHealthScore();

const stats = [
  { label: "Total Penjualan", value: formatCurrency(current.penjualan), change: pct(current.penjualan, prev.penjualan), icon: DollarSign, iconBg: "bg-success", up: true },
  { label: "Laba Bersih", value: formatCurrency(current.laba), change: pct(current.laba, prev.laba), icon: TrendingUp, iconBg: "bg-primary", up: true },
  { label: "Total Pengeluaran", value: formatCurrency(current.pembelian + current.pengeluaran), change: pct(current.pembelian + current.pengeluaran, prev.pembelian + prev.pengeluaran), icon: TrendingDown, iconBg: "bg-destructive", up: false },
  { label: "Kesehatan Usaha", value: health.label, change: `${health.score.toFixed(1)}%`, icon: Activity, iconBg: "bg-warning", up: true },
];

// Full year data for trend chart
const trendData = monthlySummaries.map((m) => ({
  month: m.month,
  Pendapatan: m.penjualan,
  Laba: m.laba,
}));

const cashFlowData = monthlySummaries.map((m) => ({
  month: m.month,
  "Kas Masuk": m.penjualan,
  "Kas Keluar": m.pembelian + m.pengeluaran,
}));

const Index = () => {
  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Ringkasan keuangan Veracollection bulan ini</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={stat.label} className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
              <div className={cn("w-9 h-9 rounded-full flex items-center justify-center", stat.iconBg)}>
                <stat.icon className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <div className="flex items-center gap-1 mt-2">
              {stat.up ? <TrendingUp className="w-3.5 h-3.5 text-success" /> : <TrendingDown className="w-3.5 h-3.5 text-destructive" />}
              <span className={cn("text-xs font-medium", stat.up ? "text-success" : "text-destructive")}>
                {stat.up ? "+" : ""}{stat.change}%
              </span>
              <span className="text-xs text-muted-foreground">vs bulan lalu</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Tren Pendapatan & Laba</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="Pendapatan" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Laba" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Arus Kas</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="Kas Masuk" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Kas Keluar" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
