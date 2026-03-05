import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { useData } from "@/context/DataContext";
import { formatCurrency, type Transaction } from "@/lib/data";
import { Plus, MinusCircle, Search, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { format, parseISO, isToday } from "date-fns";

export default function PengeluaranHarianPage() {
  const { transactions, addTransaction, removeTransaction } = useData();

  // Filter only daily expenses
  const pengeluaranHarian = useMemo(
    () => transactions.filter((t) => t.type === "pengeluaran" && t.category === "Harian"),
    [transactions]
  );

  // Today's expenses
  const todayExpenses = useMemo(
    () => pengeluaranHarian.filter((t) => isToday(parseISO(t.date))),
    [pengeluaranHarian]
  );
  const todayTotal = useMemo(() => todayExpenses.reduce((s, t) => s + t.amount, 0), [todayExpenses]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    pengeluaranHarian.forEach((tx) => {
      const key = tx.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(tx);
    });
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [pengeluaranHarian]);

  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  const save = () => {
    if (!desc || !amount) return;
    const tx: Transaction = {
      id: `T${Date.now()}`,
      date,
      type: "pengeluaran",
      description: desc,
      amount: Number(amount),
      category: "Harian",
    };
    addTransaction(tx);
    setDesc(""); setAmount("");
    setAddOpen(false);
    toast({ title: `Pengeluaran harian dicatat — ${formatCurrency(Number(amount))}` });
  };

  const filteredGroups = groupedByDate
    .map(([date, txs]) => [date, txs.filter(tx => !search || tx.description.toLowerCase().includes(search.toLowerCase()))] as [string, Transaction[]])
    .filter(([, txs]) => txs.length > 0);

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Pengeluaran Harian</h2>
          <p className="text-sm text-muted-foreground mt-1">Catat pengeluaran harian seperti gaji harian, makan, transport</p>
        </div>
        <Button className="gap-2" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4" />Tambah</Button>
      </div>

      {/* Today's summary */}
      <div className="glass-card rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total Hari Ini</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(todayTotal)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{todayExpenses.length} transaksi</p>
            <p className="text-sm text-muted-foreground">{format(new Date(), "dd MMMM yyyy")}</p>
          </div>
        </div>
      </div>

      <div className="relative max-w-xs mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Cari pengeluaran harian..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Grouped by date */}
      <div className="space-y-4">
        {filteredGroups.map(([dateKey, txs]) => {
          const dayTotal = txs.reduce((s, t) => s + t.amount, 0);
          return (
            <div key={dateKey} className="glass-card rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
                <span className="text-sm font-medium text-foreground">{dateKey}</span>
                <span className="text-sm font-bold text-foreground">{formatCurrency(dayTotal)}</span>
              </div>
              <div className="divide-y divide-border">
                {txs.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-4 p-4 group">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-destructive bg-destructive/10">
                      <MinusCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{tx.description}</p>
                    </div>
                    <span className="text-sm font-bold text-foreground">-{formatCurrency(tx.amount)}</span>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { removeTransaction(tx.id); toast({ title: "Dihapus" }); }}>
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {!filteredGroups.length && (
          <div className="glass-card rounded-xl p-8 text-center text-muted-foreground text-sm">Belum ada pengeluaran harian.</div>
        )}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Tambah Pengeluaran Harian</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div><Label>Tanggal</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div><Label>Deskripsi</Label><Input placeholder="Contoh: Gaji harian karyawan" value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
            <div><Label>Jumlah (Rp)</Label><Input type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
            <Button onClick={save} className="w-full" disabled={!desc || !amount}>Simpan</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
