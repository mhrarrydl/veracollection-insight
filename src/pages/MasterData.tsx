import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { products, suppliers, accounts, formatCurrency } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Truck, Wallet } from "lucide-react";

export default function MasterData() {
  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Master Data</h2>
        <p className="text-sm text-muted-foreground mt-1">Kelola data dasar produk, supplier, dan akun</p>
      </div>

      <Tabs defaultValue="produk">
        <TabsList className="mb-4">
          <TabsTrigger value="produk" className="gap-2"><Package className="w-4 h-4" />Produk</TabsTrigger>
          <TabsTrigger value="supplier" className="gap-2"><Truck className="w-4 h-4" />Supplier</TabsTrigger>
          <TabsTrigger value="akun" className="gap-2"><Wallet className="w-4 h-4" />Akun</TabsTrigger>
        </TabsList>

        <TabsContent value="produk">
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
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{p.id}</td>
                    <td className="py-3 px-4 font-medium text-foreground">{p.name}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.category === "kain" ? "bg-info/10 text-info" : "bg-accent/20 text-accent-foreground"}`}>
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-foreground">{formatCurrency(p.price)}</td>
                    <td className="py-3 px-4 text-right text-foreground">{p.stock}</td>
                    <td className="py-3 px-4 text-muted-foreground">{p.supplier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="supplier">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suppliers.map((s) => (
              <div key={s.id} className="glass-card rounded-xl p-5">
                <h4 className="text-sm font-bold text-foreground mb-2">{s.name}</h4>
                <p className="text-xs text-muted-foreground">📞 {s.contact}</p>
                <p className="text-xs text-muted-foreground">📍 {s.address}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="akun">
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Nama Akun</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Tipe</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => (
                  <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{a.id}</td>
                    <td className="py-3 px-4 font-medium text-foreground">{a.name}</td>
                    <td className="py-3 px-4 capitalize text-muted-foreground">{a.type}</td>
                    <td className="py-3 px-4 text-right font-semibold text-foreground">{formatCurrency(a.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
