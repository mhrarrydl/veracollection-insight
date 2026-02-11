import { createContext, useContext, useState, useMemo, useEffect, useCallback, type ReactNode } from "react";
import {
  type Transaction,
  type Product,
  type Category,
  type Supplier,
  type Account,
  type MonthlySummary,
  type YearlySummary,
  type TransactionItem,
  formatCurrency,
  monthlySummaries as staticMonthlySummaries,
} from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";

interface DataContextType {
  loading: boolean;
  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  // Products
  products: Product[];
  addProduct: (p: Product) => Promise<void>;
  updateProduct: (p: Product) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  // Categories
  categories: Category[];
  addCategory: (c: Category) => Promise<void>;
  updateCategory: (c: Category) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  // Suppliers
  suppliers: Supplier[];
  addSupplier: (s: Supplier) => Promise<void>;
  updateSupplier: (s: Supplier) => Promise<void>;
  removeSupplier: (id: string) => Promise<void>;
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  // Accounts
  accounts: Account[];
  addAccount: (a: Account) => Promise<void>;
  updateAccount: (a: Account) => Promise<void>;
  removeAccount: (id: string) => Promise<void>;
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  // Yearly
  yearlySummaries: YearlySummary[];
  addYearlySummary: (ys: YearlySummary) => Promise<void>;
  removeYearlySummary: (year: string) => Promise<void>;
  updateYearlySummary: (ys: YearlySummary) => Promise<void>;
  // Computed
  monthlySummaries: MonthlySummary[];
  currentMonth: MonthlySummary;
  prevMonth: MonthlySummary;
}

const DataContext = createContext<DataContextType | null>(null);

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

const defaultSummary: MonthlySummary = { month: "", penjualan: 0, pembelian: 0, pengeluaran: 0, laba: 0 };

