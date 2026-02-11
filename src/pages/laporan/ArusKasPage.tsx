import AppLayout from "@/components/AppLayout";
import { useData } from "@/context/DataContext";
import { formatCurrency } from "@/lib/data";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function ArusKasPage() {
  const { monthlySummaries } = useData();
  const data = monthlySummaries.map((m) => ({
    month: m.month,
    "Kas Masuk": m.penjualan,
    "Kas Keluar": m.pembelian + m.pengeluaran,
  }));

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Laporan Arus Kas</h2>
          <p className="text-sm text-muted-foreground mt-1">Kas masuk dan kas keluar 6 bulan terakhir</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => window.print()}>
          <Printer className="w-4 h-4" />Export
        </Button>
      </div>
      <div className="glass-card rounded-xl p-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
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

      {/* Table */}
      <div className="glass-card rounded-xl p-6 mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Bulan</th>
                <th className="text-right py-3 px-3 font-semibold text-muted-foreground">Kas Masuk</th>
                <th className="text-right py-3 px-3 font-semibold text-muted-foreground">Kas Keluar</th>
                <th className="text-right py-3 px-3 font-semibold text-muted-foreground">Selisih</th>
              </tr>
            </thead>
            <tbody>
              {monthlySummaries.map((m) => {
                const masuk = m.penjualan;
                const keluar = m.pembelian + m.pengeluaran;
                return (
                  <tr key={m.month} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-3 font-medium text-foreground">{m.month}</td>
                    <td className="py-3 px-3 text-right text-success">{formatCurrency(masuk)}</td>
                    <td className="py-3 px-3 text-right text-destructive">{formatCurrency(keluar)}</td>
                    <td className={cn("py-3 px-3 text-right font-semibold", masuk - keluar >= 0 ? "text-success" : "text-destructive")}>
                      {formatCurrency(masuk - keluar)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
