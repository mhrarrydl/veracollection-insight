import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { transactions, formatCurrency, products, type Transaction, type TransactionItem } from "@/lib/data";
import { Plus, ArrowDownLeft, Search, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface LineItem { productId: string; productName: string; qty: string; price: string; }
const emptyLine = (): LineItem => ({ productId: "", productName: "", qty: "1", price: "" });

export default function PembelianPage() {
  const [all, setAll] = useState<Transaction[]>(transactions.filter((t) => t.type === "pembelian"));
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [lines, setLines] = useState<LineItem[]>([emptyLine()]);
  const [detail, setDetail] = useState<Transaction | null>(null);

  const lineTotal = useMemo(() => lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.price) || 0), 0), [lines]);

  const updateLine = (idx: number, field: keyof LineItem, value: string) => {
    setLines((prev) => prev.map((l, i) => {
      if (i !== idx) return l;
      const updated = { ...l, [field]: value };
      if (field === "productId") { const prod = products.find((p) => p.id === value); if (prod) { updated.productName = prod.name; updated.price = String(prod.price); } }
      return updated;
    }));
  };

  const save = () => {
    const valid = lines.filter((l) => l.productName && Number(l.qty) > 0 && Number(l.price) > 0);
    if (!valid.length) return;
    const items: TransactionItem[] = valid.map((l) => ({ product: l.productName, qty: Number(l.qty), price: Number(l.price) }));
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    const tx: Transaction = { id: `T${Date.now()}`, date, type: "pembelian", description: `Pembelian ${items.map((i) => i.product).join(", ")}`, items, amount: total };
    setAll([tx, ...all]);
    setLines([emptyLine()]);
    setAddOpen(false);
    toast({ title: `Pembelian dicatat — ${formatCurrency(total)}` });
  };

  const filtered = all.filter((tx) => !search || tx.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-foreground">Pembelian</h2><p className="text-sm text-muted-foreground mt-1">Catat pembelian kain, barang, & kebutuhan operasional</p></div>
        <Button className="gap-2" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4" />Tambah Pembelian</Button>
      </div>

      <div className="relative max-w-xs mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Cari pembelian..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="glass-card rounded-xl divide-y divide-border">
        {filtered.map((tx) => (
          <div key={tx.id} className="flex items-center gap-4 p-4 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-info bg-info/10"><ArrowDownLeft className="w-5 h-5" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{tx.description}</p>
              <p className="text-xs text-muted-foreground">{tx.date}{tx.items && ` • ${tx.items.length} item`}</p>
            </div>
            <span className="text-sm font-bold text-foreground">-{formatCurrency(tx.amount)}</span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {tx.items && <Button variant="ghost" size="sm" onClick={() => setDetail(tx)}><Eye className="w-3.5 h-3.5" /></Button>}
              <Button variant="ghost" size="sm" onClick={() => { setAll((p) => p.filter((t) => t.id !== tx.id)); toast({ title: "Dihapus" }); }}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
            </div>
          </div>
        ))}
        {!filtered.length && <div className="p-8 text-center text-muted-foreground text-sm">Belum ada pembelian.</div>}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Tambah Pembelian</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Tanggal</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
            {lines.map((line, idx) => (
              <div key={idx} className="flex gap-2 items-end">
                <div className="flex-1"><Label className="text-xs">Produk/Barang</Label>
                  <Select value={line.productId} onValueChange={(v) => updateLine(idx, "productId", v)}>
                    <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                    <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="w-20"><Label className="text-xs">Qty</Label><Input type="number" min="1" value={line.qty} onChange={(e) => updateLine(idx, "qty", e.target.value)} /></div>
                <div className="w-28"><Label className="text-xs">Harga</Label><Input type="number" value={line.price} onChange={(e) => updateLine(idx, "price", e.target.value)} /></div>
                {lines.length > 1 && <Button variant="ghost" size="sm" onClick={() => setLines((p) => p.filter((_, i) => i !== idx))}><Trash2 className="w-4 h-4 text-destructive" /></Button>}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setLines((p) => [...p, emptyLine()])}><Plus className="w-3 h-3 mr-1" />Tambah Item</Button>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-lg font-bold text-foreground">{formatCurrency(lineTotal)}</span>
            </div>
            <Button onClick={save} className="w-full" disabled={lineTotal === 0}>Simpan Pembelian</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detail {detail?.id}</DialogTitle></DialogHeader>
          {detail?.items && (
            <div className="space-y-3 pt-2">
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/50"><th className="text-left py-2 px-3 text-xs text-muted-foreground">Produk</th><th className="text-right py-2 px-3 text-xs text-muted-foreground">Qty</th><th className="text-right py-2 px-3 text-xs text-muted-foreground">Harga</th><th className="text-right py-2 px-3 text-xs text-muted-foreground">Subtotal</th></tr></thead>
                  <tbody>{detail.items.map((item, i) => (<tr key={i} className="border-t border-border/50"><td className="py-2 px-3">{item.product}</td><td className="py-2 px-3 text-right">{item.qty}</td><td className="py-2 px-3 text-right">{formatCurrency(item.price)}</td><td className="py-2 px-3 text-right font-medium">{formatCurrency(item.qty * item.price)}</td></tr>))}</tbody>
                </table>
              </div>
              <div className="flex justify-between pt-2 border-t"><span className="font-bold">Total</span><span className="font-bold">{formatCurrency(detail.amount)}</span></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
