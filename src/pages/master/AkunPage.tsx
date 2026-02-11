import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { accounts as initialAccounts, formatCurrency, type Account } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AkunPage() {
  const [list, setList] = useState<Account[]>(initialAccounts);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Account | null>(null);
  const [form, setForm] = useState({ name: "", type: "aset", balance: "0" });

  const openAdd = () => { setEdit(null); setForm({ name: "", type: "aset", balance: "0" }); setOpen(true); };
  const openEdit = (a: Account) => { setEdit(a); setForm({ name: a.name, type: a.type, balance: String(a.balance) }); setOpen(true); };
  const save = () => {
    if (edit) { setList((prev) => prev.map((a) => a.id === edit.id ? { ...a, name: form.name, type: form.type, balance: Number(form.balance) } : a)); toast({ title: "Akun diperbarui" }); }
    else { setList((prev) => [...prev, { id: `A${String(prev.length + 1).padStart(3, "0")}`, name: form.name, type: form.type, balance: Number(form.balance) }]); toast({ title: "Akun ditambahkan" }); }
    setOpen(false);
  };
  const remove = (id: string) => { setList((prev) => prev.filter((a) => a.id !== id)); toast({ title: "Akun dihapus" }); };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-foreground">Akun Keuangan</h2><p className="text-sm text-muted-foreground mt-1">Kelola akun keuangan (kas, modal, beban, dll.)</p></div>
        <Button className="gap-2" onClick={openAdd}><Plus className="w-4 h-4" />Tambah Akun</Button>
      </div>
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/50 border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">ID</th>
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Nama Akun</th>
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Tipe</th>
            <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Saldo</th>
            <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Aksi</th>
          </tr></thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{a.id}</td>
                <td className="py-3 px-4 font-medium text-foreground">{a.name}</td>
                <td className="py-3 px-4 capitalize text-muted-foreground">{a.type}</td>
                <td className="py-3 px-4 text-right font-semibold text-foreground">{formatCurrency(a.balance)}</td>
                <td className="py-3 px-4"><div className="flex items-center justify-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(a)}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(a.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{edit ? "Edit Akun" : "Tambah Akun"}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div><Label>Nama Akun</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Tipe</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="aset">Aset</SelectItem><SelectItem value="ekuitas">Ekuitas</SelectItem>
                  <SelectItem value="beban">Beban</SelectItem><SelectItem value="pendapatan">Pendapatan</SelectItem>
                  <SelectItem value="kewajiban">Kewajiban</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Saldo Awal (Rp)</Label><Input type="number" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} /></div>
            <Button onClick={save} className="w-full" disabled={!form.name}>Simpan</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
