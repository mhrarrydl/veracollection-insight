import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useData } from "@/context/DataContext";
import { formatCurrency, type YearlySummary } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function RekapTahunanPage() {
  const { yearlySummaries, addYearlySummary, removeYearlySummary, updateYearlySummary } = useData();
  const [open, setOpen] = useState(false);
  const [editYear, setEditYear] = useState<string | null>(null);
  const [form, setForm] = useState({ year: "", penjualan: "", pembelian: "", pengeluaran: "" });

  const openAdd = () => {
    setEditYear(null);
    setForm({ year: String(new Date().getFullYear()), penjualan: "", pembelian: "", pengeluaran: "" });
    setOpen(true);
  };

  const openEdit = (ys: YearlySummary) => {
    setEditYear(ys.year);
    setForm({
      year: ys.year,
      penjualan: String(ys.penjualan),
      pembelian: String(ys.pembelian),
      pengeluaran: String(ys.pengeluaran),
    });
    setOpen(true);
  };

  const save = () => {
    const penjualan = Number(form.penjualan) || 0;
    const pembelian = Number(form.pembelian) || 0;
    const pengeluaran = Number(form.pengeluaran) || 0;
    const laba = penjualan - pembelian - pengeluaran;
    const entry: YearlySummary = { year: form.year, penjualan, pembelian, pengeluaran, laba };

    if (editYear) {
      updateYearlySummary(entry);
      toast({ title: `Rekap tahun ${form.year} diperbarui` });
    } else {
      if (yearlySummaries.some((y) => y.year === form.year)) {
        toast({ title: "Tahun sudah ada", description: "Gunakan edit untuk mengubah data", variant: "destructive" });
        return;
      }
      addYearlySummary(entry);
      toast({ title: `Rekap tahun ${form.year} ditambahkan` });
    }
    setOpen(false);
  };

  const remove = (year: string) => {
    removeYearlySummary(year);
    toast({ title: `Rekap tahun ${year} dihapus` });
  };

  // Totals
  const totalPenjualan = yearlySummaries.reduce((s, y) => s + y.penjualan, 0);
  const totalPembelian = yearlySummaries.reduce((s, y) => s + y.pembelian, 0);
  const totalPengeluaran = yearlySummaries.reduce((s, y) => s + y.pengeluaran, 0);
  const totalLaba = yearlySummaries.reduce((s, y) => s + y.laba, 0);

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Rekapitulasi Tahunan</h2>
          <p className="text-sm text-muted-foreground mt-1">Ringkasan pendapatan, biaya, dan laba per tahun</p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="w-4 h-4" />Tambah Rekap Tahun
        </Button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Tahun</th>
                <th className="text-right py-3 px-3 font-semibold text-muted-foreground">Penjualan</th>
                <th className="text-right py-3 px-3 font-semibold text-muted-foreground">Pembelian</th>
                <th className="text-right py-3 px-3 font-semibold text-muted-foreground">Pengeluaran</th>
                <th className="text-right py-3 px-3 font-semibold text-muted-foreground">Laba</th>
                <th className="text-right py-3 px-3 font-semibold text-muted-foreground">Margin</th>
                <th className="text-center py-3 px-3 font-semibold text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {yearlySummaries.map((ys) => (
                <tr key={ys.year} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-3 font-bold text-foreground">{ys.year}</td>
                  <td className="py-3 px-3 text-right text-foreground">{formatCurrency(ys.penjualan)}</td>
                  <td className="py-3 px-3 text-right text-foreground">{formatCurrency(ys.pembelian)}</td>
                  <td className="py-3 px-3 text-right text-foreground">{formatCurrency(ys.pengeluaran)}</td>
                  <td className="py-3 px-3 text-right font-semibold text-success">{formatCurrency(ys.laba)}</td>
                  <td className="py-3 px-3 text-right text-muted-foreground">
                    {ys.penjualan > 0 ? ((ys.laba / ys.penjualan) * 100).toFixed(1) : "0"}%
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(ys)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => remove(ys.year)}>
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-foreground/20 bg-muted/30">
                <td className="py-3 px-3 font-bold text-foreground">Total</td>
                <td className="py-3 px-3 text-right font-bold text-foreground">{formatCurrency(totalPenjualan)}</td>
                <td className="py-3 px-3 text-right font-bold text-foreground">{formatCurrency(totalPembelian)}</td>
                <td className="py-3 px-3 text-right font-bold text-foreground">{formatCurrency(totalPengeluaran)}</td>
                <td className="py-3 px-3 text-right font-bold text-success">{formatCurrency(totalLaba)}</td>
                <td className="py-3 px-3 text-right font-bold text-muted-foreground">
                  {totalPenjualan > 0 ? ((totalLaba / totalPenjualan) * 100).toFixed(1) : "0"}%
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Grafik Rekap Tahunan</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearlySummaries} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="penjualan" name="Penjualan" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pembelian" name="Pembelian" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pengeluaran" name="Pengeluaran" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="laba" name="Laba" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editYear ? `Edit Rekap ${editYear}` : "Tambah Rekap Tahunan"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Tahun</Label>
              <Input
                type="number"
                min="2000"
                max="2099"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                disabled={!!editYear}
              />
            </div>
            <div>
              <Label>Total Penjualan (Rp)</Label>
              <Input type="number" placeholder="0" value={form.penjualan} onChange={(e) => setForm({ ...form, penjualan: e.target.value })} />
            </div>
            <div>
              <Label>Total Pembelian (Rp)</Label>
              <Input type="number" placeholder="0" value={form.pembelian} onChange={(e) => setForm({ ...form, pembelian: e.target.value })} />
            </div>
            <div>
              <Label>Total Pengeluaran (Rp)</Label>
              <Input type="number" placeholder="0" value={form.pengeluaran} onChange={(e) => setForm({ ...form, pengeluaran: e.target.value })} />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-sm font-medium text-muted-foreground">Laba (otomatis)</span>
              <span className="text-lg font-bold text-success">
                {formatCurrency((Number(form.penjualan) || 0) - (Number(form.pembelian) || 0) - (Number(form.pengeluaran) || 0))}
              </span>
            </div>
            <Button onClick={save} className="w-full" disabled={!form.year || !form.penjualan}>
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
