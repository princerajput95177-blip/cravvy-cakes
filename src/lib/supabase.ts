import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Order, BakerySettings, Category } from '../types';

const DEFAULT_SUPABASE_URL = 'https://fwecdysawguawwuhnnol.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_d1fPHFN8eyHreFtfd_-0fQ_V1b_vjxP';

const getEnvVar = (key: string): string => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(key);
      if (stored) return stored;
    }
  } catch {
    // ignore
  }
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.[key]) {
      return (import.meta as any).env[key];
    }
  } catch {
    // ignore
  }
  try {
    if (typeof process !== 'undefined' && process.env?.[key]) {
      return process.env[key] as string;
    }
  } catch {
    // ignore
  }
  return '';
};

let currentUrl = getEnvVar('VITE_SUPABASE_URL') || DEFAULT_SUPABASE_URL;
let currentAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    currentUrl &&
    currentAnonKey &&
    currentUrl.startsWith('http') &&
    !currentUrl.includes('placeholder')
  );
};

export let supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(currentUrl, currentAnonKey)
  : null;

export const updateSupabaseCredentials = (url: string, anonKey: string) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('VITE_SUPABASE_URL', url.trim());
      window.localStorage.setItem('VITE_SUPABASE_ANON_KEY', anonKey.trim());
    }
    currentUrl = url.trim();
    currentAnonKey = anonKey.trim();
    supabase = isSupabaseConfigured() ? createClient(currentUrl, currentAnonKey) : null;
  } catch (err) {
    console.error('Failed to save Supabase credentials:', err);
  }
};

export const getSupabaseConfig = () => ({
  url: currentUrl,
  anonKey: currentAnonKey,
  isConfigured: isSupabaseConfigured(),
});

// Mappers for DB snake_case <-> App camelCase
export const mapProductToDb = (p: Product) => ({
  id: p.id,
  name: p.name,
  price: Number(p.price),
  discount_price: p.discountPrice ? Number(p.discountPrice) : null,
  category_slug: p.categorySlug,
  image: p.image,
  is_eggless: Boolean(p.isEggless),
  in_stock: p.inStock !== false,
  is_best_seller: Boolean(p.isBestSeller),
  is_new_arrival: Boolean(p.isNewArrival),
  is_special_offer: Boolean(p.isSpecialOffer),
  description: p.description || '',
  tags: p.tags || [],
  flavours: p.availableFlavours || [],
  sizes: p.availableSizes || [],
  rating: p.rating || 4.9,
  review_count: p.reviewCount || 24,
});

export const mapProductFromDb = (row: any): Product => ({
  id: row.id,
  name: row.name,
  categorySlug: row.category_slug || 'all',
  price: Number(row.price),
  discountPrice: row.discount_price ? Number(row.discount_price) : undefined,
  description: row.description || '',
  image: row.image || '',
  rating: Number(row.rating || 4.9),
  reviewCount: Number(row.review_count || 0),
  isEggless: Boolean(row.is_eggless),
  isBestSeller: Boolean(row.is_best_seller),
  isNewArrival: Boolean(row.is_new_arrival),
  isSpecialOffer: Boolean(row.is_special_offer),
  availableFlavours: row.flavours || [],
  availableSizes: row.sizes || [],
  inStock: Boolean(row.in_stock),
  prepTimeMinutes: 45,
  tags: row.tags || [],
});

export const mapCategoryToDb = (c: Category) => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  icon: c.icon || 'Cake',
  image: c.image || '',
  item_count: c.itemCount || 0,
  is_active: c.isActive !== false,
});

export const mapCategoryFromDb = (row: any): Category => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  icon: row.icon || 'Cake',
  image: row.image || '',
  itemCount: Number(row.item_count || 0),
  isActive: Boolean(row.is_active),
});

export const mapOrderToDb = (o: Order) => ({
  id: o.id,
  order_number: o.orderNumber,
  customer_name: o.customerName,
  customer_phone: o.customerPhone,
  customer_email: o.customerEmail || null,
  delivery_address: o.deliveryAddress,
  items: o.items,
  subtotal: Number(o.subtotal),
  discount: Number(o.discountAmount || 0),
  delivery_fee: Number(o.deliveryCharge || 0),
  total: Number(o.finalTotal),
  payment_method: o.paymentMethod,
  payment_status: o.paymentStatus,
  status: o.status,
  order_date: o.orderDate,
  delivery_date: o.deliveryDate,
  delivery_time_slot: o.deliveryTimeSlot,
  special_instructions: o.specialInstructions || null,
  utr_transaction_id: o.utrTransactionId || null,
  payment_screenshot: o.paymentScreenshot || null,
});

