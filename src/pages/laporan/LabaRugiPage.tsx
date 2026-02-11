import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { useData } from "@/context/DataContext";
import { formatCurrency } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer } from "lucide-react";

export default function LabaRugiPage() {
  const { monthlySummaries } = useData();
  const [selectedMonth, setSelectedMonth] = useState(monthlySummaries[monthlySummaries.length - 1]?.month || "");

  const latest = useMemo(
    () => monthlySummaries.find((m) => m.month === selectedMonth) || monthlySummaries[monthlySummaries.length - 1],
    [monthlySummaries, selectedMonth]
  );

  const totalBiaya = latest.pembelian + latest.pengeluaran;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Laporan Laba Rugi</h2>
          <p className="text-sm text-muted-foreground mt-1">Periode: {latest.month}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Pilih bulan" />
            </SelectTrigger>
            <SelectContent>
              {monthlySummaries.map((m) => (
                <SelectItem key={m.month} value={m.month}>{m.month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2" onClick={handlePrint}>
            <Printer className="w-4 h-4" />Export
          </Button>
        </div>
      </div>
      <div className="glass-card rounded-xl p-6 max-w-2xl print:shadow-none" id="print-area">
        <div className="text-center mb-6 hidden print:block">
          <h2 className="text-lg font-bold">Laporan Laba Rugi</h2>
          <p className="text-sm text-muted-foreground">Veracollection — {latest.month}</p>
        </div>
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
