import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import {
  transactions as initialTransactions,
  products as initialProducts,
  categories as initialCategories,
  suppliers as initialSuppliers,
  accounts as initialAccounts,
  monthlySummaries as staticMonthlySummaries,
  yearlySummaries as initialYearlySummaries,
  type Transaction,
  type Product,
  type Category,
  type Supplier,
  type Account,
  type MonthlySummary,
  type YearlySummary,
  formatCurrency,
} from "@/lib/data";
import { format, parseISO, startOfMonth } from "date-fns";

interface DataContextType {
  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  removeTransaction: (id: string) => void;
  // Products
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  // Categories
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  // Suppliers
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  // Accounts
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  // Yearly
  yearlySummaries: YearlySummary[];
  addYearlySummary: (ys: YearlySummary) => void;
  removeYearlySummary: (year: string) => void;
  updateYearlySummary: (ys: YearlySummary) => void;
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

export function DataProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [yearlySummaries, setYearlySummaries] = useState<YearlySummary[]>(initialYearlySummaries);

  const addYearlySummary = (ys: YearlySummary) => {
    setYearlySummaries((prev) => [...prev, ys].sort((a, b) => a.year.localeCompare(b.year)));
  };
  const removeYearlySummary = (year: string) => {
    setYearlySummaries((prev) => prev.filter((y) => y.year !== year));
  };
  const updateYearlySummary = (ys: YearlySummary) => {
    setYearlySummaries((prev) => prev.map((y) => y.year === ys.year ? ys : y));
  };

  const addTransaction = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);

    // Update account balances
    setAccounts((prev) =>
      prev.map((acc) => {
        if (tx.type === "penjualan" && acc.name === "Kas") {
          return { ...acc, balance: acc.balance + tx.amount };
        }
        if (tx.type === "penjualan" && acc.name === "Pendapatan Penjualan") {
          return { ...acc, balance: acc.balance + tx.amount };
        }
        if (tx.type === "pembelian" && acc.name === "Kas") {
          return { ...acc, balance: acc.balance - tx.amount };
        }
        if (tx.type === "pembelian" && acc.name === "Persediaan Barang") {
          return { ...acc, balance: acc.balance + tx.amount };
        }
        if (tx.type === "pengeluaran" && acc.name === "Kas") {
          return { ...acc, balance: acc.balance - tx.amount };
        }
        return acc;
      })
    );

    // Update product stock
    if (tx.items) {
      setProducts((prev) =>
        prev.map((p) => {
          const item = tx.items?.find((i) => i.product === p.name);
          if (!item) return p;
          if (tx.type === "penjualan") return { ...p, stock: Math.max(0, p.stock - item.qty) };
          if (tx.type === "pembelian") return { ...p, stock: p.stock + item.qty };
          return p;
        })
      );
    }
  };

  const removeTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (tx) {
      // Reverse account effects
      setAccounts((prev) =>
        prev.map((acc) => {
          if (tx.type === "penjualan" && acc.name === "Kas") return { ...acc, balance: acc.balance - tx.amount };
          if (tx.type === "penjualan" && acc.name === "Pendapatan Penjualan") return { ...acc, balance: acc.balance - tx.amount };
          if (tx.type === "pembelian" && acc.name === "Kas") return { ...acc, balance: acc.balance + tx.amount };
          if (tx.type === "pembelian" && acc.name === "Persediaan Barang") return { ...acc, balance: acc.balance - tx.amount };
          if (tx.type === "pengeluaran" && acc.name === "Kas") return { ...acc, balance: acc.balance + tx.amount };
          return acc;
        })
      );
      // Reverse product stock
      if (tx.items) {
        setProducts((prev) =>
          prev.map((p) => {
            const item = tx.items?.find((i) => i.product === p.name);
            if (!item) return p;
            if (tx.type === "penjualan") return { ...p, stock: p.stock + item.qty };
            if (tx.type === "pembelian") return { ...p, stock: Math.max(0, p.stock - item.qty) };
            return p;
          })
        );
      }
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Compute monthly summaries dynamically from transactions + static base
  const monthlySummaries = useMemo(() => {
    // Start with static data as base
    const summaryMap = new Map<string, MonthlySummary>();
    staticMonthlySummaries.forEach((m) => summaryMap.set(m.month, { ...m }));

    // Add dynamic transactions on top
    transactions.forEach((tx) => {
      const monthKey = format(parseISO(tx.date), "MMM yyyy");
      if (!summaryMap.has(monthKey)) {
        summaryMap.set(monthKey, { month: monthKey, penjualan: 0, pembelian: 0, pengeluaran: 0, laba: 0 });
      }
      // Static data already includes initial transactions, so only add new ones
      // We check if it's a dynamic (newly added) transaction by ID pattern
      const entry = summaryMap.get(monthKey)!;
      if (tx.id.startsWith("T1") && tx.id.length > 5) {
        // Newly added transaction (timestamp-based ID)
        if (tx.type === "penjualan") entry.penjualan += tx.amount;
        if (tx.type === "pembelian") entry.pembelian += tx.amount;
        if (tx.type === "pengeluaran") entry.pengeluaran += tx.amount;
        entry.laba = entry.penjualan - entry.pembelian - entry.pengeluaran;
      }
    });

    return Array.from(summaryMap.values());
  }, [transactions]);

  const currentMonth = monthlySummaries[monthlySummaries.length - 1];
  const prevMonth = monthlySummaries[monthlySummaries.length - 2] || currentMonth;

  return (
    <DataContext.Provider
      value={{
        transactions,
        addTransaction,
        removeTransaction,
        products,
        setProducts,
        categories,
        setCategories,
        suppliers,
        setSuppliers,
        accounts,
        setAccounts,
        yearlySummaries,
        addYearlySummary,
        removeYearlySummary,
        updateYearlySummary,
        monthlySummaries,
        currentMonth,
        prevMonth,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
