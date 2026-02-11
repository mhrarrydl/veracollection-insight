import { useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { useData } from "@/context/DataContext";
import { formatCurrency } from "@/lib/data";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function RekapProdukPage() {
  const { transactions, products, categories } = useData();

  const productSales = useMemo(() => {
    const map = new Map<string, { name: string; category: string; qty: number; revenue: number }>();
    transactions
      .filter((t) => t.type === "penjualan" && t.items)
      .forEach((t) =>
        t.items!.forEach((item) => {
          const existing = map.get(item.product) || { name: item.product, category: products.find((p) => p.name === item.product)?.category || "Lainnya", qty: 0, revenue: 0 };
          existing.qty += item.qty;
          existing.revenue += item.qty * item.price;
          map.set(item.product, existing);
        })
      );
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }, [transactions, products]);

  const categorySales = useMemo(() => {
    const map = new Map<string, number>();
    productSales.forEach((p) => {
      map.set(p.category, (map.get(p.category) || 0) + p.revenue);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [productSales]);

  const totalRevenue = productSales.reduce((s, p) => s + p.revenue, 0);

  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Rekap Per Produk</h2>
        <p className="text-sm text-muted-foreground mt-1">Perbandingan penjualan per produk dan kategori</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Pie chart kategori */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Kontribusi per Kategori</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorySales} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categorySales.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar chart per produk */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Penjualan per Produk</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productSales} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={120} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="revenue" name="Pendapatan" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Detail Penjualan per Produk</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Produk</th>
                <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Kategori</th>
                <th className="text-right py-3 px-3 font-semibold text-muted-foreground">Qty Terjual</th>
                <th className="text-right py-3 px-3 font-semibold text-muted-foreground">Total Pendapatan</th>
                <th className="text-right py-3 px-3 font-semibold text-muted-foreground">Kontribusi</th>
              </tr>
            </thead>
            <tbody>
              {productSales.map((p) => (
                <tr key={p.name} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-3 font-medium text-foreground">{p.name}</td>
                  <td className="py-3 px-3 text-muted-foreground">{p.category}</td>
                  <td className="py-3 px-3 text-right">{p.qty}</td>
                  <td className="py-3 px-3 text-right font-semibold text-success">{formatCurrency(p.revenue)}</td>
                  <td className="py-3 px-3 text-right text-muted-foreground">{totalRevenue > 0 ? ((p.revenue / totalRevenue) * 100).toFixed(1) : 0}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-foreground/20 bg-muted/30">
                <td className="py-3 px-3 font-bold" colSpan={2}>Total</td>
                <td className="py-3 px-3 text-right font-bold">{productSales.reduce((s, p) => s + p.qty, 0)}</td>
                <td className="py-3 px-3 text-right font-bold text-success">{formatCurrency(totalRevenue)}</td>
                <td className="py-3 px-3 text-right font-bold">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
