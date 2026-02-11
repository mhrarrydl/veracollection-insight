import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  products as initialProducts,
  suppliers as initialSuppliers,
  accounts as initialAccounts,
  categories as initialCategories,
  formatCurrency,
  type Product,
  type Supplier,
  type Account,
  type Category,
} from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Truck, Wallet, Tags, Plus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function MasterData() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [supplierList, setSupplierList] = useState<Supplier[]>(initialSuppliers);
  const [accountList, setAccountList] = useState<Account[]>(initialAccounts);
  const [categoryList, setCategoryList] = useState<Category[]>(initialCategories);

  // Product CRUD
  const [prodOpen, setProdOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState({ name: "", category: "", price: "", stock: "", supplier: "" });

  const openAddProduct = () => {
    setEditProduct(null);
    setProdForm({ name: "", category: categoryList[0]?.name || "", price: "", stock: "", supplier: "" });
    setProdOpen(true);
  };
  const openEditProduct = (p: Product) => {
    setEditProduct(p);
    setProdForm({ name: p.name, category: p.category, price: String(p.price), stock: String(p.stock), supplier: p.supplier });
    setProdOpen(true);
  };
  const saveProduct = () => {
    if (editProduct) {
      setProductList((prev) => prev.map((p) => p.id === editProduct.id ? { ...p, ...prodForm, price: Number(prodForm.price), stock: Number(prodForm.stock) } : p));
      toast({ title: "Produk diperbarui" });
    } else {
      const newP: Product = { id: `P${String(productList.length + 1).padStart(3, "0")}`, name: prodForm.name, category: prodForm.category, price: Number(prodForm.price), stock: Number(prodForm.stock), supplier: prodForm.supplier };
      setProductList((prev) => [...prev, newP]);
      toast({ title: "Produk ditambahkan" });
    }
    setProdOpen(false);
  };
  const deleteProduct = (id: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Produk dihapus" });
  };

  // Supplier CRUD
  const [supOpen, setSupOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [supForm, setSupForm] = useState({ name: "", contact: "", address: "" });

  const openAddSupplier = () => { setEditSupplier(null); setSupForm({ name: "", contact: "", address: "" }); setSupOpen(true); };
  const openEditSupplier = (s: Supplier) => { setEditSupplier(s); setSupForm({ name: s.name, contact: s.contact, address: s.address }); setSupOpen(true); };
  const saveSupplier = () => {
    if (editSupplier) {
      setSupplierList((prev) => prev.map((s) => s.id === editSupplier.id ? { ...s, ...supForm } : s));
      toast({ title: "Supplier diperbarui" });
    } else {
      setSupplierList((prev) => [...prev, { id: `S${String(prev.length + 1).padStart(3, "0")}`, ...supForm }]);
      toast({ title: "Supplier ditambahkan" });
    }
    setSupOpen(false);
  };
  const deleteSupplier = (id: string) => { setSupplierList((prev) => prev.filter((s) => s.id !== id)); toast({ title: "Supplier dihapus" }); };

  // Account CRUD
  const [accOpen, setAccOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [accForm, setAccForm] = useState({ name: "", type: "aset", balance: "0" });

  const openAddAccount = () => { setEditAccount(null); setAccForm({ name: "", type: "aset", balance: "0" }); setAccOpen(true); };
  const openEditAccount = (a: Account) => { setEditAccount(a); setAccForm({ name: a.name, type: a.type, balance: String(a.balance) }); setAccOpen(true); };
  const saveAccount = () => {
    if (editAccount) {
      setAccountList((prev) => prev.map((a) => a.id === editAccount.id ? { ...a, name: accForm.name, type: accForm.type, balance: Number(accForm.balance) } : a));
      toast({ title: "Akun diperbarui" });
    } else {
      setAccountList((prev) => [...prev, { id: `A${String(prev.length + 1).padStart(3, "0")}`, name: accForm.name, type: accForm.type, balance: Number(accForm.balance) }]);
      toast({ title: "Akun ditambahkan" });
    }
    setAccOpen(false);
  };
  const deleteAccount = (id: string) => { setAccountList((prev) => prev.filter((a) => a.id !== id)); toast({ title: "Akun dihapus" }); };

  // Category CRUD
  const [catOpen, setCatOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({ name: "", description: "" });

  const openAddCategory = () => { setEditCategory(null); setCatForm({ name: "", description: "" }); setCatOpen(true); };
  const openEditCategory = (c: Category) => { setEditCategory(c); setCatForm({ name: c.name, description: c.description }); setCatOpen(true); };
  const saveCategory = () => {
    if (editCategory) {
      setCategoryList((prev) => prev.map((c) => c.id === editCategory.id ? { ...c, ...catForm } : c));
      toast({ title: "Kategori diperbarui" });
    } else {
      setCategoryList((prev) => [...prev, { id: `C${String(prev.length + 1).padStart(3, "0")}`, ...catForm }]);
      toast({ title: "Kategori ditambahkan" });
    }
    setCatOpen(false);
  };
  const deleteCategory = (id: string) => { setCategoryList((prev) => prev.filter((c) => c.id !== id)); toast({ title: "Kategori dihapus" }); };

  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Master Data</h2>
        <p className="text-sm text-muted-foreground mt-1">Kelola data dasar produk, supplier, kategori, dan akun keuangan</p>
      </div>

      <Tabs defaultValue="produk">
        <TabsList className="mb-4">
          <TabsTrigger value="produk" className="gap-2"><Package className="w-4 h-4" />Produk</TabsTrigger>
          <TabsTrigger value="kategori" className="gap-2"><Tags className="w-4 h-4" />Kategori</TabsTrigger>
          <TabsTrigger value="supplier" className="gap-2"><Truck className="w-4 h-4" />Supplier</TabsTrigger>
          <TabsTrigger value="akun" className="gap-2"><Wallet className="w-4 h-4" />Akun</TabsTrigger>
        </TabsList>

        {/* ─── PRODUK ─── */}
        <TabsContent value="produk">
          <div className="flex justify-end mb-3">
            <Button size="sm" className="gap-2" onClick={openAddProduct}><Plus className="w-4 h-4" />Tambah Produk</Button>
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
                {productList.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{p.id}</td>
                    <td className="py-3 px-4 font-medium text-foreground">{p.name}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">{p.category}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-foreground">{formatCurrency(p.price)}</td>
                    <td className="py-3 px-4 text-right text-foreground">{p.stock}</td>
                    <td className="py-3 px-4 text-muted-foreground">{p.supplier}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditProduct(p)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteProduct(p.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Dialog open={prodOpen} onOpenChange={setProdOpen}>
            <DialogContent>
              <DialogHeader><DialogTitle>{editProduct ? "Edit Produk" : "Tambah Produk"}</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div><Label>Nama Produk</Label><Input value={prodForm.name} onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })} /></div>
                <div>
                  <Label>Kategori</Label>
                  <Select value={prodForm.category} onValueChange={(v) => setProdForm({ ...prodForm, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                    <SelectContent>
                      {categoryList.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Harga (Rp)</Label><Input type="number" value={prodForm.price} onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })} /></div>
                  <div><Label>Stok</Label><Input type="number" value={prodForm.stock} onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })} /></div>
                </div>
                <div>
                  <Label>Supplier</Label>
                  <Select value={prodForm.supplier} onValueChange={(v) => setProdForm({ ...prodForm, supplier: v })}>
                    <SelectTrigger><SelectValue placeholder="Pilih Supplier" /></SelectTrigger>
                    <SelectContent>
                      {supplierList.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                      <SelectItem value="Produksi Sendiri">Produksi Sendiri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={saveProduct} className="w-full" disabled={!prodForm.name || !prodForm.price}>Simpan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ─── KATEGORI ─── */}
        <TabsContent value="kategori">
          <div className="flex justify-end mb-3">
            <Button size="sm" className="gap-2" onClick={openAddCategory}><Plus className="w-4 h-4" />Tambah Kategori</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categoryList.map((c) => (
              <div key={c.id} className="glass-card rounded-xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs text-muted-foreground font-mono">{c.id}</span>
                    <h4 className="text-sm font-bold text-foreground">{c.name}</h4>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEditCategory(c)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteCategory(c.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{c.description}</p>
                <p className="text-xs text-primary mt-2 font-medium">{productList.filter((p) => p.category === c.name).length} produk</p>
              </div>
            ))}
          </div>
          <Dialog open={catOpen} onOpenChange={setCatOpen}>
            <DialogContent>
              <DialogHeader><DialogTitle>{editCategory ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div><Label>Nama Kategori</Label><Input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} /></div>
                <div><Label>Deskripsi</Label><Input value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} /></div>
                <Button onClick={saveCategory} className="w-full" disabled={!catForm.name}>Simpan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ─── SUPPLIER ─── */}
        <TabsContent value="supplier">
          <div className="flex justify-end mb-3">
            <Button size="sm" className="gap-2" onClick={openAddSupplier}><Plus className="w-4 h-4" />Tambah Supplier</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supplierList.map((s) => (
              <div key={s.id} className="glass-card rounded-xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs text-muted-foreground font-mono">{s.id}</span>
                    <h4 className="text-sm font-bold text-foreground">{s.name}</h4>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEditSupplier(s)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteSupplier(s.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">📞 {s.contact}</p>
                <p className="text-xs text-muted-foreground">📍 {s.address}</p>
              </div>
            ))}
          </div>
          <Dialog open={supOpen} onOpenChange={setSupOpen}>
            <DialogContent>
              <DialogHeader><DialogTitle>{editSupplier ? "Edit Supplier" : "Tambah Supplier"}</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div><Label>Nama Supplier</Label><Input value={supForm.name} onChange={(e) => setSupForm({ ...supForm, name: e.target.value })} /></div>
                <div><Label>Kontak</Label><Input value={supForm.contact} onChange={(e) => setSupForm({ ...supForm, contact: e.target.value })} /></div>
                <div><Label>Alamat</Label><Input value={supForm.address} onChange={(e) => setSupForm({ ...supForm, address: e.target.value })} /></div>
                <Button onClick={saveSupplier} className="w-full" disabled={!supForm.name}>Simpan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ─── AKUN ─── */}
        <TabsContent value="akun">
          <div className="flex justify-end mb-3">
            <Button size="sm" className="gap-2" onClick={openAddAccount}><Plus className="w-4 h-4" />Tambah Akun</Button>
          </div>
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Nama Akun</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Tipe</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Saldo</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {accountList.map((a) => (
                  <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{a.id}</td>
                    <td className="py-3 px-4 font-medium text-foreground">{a.name}</td>
                    <td className="py-3 px-4 capitalize text-muted-foreground">{a.type}</td>
                    <td className="py-3 px-4 text-right font-semibold text-foreground">{formatCurrency(a.balance)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditAccount(a)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteAccount(a.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Dialog open={accOpen} onOpenChange={setAccOpen}>
            <DialogContent>
              <DialogHeader><DialogTitle>{editAccount ? "Edit Akun" : "Tambah Akun"}</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div><Label>Nama Akun</Label><Input value={accForm.name} onChange={(e) => setAccForm({ ...accForm, name: e.target.value })} /></div>
                <div>
                  <Label>Tipe</Label>
                  <Select value={accForm.type} onValueChange={(v) => setAccForm({ ...accForm, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aset">Aset</SelectItem>
                      <SelectItem value="ekuitas">Ekuitas</SelectItem>
                      <SelectItem value="beban">Beban</SelectItem>
                      <SelectItem value="pendapatan">Pendapatan</SelectItem>
                      <SelectItem value="kewajiban">Kewajiban</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Saldo Awal (Rp)</Label><Input type="number" value={accForm.balance} onChange={(e) => setAccForm({ ...accForm, balance: e.target.value })} /></div>
                <Button onClick={saveAccount} className="w-full" disabled={!accForm.name}>Simpan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
