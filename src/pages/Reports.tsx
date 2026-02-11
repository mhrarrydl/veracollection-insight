import AppLayout from "@/components/AppLayout";
import { monthlySummaries, formatCurrency, transactions } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Reports() {
  const latest = monthlySummaries[monthlySummaries.length - 1];
  const totalPenjualan = latest.penjualan;
  const totalBiaya = latest.pembelian + latest.pengeluaran;
  const labaBersih = latest.laba;

  const cashFlowData = monthlySummaries.map((m) => ({
    month: m.month,
    kasuk: m.penjualan,
    kakeluar: m.pembelian + m.pengeluaran,
    net: m.penjualan - m.pembelian - m.pengeluaran,
  }));

  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Laporan Keuangan</h2>
        <p className="text-sm text-muted-foreground mt-1">Laporan otomatis dari data transaksi</p>
      </div>

      <Tabs defaultValue="labarugi">
        <TabsList className="mb-4">
          <TabsTrigger value="labarugi">Laba Rugi</TabsTrigger>
          <TabsTrigger value="aruskas">Arus Kas</TabsTrigger>
          <TabsTrigger value="rekap">Rekapitulasi</TabsTrigger>
        </TabsList>

        <TabsContent value="labarugi">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Laporan Laba Rugi — {latest.month}</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Total Penjualan</span>
                <span className="text-sm font-semibold text-foreground">{formatCurrency(totalPenjualan)}</span>
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
                <span className="text-base font-bold text-success">{formatCurrency(labaBersih)}</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="aruskas">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Laporan Arus Kas (6 Bulan)</h3>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line type="monotone" dataKey="kasuk" name="Kas Masuk" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="kakeluar" name="Kas Keluar" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="net" name="Net" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rekap">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Rekapitulasi Bulanan</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Bulan</th>
                    <th className="text-right py-3 px-2 font-semibold text-muted-foreground">Penjualan</th>
                    <th className="text-right py-3 px-2 font-semibold text-muted-foreground">Pembelian</th>
                    <th className="text-right py-3 px-2 font-semibold text-muted-foreground">Pengeluaran</th>
                    <th className="text-right py-3 px-2 font-semibold text-muted-foreground">Laba</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlySummaries.map((m) => (
                    <tr key={m.month} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-2 font-medium text-foreground">{m.month}</td>
                      <td className="py-3 px-2 text-right text-foreground">{formatCurrency(m.penjualan)}</td>
                      <td className="py-3 px-2 text-right text-foreground">{formatCurrency(m.pembelian)}</td>
                      <td className="py-3 px-2 text-right text-foreground">{formatCurrency(m.pengeluaran)}</td>
                      <td className="py-3 px-2 text-right font-semibold text-success">{formatCurrency(m.laba)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="h-[280px] mt-6">
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
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