export const mapOrderFromDb = (row: any): Order => ({
  id: row.id,
  orderNumber: row.order_number,
  items: row.items || [],
  subtotal: Number(row.subtotal),
  deliveryCharge: Number(row.delivery_fee || 0),
  discountAmount: Number(row.discount || 0),
  taxAmount: 0,
  finalTotal: Number(row.total),
  customerName: row.customer_name,
  customerPhone: row.customer_phone,
  customerEmail: row.customer_email || undefined,
  deliveryAddress: row.delivery_address,
  deliveryDate: row.delivery_date,
  deliveryTimeSlot: row.delivery_time_slot,
  paymentMethod: row.payment_method,
  paymentStatus: row.payment_status,
  utrTransactionId: row.utr_transaction_id || undefined,
  paymentScreenshot: row.payment_screenshot || undefined,
  status: row.status,
  orderDate: row.order_date,
  specialInstructions: row.special_instructions || undefined,
  statusHistory: [
    {
      status: row.status,
      timestamp: row.order_date,
      note: `Order status: ${row.status}`,
    },
  ],
});

/**
 * Service to sync and fetch data from Supabase
 */
export const supabaseService = {
  // Check live connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!supabase) {
      return {
        success: false,
        message: 'Supabase URL or Anon Key is missing in environment variables.',
      };
    }
    try {
      const { error } = await supabase.from('bakery_settings').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        if (
          error.message.includes('relation "bakery_settings" does not exist') ||
          error.message.includes('Could not find the table')
        ) {
          return {
            success: true,
            message: 'Connected to Supabase! Please run the SQL schema in Supabase SQL editor to create tables.',
          };
        }
        return { success: false, message: error.message };
      }
      return { success: true, message: 'Connected successfully to Supabase database!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Connection failed' };
    }
  },

  // Products
  async getProducts(): Promise<Product[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) {
        console.warn('Supabase getProducts error:', error.message);
        return null;
      }
      return (data || []).map(mapProductFromDb);
    } catch {
      return null;
    }
  },

  async upsertProduct(product: Product): Promise<boolean> {
    if (!supabase) return false;
    try {
      const dbProd = mapProductToDb(product);
      const { error } = await supabase.from('products').upsert([dbProd]);
      if (error) console.error('Supabase upsertProduct error:', error);
      return !error;
    } catch {
      return false;
    }
  },

  async deleteProduct(productId: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      return !error;
    } catch {
      return false;
    }
  },

  // Categories
  async getCategories(): Promise<Category[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
      if (error) return null;
      return (data || []).map(mapCategoryFromDb);
    } catch {
      return null;
    }
  },

  // Orders
  async getOrders(): Promise<Order[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) {
        console.warn('Supabase getOrders error:', error.message);
        return null;
      }
      return (data || []).map(mapOrderFromDb);
    } catch {
      return null;
    }
  },

  async insertOrder(order: Order): Promise<boolean> {
    if (!supabase) return false;
    try {
      const dbOrder = mapOrderToDb(order);
      const { error } = await supabase.from('orders').insert([dbOrder]);
      if (error) console.error('Supabase insertOrder error:', error);
      return !error;
    } catch {
      return false;
    }
  },

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
      return !error;
    } catch {
      return false;
    }
  },

  // Settings
  async getSettings(): Promise<BakerySettings | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('bakery_settings')
        .select('*')
        .eq('id', 'default_settings')
        .single();
      if (error) return null;
      return data?.data as BakerySettings;
    } catch {
      return null;
    }
  },

  async saveSettings(settings: BakerySettings): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('bakery_settings').upsert([
        {
          id: 'default_settings',
          data: settings,
          updated_at: new Date().toISOString(),
        },
      ]);
      return !error;
    } catch {
      return false;
    }
  },

  // Bulk Seed initial items to Supabase
  async seedAllData(
    products: Product[],
    categories: Category[],
    settings: BakerySettings
  ): Promise<{ success: boolean; message: string }> {
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured.' };
    }
    try {
      // 1. Settings
      await supabase.from('bakery_settings').upsert([
        { id: 'default_settings', data: settings, updated_at: new Date().toISOString() },
      ]);

      // 2. Categories
      if (categories.length > 0) {
        const dbCategories = categories.map(mapCategoryToDb);
        const { error: catErr } = await supabase.from('categories').upsert(dbCategories);
        if (catErr) console.error('Categories seed error:', catErr);
      }

      // 3. Products
      if (products.length > 0) {
        const dbProducts = products.map(mapProductToDb);
        const { error: prodErr } = await supabase.from('products').upsert(dbProducts);
        if (prodErr) console.error('Products seed error:', prodErr);
      }

      return {
        success: true,
        message: `Successfully synced ${products.length} products and ${categories.length} categories to Supabase!`,
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Sync failed.' };
    }
  },
};
