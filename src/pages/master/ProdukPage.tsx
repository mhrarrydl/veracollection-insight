import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useData } from "@/context/DataContext";
import { formatCurrency, type Product } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ProdukPage() {
  const { products, addProduct, updateProduct, removeProduct, categories, suppliers } = useData();
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "", supplier: "" });

  const openAdd = () => { setEditProduct(null); setForm({ name: "", category: categories[0]?.name || "", price: "", stock: "", supplier: "" }); setOpen(true); };
  const openEdit = (p: Product) => { setEditProduct(p); setForm({ name: p.name, category: p.category, price: String(p.price), stock: String(p.stock), supplier: p.supplier }); setOpen(true); };
  const save = async () => {
    if (editProduct) {
      await updateProduct({ ...editProduct, ...form, price: Number(form.price), stock: Number(form.stock) });
      toast({ title: "Produk diperbarui" });
    } else {
      await addProduct({ id: `P${Date.now()}`, name: form.name, category: form.category, price: Number(form.price), stock: Number(form.stock), supplier: form.supplier });
      toast({ title: "Produk ditambahkan" });
    }
    setOpen(false);
  };
  const remove = async (id: string) => { await removeProduct(id); toast({ title: "Produk dihapus" }); };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Produk</h2>
          <p className="text-sm text-muted-foreground mt-1">Kelola data produk kain & celana</p>
        </div>
        <Button className="gap-2" onClick={openAdd}><Plus className="w-4 h-4" />Tambah Produk</Button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">ID</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Nama Produk</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Kategori</th>
              <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Harga</th>
              <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Stok</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Supplier</th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{p.id}</td>
                <td className="py-3 px-4 font-medium text-foreground">{p.name}</td>
                <td className="py-3 px-4"><span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">{p.category}</span></td>
                <td className="py-3 px-4 text-right text-foreground">{formatCurrency(p.price)}</td>
                <td className="py-3 px-4 text-right text-foreground">{p.stock}</td>
                <td className="py-3 px-4 text-muted-foreground">{p.supplier}</td>
                <td className="py-3 px-4"><div className="flex items-center justify-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(p)}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(p.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editProduct ? "Edit Produk" : "Tambah Produk"}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div><Label>Nama Produk</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Kategori</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Harga (Rp)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
              <div><Label>Stok</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
            </div>
            <div><Label>Supplier</Label>
              <Select value={form.supplier} onValueChange={(v) => setForm({ ...form, supplier: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih Supplier" /></SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                  <SelectItem value="Produksi Sendiri">Produksi Sendiri</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={save} className="w-full" disabled={!form.name || !form.price}>Simpan</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
