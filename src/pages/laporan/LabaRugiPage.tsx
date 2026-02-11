import AppLayout from "@/components/AppLayout";
import { monthlySummaries, formatCurrency } from "@/lib/data";

export default function LabaRugiPage() {
  const latest = monthlySummaries[monthlySummaries.length - 1];
  const totalBiaya = latest.pembelian + latest.pengeluaran;

  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Laporan Laba Rugi</h2>
        <p className="text-sm text-muted-foreground mt-1">Periode: {latest.month}</p>
      </div>
      <div className="glass-card rounded-xl p-6 max-w-2xl">
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Total Penjualan</span>
            <span className="text-sm font-semibold text-foreground">{formatCurrency(latest.penjualan)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Harga Pokok Pembelian</span>
            <span className="text-sm font-semibold text-foreground">({formatCurrency(latest.pembelian)})</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Beban Operasional</span>
            <span className="text-sm font-semibold text-foreground">({formatCurrency(latest.pengeluaran)})</span>
          </div>
          <div className="flex justify-between py-2 border-b-2 border-foreground">
            <span className="text-sm font-bold text-foreground">Total Biaya</span>
            <span className="text-sm font-bold text-foreground">({formatCurrency(totalBiaya)})</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-base font-bold text-foreground">Laba Bersih</span>
            <span className="text-base font-bold text-success">{formatCurrency(latest.laba)}</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
