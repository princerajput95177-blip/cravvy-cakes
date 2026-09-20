import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Category,
  Product,
  CartItem,
  Address,
  Order,
  CustomCakeRequest,
  Coupon,
  Banner,
  UserProfile,
  BakeryNotification,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  CakeFlavour,
  CakeSize,
  Review,
  BakerySettings,
  BakeryCustomer,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BANNERS,
  INITIAL_COUPONS,
  INITIAL_ADDRESSES,
  INITIAL_ORDERS,
  INITIAL_CUSTOM_CAKES,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_CUSTOMERS,
} from '../data/initialData';
import confetti from 'canvas-confetti';
import { openWhatsAppOrderSummary } from '../utils/whatsapp';
import { isSupabaseConfigured, supabaseService } from '../lib/supabase';

interface BakeryContextType {
  // Supabase Database Integration
  isSupabaseEnabled: boolean;
  testSupabaseConnection: () => Promise<{ success: boolean; message: string }>;
  syncAllToSupabase: () => Promise<{ success: boolean; message: string }>;

  // App view & Mode
  viewMode: 'customer' | 'admin' | 'codebase';
  setViewMode: (mode: 'customer' | 'admin' | 'codebase') => void;
  deviceFrame: boolean;
  setDeviceFrame: (frame: boolean) => void;
  customerTab: 'home' | 'categories' | 'cart' | 'orders' | 'profile' | 'wishlist';
  setCustomerTab: (tab: 'home' | 'categories' | 'cart' | 'orders' | 'profile' | 'wishlist') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;

  // Selected product & tracking
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  activeTrackingOrderId: string | null;
  setActiveTrackingOrderId: (id: string | null) => void;
  customCakeModalOpen: boolean;
  setCustomCakeModalOpen: (open: boolean) => void;

  // User & Auth
  user: UserProfile;
  currentUser: UserProfile;
  loginAsGuest: () => void;
  loginWithPhone: (phone: string, name?: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalReason: string | null;
  setAuthModalReason: (reason: string | null) => void;
  savedAddresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (addr: Address) => void;
  addAddress: (addr: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;

  // Products & Categories
  categories: Category[];
  products: Product[];
  selectedCategorySlug: string;
  setSelectedCategorySlug: (slug: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  recentSearches: string[];
  addRecentSearch: (q: string) => void;
  clearRecentSearches: () => void;
  isEgglessFilter: boolean | null;
  setIsEgglessFilter: (val: boolean | null) => void;
  sortBy: 'popular' | 'price-low' | 'price-high' | 'rating';
  setSortBy: (sort: 'popular' | 'price-low' | 'price-high' | 'rating') => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (
    product: Product,
    options?: {
      quantity?: number;
      flavour?: CakeFlavour;
      size?: CakeSize;
      isEggless?: boolean;
      cakeMessage?: string;
      instructions?: string;
    }
  ) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  cartDeliveryCharge: number;
  cartDiscount: number;
  cartTax: number;
  cartTotal: number;

  // Orders
  orders: Order[];
  placeOrder: (orderData: {
    deliveryDate: string;
    deliveryTimeSlot: string;
    paymentMethod: PaymentMethod;
    specialInstructions?: string;
    paymentId?: string;
    utrTransactionId?: string;
    paymentScreenshot?: string;
    paymentStatus?: PaymentStatus;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  verifyPayment: (orderId: string) => void;
  rejectPayment: (orderId: string, reason?: string) => void;
  resubmitPaymentDetails: (orderId: string, utrTransactionId: string, paymentScreenshot?: string) => void;
  markCashCollected: (orderId: string, paymentMode?: 'Cash' | 'Rider UPI QR') => void;

  // Custom Cakes
  customCakeRequests: CustomCakeRequest[];
  submitCustomCake: (req: Omit<CustomCakeRequest, 'id' | 'requestNumber' | 'status' | 'createdAt'>) => CustomCakeRequest;
  updateCustomCakeStatus: (id: string, status: CustomCakeRequest['status'], quotedPrice?: number, adminNote?: string) => void;
  convertCustomCakeToOrder: (reqId: string) => Promise<Order | null>;
  acceptCustomCakeQuote: (reqId: string) => Promise<Order | null>;
  rejectCustomCakeQuote: (reqId: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (rev: Omit<Review, 'id' | 'date' | 'status'>) => void;
  updateReviewStatus: (id: string, status: Review['status']) => void;
  deleteReview: (id: string) => void;

  // Customers & Settings
  customers: BakeryCustomer[];
  settings: BakerySettings;
  updateSettings: (newSettings: Partial<BakerySettings>) => void;

  // Coupons & Banners
  coupons: Coupon[];
  banners: Banner[];
  notifications: BakeryNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  broadcastNotification: (notif: Omit<BakeryNotification, 'id' | 'date' | 'isRead'>) => void;

  // Admin Product/Category/Coupon CRUD
  addProduct: (prod: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, prod: Partial<Product>) => void;
  duplicateProduct: (id: string) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addCoupon: (cp: Omit<Coupon, 'id'>) => void;
  updateCoupon: (id: string, cp: Partial<Coupon>) => void;
  toggleCoupon: (id: string) => void;
  deleteCoupon: (id: string) => void;
  addBanner: (b: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, b: Partial<Banner>) => void;
  toggleBanner: (id: string) => void;
  deleteBanner: (id: string) => void;

  // Configuration management
  resetToDefaults: () => void;
  exportConfigJSON: () => string;
  importConfigJSON: (jsonStr: string) => boolean;

  // Toast helper
  activeToast: string | null;
  showToast: (msg: string) => void;
}

const BakeryContext = createContext<BakeryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'cravvy_settings_v5',
  PRODUCTS: 'cravvy_products_v8',
  CATEGORIES: 'cravvy_categories_v8',
  BANNERS: 'cravvy_banners_v2',
  COUPONS: 'cravvy_coupons_v2',
  ORDERS: 'cravvy_orders_v2',
  CUSTOM_CAKES: 'cravvy_custom_cakes_v2',
  REVIEWS: 'cravvy_reviews_v2',
  CUSTOMERS: 'cravvy_customers_v2',
};

function getStoredCategories(): Category[] {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!item) return INITIAL_CATEGORIES;
    const parsed = JSON.parse(item);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_CATEGORIES;
    }
    return parsed;
  } catch {
    return INITIAL_CATEGORIES;
  }
}

function getStoredProducts(): Product[] {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!item) return INITIAL_PRODUCTS;
    const parsed = JSON.parse(item);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_PRODUCTS;
    }
    return parsed;
  } catch {
    return INITIAL_PRODUCTS;
  }
}