export function DataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [yearlySummaries, setYearlySummaries] = useState<YearlySummary[]>([]);

  // Load all data from database on mount
  useEffect(() => {
    async function loadAll() {
      const [txRes, prodRes, catRes, supRes, accRes, yrRes] = await Promise.all([
        supabase.from("transactions").select("*").order("created_at", { ascending: false }),
        supabase.from("products").select("*"),
        supabase.from("categories").select("*"),
        supabase.from("suppliers").select("*"),
        supabase.from("accounts").select("*"),
        supabase.from("yearly_summaries").select("*").order("year"),
      ]);

      if (txRes.data) setTransactions(txRes.data.map((r: any) => ({
        id: r.id, date: r.date, type: r.type as Transaction["type"],
        description: r.description, items: r.items as TransactionItem[] | undefined,
        amount: Number(r.amount), category: r.category,
      })));
      if (prodRes.data) setProducts(prodRes.data.map((r: any) => ({
        id: r.id, name: r.name, category: r.category, price: Number(r.price), stock: Number(r.stock), supplier: r.supplier,
      })));
      if (catRes.data) setCategories(catRes.data.map((r: any) => ({ id: r.id, name: r.name, description: r.description })));
      if (supRes.data) setSuppliers(supRes.data.map((r: any) => ({ id: r.id, name: r.name, contact: r.contact, address: r.address })));
      if (accRes.data) setAccounts(accRes.data.map((r: any) => ({ id: r.id, name: r.name, type: r.type, balance: Number(r.balance) })));
      if (yrRes.data) setYearlySummaries(yrRes.data.map((r: any) => ({
        year: r.year, penjualan: Number(r.penjualan), pembelian: Number(r.pembelian),
        pengeluaran: Number(r.pengeluaran), laba: Number(r.laba),
      })));

      setLoading(false);
    }
    loadAll();
  }, []);

  // === TRANSACTIONS ===
  const addTransaction = useCallback(async (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);

    // Update account balances locally + DB
    const accountUpdates: { name: string; delta: number }[] = [];
    if (tx.type === "penjualan") {
      accountUpdates.push({ name: "Kas", delta: tx.amount }, { name: "Pendapatan Penjualan", delta: tx.amount });
    } else if (tx.type === "pembelian") {
      accountUpdates.push({ name: "Kas", delta: -tx.amount }, { name: "Persediaan Barang", delta: tx.amount });
    } else if (tx.type === "pengeluaran") {
      accountUpdates.push({ name: "Kas", delta: -tx.amount });
    }

    setAccounts((prev) => prev.map((acc) => {
      const upd = accountUpdates.find((u) => u.name === acc.name);
      return upd ? { ...acc, balance: acc.balance + upd.delta } : acc;
    }));

    // Update product stock
    if (tx.items) {
      setProducts((prev) => prev.map((p) => {
        const item = tx.items?.find((i) => i.product === p.name);
        if (!item) return p;
        const newStock = tx.type === "penjualan" ? Math.max(0, p.stock - item.qty) : tx.type === "pembelian" ? p.stock + item.qty : p.stock;
        return { ...p, stock: newStock };
      }));
    }

    // Persist to DB
    await supabase.from("transactions").insert({
      id: tx.id, date: tx.date, type: tx.type, description: tx.description,
      items: tx.items as any, amount: tx.amount, category: tx.category,
    });

    // Persist account balance updates
    for (const upd of accountUpdates) {
      const acc = accounts.find((a) => a.name === upd.name);
      if (acc) {
        await supabase.from("accounts").update({ balance: acc.balance + upd.delta }).eq("id", acc.id);
      }
    }

    // Persist product stock updates
    if (tx.items) {
      for (const item of tx.items) {
        const prod = products.find((p) => p.name === item.product);
        if (prod) {
          const newStock = tx.type === "penjualan" ? Math.max(0, prod.stock - item.qty) : tx.type === "pembelian" ? prod.stock + item.qty : prod.stock;
          await supabase.from("products").update({ stock: newStock }).eq("id", prod.id);
        }
      }
    }
  }, [accounts, products]);

  const removeTransaction = useCallback(async (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (tx) {
      const accountUpdates: { name: string; delta: number }[] = [];
      if (tx.type === "penjualan") {
        accountUpdates.push({ name: "Kas", delta: -tx.amount }, { name: "Pendapatan Penjualan", delta: -tx.amount });
      } else if (tx.type === "pembelian") {
        accountUpdates.push({ name: "Kas", delta: tx.amount }, { name: "Persediaan Barang", delta: -tx.amount });
      } else if (tx.type === "pengeluaran") {
        accountUpdates.push({ name: "Kas", delta: tx.amount });
      }

      setAccounts((prev) => prev.map((acc) => {
        const upd = accountUpdates.find((u) => u.name === acc.name);
        return upd ? { ...acc, balance: acc.balance + upd.delta } : acc;
      }));

      if (tx.items) {
        setProducts((prev) => prev.map((p) => {
          const item = tx.items?.find((i) => i.product === p.name);
          if (!item) return p;
          const newStock = tx.type === "penjualan" ? p.stock + item.qty : tx.type === "pembelian" ? Math.max(0, p.stock - item.qty) : p.stock;
          return { ...p, stock: newStock };
        }));
      }

      // Persist reversals to DB
      for (const upd of accountUpdates) {
        const acc = accounts.find((a) => a.name === upd.name);
        if (acc) await supabase.from("accounts").update({ balance: acc.balance + upd.delta }).eq("id", acc.id);
      }
      if (tx.items) {
        for (const item of tx.items) {
          const prod = products.find((p) => p.name === item.product);
          if (prod) {
            const newStock = tx.type === "penjualan" ? prod.stock + item.qty : tx.type === "pembelian" ? Math.max(0, prod.stock - item.qty) : prod.stock;
            await supabase.from("products").update({ stock: newStock }).eq("id", prod.id);
          }
        }
      }
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    await supabase.from("transactions").delete().eq("id", id);
  }, [transactions, accounts, products]);

  // === PRODUCTS ===
  const addProduct = useCallback(async (p: Product) => {
    setProducts((prev) => [...prev, p]);
    await supabase.from("products").insert({ id: p.id, name: p.name, category: p.category, price: p.price, stock: p.stock, supplier: p.supplier });
  }, []);

  const updateProduct = useCallback(async (p: Product) => {
    setProducts((prev) => prev.map((x) => x.id === p.id ? p : x));
    await supabase.from("products").update({ name: p.name, category: p.category, price: p.price, stock: p.stock, supplier: p.supplier }).eq("id", p.id);
  }, []);

  const removeProduct = useCallback(async (id: string) => {
    setProducts((prev) => prev.filter((x) => x.id !== id));
    await supabase.from("products").delete().eq("id", id);
  }, []);

  // === CATEGORIES ===
  const addCategory = useCallback(async (c: Category) => {
    setCategories((prev) => [...prev, c]);
    await supabase.from("categories").insert({ id: c.id, name: c.name, description: c.description });
  }, []);

  const updateCategory = useCallback(async (c: Category) => {
    setCategories((prev) => prev.map((x) => x.id === c.id ? c : x));
    await supabase.from("categories").update({ name: c.name, description: c.description }).eq("id", c.id);
  }, []);

  const removeCategory = useCallback(async (id: string) => {
    setCategories((prev) => prev.filter((x) => x.id !== id));
    await supabase.from("categories").delete().eq("id", id);
  }, []);

  // === SUPPLIERS ===
  const addSupplier = useCallback(async (s: Supplier) => {
    setSuppliers((prev) => [...prev, s]);
    await supabase.from("suppliers").insert({ id: s.id, name: s.name, contact: s.contact, address: s.address });
  }, []);

  const updateSupplier = useCallback(async (s: Supplier) => {
    setSuppliers((prev) => prev.map((x) => x.id === s.id ? s : x));
    await supabase.from("suppliers").update({ name: s.name, contact: s.contact, address: s.address }).eq("id", s.id);
  }, []);

  const removeSupplier = useCallback(async (id: string) => {
    setSuppliers((prev) => prev.filter((x) => x.id !== id));
    await supabase.from("suppliers").delete().eq("id", id);
  }, []);

  // === ACCOUNTS ===
  const addAccount = useCallback(async (a: Account) => {
    setAccounts((prev) => [...prev, a]);
    await supabase.from("accounts").insert({ id: a.id, name: a.name, type: a.type, balance: a.balance });
  }, []);

  const updateAccount = useCallback(async (a: Account) => {
    setAccounts((prev) => prev.map((x) => x.id === a.id ? a : x));
    await supabase.from("accounts").update({ name: a.name, type: a.type, balance: a.balance }).eq("id", a.id);
  }, []);

  const removeAccount = useCallback(async (id: string) => {
    setAccounts((prev) => prev.filter((x) => x.id !== id));
    await supabase.from("accounts").delete().eq("id", id);
  }, []);

  // === YEARLY SUMMARIES ===
  const addYearlySummary = useCallback(async (ys: YearlySummary) => {
    setYearlySummaries((prev) => [...prev, ys].sort((a, b) => a.year.localeCompare(b.year)));
    await supabase.from("yearly_summaries").insert({ year: ys.year, penjualan: ys.penjualan, pembelian: ys.pembelian, pengeluaran: ys.pengeluaran, laba: ys.laba });
  }, []);

  const removeYearlySummary = useCallback(async (year: string) => {
    setYearlySummaries((prev) => prev.filter((y) => y.year !== year));
    await supabase.from("yearly_summaries").delete().eq("year", year);
  }, []);

  const updateYearlySummary = useCallback(async (ys: YearlySummary) => {
    setYearlySummaries((prev) => prev.map((y) => y.year === ys.year ? ys : y));
    await supabase.from("yearly_summaries").update({ penjualan: ys.penjualan, pembelian: ys.pembelian, pengeluaran: ys.pengeluaran, laba: ys.laba }).eq("year", ys.year);
  }, []);

  // Compute monthly summaries from transactions
  const monthlySummaries = useMemo(() => {
    const summaryMap = new Map<string, MonthlySummary>();

    // Build purely from actual transactions in database
    transactions.forEach((tx) => {
      const monthKey = format(parseISO(tx.date), "MMM yyyy");
      if (!summaryMap.has(monthKey)) {
        summaryMap.set(monthKey, { month: monthKey, penjualan: 0, pembelian: 0, pengeluaran: 0, laba: 0 });
      }
      const entry = summaryMap.get(monthKey)!;
      if (tx.type === "penjualan") entry.penjualan += tx.amount;
      if (tx.type === "pembelian") entry.pembelian += tx.amount;
      if (tx.type === "pengeluaran") entry.pengeluaran += tx.amount;
      entry.laba = entry.penjualan - entry.pembelian - entry.pengeluaran;
    });

    return Array.from(summaryMap.values());
  }, [transactions]);

  const currentMonth = monthlySummaries[monthlySummaries.length - 1] || defaultSummary;
  const prevMonth = monthlySummaries[monthlySummaries.length - 2] || currentMonth;

  return (
    <DataContext.Provider
      value={{
        loading,
        transactions, addTransaction, removeTransaction,
        products, addProduct, updateProduct, removeProduct, setProducts,
        categories, addCategory, updateCategory, removeCategory, setCategories,
        suppliers, addSupplier, updateSupplier, removeSupplier, setSuppliers,
        accounts, addAccount, updateAccount, removeAccount, setAccounts,
        yearlySummaries, addYearlySummary, removeYearlySummary, updateYearlySummary,
        monthlySummaries, currentMonth, prevMonth,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
