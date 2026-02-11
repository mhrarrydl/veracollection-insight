import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { suppliers as initialSuppliers, type Supplier } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function SupplierPage() {
  const [list, setList] = useState<Supplier[]>(initialSuppliers);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Supplier | null>(null);
  const [form, setForm] = useState({ name: "", contact: "", address: "" });

  const openAdd = () => { setEdit(null); setForm({ name: "", contact: "", address: "" }); setOpen(true); };
  const openEdit = (s: Supplier) => { setEdit(s); setForm({ name: s.name, contact: s.contact, address: s.address }); setOpen(true); };
  const save = () => {
    if (edit) { setList((prev) => prev.map((s) => s.id === edit.id ? { ...s, ...form } : s)); toast({ title: "Supplier diperbarui" }); }
    else { setList((prev) => [...prev, { id: `S${String(prev.length + 1).padStart(3, "0")}`, ...form }]); toast({ title: "Supplier ditambahkan" }); }
    setOpen(false);
  };
  const remove = (id: string) => { setList((prev) => prev.filter((s) => s.id !== id)); toast({ title: "Supplier dihapus" }); };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-foreground">Supplier</h2><p className="text-sm text-muted-foreground mt-1">Kelola data supplier</p></div>
        <Button className="gap-2" onClick={openAdd}><Plus className="w-4 h-4" />Tambah Supplier</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {list.map((s) => (
          <div key={s.id} className="glass-card rounded-xl p-5">
            <div className="flex items-start justify-between mb-2">
              <div><span className="text-xs text-muted-foreground font-mono">{s.id}</span><h4 className="text-sm font-bold text-foreground">{s.name}</h4></div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(s)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="sm" onClick={() => remove(s.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">📞 {s.contact}</p>
            <p className="text-xs text-muted-foreground">📍 {s.address}</p>
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{edit ? "Edit Supplier" : "Tambah Supplier"}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div><Label>Nama</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Kontak</Label><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
            <div><Label>Alamat</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <Button onClick={save} className="w-full" disabled={!form.name}>Simpan</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