function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (parsed === null || parsed === undefined) return fallback;
    if (key === STORAGE_KEYS.SETTINGS && typeof fallback === 'object' && !Array.isArray(fallback)) {
      return { ...fallback, ...parsed };
    }
    return parsed;
  } catch (e) {
    console.warn(`Error loading ${key} from storage:`, e);
    return fallback;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving ${key} to storage:`, e);
  }
}

export const BakeryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<'customer' | 'admin' | 'codebase'>('customer');
  const [deviceFrame, setDeviceFrame] = useState<boolean>(true);
  const [customerTab, setCustomerTab] = useState<'home' | 'categories' | 'cart' | 'orders' | 'profile'>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cravvy_theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('cravvy_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('cravvy_theme', 'light');
      }
    } catch (e) {
      console.warn('Error saving theme', e);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Modals & Selected items
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>('ord-1001');
  const [customCakeModalOpen, setCustomCakeModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalReason, setAuthModalReason] = useState<string | null>(null);
  const [pendingCartItem, setPendingCartItem] = useState<{
    product: Product;
    options?: {
      quantity?: number;
      flavour?: CakeFlavour;
      size?: CakeSize;
      isEggless?: boolean;
      cakeMessage?: string;
      instructions?: string;
    };
  } | null>(null);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // User Profile - Default to Guest
  const [user, setUser] = useState<UserProfile>({
    id: 'usr-guest',
    name: 'Guest User',
    phone: '',
    email: '',
    addresses: INITIAL_ADDRESSES,
    isLoggedIn: false,
    isGuest: true,
  });

  const [savedAddresses, setSavedAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(INITIAL_ADDRESSES[0] || null);

  // Catalog & Entities with persistent storage
  const [categories, setCategories] = useState<Category[]>(() => getStoredCategories());
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('bento');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEgglessFilter, setIsEgglessFilter] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(INITIAL_COUPONS[0]);

  // Orders, Banners, Coupons, Custom Cakes
  const [orders, setOrders] = useState<Order[]>(() =>
    getStoredItem(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
  );
  const [customCakeRequests, setCustomCakeRequests] = useState<CustomCakeRequest[]>(() =>
    getStoredItem(STORAGE_KEYS.CUSTOM_CAKES, INITIAL_CUSTOM_CAKES)
  );
  const [coupons, setCoupons] = useState<Coupon[]>(() =>
    getStoredItem(STORAGE_KEYS.COUPONS, INITIAL_COUPONS)
  );
  const [banners, setBanners] = useState<Banner[]>(() =>
    getStoredItem(STORAGE_KEYS.BANNERS, INITIAL_BANNERS)
  );

  // Reviews, Customers, Settings
  const [reviews, setReviews] = useState<Review[]>(() =>
    getStoredItem(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS)
  );
  const [customers, setCustomers] = useState<BakeryCustomer[]>(() =>
    getStoredItem(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS)
  );
  const [settings, setSettings] = useState<BakerySettings>(() =>
    getStoredItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS)
  );

  // Auto-sync state to localStorage whenever modified
  useEffect(() => { setStoredItem(STORAGE_KEYS.CATEGORIES, categories); }, [categories]);
  useEffect(() => { setStoredItem(STORAGE_KEYS.PRODUCTS, products); }, [products]);
  useEffect(() => { setStoredItem(STORAGE_KEYS.COUPONS, coupons); }, [coupons]);
  useEffect(() => { setStoredItem(STORAGE_KEYS.BANNERS, banners); }, [banners]);
  useEffect(() => { setStoredItem(STORAGE_KEYS.ORDERS, orders); }, [orders]);
  useEffect(() => { setStoredItem(STORAGE_KEYS.CUSTOM_CAKES, customCakeRequests); }, [customCakeRequests]);
  useEffect(() => { setStoredItem(STORAGE_KEYS.REVIEWS, reviews); }, [reviews]);
  useEffect(() => { setStoredItem(STORAGE_KEYS.CUSTOMERS, customers); }, [customers]);
  useEffect(() => { setStoredItem(STORAGE_KEYS.SETTINGS, settings); }, [settings]);

  // Sync across tabs / windows in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key === STORAGE_KEYS.SETTINGS) setSettings(getStoredItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS));
      if (e.key === STORAGE_KEYS.PRODUCTS) setProducts(getStoredItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS));
      if (e.key === STORAGE_KEYS.CATEGORIES) setCategories(getStoredItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES));
      if (e.key === STORAGE_KEYS.BANNERS) setBanners(getStoredItem(STORAGE_KEYS.BANNERS, INITIAL_BANNERS));
      if (e.key === STORAGE_KEYS.COUPONS) setCoupons(getStoredItem(STORAGE_KEYS.COUPONS, INITIAL_COUPONS));
      if (e.key === STORAGE_KEYS.ORDERS) setOrders(getStoredItem(STORAGE_KEYS.ORDERS, INITIAL_ORDERS));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Supabase Real-time Cloud Persistence
  const isSupabaseEnabled = isSupabaseConfigured();

  const testSupabaseConnection = async () => {
    return await supabaseService.testConnection();
  };

  const syncAllToSupabase = async () => {
    const res = await supabaseService.seedAllData(products, categories, settings);
    if (res.success) {
      showToast('⚡ ' + res.message);
    } else {
      showToast('⚠️ ' + res.message);
    }
    return res;
  };

  // Hydrate from Supabase on startup when configured
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    supabaseService.getProducts().then((remoteProds) => {
      if (remoteProds && remoteProds.length > 0) {
        setProducts(remoteProds);
      }
    });

    supabaseService.getSettings().then((remoteSettings) => {
      if (remoteSettings) {
        setSettings(remoteSettings);
      }
    });

    supabaseService.getOrders().then((remoteOrders) => {
      if (remoteOrders && remoteOrders.length > 0) {
        setOrders(remoteOrders);
      }
    });
  }, []);

  // Notifications
  const [notifications, setNotifications] = useState<BakeryNotification[]>([
    {
      id: 'notif-1',
      title: 'Order CC-8942 is Baking!',
      message: 'Our head chef is piping rich Belgian chocolate ganache on your cake.',
      type: 'order',
      date: '10:30 AM',
      isRead: false,
      orderId: 'ord-1001',
    },
    {
      id: 'notif-2',
      title: 'Special Weekend 20% OFF',
      message: 'Use coupon CRAVVY20 at checkout for instant celebration discount!',
      type: 'offer',
      date: 'Yesterday',
      isRead: true,
    },
  ]);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-2']);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(exists ? 'Removed from Wishlist' : 'Added to Wishlist ❤️');
      return updated;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Reviews
  const addReview = (rev: Omit<Review, 'id' | 'date' | 'status'>) => {
    const newRev: Review = {
      ...rev,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'approved',
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('Thank you! Your review has been published ⭐');
  };

  const updateReviewStatus = (id: string, status: Review['status']) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    showToast(`Review marked as ${status}`);
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('Review removed');
  };

  // Settings
  const updateSettings = (newSettings: Partial<BakerySettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      if (isSupabaseConfigured()) {
        supabaseService.saveSettings(merged);
      }
      return merged;
    });
    showToast('Bakery configuration saved successfully!');
  };

  // Recent Searches
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Chocolate Truffle',
    'Red Velvet',
    'Cheesecake',
    'Eggless Brownie',
  ]);

  const addRecentSearch = (q: string) => {
    if (!q.trim()) return;
    setRecentSearches((prev) => [q.trim(), ...prev.filter((item) => item.toLowerCase() !== q.trim().toLowerCase())].slice(0, 8));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Product Duplication
  const duplicateProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const duplicated: Product = {
      ...target,
      id: 'prod-' + Date.now(),
      name: `${target.name} (Copy)`,
    };
    setProducts((prev) => [duplicated, ...prev]);
    showToast(`Duplicated "${target.name}"`);
  };

  const showToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => {
      setActiveToast((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Auth Handlers
  const loginAsGuest = () => {
    setUser({
      id: 'usr-guest',
      name: 'Guest User',
      phone: '',
      email: '',
      addresses: INITIAL_ADDRESSES,
      isLoggedIn: false,
      isGuest: true,
    });
    setIsAuthModalOpen(false);
    setAuthModalReason(null);
    setPendingCartItem(null);
    showToast('Continuing as Guest. Enjoy exploring Cravvy Cakes!');
  };

  const loginWithPhone = async (phone: string, name?: string): Promise<boolean> => {
    const loggedInUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: name || 'Prince Rajput',
      phone: phone,
      email: `${phone.replace(/\D/g, '') || 'customer'}@cravvycakes.com`,
      addresses: savedAddresses.length > 0 ? savedAddresses : INITIAL_ADDRESSES,
      isLoggedIn: true,
      isGuest: false,
    };
    setUser(loggedInUser);
    setIsAuthModalOpen(false);
    setAuthModalReason(null);
    showToast(`Welcome to Cravvy Cakes, ${loggedInUser.name}!`);

    // If there was a pending cart action, execute it seamlessly
    if (pendingCartItem) {
      executeAddToCart(pendingCartItem.product, pendingCartItem.options);
      setPendingCartItem(null);
    }
    return true;
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    if (otp.length === 4 || otp.length === 6) {
      setUser((prev) => ({ ...prev, isLoggedIn: true, isGuest: false }));
      setIsAuthModalOpen(false);
      setAuthModalReason(null);
      showToast('OTP verified successfully!');

      if (pendingCartItem) {
        executeAddToCart(pendingCartItem.product, pendingCartItem.options);
        setPendingCartItem(null);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser({
      id: 'usr-guest',
      name: 'Guest User',
      phone: '',
      email: '',
      addresses: INITIAL_ADDRESSES,
      isLoggedIn: false,
      isGuest: true,
    });
    setPendingCartItem(null);
    showToast('Logged out. You are now browsing as Guest.');
  };

  // Address Handlers
  const addAddress = (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...addr,
      id: 'addr-' + Date.now(),
    };
    setSavedAddresses((prev) => [newAddr, ...prev]);
    setSelectedAddress(newAddr);
    showToast('Delivery address saved successfully');
  };

  const deleteAddress = (id: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAddress?.id === id) {
      setSelectedAddress(savedAddresses.find((a) => a.id !== id) || null);
    }
    showToast('Address removed');
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartDeliveryCharge =
    cartSubtotal === 0
      ? 0
      : cartSubtotal >= (settings.freeDeliveryThreshold ?? 499)
      ? 0
      : (settings.deliveryCharge ?? 40);

  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountPercent) {
      const computed = (cartSubtotal * appliedCoupon.discountPercent) / 100;
      cartDiscount = appliedCoupon.maxDiscount ? Math.min(computed, appliedCoupon.maxDiscount) : computed;
    } else if (appliedCoupon.flatDiscount) {
      cartDiscount = appliedCoupon.flatDiscount;
    }
  }

  const taxableAmount = Math.max(0, cartSubtotal - cartDiscount);
  const taxRate = typeof settings.taxPercentage === 'number' ? settings.taxPercentage / 100 : 0.05;
  const cartTax = Number((taxableAmount * taxRate).toFixed(2));
  const cartTotal = Number(Math.max(0, taxableAmount + cartDeliveryCharge + cartTax).toFixed(2));

  const executeAddToCart = (
    product: Product,
    options?: {
      quantity?: number;
      flavour?: CakeFlavour;
      size?: CakeSize;
      isEggless?: boolean;
      cakeMessage?: string;
      instructions?: string;
    }
  ) => {
    const qty = options?.quantity || 1;
    const basePrice = product.discountPrice || product.price;
    // Add small multiplier for larger sizes if applicable
    let sizeMultiplier = 1;
    if (options?.size?.includes('1.0 kg')) sizeMultiplier = 1.8;
    else if (options?.size?.includes('1.5 kg')) sizeMultiplier = 2.6;
    else if (options?.size?.includes('2.0 kg')) sizeMultiplier = 3.4;
    else if (options?.size?.includes('3.0 kg')) sizeMultiplier = 5.0;

    const unitPrice = Math.round(basePrice * sizeMultiplier);
    const totalPrice = unitPrice * qty;

    const newItem: CartItem = {
      id: `ci-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      product,
      quantity: qty,
      selectedFlavour: options?.flavour || product.availableFlavours?.[0],
      selectedSize: options?.size || product.availableSizes?.[0],
      isEggless: options?.isEggless !== undefined ? options.isEggless : product.isEggless,
      cakeMessage: options?.cakeMessage,
      customInstructions: options?.instructions,
      unitPrice,
      totalPrice,
    };

    setCart((prev) => [...prev, newItem]);
    showToast(`Added "${product.name.slice(0, 24)}..." to cart!`);
  };

  const addToCart = (
    product: Product,
    options?: {
      quantity?: number;
      flavour?: CakeFlavour;
      size?: CakeSize;
      isEggless?: boolean;
      cakeMessage?: string;
      instructions?: string;
    }
  ) => {
    // If user is guest/not logged in, trigger login modal
    if (!user.isLoggedIn) {
      setPendingCartItem({ product, options });
      setAuthModalReason(`Please login with your mobile number to add "${product.name}" to your cart & place orders.`);
      setIsAuthModalOpen(true);
      return;
    }

    executeAddToCart(product, options);
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyCoupon = (code: string) => {
    const found = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Minimum cart value of ₹${found.minOrderValue} required for code ${found.code}.`,
      };
    }
    setAppliedCoupon(found);
    showToast(`Coupon "${found.code}" applied!`);
    return { success: true, message: `Applied! ${found.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // Place Order
  const placeOrder = async (orderData: {
    deliveryDate: string;
    deliveryTimeSlot: string;
    paymentMethod: PaymentMethod;
    specialInstructions?: string;
    paymentId?: string;
    utrTransactionId?: string;
    paymentScreenshot?: string;
    paymentStatus?: PaymentStatus;
  }): Promise<Order> => {
    if (!selectedAddress) {
      throw new Error('Please select or add a delivery address first.');
    }
    if (cart.length === 0) {
      throw new Error('Cart is empty.');
    }

    const orderNum = `CC-${Math.floor(1000 + Math.random() * 9000)}`;
    const initialPaymentStatus: PaymentStatus =
      orderData.paymentStatus ||
      (orderData.paymentMethod === 'Cash on Delivery'
        ? 'Pending'
        : orderData.paymentMethod === 'Bank / UPI Transfer'
        ? 'Pending Verification'
        : 'Paid');

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryCharge: cartDeliveryCharge,
      discountAmount: cartDiscount,
      couponCode: appliedCoupon?.code,
      taxAmount: cartTax,
      finalTotal: cartTotal,
      customerName: user.name,
      customerPhone: user.phone,
      customerEmail: user.email,
      deliveryAddress: selectedAddress,
      deliveryDate: orderData.deliveryDate,
      deliveryTimeSlot: orderData.deliveryTimeSlot,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: initialPaymentStatus,
      paymentId: orderData.paymentId,
      utrTransactionId: orderData.utrTransactionId,
      paymentScreenshot: orderData.paymentScreenshot,
      paymentDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Placed',
      orderDate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      specialInstructions: orderData.specialInstructions,
      statusHistory: [
        {
          status: 'Placed',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note:
            orderData.paymentMethod === 'Bank / UPI Transfer'
              ? `Order received via Bank / UPI (UTR: ${orderData.utrTransactionId || 'Verification Pending'})`
              : `Order received via Customer App (${orderData.paymentMethod})`,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    if (isSupabaseConfigured()) {
      supabaseService.insertOrder(newOrder);
    }
    setActiveTrackingOrderId(newOrder.id);
    clearCart();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D97706', '#E65100', '#F59E0B', '#10B981', '#EC4899'],
      });
    } catch {
      // ignore
    }

    // Add push notification
    broadcastNotification({
      title: `Order ${orderNum} Placed!`,
      message:
        orderData.paymentMethod === 'Bank / UPI Transfer'
          ? `Order placed! Payment details submitted for verification. We'll start baking once verified.`
          : `Your Cravvy Cakes order of ₹${newOrder.finalTotal} is now being processed.`,
      type: 'order',
      orderId: newOrder.id,
    });

    // Automatically send formatted order summary to Bakery WhatsApp (9653930001)
    try {
      openWhatsAppOrderSummary(newOrder, settings.whatsappNumber || '9653930001');
    } catch {
      // ignore
    }

    return newOrder;
  };

  // Payment Verification by Admin
  const verifyPayment = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedHistory = [
            ...ord.statusHistory,
            {
              status: ord.status === 'Placed' ? 'Confirmed' : ord.status,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              note: `Payment verified by Admin via Bank / UPI. UTR: ${ord.utrTransactionId || 'Verified'}`,
            },
          ];
          return {
            ...ord,
            paymentStatus: 'Verified' as PaymentStatus,
            status: ord.status === 'Placed' ? ('Confirmed' as OrderStatus) : ord.status,
            statusHistory: updatedHistory,
          };
        }
        return ord;
      })
    );

    const targetOrd = orders.find((o) => o.id === orderId);
    if (targetOrd) {
      broadcastNotification({
        title: `Payment Verified: Order ${targetOrd.orderNumber}`,
        message: `Your payment of ₹${targetOrd.finalTotal} via Bank / UPI has been verified! Your order is now confirmed.`,
        type: 'order',
        orderId: targetOrd.id,
      });
    }
    showToast('Payment verified successfully! Order marked as Confirmed.');
  };

  // Payment Rejection by Admin
  const rejectPayment = (orderId: string, reason?: string) => {
    const rejectionReason =
      reason || 'Payment screenshot / UTR could not be verified. Please submit a valid payment screenshot.';

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedHistory = [
            ...ord.statusHistory,
            {
              status: ord.status,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              note: `Payment rejected by Admin: ${rejectionReason}`,
            },
          ];
          return {
            ...ord,
            paymentStatus: 'Rejected' as PaymentStatus,
            paymentRejectionReason: rejectionReason,
            statusHistory: updatedHistory,
          };
        }
        return ord;
      })
    );

    const targetOrd = orders.find((o) => o.id === orderId);
    if (targetOrd) {
      broadcastNotification({
        title: `Payment Verification Failed: Order ${targetOrd.orderNumber}`,
        message: `We could not verify your payment: ${rejectionReason}. Please resubmit valid payment details in the app.`,
        type: 'order',
        orderId: targetOrd.id,
      });
    }
    showToast('Payment rejected. Customer has been notified to submit valid details.');
  };

  // Customer Resubmits Payment Details
  const resubmitPaymentDetails = (orderId: string, utrTransactionId: string, paymentScreenshot?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedHistory = [
            ...ord.statusHistory,
            {
              status: ord.status,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              note: `Customer updated payment details. New UTR: ${utrTransactionId}. Verification pending.`,
            },
          ];
          return {
            ...ord,
            utrTransactionId,
            paymentScreenshot: paymentScreenshot || ord.paymentScreenshot,
            paymentStatus: 'Pending Verification' as PaymentStatus,
            paymentRejectionReason: undefined,
            paymentDate: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            statusHistory: updatedHistory,
          };
        }
        return ord;
      })
    );
    showToast('Updated payment details submitted successfully. Verification pending.');
  };

  // Mark Cash on Delivery as Collected
  const markCashCollected = (orderId: string, paymentMode: 'Cash' | 'Rider UPI QR' = 'Cash') => {
    let collectedOrder: Order | undefined;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          collectedOrder = ord;
          const updatedHistory = [
            ...ord.statusHistory,
            {
              status: ord.status,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              note: `Cash on Delivery collected: ₹${ord.finalTotal} received via ${paymentMode}.`,
            },
          ];
          return {
            ...ord,
            paymentStatus: 'Paid' as PaymentStatus,
            statusHistory: updatedHistory,
          };
        }
        return ord;
      })
    );

    if (collectedOrder) {
      broadcastNotification({
        title: `COD Payment Collected!`,
        message: `Cash on Delivery payment of ₹${collectedOrder.finalTotal} for order ${collectedOrder.orderNumber} has been marked as collected (${paymentMode}).`,
        type: 'order',
        orderId,
      });
      showToast(`COD payment of ₹${collectedOrder.finalTotal} marked as collected!`);
    }
  };

  // Order status update (Syncs Admin -> Customer Tracking)
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedHistory = [
            ...ord.statusHistory,
            {
              status: newStatus,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              note: note || `Order updated to ${newStatus}`,
            },
          ];
          return {
            ...ord,
            status: newStatus,
            statusHistory: updatedHistory,
          };
        }
        return ord;
      })
    );

    // Notify customer
    if (isSupabaseConfigured()) {
      supabaseService.updateOrderStatus(orderId, newStatus);
    }

    broadcastNotification({
      title: `Order Status Update: ${newStatus}`,
      message: `Your order has progressed to "${newStatus}".`,
      type: 'order',
      orderId,
    });
    showToast(`Order status updated to ${newStatus}`);
  };

  // Custom Cakes
  const submitCustomCake = (
    req: Omit<CustomCakeRequest, 'id' | 'requestNumber' | 'status' | 'createdAt'>
  ): CustomCakeRequest => {
    const newReq: CustomCakeRequest = {
      ...req,
      id: 'cc-' + Date.now(),
      requestNumber: `CC-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Pending Quote',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
    };

    setCustomCakeRequests((prev) => [newReq, ...prev]);

    broadcastNotification({
      title: `Custom Cake Request ${newReq.requestNumber} Received!`,
      message: 'Our master baker is reviewing your design and will provide an exact quote shortly.',
      type: 'announcement',
    });

    showToast(`Custom cake request ${newReq.requestNumber} submitted!`);
    return newReq;
  };

  const updateCustomCakeStatus = (
    id: string,
    status: CustomCakeRequest['status'],
    quotedPrice?: number,
    adminNote?: string
  ) => {
    setCustomCakeRequests((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          return {
            ...req,
            status,
            quotedPrice: quotedPrice !== undefined ? quotedPrice : req.quotedPrice,
            adminNote: adminNote !== undefined ? adminNote : req.adminNote,
          };
        }
        return req;
      })
    );
    showToast(`Custom cake status: ${status}`);
  };

  const convertCustomCakeToOrder = async (reqId: string): Promise<Order | null> => {
    const req = customCakeRequests.find((r) => r.id === reqId);
    if (!req) return null;

    const price = req.quotedPrice || 2500;
    const customProd: Product = {
      id: `custom-cake-${req.id}`,
      name: `Custom Cake (${req.cakeType})`,
      categorySlug: 'custom-cakes',
      price: price,
      description: `${req.flavour} cake with message: "${req.cakeMessage}". Special Note: ${req.specialInstructions}`,
      image: req.referenceImageUrl,
      rating: 5.0,
      reviewCount: 1,
      isEggless: req.isEggless,
      inStock: true,
      prepTimeMinutes: 180,
      tags: ['Custom Cake', req.cakeType],
    };

    const cartItem: CartItem = {
      id: 'ci-custom-' + Date.now(),
      product: customProd,
      quantity: 1,
      selectedFlavour: req.flavour,
      selectedSize: req.weightSize,
      isEggless: req.isEggless,
      cakeMessage: req.cakeMessage,
      customInstructions: req.specialInstructions,
      unitPrice: price,
      totalPrice: price,
    };

    const orderNum = `CC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: orderNum,
      items: [cartItem],
      subtotal: price,
      deliveryCharge: 0,
      discountAmount: 0,
      taxAmount: Number((price * 0.05).toFixed(2)),
      finalTotal: Number((price * 1.05).toFixed(2)),
      customerName: req.customerName,
      customerPhone: req.customerPhone,
      deliveryAddress: selectedAddress || savedAddresses[0],
      deliveryDate: req.requiredDeliveryDate,
      deliveryTimeSlot: req.deliveryTimeSlot,
      paymentMethod: 'Razorpay',
      paymentStatus: 'Paid',
      paymentId: 'pay_custom_' + Date.now(),
      status: 'Confirmed',
      orderDate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      specialInstructions: req.specialInstructions,
      statusHistory: [
        {
          status: 'Confirmed',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Converted from Custom Cake request ${req.requestNumber}`,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    updateCustomCakeStatus(reqId, 'Converted to Order');
    showToast(`Converted ${req.requestNumber} into Order ${orderNum}!`);
    return newOrder;
  };

  const acceptCustomCakeQuote = async (reqId: string) => {
    const order = await convertCustomCakeToOrder(reqId);
    if (order) {
      showToast(`Custom cake quote accepted! Order ${order.orderNumber} is confirmed.`);
      setCustomerTab('orders');
    }
    return order;
  };

  const rejectCustomCakeQuote = (reqId: string) => {
    updateCustomCakeStatus(reqId, 'Rejected', undefined, 'Declined by customer');
    showToast('Custom cake quotation declined.');
  };

  // Notifications
  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const broadcastNotification = (notif: Omit<BakeryNotification, 'id' | 'date' | 'isRead'>) => {
    const newNotif: BakeryNotification = {
      ...notif,
      id: 'notif-' + Date.now(),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Product CRUD
  const addProduct = (prod: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prod,
      id: 'prod-' + Date.now(),
    };
    setProducts((prev) => [newProd, ...prev]);
    if (isSupabaseConfigured()) {
      supabaseService.upsertProduct(newProd);
    }
    showToast(`Product "${prod.name}" added to menu!`);
  };

  const updateProduct = (id: string, prod: Partial<Product>) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...prod } : p));
      if (isSupabaseConfigured()) {
        const target = next.find((p) => p.id === id);
        if (target) supabaseService.upsertProduct(target);
      }
      return next;
    });
    showToast('Product updated successfully');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (isSupabaseConfigured()) {
      supabaseService.deleteProduct(id);
    }
    showToast('Product deleted');
  };

  const toggleProductStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStock = !p.inStock;
          const updated = { ...p, inStock: nextStock };
          if (isSupabaseConfigured()) {
            supabaseService.upsertProduct(updated);
          }
          showToast(`${p.name} is now ${nextStock ? 'In Stock' : 'Out of Stock'}`);
          return updated;
        }
        return p;
      })
    );
  };

  // Category CRUD
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...cat,
      id: 'cat-' + Date.now(),
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${cat.name}" added!`);
  };

  const updateCategory = (id: string, cat: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...cat } : c)));
    showToast('Category updated');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted');
  };

  // Coupon CRUD
  const addCoupon = (cp: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = {
      ...cp,
      id: 'cp-' + Date.now(),
    };
    setCoupons((prev) => [...prev, newCoupon]);
    showToast(`Coupon "${cp.code}" created!`);
  };

  const updateCoupon = (id: string, cp: Partial<Coupon>) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...cp } : c)));
    showToast('Coupon updated');
  };

  const toggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast('Coupon removed');
  };

  // Banner CRUD
  const addBanner = (b: Omit<Banner, 'id'>) => {
    const newB: Banner = {
      ...b,
      id: 'ban-' + Date.now(),
    };
    setBanners((prev) => [...prev, newB]);
    showToast('Promotional banner added!');
  };

  const updateBanner = (id: string, b: Partial<Banner>) => {
    setBanners((prev) => prev.map((item) => (item.id === id ? { ...item, ...b } : item)));
    showToast('Banner updated');
  };

  const toggleBanner = (id: string) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b)));
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    showToast('Banner deleted');
  };

  // Configuration management
  const resetToDefaults = () => {
    Object.values(STORAGE_KEYS).forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch (e) {}
    });
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setBanners(INITIAL_BANNERS);
    setCoupons(INITIAL_COUPONS);
    setOrders(INITIAL_ORDERS);
    setCustomCakeRequests(INITIAL_CUSTOM_CAKES);
    setReviews(INITIAL_REVIEWS);
    setCustomers(INITIAL_CUSTOMERS);
    setSettings(INITIAL_SETTINGS);
    showToast('Bakery reset to official defaults! All changes refreshed.');
  };

  const exportConfigJSON = () => {
    const config = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      settings,
      categories,
      products,
      banners,
      coupons,
    };
    return JSON.stringify(config, null, 2);
  };

  const importConfigJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.settings) setSettings({ ...INITIAL_SETTINGS, ...parsed.settings });
      if (Array.isArray(parsed.categories)) setCategories(parsed.categories);
      if (Array.isArray(parsed.products)) setProducts(parsed.products);
      if (Array.isArray(parsed.banners)) setBanners(parsed.banners);
      if (Array.isArray(parsed.coupons)) setCoupons(parsed.coupons);
      showToast('Configuration successfully imported! Live app updated.');
      return true;
    } catch (err: any) {
      showToast('Failed to import JSON: Invalid format');
      return false;
    }
  };

  return (
    <BakeryContext.Provider
      value={{
        viewMode,
        setViewMode,
        deviceFrame,
        setDeviceFrame,
        customerTab,
        setCustomerTab,

        selectedProduct,
        setSelectedProduct,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        customCakeModalOpen,
        setCustomCakeModalOpen,

        user,
        currentUser: user,
        loginAsGuest,
        loginWithPhone,
        verifyOtp,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalReason,
        setAuthModalReason,
        savedAddresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        deleteAddress,

        categories,
        products,
        selectedCategorySlug,
        setSelectedCategorySlug,
        searchQuery,
        setSearchQuery,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        isEgglessFilter,
        setIsEgglessFilter,
        sortBy,
        setSortBy,

        wishlist,
        toggleWishlist,
        isInWishlist,

        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartDeliveryCharge,
        cartDiscount,
        cartTax,
        cartTotal,

        orders,
        placeOrder,
        updateOrderStatus,
        verifyPayment,
        rejectPayment,
        resubmitPaymentDetails,
        markCashCollected,

        customCakeRequests,
        submitCustomCake,
        updateCustomCakeStatus,
        convertCustomCakeToOrder,
        acceptCustomCakeQuote,
        rejectCustomCakeQuote,

        reviews,
        addReview,
        updateReviewStatus,
        deleteReview,

        customers,
        settings,
        updateSettings,

        coupons,
        banners,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        broadcastNotification,

        addProduct,
        updateProduct,
        duplicateProduct,
        deleteProduct,
        toggleProductStock,
        addCategory,
        updateCategory,
        deleteCategory,
        addCoupon,
        updateCoupon,
        toggleCoupon,
        deleteCoupon,
        addBanner,
        updateBanner,
        toggleBanner,
        deleteBanner,

        resetToDefaults,
        exportConfigJSON,
        importConfigJSON,

        activeToast,
        showToast,
        isDarkMode,
        setIsDarkMode,
        toggleDarkMode,

        // Supabase
        isSupabaseEnabled,
        testSupabaseConnection,
        syncAllToSupabase,
      }}
    >
      {children}
    </BakeryContext.Provider>
  );
};

export const useBakery = () => {
  const context = useContext(BakeryContext);
  if (!context) {
    throw new Error('useBakery must be used within a BakeryProvider');
  }
  return context;
};
