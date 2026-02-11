import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { transactions, formatCurrency, products, expenseCategories, type Transaction, type TransactionItem } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Plus, ArrowUpRight, ArrowDownLeft, MinusCircle, Search, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const typeConfig = {
  penjualan: { icon: ArrowUpRight, label: "Penjualan", className: "text-success bg-success/10" },
  pembelian: { icon: ArrowDownLeft, label: "Pembelian", className: "text-info bg-info/10" },
  pengeluaran: { icon: MinusCircle, label: "Pengeluaran", className: "text-destructive bg-destructive/10" },
};

interface LineItem {
  productId: string;
  productName: string;
  qty: string;
  price: string;
}

const emptyLine = (): LineItem => ({ productId: "", productName: "", qty: "1", price: "" });

export default function Transactions() {
  const [filter, setFilter] = useState<string>("semua");
  const [search, setSearch] = useState("");
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(transactions);

  // Add transaction
  const [addOpen, setAddOpen] = useState(false);
  const [txType, setTxType] = useState<Transaction["type"]>("penjualan");
  const [txDate, setTxDate] = useState(new Date().toISOString().split("T")[0]);

  // For penjualan/pembelian
  const [lines, setLines] = useState<LineItem[]>([emptyLine()]);

  // For pengeluaran
  const [expDesc, setExpDesc] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expCategory, setExpCategory] = useState("Operasional");

  // Detail view
  const [detailTx, setDetailTx] = useState<Transaction | null>(null);

  const lineTotal = useMemo(() => {
    return lines.reduce((sum, l) => sum + (Number(l.qty) || 0) * (Number(l.price) || 0), 0);
  }, [lines]);

  const updateLine = (idx: number, field: keyof LineItem, value: string) => {
    setLines((prev) => prev.map((l, i) => {
      if (i !== idx) return l;
      const updated = { ...l, [field]: value };
      if (field === "productId") {
        const prod = products.find((p) => p.id === value);
        if (prod) {
          updated.productName = prod.name;
          updated.price = String(prod.price);
        }
      }
      return updated;
    }));
  };

  const addLine = () => setLines((prev) => [...prev, emptyLine()]);
  const removeLine = (idx: number) => setLines((prev) => prev.filter((_, i) => i !== idx));

  const handleSave = () => {
    if (txType === "pengeluaran") {
      if (!expDesc || !expAmount) return;
      const tx: Transaction = {
        id: `T${String(allTransactions.length + 1).padStart(3, "0")}`,
        date: txDate,
        type: "pengeluaran",
        description: expDesc,
        amount: Number(expAmount),
        category: expCategory,
      };
      setAllTransactions([tx, ...allTransactions]);
      toast({ title: "Pengeluaran dicatat" });
    } else {
      const validLines = lines.filter((l) => l.productName && Number(l.qty) > 0 && Number(l.price) > 0);
      if (validLines.length === 0) return;
      const items: TransactionItem[] = validLines.map((l) => ({ product: l.productName, qty: Number(l.qty), price: Number(l.price) }));
      const total = items.reduce((s, i) => s + i.qty * i.price, 0);
      const desc = txType === "penjualan"
        ? `Penjualan ${items.map((i) => i.product).join(", ")}`
        : `Pembelian ${items.map((i) => i.product).join(", ")}`;
      const tx: Transaction = {
        id: `T${String(allTransactions.length + 1).padStart(3, "0")}`,
        date: txDate,
        type: txType,
        description: desc,
        items,
        amount: total,
      };
      setAllTransactions([tx, ...allTransactions]);
      toast({ title: `${txType === "penjualan" ? "Penjualan" : "Pembelian"} dicatat — ${formatCurrency(total)}` });
    }
    // Reset
    setLines([emptyLine()]);
    setExpDesc("");
    setExpAmount("");
    setAddOpen(false);
  };

  const filtered = allTransactions.filter((tx) => {
    if (filter !== "semua" && tx.type !== filter) return false;
    if (search && !tx.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const deleteTx = (id: string) => {
    setAllTransactions((prev) => prev.filter((t) => t.id !== id));
    toast({ title: "Transaksi dihapus" });
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Transaksi Keuangan</h2>
          <p className="text-sm text-muted-foreground mt-1">Catat penjualan, pembelian, dan pengeluaran</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Tambah Transaksi</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Tambah Transaksi Baru</DialogTitle></DialogHeader>

            <Tabs value={txType} onValueChange={(v) => setTxType(v as Transaction["type"])}>
              <TabsList className="w-full mb-4">
                <TabsTrigger value="penjualan" className="flex-1">Penjualan</TabsTrigger>
                <TabsTrigger value="pembelian" className="flex-1">Pembelian</TabsTrigger>
                <TabsTrigger value="pengeluaran" className="flex-1">Pengeluaran</TabsTrigger>
              </TabsList>

              <div className="mb-4">
                <Label>Tanggal</Label>
                <Input type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)} />
              </div>

              {/* Penjualan / Pembelian */}
              <TabsContent value="penjualan" className="space-y-3 mt-0">
                <Label className="text-xs text-muted-foreground">Pilih produk & jumlah — total dihitung otomatis</Label>
                {lines.map((line, idx) => (
                  <div key={idx} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label className="text-xs">Produk</Label>
                      <Select value={line.productId} onValueChange={(v) => updateLine(idx, "productId", v)}>
                        <SelectTrigger><SelectValue placeholder="Pilih produk" /></SelectTrigger>
                        <SelectContent>
                          {products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-20">
                      <Label className="text-xs">Qty</Label>
                      <Input type="number" min="1" value={line.qty} onChange={(e) => updateLine(idx, "qty", e.target.value)} />
                    </div>
                    <div className="w-28">
                      <Label className="text-xs">Harga</Label>
                      <Input type="number" value={line.price} onChange={(e) => updateLine(idx, "price", e.target.value)} />
                    </div>
                    {lines.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeLine(idx)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" className="gap-1" onClick={addLine}><Plus className="w-3 h-3" />Tambah Item</Button>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-sm font-medium text-muted-foreground">Total</span>
                  <span className="text-lg font-bold text-foreground">{formatCurrency(lineTotal)}</span>
                </div>
                <Button onClick={handleSave} className="w-full" disabled={lineTotal === 0}>Simpan Penjualan</Button>
              </TabsContent>

              <TabsContent value="pembelian" className="space-y-3 mt-0">
                <Label className="text-xs text-muted-foreground">Catat pembelian kain, barang, atau kebutuhan operasional</Label>
                {lines.map((line, idx) => (
                  <div key={idx} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label className="text-xs">Produk/Barang</Label>
                      <Select value={line.productId} onValueChange={(v) => updateLine(idx, "productId", v)}>
                        <SelectTrigger><SelectValue placeholder="Pilih produk" /></SelectTrigger>
                        <SelectContent>
                          {products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-20">
                      <Label className="text-xs">Qty</Label>
                      <Input type="number" min="1" value={line.qty} onChange={(e) => updateLine(idx, "qty", e.target.value)} />
                    </div>
                    <div className="w-28">
                      <Label className="text-xs">Harga</Label>
                      <Input type="number" value={line.price} onChange={(e) => updateLine(idx, "price", e.target.value)} />
                    </div>
                    {lines.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeLine(idx)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" className="gap-1" onClick={addLine}><Plus className="w-3 h-3" />Tambah Item</Button>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-sm font-medium text-muted-foreground">Total</span>
                  <span className="text-lg font-bold text-foreground">{formatCurrency(lineTotal)}</span>
                </div>
                <Button onClick={handleSave} className="w-full" disabled={lineTotal === 0}>Simpan Pembelian</Button>
              </TabsContent>

              <TabsContent value="pengeluaran" className="space-y-4 mt-0">
                <div>
                  <Label>Kategori Pengeluaran</Label>
                  <Select value={expCategory} onValueChange={setExpCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Deskripsi</Label>
                  <Input placeholder="Contoh: Gaji Karyawan Bulan Januari" value={expDesc} onChange={(e) => setExpDesc(e.target.value)} />
                </div>
                <div>
                  <Label>Jumlah (Rp)</Label>
                  <Input type="number" placeholder="0" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} />
                </div>
                <Button onClick={handleSave} className="w-full" disabled={!expDesc || !expAmount}>Simpan Pengeluaran</Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Cari transaksi..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {["semua", "penjualan", "pembelian", "pengeluaran"].map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">{f}</Button>
        ))}
      </div>

      {/* Transaction list */}
      <div className="glass-card rounded-xl divide-y divide-border">
        {filtered.map((tx) => {
          const config = typeConfig[tx.type];
          return (
            <div key={tx.id} className="flex items-center gap-4 p-4 group">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", config.className)}>
                <config.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{tx.description}</p>
                <p className="text-xs text-muted-foreground">
                  {tx.date} • {config.label}
                  {tx.items && ` • ${tx.items.length} item`}
                  {tx.category && ` • ${tx.category}`}
                </p>
              </div>
              <span className={cn("text-sm font-bold", tx.type === "penjualan" ? "text-success" : "text-foreground")}>
                {tx.type === "penjualan" ? "+" : "-"}{formatCurrency(tx.amount)}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {tx.items && (
                  <Button variant="ghost" size="sm" onClick={() => setDetailTx(tx)}><Eye className="w-3.5 h-3.5" /></Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => deleteTx(tx.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm">Tidak ada transaksi ditemukan.</div>
        )}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!detailTx} onOpenChange={() => setDetailTx(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detail Transaksi {detailTx?.id}</DialogTitle></DialogHeader>
          {detailTx && (
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tanggal</span>
                <span className="font-medium text-foreground">{detailTx.date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tipe</span>
                <span className="font-medium text-foreground capitalize">{detailTx.type}</span>
              </div>
              {detailTx.items && (
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Produk</th>
                        <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground">Qty</th>
                        <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground">Harga</th>
                        <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailTx.items.map((item, i) => (
                        <tr key={i} className="border-t border-border/50">
                          <td className="py-2 px-3 text-foreground">{item.product}</td>
                          <td className="py-2 px-3 text-right text-foreground">{item.qty}</td>
                          <td className="py-2 px-3 text-right text-foreground">{formatCurrency(item.price)}</td>
                          <td className="py-2 px-3 text-right font-medium text-foreground">{formatCurrency(item.qty * item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-bold text-foreground">{formatCurrency(detailTx.amount)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
