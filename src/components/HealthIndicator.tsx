import { getHealthScore, getProfitMargin, getInventoryTurnover, getAssetTurnover } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Activity, TrendingUp, RotateCcw, Zap } from "lucide-react";

export default function HealthIndicator() {
  const health = getHealthScore();
  const profitMargin = getProfitMargin();
  const invTurnover = getInventoryTurnover();
  const assetTurnover = getAssetTurnover();

  const colorMap: Record<string, string> = {
    success: "text-success bg-success/10 border-success/20",
    warning: "text-warning bg-warning/10 border-warning/20",
    destructive: "text-destructive bg-destructive/10 border-destructive/20",
  };

  const indicators = [
    { label: "Profit Margin", value: `${profitMargin}%`, icon: TrendingUp, desc: "Rasio laba terhadap penjualan" },
    { label: "Perputaran Persediaan", value: `${invTurnover}x`, icon: RotateCcw, desc: "Efektivitas pengelolaan stok" },
    { label: "Asset Turnover", value: `${assetTurnover}x`, icon: Zap, desc: "Kemampuan aset menghasilkan penjualan" },
  ];

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: "400ms" }}>
      <h3 className="text-sm font-semibold text-foreground mb-4">Kesehatan Usaha</h3>

      {/* Main health badge */}
      <div className={cn("flex items-center gap-3 p-3 rounded-lg border mb-4", colorMap[health.color])}>
        <Activity className="w-5 h-5" />
        <div>
          <p className="text-sm font-bold">{health.label}</p>
          <p className="text-xs opacity-80">Skor: {health.score.toFixed(1)}%</p>
        </div>
      </div>

      {/* Indicators */}
      <div className="space-y-3">
        {indicators.map((ind) => (
          <div key={ind.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ind.icon className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium text-foreground">{ind.label}</p>
                <p className="text-[10px] text-muted-foreground">{ind.desc}</p>
              </div>
            </div>
            <span className="text-sm font-bold text-foreground">{ind.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
