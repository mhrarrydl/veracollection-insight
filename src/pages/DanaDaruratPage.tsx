import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { useData } from "@/context/DataContext";
import { formatCurrency } from "@/lib/data";
import { Plus, Shield, Trash2, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import type { Transaction } from "@/lib/data";

export default function DanaDaruratPage() {
  const { transactions, addTransaction, removeTransaction } = useData();
  const danaDarurat = useMemo(() => transactions.filter((t) => t.category === "Dana Darurat"), [transactions]);

  const totalMasuk = useMemo(() => danaDarurat.filter(t => t.type === "penjualan").reduce((s, t) => s + t.amount, 0), [danaDarurat]);
  const totalKeluar = useMemo(() => danaDarurat.filter(t => t.type === "pengeluaran").reduce((s, t) => s + t.amount, 0), [danaDarurat]);
  const saldo = totalMasuk - totalKeluar;

  const [addOpen, setAddOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [tipe, setTipe] = useState<"masuk" | "keluar">("masuk");

  const save = () => {
    if (!desc || !amount) return;
    const tx: Transaction = {
      id: `T${Date.now()}`,
      date,
      type: tipe === "masuk" ? "penjualan" : "pengeluaran",
      description: desc,
      amount: Number(amount),
      category: "Dana Darurat",
    };
    addTransaction(tx);
    setDesc(""); setAmount("");
    setAddOpen(false);
    toast({ title: `Dana darurat ${tipe === "masuk" ? "ditambah" : "digunakan"} — ${formatCurrency(Number(amount))}` });
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dana Darurat</h2>
          <p className="text-sm text-muted-foreground mt-1">Kelola cadangan dana untuk kebutuhan mendesak</p>
        </div>
        <Button className="gap-2" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4" />Tambah</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Masuk</p>
          <p className="text-lg font-bold text-success">{formatCurrency(totalMasuk)}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Keluar</p>
          <p className="text-lg font-bold text-destructive">{formatCurrency(totalKeluar)}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Saldo Dana Darurat</p>
          <p className="text-lg font-bold text-foreground">{formatCurrency(saldo)}</p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="glass-card rounded-xl divide-y divide-border">
        {danaDarurat.map((tx) => (
          <div key={tx.id} className="flex items-center gap-4 p-4 group">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tx.type === "penjualan" ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}`}>
              {tx.type === "penjualan" ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{tx.description}</p>
              <p className="text-xs text-muted-foreground">{tx.date}</p>
            </div>
            <span className={`text-sm font-bold ${tx.type === "penjualan" ? "text-success" : "text-destructive"}`}>
              {tx.type === "penjualan" ? "+" : "-"}{formatCurrency(tx.amount)}
            </span>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { removeTransaction(tx.id); toast({ title: "Dihapus" }); }}>
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </Button>
          </div>
        ))}
        {!danaDarurat.length && <div className="p-8 text-center text-muted-foreground text-sm">Belum ada dana darurat.</div>}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Tambah Dana Darurat</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div><Label>Tanggal</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div><Label>Tipe</Label>
              <Select value={tipe} onValueChange={(v) => setTipe(v as "masuk" | "keluar")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="masuk">Masuk (Simpan Dana)</SelectItem>
                  <SelectItem value="keluar">Keluar (Gunakan Dana)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Deskripsi</Label><Input placeholder="Contoh: Cadangan bulan ini" value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
            <div><Label>Jumlah (Rp)</Label><Input type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
            <Button onClick={save} className="w-full" disabled={!desc || !amount}>Simpan</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
