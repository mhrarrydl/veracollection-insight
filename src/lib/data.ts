import { format, subDays, subMonths } from "date-fns";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  supplier: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  address: string;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
}

export interface TransactionItem {
  product: string;
  qty: number;
  price: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: "penjualan" | "pembelian" | "pengeluaran";
  description: string;
  items?: TransactionItem[];
  amount: number;
  category?: string;
}

export interface MonthlySummary {
  month: string;
  penjualan: number;
  pembelian: number;
  pengeluaran: number;
  laba: number;
}

export const categories: Category[] = [
  { id: "C001", name: "Kain", description: "Bahan kain mentah untuk produksi" },
  { id: "C002", name: "Celana", description: "Produk celana jadi siap jual" },
  { id: "C003", name: "Aksesoris", description: "Aksesoris pelengkap produk" },
];

export const products: Product[] = [
  { id: "P001", name: "Kain Katun Premium", category: "Kain", price: 85000, stock: 150, supplier: "PT Tekstil Jaya" },
  { id: "P002", name: "Kain Denim Stretch", category: "Kain", price: 120000, stock: 80, supplier: "CV Denim Indo" },
  { id: "P003", name: "Celana Chino Slim", category: "Celana", price: 189000, stock: 45, supplier: "Produksi Sendiri" },
  { id: "P004", name: "Celana Jogger Premium", category: "Celana", price: 165000, stock: 60, supplier: "Produksi Sendiri" },
  { id: "P005", name: "Kain Linen Import", category: "Kain", price: 210000, stock: 35, supplier: "PT Asia Fabric" },
  { id: "P006", name: "Celana Cargo Tactical", category: "Celana", price: 225000, stock: 30, supplier: "Produksi Sendiri" },
  { id: "P007", name: "Kain Twill Cotton", category: "Kain", price: 95000, stock: 100, supplier: "PT Tekstil Jaya" },
  { id: "P008", name: "Celana Palazzo Wide", category: "Celana", price: 175000, stock: 40, supplier: "Produksi Sendiri" },
];

export const suppliers: Supplier[] = [
  { id: "S001", name: "PT Tekstil Jaya", contact: "081234567890", address: "Bandung" },
  { id: "S002", name: "CV Denim Indo", contact: "081298765432", address: "Surabaya" },
  { id: "S003", name: "PT Asia Fabric", contact: "082112345678", address: "Jakarta" },
];

export const accounts: Account[] = [
  { id: "A001", name: "Kas", type: "aset", balance: 45000000 },
  { id: "A002", name: "Modal", type: "ekuitas", balance: 100000000 },
  { id: "A003", name: "Persediaan Barang", type: "aset", balance: 32000000 },
  { id: "A004", name: "Beban Gaji", type: "beban", balance: 0 },
  { id: "A005", name: "Beban Operasional", type: "beban", balance: 0 },
  { id: "A006", name: "Pendapatan Penjualan", type: "pendapatan", balance: 0 },
];

export const expenseCategories = ["Gaji", "Listrik", "Transportasi", "Sewa", "Operasional", "Lainnya"];

const today = new Date();

