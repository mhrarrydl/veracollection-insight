import { transactions, formatCurrency } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, MinusCircle } from "lucide-react";

const typeConfig = {
  penjualan: { icon: ArrowUpRight, label: "Penjualan", className: "text-success bg-success/10" },
  pembelian: { icon: ArrowDownLeft, label: "Pembelian", className: "text-info bg-info/10" },
  pengeluaran: { icon: MinusCircle, label: "Pengeluaran", className: "text-destructive bg-destructive/10" },
};

export default function RecentTransactions() {
  const recent = transactions.slice(0, 6);

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: "480ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Transaksi Terbaru</h3>
        <a href="/transaksi" className="text-xs text-accent hover:underline font-medium">
          Lihat Semua →
        </a>
      </div>
      <div className="space-y-3">
        {recent.map((tx) => {
          const config = typeConfig[tx.type];
          return (
            <div key={tx.id} className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", config.className)}>
                <config.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{tx.date}</p>
              </div>
              <span
                className={cn(
                  "text-sm font-semibold",
                  tx.type === "penjualan" ? "text-success" : "text-foreground"
                )}
              >
                {tx.type === "penjualan" ? "+" : "-"}{formatCurrency(tx.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
