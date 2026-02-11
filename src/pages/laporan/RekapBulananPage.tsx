import AppLayout from "@/components/AppLayout";
import { monthlySummaries, formatCurrency } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function RekapBulananPage() {
  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Rekapitulasi Bulanan</h2>
        <p className="text-sm text-muted-foreground mt-1">Ringkasan pendapatan, biaya, dan laba per bulan</p>
      </div>
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Bulan</th>
              <th className="text-right py-3 px-2 font-semibold text-muted-foreground">Penjualan</th>
              <th className="text-right py-3 px-2 font-semibold text-muted-foreground">Pembelian</th>
              <th className="text-right py-3 px-2 font-semibold text-muted-foreground">Pengeluaran</th>
              <th className="text-right py-3 px-2 font-semibold text-muted-foreground">Laba</th>
            </tr></thead>
            <tbody>
              {monthlySummaries.map((m) => (
                <tr key={m.month} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-2 font-medium text-foreground">{m.month}</td>
                  <td className="py-3 px-2 text-right">{formatCurrency(m.penjualan)}</td>
                  <td className="py-3 px-2 text-right">{formatCurrency(m.pembelian)}</td>
                  <td className="py-3 px-2 text-right">{formatCurrency(m.pengeluaran)}</td>
                  <td className="py-3 px-2 text-right font-semibold text-success">{formatCurrency(m.laba)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Grafik Rekap Bulanan</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySummaries}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="penjualan" name="Penjualan" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pembelian" name="Pembelian" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="laba" name="Laba" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