export const transactions: Transaction[] = [
  { id: "T001", date: format(subDays(today, 1), "yyyy-MM-dd"), type: "penjualan", description: "Penjualan Celana Chino Slim", items: [{ product: "Celana Chino Slim", qty: 5, price: 189000 }], amount: 945000 },
  { id: "T002", date: format(subDays(today, 1), "yyyy-MM-dd"), type: "penjualan", description: "Penjualan Celana Jogger Premium", items: [{ product: "Celana Jogger Premium", qty: 3, price: 165000 }], amount: 495000 },
  { id: "T003", date: format(subDays(today, 2), "yyyy-MM-dd"), type: "pembelian", description: "Pembelian Kain Katun Premium", items: [{ product: "Kain Katun Premium", qty: 50, price: 85000 }], amount: 4250000 },
  { id: "T004", date: format(subDays(today, 3), "yyyy-MM-dd"), type: "pengeluaran", description: "Gaji Karyawan", amount: 8500000, category: "Gaji" },
  { id: "T005", date: format(subDays(today, 3), "yyyy-MM-dd"), type: "penjualan", description: "Penjualan Celana Cargo Tactical", items: [{ product: "Celana Cargo Tactical", qty: 4, price: 225000 }], amount: 900000 },
  { id: "T006", date: format(subDays(today, 4), "yyyy-MM-dd"), type: "pengeluaran", description: "Listrik & Air", amount: 1200000, category: "Operasional" },
  { id: "T007", date: format(subDays(today, 5), "yyyy-MM-dd"), type: "penjualan", description: "Penjualan Kain Denim Stretch", items: [{ product: "Kain Denim Stretch", qty: 10, price: 120000 }], amount: 1200000 },
  { id: "T008", date: format(subDays(today, 6), "yyyy-MM-dd"), type: "pembelian", description: "Pembelian Kain Linen Import", items: [{ product: "Kain Linen Import", qty: 20, price: 210000 }], amount: 4200000 },
  { id: "T009", date: format(subDays(today, 7), "yyyy-MM-dd"), type: "penjualan", description: "Penjualan Celana Palazzo Wide", items: [{ product: "Celana Palazzo Wide", qty: 6, price: 175000 }], amount: 1050000 },
  { id: "T010", date: format(subDays(today, 8), "yyyy-MM-dd"), type: "pengeluaran", description: "Transportasi & Pengiriman", amount: 850000, category: "Transportasi" },
];

export const monthlySummaries: MonthlySummary[] = [
  { month: format(subMonths(today, 5), "MMM yyyy"), penjualan: 28500000, pembelian: 12000000, pengeluaran: 11200000, laba: 5300000 },
  { month: format(subMonths(today, 4), "MMM yyyy"), penjualan: 32100000, pembelian: 14500000, pengeluaran: 10800000, laba: 6800000 },
  { month: format(subMonths(today, 3), "MMM yyyy"), penjualan: 29800000, pembelian: 11200000, pengeluaran: 12100000, laba: 6500000 },
  { month: format(subMonths(today, 2), "MMM yyyy"), penjualan: 35600000, pembelian: 15800000, pengeluaran: 11500000, laba: 8300000 },
  { month: format(subMonths(today, 1), "MMM yyyy"), penjualan: 38200000, pembelian: 16200000, pengeluaran: 12800000, laba: 9200000 },
  { month: format(today, "MMM yyyy"), penjualan: 41500000, pembelian: 17500000, pengeluaran: 13200000, laba: 10800000 },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

export function getHealthScore(): { score: number; label: string; color: string } {
  const latest = monthlySummaries[monthlySummaries.length - 1];
  const profitMargin = (latest.laba / latest.penjualan) * 100;
  if (profitMargin >= 20) return { score: profitMargin, label: "Sehat", color: "success" };
  if (profitMargin >= 10) return { score: profitMargin, label: "Perlu Evaluasi", color: "warning" };
  return { score: profitMargin, label: "Berisiko", color: "destructive" };
}

export function getProfitMargin(): number {
  const latest = monthlySummaries[monthlySummaries.length - 1];
  return Number(((latest.laba / latest.penjualan) * 100).toFixed(1));
}

export function getInventoryTurnover(): number {
  const totalSales = monthlySummaries.reduce((a, b) => a + b.penjualan, 0);
  const avgInventory = 32000000;
  return Number((totalSales / avgInventory / 6).toFixed(1));
}

export function getAssetTurnover(): number {
  const totalSales = monthlySummaries.reduce((a, b) => a + b.penjualan, 0);
  const totalAssets = 77000000;
  return Number(((totalSales / 6) / totalAssets).toFixed(2));
}
