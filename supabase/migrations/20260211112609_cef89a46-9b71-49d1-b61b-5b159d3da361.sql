
-- Categories table
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- Suppliers table
CREATE TABLE public.suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT ''
);
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to suppliers" ON public.suppliers FOR ALL USING (true) WITH CHECK (true);

-- Products table
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  supplier TEXT NOT NULL DEFAULT ''
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Accounts table
CREATE TABLE public.accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT '',
  balance NUMERIC NOT NULL DEFAULT 0
);
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to accounts" ON public.accounts FOR ALL USING (true) WITH CHECK (true);

-- Transactions table
CREATE TABLE public.transactions (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('penjualan', 'pembelian', 'pengeluaran')),
  description TEXT NOT NULL DEFAULT '',
  items JSONB,
  amount NUMERIC NOT NULL DEFAULT 0,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

-- Yearly summaries table
CREATE TABLE public.yearly_summaries (
  year TEXT PRIMARY KEY,
  penjualan NUMERIC NOT NULL DEFAULT 0,
  pembelian NUMERIC NOT NULL DEFAULT 0,
  pengeluaran NUMERIC NOT NULL DEFAULT 0,
  laba NUMERIC NOT NULL DEFAULT 0
);
ALTER TABLE public.yearly_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to yearly_summaries" ON public.yearly_summaries FOR ALL USING (true) WITH CHECK (true);

-- Seed initial data
INSERT INTO public.categories (id, name, description) VALUES
  ('C001', 'Kain', 'Bahan kain mentah untuk produksi'),
  ('C002', 'Celana', 'Produk celana jadi siap jual'),
  ('C003', 'Aksesoris', 'Aksesoris pelengkap produk');

INSERT INTO public.suppliers (id, name, contact, address) VALUES
  ('S001', 'PT Tekstil Jaya', '081234567890', 'Bandung'),
  ('S002', 'CV Denim Indo', '081298765432', 'Surabaya'),
  ('S003', 'PT Asia Fabric', '082112345678', 'Jakarta');

INSERT INTO public.products (id, name, category, price, stock, supplier) VALUES
  ('P001', 'Kain Katun Premium', 'Kain', 85000, 150, 'PT Tekstil Jaya'),
  ('P002', 'Kain Denim Stretch', 'Kain', 120000, 80, 'CV Denim Indo'),
  ('P003', 'Celana Chino Slim', 'Celana', 189000, 45, 'Produksi Sendiri'),
  ('P004', 'Celana Jogger Premium', 'Celana', 165000, 60, 'Produksi Sendiri'),
  ('P005', 'Kain Linen Import', 'Kain', 210000, 35, 'PT Asia Fabric'),
  ('P006', 'Celana Cargo Tactical', 'Celana', 225000, 30, 'Produksi Sendiri'),
  ('P007', 'Kain Twill Cotton', 'Kain', 95000, 100, 'PT Tekstil Jaya'),
  ('P008', 'Celana Palazzo Wide', 'Celana', 175000, 40, 'Produksi Sendiri');

INSERT INTO public.accounts (id, name, type, balance) VALUES
  ('A001', 'Kas', 'aset', 45000000),
  ('A002', 'Modal', 'ekuitas', 100000000),
  ('A003', 'Persediaan Barang', 'aset', 32000000),
  ('A004', 'Beban Gaji', 'beban', 0),
  ('A005', 'Beban Operasional', 'beban', 0),
  ('A006', 'Pendapatan Penjualan', 'pendapatan', 0);

INSERT INTO public.yearly_summaries (year, penjualan, pembelian, pengeluaran, laba) VALUES
  ('2022', 320000000, 145000000, 120000000, 55000000),
  ('2023', 385000000, 168000000, 138000000, 79000000),
  ('2024', 425000000, 182000000, 148000000, 95000000),
  ('2025', 205700000, 87200000, 71600000, 46900000);
