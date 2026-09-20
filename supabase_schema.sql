-- ==============================================================================
-- CRAVVY CAKES & BAKERY - SUPABASE DATABASE SCHEMA
-- Copy and paste this into Supabase Dashboard -> SQL Editor and click "RUN"
-- ==============================================================================

-- 1. Enable UUID Extension (Optional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. BAKERY SETTINGS TABLE
CREATE TABLE IF NOT EXISTS bakery_settings (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  image TEXT,
  item_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  discount_price NUMERIC,
  category_slug TEXT,
  image TEXT NOT NULL,
  is_eggless BOOLEAN DEFAULT TRUE,
  in_stock BOOLEAN DEFAULT TRUE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  is_special_offer BOOLEAN DEFAULT FALSE,
  description TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  flavours JSONB DEFAULT '[]'::jsonb,
  sizes JSONB DEFAULT '[]'::jsonb,
  rating NUMERIC DEFAULT 4.9,
  review_count INT DEFAULT 24,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address JSONB,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  delivery_fee NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Placed',
  order_date TEXT NOT NULL,
  delivery_date TEXT NOT NULL,
  delivery_time_slot TEXT NOT NULL,
  special_instructions TEXT,
  utr_transaction_id TEXT,
  payment_screenshot TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CUSTOM CAKE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS custom_cake_requests (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  occasion TEXT,
  flavour TEXT,
  size TEXT,
  is_eggless BOOLEAN DEFAULT TRUE,
  message TEXT,
  instructions TEXT,
  reference_images JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'Pending Quote',
  quoted_price NUMERIC,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS) & ALLOW PUBLIC ACCESS (FOR REST API ANON)
ALTER TABLE bakery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_cake_requests ENABLE ROW LEVEL SECURITY;

-- Allow read and write for anon key (client app)
CREATE POLICY "Allow anon all on bakery_settings" ON bakery_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on custom_cake_requests" ON custom_cake_requests FOR ALL USING (true) WITH CHECK (true);
