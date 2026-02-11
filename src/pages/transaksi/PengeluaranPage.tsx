import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { transactions, formatCurrency, expenseCategories, type Transaction } from "@/lib/data";
import { Plus, MinusCircle, Search, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function PengeluaranPage() {
  const [all, setAll] = useState<Transaction[]>(transactions.filter((t) => t.type === "pengeluaran"));
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState("Operasional");

  const save = () => {
    if (!desc || !amount) return;
    const tx: Transaction = { id: `T${Date.now()}`, date, type: "pengeluaran", description: desc, amount: Number(amount), category: cat };
    setAll([tx, ...all]);
    setDesc(""); setAmount("");
    setAddOpen(false);
    toast({ title: `Pengeluaran dicatat — ${formatCurrency(Number(amount))}` });
  };

  const filtered = all.filter((tx) => !search || tx.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-foreground">Pengeluaran</h2><p className="text-sm text-muted-foreground mt-1">Catat pengeluaran gaji, listrik, transport, dll.</p></div>
        <Button className="gap-2" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4" />Tambah Pengeluaran</Button>
      </div>

      <div className="relative max-w-xs mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Cari pengeluaran..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="glass-card rounded-xl divide-y divide-border">
        {filtered.map((tx) => (
          <div key={tx.id} className="flex items-center gap-4 p-4 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-destructive bg-destructive/10"><MinusCircle className="w-5 h-5" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{tx.description}</p>
              <p className="text-xs text-muted-foreground">{tx.date}{tx.category && ` • ${tx.category}`}</p>
            </div>
            <span className="text-sm font-bold text-foreground">-{formatCurrency(tx.amount)}</span>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { setAll((p) => p.filter((t) => t.id !== tx.id)); toast({ title: "Dihapus" }); }}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
          </div>
        ))}
        {!filtered.length && <div className="p-8 text-center text-muted-foreground text-sm">Belum ada pengeluaran.</div>}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Tambah Pengeluaran</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div><Label>Tanggal</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div><Label>Kategori</Label>
              <Select value={cat} onValueChange={setCat}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{expenseCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Deskripsi</Label><Input placeholder="Contoh: Gaji Karyawan" value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
            <div><Label>Jumlah (Rp)</Label><Input type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
            <Button onClick={save} className="w-full" disabled={!desc || !amount}>Simpan Pengeluaran</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
