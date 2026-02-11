import AppLayout from "@/components/AppLayout";
import { useData } from "@/context/DataContext";
import { formatCurrency } from "@/lib/data";
import { DollarSign, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const pct = (cur: number, pre: number) => pre === 0 ? "0.0" : ((cur - pre) / pre * 100).toFixed(1);

const Index = () => {
  const { monthlySummaries, currentMonth, prevMonth } = useData();

  const health = useMemo(() => {
    const profitMargin = currentMonth.penjualan > 0 ? (currentMonth.laba / currentMonth.penjualan) * 100 : 0;
    if (profitMargin >= 20) return { score: profitMargin, label: "Sehat", color: "success" };
    if (profitMargin >= 10) return { score: profitMargin, label: "Perlu Evaluasi", color: "warning" };
    return { score: profitMargin, label: "Berisiko", color: "destructive" };
  }, [currentMonth]);

  const stats = useMemo(() => [
    { label: "Total Penjualan", value: formatCurrency(currentMonth.penjualan), change: pct(currentMonth.penjualan, prevMonth.penjualan), icon: DollarSign, iconBg: "bg-success", up: true },
    { label: "Laba Bersih", value: formatCurrency(currentMonth.laba), change: pct(currentMonth.laba, prevMonth.laba), icon: TrendingUp, iconBg: "bg-primary", up: true },
    { label: "Total Pengeluaran", value: formatCurrency(currentMonth.pembelian + currentMonth.pengeluaran), change: pct(currentMonth.pembelian + currentMonth.pengeluaran, prevMonth.pembelian + prevMonth.pengeluaran), icon: TrendingDown, iconBg: "bg-destructive", up: false },
    { label: "Kesehatan Usaha", value: health.label, change: `${health.score.toFixed(1)}%`, icon: Activity, iconBg: "bg-warning", up: true },
  ], [currentMonth, prevMonth, health]);

  const trendData = useMemo(() => monthlySummaries.map((m) => ({
    month: m.month, Pendapatan: m.penjualan, Laba: m.laba,
  })), [monthlySummaries]);

  const cashFlowData = useMemo(() => monthlySummaries.map((m) => ({
    month: m.month, "Kas Masuk": m.penjualan, "Kas Keluar": m.pembelian + m.pengeluaran,
  })), [monthlySummaries]);

  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Ringkasan keuangan Veracollection bulan ini</p>
      </div>

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
