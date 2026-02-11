import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { categories as initialCategories, products, type Category } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function KategoriPage() {
  const [list, setList] = useState<Category[]>(initialCategories);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const openAdd = () => { setEdit(null); setForm({ name: "", description: "" }); setOpen(true); };
  const openEdit = (c: Category) => { setEdit(c); setForm({ name: c.name, description: c.description }); setOpen(true); };
  const save = () => {
    if (edit) { setList((prev) => prev.map((c) => c.id === edit.id ? { ...c, ...form } : c)); toast({ title: "Kategori diperbarui" }); }
    else { setList((prev) => [...prev, { id: `C${String(prev.length + 1).padStart(3, "0")}`, ...form }]); toast({ title: "Kategori ditambahkan" }); }
    setOpen(false);
  };
  const remove = (id: string) => { setList((prev) => prev.filter((c) => c.id !== id)); toast({ title: "Kategori dihapus" }); };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-foreground">Kategori Produk</h2><p className="text-sm text-muted-foreground mt-1">Kelola kategori produk</p></div>
        <Button className="gap-2" onClick={openAdd}><Plus className="w-4 h-4" />Tambah Kategori</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {list.map((c) => (
          <div key={c.id} className="glass-card rounded-xl p-5">
            <div className="flex items-start justify-between mb-2">
              <div><span className="text-xs text-muted-foreground font-mono">{c.id}</span><h4 className="text-sm font-bold text-foreground">{c.name}</h4></div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(c)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="sm" onClick={() => remove(c.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{c.description}</p>
            <p className="text-xs text-primary mt-2 font-medium">{products.filter((p) => p.category === c.name).length} produk</p>
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{edit ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div><Label>Nama</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Deskripsi</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <Button onClick={save} className="w-full" disabled={!form.name}>Simpan</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
