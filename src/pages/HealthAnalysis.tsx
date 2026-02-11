import AppLayout from "@/components/AppLayout";
import { useData } from "@/context/DataContext";
import { formatCurrency } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Activity, TrendingUp, RotateCcw, Zap, Shield, AlertTriangle, CheckCircle, Target } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { useMemo } from "react";

export default function HealthAnalysis() {
  const { monthlySummaries, currentMonth, accounts } = useData();

  const health = useMemo(() => {
    const profitMargin = currentMonth.penjualan > 0 ? (currentMonth.laba / currentMonth.penjualan) * 100 : 0;
    if (profitMargin >= 20) return { score: profitMargin, label: "Sehat", color: "success" };
    if (profitMargin >= 10) return { score: profitMargin, label: "Perlu Evaluasi", color: "warning" };
    return { score: profitMargin, label: "Berisiko", color: "destructive" };
  }, [currentMonth]);

  const profitMargin = useMemo(() => {
    return currentMonth.penjualan > 0 ? Number(((currentMonth.laba / currentMonth.penjualan) * 100).toFixed(1)) : 0;
  }, [currentMonth]);

  const invTurnover = useMemo(() => {
    const totalSales = monthlySummaries.reduce((a, b) => a + b.penjualan, 0);
    const avgInventory = accounts.find((a) => a.name === "Persediaan Barang")?.balance || 32000000;
    return Number((totalSales / avgInventory / monthlySummaries.length).toFixed(1));
  }, [monthlySummaries, accounts]);

  const assetTurnover = useMemo(() => {
    const totalSales = monthlySummaries.reduce((a, b) => a + b.penjualan, 0);
    const totalAssets = accounts.filter((a) => a.type === "aset").reduce((s, a) => s + a.balance, 0) || 77000000;
    return Number(((totalSales / monthlySummaries.length) / totalAssets).toFixed(2));
  }, [monthlySummaries, accounts]);

  // Break Even Point
  const bep = useMemo(() => {
    // Fixed costs = pengeluaran (gaji, listrik, dll)
    // Variable cost ratio = pembelian / penjualan
    const avgPenjualan = monthlySummaries.reduce((s, m) => s + m.penjualan, 0) / monthlySummaries.length;
    const avgPembelian = monthlySummaries.reduce((s, m) => s + m.pembelian, 0) / monthlySummaries.length;
    const avgPengeluaran = monthlySummaries.reduce((s, m) => s + m.pengeluaran, 0) / monthlySummaries.length;

    const variableCostRatio = avgPenjualan > 0 ? avgPembelian / avgPenjualan : 0;
    const contributionMarginRatio = 1 - variableCostRatio;
    const bepValue = contributionMarginRatio > 0 ? avgPengeluaran / contributionMarginRatio : 0;

    return {
      value: bepValue,
      fixedCost: avgPengeluaran,
      variableRatio: variableCostRatio * 100,
      isAboveBep: avgPenjualan > bepValue,
      margin: avgPenjualan > 0 ? ((avgPenjualan - bepValue) / avgPenjualan * 100) : 0,
    };
  }, [monthlySummaries]);

  const gaugeData = [{ value: health.score, fill: `hsl(var(--${health.color}))` }];

  const statusIcon = { success: CheckCircle, warning: AlertTriangle, destructive: Shield };
  const StatusIcon = statusIcon[health.color as keyof typeof statusIcon] || Activity;

  const colorMap: Record<string, string> = {
    success: "text-success border-success/30 bg-success/5",
    warning: "text-warning border-warning/30 bg-warning/5",
    destructive: "text-destructive border-destructive/30 bg-destructive/5",
  };

  const indicators = [
    { label: "Profit Margin", value: profitMargin, unit: "%", icon: TrendingUp, desc: "Persentase laba bersih terhadap total penjualan.", status: profitMargin >= 20 ? "Baik" : profitMargin >= 10 ? "Cukup" : "Rendah", statusColor: profitMargin >= 20 ? "text-success" : profitMargin >= 10 ? "text-warning" : "text-destructive" },
    { label: "Perputaran Persediaan", value: invTurnover, unit: "x / bulan", icon: RotateCcw, desc: "Seberapa cepat persediaan terjual dan diganti.", status: invTurnover >= 1.5 ? "Efisien" : invTurnover >= 0.8 ? "Normal" : "Lambat", statusColor: invTurnover >= 1.5 ? "text-success" : invTurnover >= 0.8 ? "text-warning" : "text-destructive" },
    { label: "Asset Turnover", value: assetTurnover, unit: "x", icon: Zap, desc: "Kemampuan total aset menghasilkan pendapatan.", status: assetTurnover >= 0.5 ? "Produktif" : assetTurnover >= 0.3 ? "Cukup" : "Kurang", statusColor: assetTurnover >= 0.5 ? "text-success" : assetTurnover >= 0.3 ? "text-warning" : "text-destructive" },
    { label: "Break Even Point", value: formatCurrency(bep.value), unit: "/ bulan", icon: Target, desc: "Omzet minimal agar usaha tidak merugi.", status: bep.isAboveBep ? "Di Atas BEP" : "Di Bawah BEP", statusColor: bep.isAboveBep ? "text-success" : "text-destructive", isFormatted: true },
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Analisis Kesehatan Usaha</h2>
        <p className="text-sm text-muted-foreground mt-1">Indikator kinerja keuangan Veracollection</p>
      </div>

      <div className={cn("glass-card rounded-xl p-6 border-2 mb-6 animate-fade-in", colorMap[health.color])}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-[180px] h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" startAngle={180} endAngle={0} data={gaugeData}>
                <PolarAngleAxis type="number" domain={[0, 50]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StatusIcon className="w-6 h-6" />
              <h3 className="text-2xl font-bold">{health.label}</h3>
            </div>
            <p className="text-sm opacity-80 max-w-md">
              {health.label === "Sehat" ? "Kondisi keuangan usaha dalam keadaan baik. Profit margin di atas 20%." : health.label === "Perlu Evaluasi" ? "Beberapa indikator memerlukan perhatian." : "Kondisi keuangan memerlukan tindakan segera."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {indicators.map((ind, i) => (
          <div key={ind.label} className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><ind.icon className="w-4 h-4 text-primary" /></div>
              <h4 className="text-sm font-semibold text-foreground">{ind.label}</h4>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-foreground">{ind.isFormatted ? ind.value : ind.value}</span>
              {!ind.isFormatted && <span className="text-sm text-muted-foreground">{ind.unit}</span>}
            </div>
            {ind.isFormatted && <p className="text-xs text-muted-foreground mb-2">{ind.unit}</p>}
            <div className={cn("text-xs font-semibold mb-2", ind.statusColor)}>{ind.status}</div>
            <p className="text-xs text-muted-foreground leading-relaxed">{ind.desc}</p>
          </div>
        ))}
      </div>

      {/* BEP Detail */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Detail Break Even Point</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">Biaya Tetap (rata-rata/bulan)</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(bep.fixedCost)}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">Rasio Biaya Variabel</p>
            <p className="text-lg font-bold text-foreground">{bep.variableRatio.toFixed(1)}%</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">Margin of Safety</p>
            <p className={cn("text-lg font-bold", bep.margin > 0 ? "text-success" : "text-destructive")}>{bep.margin.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
