import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { transactions, formatCurrency, type Transaction } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Plus, ArrowUpRight, ArrowDownLeft, MinusCircle, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const typeConfig = {
  penjualan: { icon: ArrowUpRight, label: "Penjualan", className: "text-success bg-success/10" },
  pembelian: { icon: ArrowDownLeft, label: "Pembelian", className: "text-info bg-info/10" },
  pengeluaran: { icon: MinusCircle, label: "Pengeluaran", className: "text-destructive bg-destructive/10" },
};

export default function Transactions() {
  const [filter, setFilter] = useState<string>("semua");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(transactions);

  const [newTx, setNewTx] = useState({
    type: "penjualan" as Transaction["type"],
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const filtered = allTransactions.filter((tx) => {
    if (filter !== "semua" && tx.type !== filter) return false;
    if (search && !tx.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAdd = () => {
    const tx: Transaction = {
      id: `T${String(allTransactions.length + 1).padStart(3, "0")}`,
      date: newTx.date,
      type: newTx.type,
      description: newTx.description,
      amount: Number(newTx.amount),
    };
    setAllTransactions([tx, ...allTransactions]);
    setNewTx({ type: "penjualan", description: "", amount: "", date: new Date().toISOString().split("T")[0] });
    setOpen(false);
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Transaksi</h2>
          <p className="text-sm text-muted-foreground mt-1">Kelola seluruh transaksi keuangan</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Tambah Transaksi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Transaksi Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Tipe</Label>
                <Select value={newTx.type} onValueChange={(v) => setNewTx({ ...newTx, type: v as Transaction["type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="penjualan">Penjualan</SelectItem>
                    <SelectItem value="pembelian">Pembelian</SelectItem>
                    <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tanggal</Label>
                <Input type="date" value={newTx.date} onChange={(e) => setNewTx({ ...newTx, date: e.target.value })} />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Input placeholder="Contoh: Penjualan Celana Chino" value={newTx.description} onChange={(e) => setNewTx({ ...newTx, description: e.target.value })} />
              </div>
              <div>
                <Label>Jumlah (Rp)</Label>
                <Input type="number" placeholder="0" value={newTx.amount} onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })} />
              </div>
              <Button onClick={handleAdd} className="w-full" disabled={!newTx.description || !newTx.amount}>
                Simpan Transaksi
              </Button>
            </div>
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
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
            {f}
          </Button>
        ))}
      </div>

      {/* Transaction list */}
      <div className="glass-card rounded-xl divide-y divide-border">
        {filtered.map((tx) => {
          const config = typeConfig[tx.type];
          return (
            <div key={tx.id} className="flex items-center gap-4 p-4">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", config.className)}>
                <config.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{tx.date} • {config.label}</p>
              </div>
              <span className={cn("text-sm font-bold", tx.type === "penjualan" ? "text-success" : "text-foreground")}>
                {tx.type === "penjualan" ? "+" : "-"}{formatCurrency(tx.amount)}
              </span>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm">Tidak ada transaksi ditemukan.</div>
        )}
      </div>
    </AppLayout>
  );
}
