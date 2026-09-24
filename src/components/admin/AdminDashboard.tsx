import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useBakery } from '../../context/BakeryContext';
import { Product, Category, Coupon, Banner, Order, CustomCakeRequest, OrderStatus, CakeFlavour, CakeSize, Review } from '../../types';
import { PrintInvoiceModal } from './PrintInvoiceModal';
import { PaymentVerificationView } from './PaymentVerificationView';
import {
  LayoutDashboard,
  ShoppingBag,
  Cake,
  FolderTree,
  Tag,
  Image as ImageIcon,
  Bell,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  PlusCircle,
  Zap,
  Edit2,
  Trash2,
  Eye,
  Printer,
  Search,
  MessageCircle,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  X,
  Star,
  Settings as SettingsIcon,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Store,
  Download,
  Upload,
  RotateCcw,
  Check,
  Lock,
  ExternalLink,
  FileText,
  Layers,
  Megaphone,
  Palette,
  Banknote,
  Database,
  Cloud,
  Server,
  RefreshCw,
} from 'lucide-react';
import {
  getBakeryWhatsAppUrl,
  BAKERY_WHATSAPP_NUMBER,
  BAKERY_MAPS_URL,
  BAKERY_ADDRESS_TEXT,
} from '../../utils/whatsapp';
import { getSupabaseConfig, updateSupabaseCredentials } from '../../lib/supabase';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    toggleProductStock,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    customCakeRequests,
    updateCustomCakeStatus,
    convertCustomCakeToOrder,
    coupons,
    addCoupon,
    updateCoupon,
    toggleCoupon,
    deleteCoupon,
    banners,
    addBanner,
    updateBanner,
    toggleBanner,
    deleteBanner,
    broadcastNotification,
    reviews,
    updateReviewStatus,
    deleteReview,
    settings,
    updateSettings,
    customers,
    showToast,
    resetToDefaults,
    exportConfigJSON,
    importConfigJSON,
    setViewMode,
    lockAdmin,
    setCustomerTab,
    verifyPayment,
    rejectPayment,
    markCashCollected,
    isSupabaseEnabled,
    testSupabaseConnection,
    syncAllToSupabase,
  } = useBakery();

  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const initialSupabaseConfig = getSupabaseConfig();
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(initialSupabaseConfig.url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(initialSupabaseConfig.anonKey);

  const [activeAdminTab, setActiveAdminTab] = useState<
    | 'dashboard'
    | 'payment-verification'
    | 'orders'
    | 'add-product'
    | 'products'
    | 'custom-cakes'
    | 'categories'
    | 'banners'
    | 'coupons'
    | 'customers'
    | 'reviews'
    | 'settings'
    | 'notifications'
    | 'supabase'
  >('dashboard');

  // Dedicated "Add New Item" Page State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(categories[0]?.slug || 'bento');
  const [newItemPrice, setNewItemPrice] = useState('599');
  const [newItemDiscountPrice, setNewItemDiscountPrice] = useState('499');
  const [newItemDesc, setNewItemDesc] = useState('Freshly baked artisanal recipe with rich cocoa and velvety frosting.');
  const [newItemImage, setNewItemImage] = useState('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80');
  const [newItemIsEggless, setNewItemIsEggless] = useState(true);
  const [newItemInStock, setNewItemInStock] = useState(true);
  const [newItemIsBestseller, setNewItemIsBestseller] = useState(false);
  const [newItemFlavours, setNewItemFlavours] = useState('Dutch Truffle, Belgian Chocolate');
  const [newItemSizes, setNewItemSizes] = useState('0.5 kg, 1.0 kg, 2.0 kg');

  // Review status filter
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Bakery Settings form state
  const [settingsForm, setSettingsForm] = useState(settings);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Print invoice modal state
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Search & Filter in Orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // Product Add / Edit Modal State
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('birthday-cakes');
  const [prodPrice, setProdPrice] = useState('599');
  const [prodDiscountPrice, setProdDiscountPrice] = useState('499');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80');
  const [prodIsEggless, setProdIsEggless] = useState(true);
  const [prodInStock, setProdInStock] = useState(true);
  const [prodFlavours, setProdFlavours] = useState('Dutch Truffle, Belgian Chocolate');
  const [prodSizes, setProdSizes] = useState('0.5 kg, 1.0 kg, 2.0 kg');

  // Category Add / Edit Modal State
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catImage, setCatImage] = useState('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80');
  const [catIcon, setCatIcon] = useState('Cake');

  // Banner Add / Edit Modal State
  const [showBannerModal, setShowBannerModal] = useState<boolean>(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [banTitle, setBanTitle] = useState('');
  const [banSubtitle, setBanSubtitle] = useState('');
  const [banBadge, setBanBadge] = useState('Special Offer');
  const [banImage, setBanImage] = useState('https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1200&q=80');
  const [banActive, setBanActive] = useState(true);

  // Backup / Import / Export JSON State
  const [showImportExportModal, setShowImportExportModal] = useState<boolean>(false);
  const [importExportMode, setImportExportMode] = useState<'export' | 'import'>('export');
  const [jsonText, setJsonText] = useState('');

  // Custom cake quote input state
  const [quotingReqId, setQuotingReqId] = useState<string | null>(null);
  const [quotePriceInput, setQuotePriceInput] = useState<string>('2400');
  const [quoteNoteInput, setQuoteNoteInput] = useState<string>('Confirmed fresh handcrafted design with 2-tier stability');

  // Coupon create state
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('20');
  const [newCouponMin, setNewCouponMin] = useState('499');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Notification Broadcast State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState<'offer' | 'announcement'>('offer');

  // Fast Price Management & Product Filter State
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productSearchFilter, setProductSearchFilter] = useState<string>('');
  const [quickPriceCakeId, setQuickPriceCakeId] = useState<string>('prod-1lb-1');
  const [quickRegularPrice, setQuickRegularPrice] = useState<string>('599');
  const [quickOfferPrice, setQuickOfferPrice] = useState<string>('519');
  const [rowPriceEdits, setRowPriceEdits] = useState<{ [id: string]: { price: string; discountPrice: string; saved?: boolean } }>({});

  const handleSelectQuickCake = (cakeId: string) => {
    setQuickPriceCakeId(cakeId);
    const p = products.find((prod) => prod.id === cakeId);
    if (p) {
      setQuickRegularPrice(p.price.toString());
      setQuickOfferPrice(p.discountPrice ? p.discountPrice.toString() : '');
    }
  };

  const handleSaveQuickPrice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const p = products.find((prod) => prod.id === quickPriceCakeId);
    if (!p) return;
    const regNum = Number(quickRegularPrice);
    if (isNaN(regNum) || regNum <= 0) {
      showToast('Please enter a valid regular price / सही मूल्य दर्ज करें');
      return;
    }
    const offNum = quickOfferPrice.trim() ? Number(quickOfferPrice) : undefined;
    updateProduct(p.id, {
      price: regNum,
      discountPrice: offNum,
    });
    showToast(`✅ "${p.name}" Price updated to ₹${offNum || regNum}! App me turant update ho gaya.`);
  };

  const handleSaveRowPrice = (prodId: string) => {
    const edit = rowPriceEdits[prodId];
    const p = products.find((item) => item.id === prodId);
    if (!p || !edit) return;
    const regNum = Number(edit.price);
    if (isNaN(regNum) || regNum <= 0) {
      showToast('Please enter a valid price / सही मूल्य दर्ज करें');
      return;
    }
    const offNum = edit.discountPrice.trim() ? Number(edit.discountPrice) : undefined;
    updateProduct(prodId, {
      price: regNum,
      discountPrice: offNum,
    });
    setRowPriceEdits((prev) => ({
      ...prev,
      [prodId]: { ...prev[prodId], saved: true },
    }));
    setTimeout(() => {
      setRowPriceEdits((prev) => ({
        ...prev,
        [prodId]: { ...prev[prodId], saved: false },
      }));
    }, 2500);
    showToast(`✅ "${p.name}" Price updated to ₹${offNum || regNum}! Reflected live in App.`);
  };

  // Metrics calculations
  const totalSales = orders.reduce((sum, o) => sum + o.finalTotal, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Placed' || o.status === 'Confirmed' || o.status === 'Preparing');
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');

  // Save product handler
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const flavoursArray = prodFlavours.split(',').map((s) => s.trim() as CakeFlavour).filter(Boolean);
    const sizesArray = prodSizes.split(',').map((s) => s.trim() as CakeSize).filter(Boolean);

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: prodName,
        categorySlug: prodCategory,
        price: Number(prodPrice),
        discountPrice: prodDiscountPrice ? Number(prodDiscountPrice) : undefined,
        description: prodDesc,
        image: prodImage,
        isEggless: prodIsEggless,
        inStock: prodInStock,
        availableFlavours: flavoursArray,
        availableSizes: sizesArray,
      });
      showToast(`Delicacy "${prodName}" updated successfully!`);
    } else {
      addProduct({
        name: prodName,
        categorySlug: prodCategory,
        price: Number(prodPrice),
        discountPrice: prodDiscountPrice ? Number(prodDiscountPrice) : undefined,
        description: prodDesc,
        image: prodImage,
        rating: 4.8,
        reviewCount: 1,
        isEggless: prodIsEggless,
        inStock: prodInStock,
        prepTimeMinutes: 45,
        availableFlavours: flavoursArray,
        availableSizes: sizesArray,
        tags: [prodCategory, prodIsEggless ? 'Eggless' : 'Regular'],
      });
      showToast(`New item "${prodName}" added to the bakery catalog!`);
    }

    setShowProductModal(false);
    setEditingProductId(null);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdCategory(p.categorySlug);
    setProdPrice(p.price.toString());
    setProdDiscountPrice(p.discountPrice ? p.discountPrice.toString() : '');
    setProdDesc(p.description);
    setProdImage(p.image);
    setProdIsEggless(p.isEggless);
    setProdInStock(p.inStock);
    setProdFlavours(p.availableFlavours?.join(', ') || '');
    setProdSizes(p.availableSizes?.join(', ') || '');
    setShowProductModal(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      showToast('Image file too large! Please choose an image under 8MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setter(event.target.result);
        showToast('Image uploaded successfully! ✨');
      }
    };
    reader.readAsDataURL(file);
  };

  const SAMPLE_PRESET_IMAGES = [
    { label: '🍫 Chocolate Truffle', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80' },
    { label: '🍓 Strawberry Cake', url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=700&q=80' },
    { label: '🫐 Blueberry Cheesecake', url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80' },
    { label: '❤️ Red Velvet Heart', url: 'https://images.unsplash.com/photo-1518047601542-4505c67d1e8a?auto=format&fit=crop&w=700&q=80' },
    { label: '🍍 Fresh Pineapple', url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=700&q=80' },
    { label: '💛 Butterscotch Crunch', url: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=700&q=80' },
    { label: '☕ Lotus Biscoff', url: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=700&q=80' },
    { label: '👑 Grand 2-Tier', url: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=700&q=80' },
    { label: '🥐 Croissant', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=80' },
    { label: '🧁 Cupcakes', url: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=700&q=80' },
    { label: '🍪 Choco Brownie', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80' },
    { label: '🍡 Macarons', url: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=700&q=80' },
  ];

  const handlePublishNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      showToast('Please enter an item name / कृपया नाम दर्ज करें');
      return;
    }
    const priceNum = Number(newItemPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast('Please enter a valid price / सही मूल्य दर्ज करें');
      return;
    }

    const flavoursArray = newItemFlavours
      .split(',')
      .map((s) => s.trim() as CakeFlavour)
      .filter(Boolean);
    const sizesArray = newItemSizes
      .split(',')
      .map((s) => s.trim() as CakeSize)
      .filter(Boolean);

    const tagsArray = [newItemCategory, newItemIsEggless ? 'Eggless' : 'Regular'];
    if (newItemIsBestseller) tagsArray.push('Bestseller');

    addProduct({
      name: newItemName.trim(),
      categorySlug: newItemCategory,
      price: priceNum,
      discountPrice: newItemDiscountPrice && Number(newItemDiscountPrice) > 0 ? Number(newItemDiscountPrice) : undefined,
      description: newItemDesc.trim() || 'Freshly prepared handcrafted bakery specialty.',
      image: newItemImage.trim() || SAMPLE_PRESET_IMAGES[0].url,
      rating: 4.9,
      reviewCount: 1,
      isEggless: newItemIsEggless,
      inStock: newItemInStock,
      prepTimeMinutes: 45,
      availableFlavours: flavoursArray,
      availableSizes: sizesArray,
      tags: tagsArray,
    });

    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    showToast(`🎉 "${newItemName.trim()}" is now LIVE in the bakery app!`);
    setNewItemName('');
    setNewItemDiscountPrice('');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    addCoupon({
      code: newCouponCode.toUpperCase(),
      discountPercent: Number(newCouponDiscount),
      minOrderValue: Number(newCouponMin),
      maxDiscount: 200,
      expiryDate: '2026-12-31',
      description: newCouponDesc || `Get ${newCouponDiscount}% OFF on orders above ₹${newCouponMin}`,
      isActive: true,
    });
    setNewCouponCode('');
    setShowCouponModal(false);
  };

  // Category handlers
  const handleOpenAddCategory = () => {
    setEditingCategoryId(null);
    setCatName('');
    setCatSlug('');
    setCatImage('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80');
    setCatIcon('Cake');
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatImage(cat.image);
    setCatIcon(cat.icon);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || !catSlug) return;
    if (editingCategoryId) {
      updateCategory(editingCategoryId, {
        name: catName,
        slug: catSlug,
        image: catImage,
        icon: catIcon,
      });
      showToast(`Category "${catName}" updated successfully!`);
    } else {
      addCategory({
        name: catName,
        slug: catSlug.toLowerCase().replace(/\s+/g, '-'),
        image: catImage,
        icon: catIcon,
        itemCount: 0,
      });
      showToast(`Category "${catName}" created successfully!`);
    }
    setShowCategoryModal(false);
  };

  // Banner handlers
  const handleOpenAddBanner = () => {
    setEditingBannerId(null);
    setBanTitle('');
    setBanSubtitle('');
    setBanBadge('Limited Time Deal');
    setBanImage('https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1200&q=80');
    setBanActive(true);
    setShowBannerModal(true);
  };

  const handleOpenEditBanner = (b: Banner) => {
    setEditingBannerId(b.id);
    setBanTitle(b.title);
    setBanSubtitle(b.subtitle);
    setBanBadge(b.badge);
    setBanImage(b.imageUrl);
    setBanActive(b.isActive);
    setShowBannerModal(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banTitle || !banImage) return;
    if (editingBannerId) {
      updateBanner(editingBannerId, {
        title: banTitle,
        subtitle: banSubtitle,
        badge: banBadge,
        imageUrl: banImage,
        isActive: banActive,
      });
      showToast('Promotional Banner updated successfully!');
    } else {
      addBanner({
        title: banTitle,
        subtitle: banSubtitle,
        badge: banBadge,
        imageUrl: banImage,
        isActive: banActive,
        linkType: 'category',
      });
      showToast('New Promotional Banner added successfully!');
    }
    setShowBannerModal(false);
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;
    broadcastNotification({
      title: notifTitle,
      message: notifMessage,
      type: notifType,
    });
    showToast('Push Notification Broadcasted to all Customer Devices via FCM!');
    setNotifTitle('');
    setNotifMessage('');
  };

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    if (orderStatusFilter !== 'all' && ord.status !== orderStatusFilter) return false;
    if (orderPaymentFilter !== 'all' && ord.paymentMethod !== orderPaymentFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchNum = ord.orderNumber.toLowerCase().includes(q);
      const matchCust = ord.customerName.toLowerCase().includes(q);
      const matchPhone = ord.customerPhone.toLowerCase().includes(q);
      if (!matchNum && !matchCust && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#19100D] text-[#FAF4EE] flex flex-col md:flex-row" id="admin-panel">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#120A07] border-r border-[#362118] p-4 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 px-2 py-1">
            <div className="w-8 h-8 rounded-xl bg-[#8B2F3C] flex items-center justify-center text-rose-200 font-bold shadow-md shadow-[#8B2F3C]/40 border border-[#8B2F3C]/30">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-white">
                CRAVVY CAKES ADMIN
              </div>
              <div className="text-[10px] text-rose-300 font-medium">
                Bakery Command Portal
              </div>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {(() => {
              const pendingBankPaymentsCount = orders.filter(
                (o) =>
                  o.paymentMethod === 'Bank / UPI Transfer' &&
                  (o.paymentStatus === 'Pending Verification' || o.paymentStatus === 'Payment Verification Pending')
              ).length;

              return [
                { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
                {
                  id: 'payment-verification',
                  label: '💳 PAYMENT VERIFICATION',
                  icon: ShieldCheck,
                  badge: pendingBankPaymentsCount > 0 ? `${pendingBankPaymentsCount} Pending` : undefined,
                  isHighlight: true,
                },
                {
                  id: 'orders',
                  label: '2. Live Order Center',
                  icon: ShoppingBag,
                  badge: pendingOrders.length > 0 ? pendingOrders.length : undefined,
                },
                {
                  id: 'add-product',
                  label: '3. ➕ Add New Item (नया आइटम)',
                  icon: PlusCircle,
                  badge: 'Live',
                  isHighlight: true,
                },
                { id: 'products', label: '4. Products & Menu Catalog', icon: FolderTree },
                {
                  id: 'custom-cakes',
                  label: '5. Custom Cake Studio',
                  icon: Cake,
                  badge: customCakeRequests.filter((c) => c.status === 'Pending Quote').length || undefined,
                },
                { id: 'categories', label: '6. Categories', icon: FolderTree },
                { id: 'banners', label: '7. Banners & Flash Deals', icon: ImageIcon },
                { id: 'coupons', label: '8. Coupons & Offers', icon: Tag },
                { id: 'customers', label: '9. Customers', icon: Users },
                {
                  id: 'reviews',
                  label: '10. Reviews & Moderation',
                  icon: Star,
                  badge: reviews.filter((r) => r.status === 'Pending').length || undefined,
                },
                { id: 'settings', label: '11. Bakery Settings', icon: SettingsIcon },
                {
                  id: 'supabase',
                  label: '12. ⚡ Supabase Cloud DB',
                  icon: Database,
                  badge: isSupabaseEnabled ? 'Live' : 'Connect',
                  isHighlight: true,
                },
                { id: 'notifications', label: 'Push Broadcast (FCM)', icon: Bell },
              ];
            })().map((item) => {
              const Icon = item.icon;
              const isActive = activeAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveAdminTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                    isActive
                      ? 'bg-[#8B2F3C] text-white font-bold shadow-md shadow-[#8B2F3C]/40 border border-[#8B2F3C]/30'
                      : (item as any).isHighlight
                      ? 'text-rose-200 hover:text-white bg-[#8B2F3C]/20 hover:bg-[#8B2F3C]/35 border border-[#8B2F3C]/50 font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        (item as any).isHighlight && !isActive
                          ? 'bg-emerald-500 text-neutral-950'
                          : 'bg-rose-500 text-white animate-pulse'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-[#362118] text-[11px] text-neutral-500 px-2 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>REST API & Socket Online</span>
          </div>
          <p>Cravvy Cakes v2.4 • Jalandhar</p>
        </div>
      </aside>

      {/* Main Admin View Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-screen">
        {/* Master Admin Header Bar: Quick Status, Switch to App & Live Changes indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3.5 px-4 rounded-2xl bg-[#221510] border border-[#3E251B] shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${settings.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">
                  {settings.name || 'CRAVVY Cakes'}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#8B2F3C]/40 text-rose-200 border border-[#8B2F3C]/60">
                  Admin Master Hub
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 flex items-center gap-2">
                <span className={settings.isOpen ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                  {settings.isOpen ? '🟢 Store Live & Accepting Orders' : '🔴 Store Closed'}
                </span>
                <span>•</span>
                <span>All changes auto-sync to customer app</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setViewMode('customer');
                setCustomerTab('home');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8B2F3C] to-[#A33948] hover:from-[#722430] hover:to-[#8B2F3C] text-white text-xs font-black shadow-md flex items-center gap-1.5 transition active:scale-95 border border-[#C9A227]/40 cursor-pointer"
              title="Open Customer App to see your changes"
            >
              <Eye className="w-4 h-4 text-[#C9A227]" />
              <span>📱 Live Customer App</span>
            </button>
            <button
              onClick={lockAdmin}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Lock Admin session and return to Customer App"
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Lock & Exit Admin</span>
            </button>
            <button
              onClick={() => setActiveAdminTab('settings')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                activeAdminTab === 'settings'
                  ? 'bg-neutral-800 text-white border-neutral-600'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}
              title="Change Store Settings"
            >
              <SettingsIcon className="w-3.5 h-3.5 text-neutral-400" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: DASHBOARD OVERVIEW */}
        {activeAdminTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#362118]">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Bakery Operations Dashboard
                </h1>
                <p className="text-xs text-neutral-400">
                  Real-time sales telemetry, kitchen order load, and cake production queue.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveAdminTab('add-product')}
                  className="px-3.5 py-2 rounded-xl bg-[#8B2F3C] hover:bg-[#8B2F3C]/90 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 border border-[#8B2F3C]/40"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>➕ Add New Item (नया आइटम)</span>
                </button>
                <button
                  onClick={() => setActiveAdminTab('orders')}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold border border-neutral-700 shadow-sm transition"
                >
                  Manage Live Orders ({orders.length})
                </button>
              </div>
            </div>

            {/* Pending Payment Verification Alert Banner */}
            {(() => {
              const pendingBankCount = orders.filter(
                (o) =>
                  o.paymentMethod === 'Bank / UPI Transfer' &&
                  (o.paymentStatus === 'Pending Verification' || o.paymentStatus === 'Payment Verification Pending')
              ).length;
              if (pendingBankCount === 0) return null;
              return (
                <div className="p-4 rounded-3xl bg-gradient-to-r from-[#8B2F3C]/40 via-[#8B2F3C]/20 to-neutral-900 border border-[#8B2F3C]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#8B2F3C]/30 border border-[#8B2F3C]/40 text-rose-200 flex items-center justify-center flex-shrink-0 animate-pulse">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-white">
                        {pendingBankCount} Bank / UPI {pendingBankCount === 1 ? 'Payment' : 'Payments'} Awaiting Verification
                      </h4>
                      <p className="text-xs text-rose-200/80">
                        Customers have uploaded UTR transaction details. Verify and confirm to start kitchen preparation.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveAdminTab('payment-verification')}
                    className="px-4 py-2 rounded-xl bg-[#8B2F3C] hover:bg-[#722430] text-white shadow-md font-black text-xs shadow-md transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                  >
                    <span>Open Verification Desk</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })()}

            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-3xl bg-[#241712] border border-[#3E251B] shadow-md space-y-1">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Total Gross Sales
                </span>
                <div className="text-2xl font-black text-rose-200">
                  ₹{totalSales.toFixed(0)}
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>+18.4% this week</span>
                </div>
              </div>

              <div className="p-4 rounded-3xl bg-[#241712] border border-[#3E251B] shadow-md space-y-1">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Active Kitchen Queue
                </span>
                <div className="text-2xl font-black text-rose-400">
                  {pendingOrders.length} Orders
                </div>
                <div className="text-[10px] text-neutral-400">
                  Baking & dispatching right now
                </div>
              </div>

              <div className="p-4 rounded-3xl bg-[#241712] border border-[#3E251B] shadow-md space-y-1">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Completed Deliveries
                </span>
                <div className="text-2xl font-black text-emerald-400">
                  {deliveredOrders.length}
                </div>
                <div className="text-[10px] text-neutral-400">
                  100% on-time celebration rating
                </div>
              </div>

              <div className="p-4 rounded-3xl bg-[#241712] border border-[#3E251B] shadow-md space-y-1">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Custom Cake Quotes
                </span>
                <div className="text-2xl font-black text-purple-400">
                  {customCakeRequests.length}
                </div>
                <div className="text-[10px] text-neutral-400">
                  3D themes & multi-tier requests
                </div>
              </div>
            </div>

            {/* Payment Channels & Doorstep Cash Flow Strip */}
            {(() => {
              const codOrders = orders.filter((o) => o.paymentMethod === 'Cash on Delivery');
              const codPendingCash = codOrders
                .filter((o) => o.paymentStatus !== 'Paid')
                .reduce((acc, o) => acc + o.finalTotal, 0);
              const codCollectedCash = codOrders
                .filter((o) => o.paymentStatus === 'Paid')
                .reduce((acc, o) => acc + o.finalTotal, 0);

              const bankOrders = orders.filter((o) => o.paymentMethod === 'Bank / UPI Transfer');
              const bankPendingCount = bankOrders.filter(
                (o) => o.paymentStatus === 'Pending Verification' || o.paymentStatus === 'Payment Verification Pending'
              ).length;

              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* COD Doorstep Cash Tracker */}
                  <div className="p-4 rounded-3xl bg-emerald-950/30 border border-emerald-800/60 shadow-md flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-emerald-400" />
                        <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <div className="text-xl font-black text-white">
                        ₹{codCollectedCash.toFixed(0)} <span className="text-xs font-normal text-emerald-400">Collected</span>
                      </div>
                      <p className="text-[10px] text-neutral-400">
                        {codPendingCash > 0 ? (
                          <span className="text-rose-200 font-bold">
                            ⚠️ ₹{codPendingCash.toFixed(0)} to collect at doorsteps
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">All active COD settled</span>
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOrderPaymentFilter('Cash on Delivery');
                        setActiveAdminTab('orders');
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>View ({codOrders.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bank / UPI Verification Desk */}
                  <div className="p-4 rounded-3xl bg-blue-950/30 border border-blue-800/60 shadow-md flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                        <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                          Bank / UPI Verification
                        </span>
                      </div>
                      <div className="text-xl font-black text-white">
                        {bankOrders.length} <span className="text-xs font-normal text-blue-400">Orders</span>
                      </div>
                      <p className="text-[10px] text-neutral-400">
                        {bankPendingCount > 0 ? (
                          <span className="text-rose-200 font-bold">
                            ⏳ {bankPendingCount} pending UTR verification
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">All payments verified</span>
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveAdminTab('payment-verification')}
                      className="px-2.5 py-1.5 rounded-xl bg-blue-800/60 hover:bg-blue-700 text-blue-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Verify</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Razorpay Online Gateway */}
                  <div className="p-4 rounded-3xl bg-purple-950/30 border border-purple-800/60 shadow-md flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-purple-400" />
                        <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                          Razorpay Online
                        </span>
                      </div>
                      <div className="text-xl font-black text-white">
                        {orders.filter((o) => o.paymentMethod === 'Razorpay').length}{' '}
                        <span className="text-xs font-normal text-purple-400">Instant</span>
                      </div>
                      <p className="text-[10px] text-emerald-400 font-semibold">
                        Direct webhook settlement
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOrderPaymentFilter('Razorpay');
                        setActiveAdminTab('orders');
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-purple-800/60 hover:bg-purple-700 text-purple-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Sales Chart Simulation & Kitchen Dispatch Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Daily Sales Bar Chart */}
              <div className="lg:col-span-2 p-5 rounded-3xl bg-neutral-800/60 border border-neutral-700/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-rose-200" />
                    <span>Weekly Sales Revenue (₹)</span>
                  </h3>
                  <span className="text-[11px] text-neutral-400 font-medium">
                    Aug 10 - Aug 16, 2026
                  </span>
                </div>

                {/* Bars */}
                <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-neutral-700">
                  {[
                    { day: 'Mon', amount: 3400, height: '40%' },
                    { day: 'Tue', amount: 4200, height: '52%' },
                    { day: 'Wed', amount: 3900, height: '48%' },
                    { day: 'Thu', amount: 5600, height: '70%' },
                    { day: 'Fri', amount: 7800, height: '90%' },
                    { day: 'Sat', amount: 8400, height: '98%' },
                    { day: 'Sun', amount: 6900, height: '82%' },
                  ].map((bar) => (
                    <div key={bar.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div className="text-[10px] text-rose-200 font-bold opacity-0 group-hover:opacity-100 transition">
                        ₹{bar.amount}
                      </div>
                      <div
                        className="w-full max-w-[36px] bg-gradient-to-t from-[#8B2F3C] to-[#D4707F] rounded-t-xl transition-all duration-500 hover:brightness-125 shadow-md"
                        style={{ height: bar.height }}
                      ></div>
                      <span className="text-[11px] text-neutral-400 font-semibold">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Cakes Leaderboard */}
              <div className="p-5 rounded-3xl bg-neutral-800/60 border border-neutral-700/80 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-200" />
                  <span>Top Ordered Bakes</span>
                </h3>

                <div className="space-y-3">
                  {products.slice(0, 4).map((p, i) => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-neutral-700 text-rose-200 font-black text-[10px] flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div className="truncate max-w-[140px]">
                          <span className="font-bold text-neutral-200 block truncate">{p.name}</span>
                          <span className="text-[10px] text-neutral-400">{p.reviewCount} orders</span>
                        </div>
                      </div>
                      <span className="font-extrabold text-rose-200">₹{p.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Incoming Orders Quick Strip */}
            <div className="p-5 rounded-3xl bg-neutral-800/60 border border-neutral-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-rose-200" />
                  <span>Incoming Orders Dispatch Queue</span>
                </h3>
                <button
                  onClick={() => setActiveAdminTab('orders')}
                  className="text-xs font-bold text-rose-200 hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {orders.slice(0, 4).map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-700/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{ord.orderNumber}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8B2F3C]/20 text-rose-300 font-bold border border-[#8B2F3C]/30">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {ord.customerName} • {ord.items.length} items • ₹{ord.finalTotal}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedInvoiceOrder(ord)}
                      className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: PAYMENT VERIFICATION */}
        {activeAdminTab === 'payment-verification' && (
          <PaymentVerificationView />
        )}

        {/* VIEW 2: ORDER MANAGEMENT */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#362118]">
              <div>
                <h1 className="text-2xl font-black text-white">Order Management Board</h1>
                <p className="text-xs text-neutral-400">
                  Advance kitchen stages, print thermal receipts, and communicate with customers.
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Search Order ID / Phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#8B2F3C]"
                />

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="Placed">Placed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>

                <select
                  value={orderPaymentFilter}
                  onChange={(e) => setOrderPaymentFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none"
                >
                  <option value="all">All Payments ({orders.length})</option>
                  <option value="Cash on Delivery">💵 Cash on Delivery ({orders.filter(o => o.paymentMethod === 'Cash on Delivery').length})</option>
                  <option value="Bank / UPI Transfer">🏦 Bank / UPI ({orders.filter(o => o.paymentMethod === 'Bank / UPI Transfer').length})</option>
                  <option value="Razorpay">⚡ Razorpay ({orders.filter(o => o.paymentMethod === 'Razorpay').length})</option>
                </select>
              </div>
            </div>

            {/* Quick Payment Method Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-neutral-400 font-semibold text-[11px] uppercase tracking-wider mr-1">Filter Payment:</span>
              <button
                type="button"
                onClick={() => setOrderPaymentFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  orderPaymentFilter === 'all'
                    ? 'bg-[#8B2F3C] text-white shadow-sm border border-[#8B2F3C]/40'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-750'
                }`}
              >
                <span>All Orders</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-900/60 font-black">
                  {orders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrderPaymentFilter('Cash on Delivery')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  orderPaymentFilter === 'Cash on Delivery'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-750'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>Cash on Delivery (COD)</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-900/60 font-black">
                  {orders.filter(o => o.paymentMethod === 'Cash on Delivery').length}
                </span>
                {orders.some(o => o.paymentMethod === 'Cash on Delivery' && o.paymentStatus !== 'Paid') && (
                  <span className="w-2 h-2 rounded-full bg-[#8B2F3C] animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setOrderPaymentFilter('Bank / UPI Transfer')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  orderPaymentFilter === 'Bank / UPI Transfer'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-750'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Bank / UPI</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-900/60 font-black">
                  {orders.filter(o => o.paymentMethod === 'Bank / UPI Transfer').length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrderPaymentFilter('Razorpay')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  orderPaymentFilter === 'Razorpay'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-750'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Razorpay</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-900/60 font-black">
                  {orders.filter(o => o.paymentMethod === 'Razorpay').length}
                </span>
              </button>
            </div>

            {/* Orders Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-3xl bg-[#241712] border border-neutral-700 space-y-4 shadow-lg"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-700">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-white">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-[#8B2F3C]/20 text-rose-300 border border-[#8B2F3C]/30'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400">
                        {ord.orderDate} • Slot: {ord.deliveryDate} ({ord.deliveryTimeSlot})
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-rose-200">
                        ₹{ord.finalTotal}
                      </span>
                      <span className="text-[10px] text-neutral-400 block">
                        {ord.paymentMethod} ({ord.paymentStatus})
                      </span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="text-xs space-y-1 bg-neutral-900/60 p-3 rounded-2xl">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">{ord.customerName}</span>
                      <div className="flex items-center gap-3">
                        <a
                          href={getBakeryWhatsAppUrl(ord, settings.whatsappNumber || BAKERY_WHATSAPP_NUMBER)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-rose-200 font-semibold hover:underline flex items-center gap-1"
                          title="Send order summary to Bakery Kitchen WhatsApp Desk"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Kitchen WhatsApp</span>
                        </a>
                        <a
                          href={`https://wa.me/${ord.customerPhone.replace(/\D/g, '')}?text=Hello ${ord.customerName}, your Cravvy Cakes order ${ord.orderNumber} is currently ${ord.status}.`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Customer</span>
                        </a>
                      </div>
                    </div>
                    <p className="text-neutral-400">
                      {ord.deliveryAddress.houseFlat}, {ord.deliveryAddress.street}, {ord.deliveryAddress.area}, {ord.deliveryAddress.city} - {ord.deliveryAddress.pincode}
                    </p>
                    {ord.specialInstructions && (
                      <p className="text-rose-200 italic pt-1 text-[11px]">
                        📝 Note: "{ord.specialInstructions}"
                      </p>
                    )}
                  </div>

                  {/* Bank / UPI Transfer Verification Badge & Quick Link */}
                  {ord.paymentMethod === 'Bank / UPI Transfer' && (
                    <div
                      className={`p-3 rounded-2xl text-xs flex items-center justify-between border ${
                        ord.paymentStatus === 'Verified'
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                          : ord.paymentStatus === 'Rejected'
                          ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                          : 'bg-[#8B2F3C]/30 border-[#8B2F3C]/60 text-rose-200'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-white">Bank / UPI Transfer</span>
                          <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded-md bg-neutral-900">
                            {ord.paymentStatus}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-neutral-300 block">
                          UTR: {ord.utrTransactionId || 'Pending Input'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {ord.paymentStatus === 'Pending Verification' && (
                          <button
                            type="button"
                            onClick={() => setActiveAdminTab('payment-verification')}
                            className="px-2.5 py-1.5 rounded-xl bg-[#8B2F3C] hover:bg-[#722430] text-white shadow-md font-black text-xs shadow transition flex items-center gap-1 cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verify in Desk</span>
                          </button>
                        )}
                        {ord.paymentStatus === 'Verified' && (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cash on Delivery (COD) Management Badge & Quick Actions */}
                  {ord.paymentMethod === 'Cash on Delivery' && (
                    <div
                      className={`p-3 rounded-2xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border ${
                        ord.paymentStatus === 'Paid'
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                          : 'bg-[#8B2F3C]/30 border-[#8B2F3C]/60 text-rose-200'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Banknote className="w-4 h-4 text-emerald-400" />
                          <span className="font-extrabold text-white">Cash on Delivery</span>
                          <span
                            className={`text-[10px] uppercase font-black px-1.5 py-0.2 rounded-md ${
                              ord.paymentStatus === 'Paid'
                                ? 'bg-emerald-900 text-emerald-200'
                                : 'bg-[#8B2F3C] text-rose-100 border border-[#8B2F3C]/30 animate-pulse'
                            }`}
                          >
                            {ord.paymentStatus === 'Paid' ? 'Paid' : 'Collect on Delivery'}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-300 block">
                          {ord.paymentStatus === 'Paid' ? (
                            <span className="text-emerald-300 font-semibold">
                              ✓ ₹{ord.finalTotal} collected and accounted
                            </span>
                          ) : (
                            <span>
                              Collect <strong className="text-white font-mono font-bold text-xs">₹{ord.finalTotal}</strong> on doorstep handover
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {ord.paymentStatus !== 'Paid' ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => markCashCollected(ord.id, 'Cash')}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow transition flex items-center gap-1 cursor-pointer"
                              title="Mark as paid with physical cash"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Cash Collected</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => markCashCollected(ord.id, 'Rider UPI QR')}
                              className="px-2 py-1.5 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-neutral-200 font-bold text-xs transition cursor-pointer"
                              title="Mark as paid via Rider's UPI QR"
                            >
                              <span>Rider UPI</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-emerald-800">
                            <Check className="w-3.5 h-3.5" />
                            <span>Payment Settled</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="space-y-1.5 text-xs text-neutral-300">
                    {ord.items.map((it) => (
                      <div key={it.id} className="flex justify-between">
                        <span>
                          {it.quantity}x {it.product.name}
                          {it.selectedSize ? ` (${it.selectedSize})` : ''}
                          {it.selectedFlavour ? ` • ${it.selectedFlavour}` : ''}
                        </span>
                        <span className="font-bold text-white">₹{it.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stage Advance Buttons */}
                  <div className="pt-3 border-t border-neutral-700 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'Confirmed', 'Order accepted by Kitchen')}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                          ord.status === 'Confirmed' ? 'bg-blue-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                        }`}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'Preparing', 'Chef baking fresh in kitchen')}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                          ord.status === 'Preparing' ? 'bg-[#8B2F3C] text-white border border-[#8B2F3C]/40' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                        }`}
                      >
                        Bake & Pipe
                      </button>
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'Out for Delivery', 'Courier on route with cake box')}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                          ord.status === 'Out for Delivery' ? 'bg-purple-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                        }`}
                      >
                        Out for Delivery
                      </button>
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'Delivered', 'Handed to customer')}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                          ord.status === 'Delivered' ? 'bg-emerald-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                        }`}
                      >
                        Delivered
                      </button>
                    </div>

                    <button
                      onClick={() => setSelectedInvoiceOrder(ord)}
                      className="px-3 py-1 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Tax Bill</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: CUSTOM CAKE REQUESTS */}
        {activeAdminTab === 'custom-cakes' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#362118]">
              <h1 className="text-2xl font-black text-white">Custom Cake Studio Inquiries</h1>
              <p className="text-xs text-neutral-400">
                Review user uploaded designs, calculate intricate handcrafting labor, send price quotes, and convert to production orders.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {customCakeRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-3xl bg-[#241712] border border-neutral-700 space-y-4 shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-base font-black text-white">{req.requestNumber}</span>
                      <span className="text-xs text-neutral-400 block">{req.createdAt}</span>
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        req.status === 'Approved & Quoted'
                          ? 'bg-blue-500/20 text-blue-400'
                          : req.status === 'Converted to Order'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-[#8B2F3C]/20 text-rose-300 border border-[#8B2F3C]/30'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  {/* Customer Info & Photo */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start bg-neutral-900/70 p-3.5 rounded-2xl">
                    <div className="w-28 h-28 rounded-xl overflow-hidden bg-neutral-950 border border-[#8B2F3C]/40 flex-shrink-0">
                      <img
                        src={req.referenceImageUrl}
                        alt="Reference"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="font-bold text-white text-sm">{req.customerName}</div>
                      <div className="text-neutral-400">{req.customerPhone}</div>
                      <div className="text-rose-200 font-semibold">
                        {req.cakeType} • {req.weightSize} • {req.flavour}
                      </div>
                      <div className="text-neutral-400">
                        Required: <strong>{req.requiredDeliveryDate} ({req.deliveryTimeSlot})</strong>
                      </div>
                      {req.cakeMessage && (
                        <div className="text-neutral-300 italic">
                          Piping: "{req.cakeMessage}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Special instructions */}
                  {req.specialInstructions && (
                    <div className="p-3 rounded-xl bg-neutral-900/40 text-xs text-neutral-300">
                      <strong className="text-neutral-400">Instructions:</strong> {req.specialInstructions}
                    </div>
                  )}

                  {/* Quoting and Conversion Actions */}
                  <div className="pt-2 border-t border-neutral-700 flex flex-wrap items-center justify-between gap-2">
                    {quotingReqId === req.id ? (
                      <div className="w-full space-y-2 bg-neutral-900 p-3 rounded-2xl">
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Quoted Price (₹)"
                            value={quotePriceInput}
                            onChange={(e) => setQuotePriceInput(e.target.value)}
                            className="w-1/3 px-3 py-1.5 rounded-xl bg-neutral-800 text-xs text-white font-bold"
                          />
                          <input
                            type="text"
                            placeholder="Note to customer"
                            value={quoteNoteInput}
                            onChange={(e) => setQuoteNoteInput(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-xl bg-neutral-800 text-xs text-white"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setQuotingReqId(null)}
                            className="px-3 py-1 rounded-lg bg-neutral-700 text-xs font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              updateCustomCakeStatus(
                                req.id,
                                'Approved & Quoted',
                                Number(quotePriceInput),
                                quoteNoteInput
                              );
                              setQuotingReqId(null);
                            }}
                            className="px-3 py-1 rounded-lg bg-[#8B2F3C] text-white text-xs font-bold border border-[#8B2F3C]/40"
                          >
                            Submit Quote (₹{quotePriceInput})
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-xs">
                          <span className="text-neutral-400 block text-[10px]">Price Quote</span>
                          <span className="text-base font-black text-rose-200">
                            {req.quotedPrice ? `₹${req.quotedPrice}` : 'Needs Price Quote'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setQuotingReqId(req.id);
                              setQuotePriceInput(req.quotedPrice ? req.quotedPrice.toString() : '2500');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-bold"
                          >
                            {req.quotedPrice ? 'Edit Quote' : 'Set Price Quote'}
                          </button>

                          {req.status === 'Approved & Quoted' && (
                            <button
                              onClick={() => convertCustomCakeToOrder(req.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Convert to Live Order</span>
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: DEDICATED ADD NEW ITEM & LIVE APP REFLECTION */}
        {activeAdminTab === 'add-product' && (
          <div className="space-y-6">
            {/* Header Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#362118]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#8B2F3C]/20 text-rose-200 border border-[#8B2F3C]/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Instant Live App Sync
                  </span>
                  <span className="text-xs text-neutral-400">नया आइटम जोड़ें</span>
                </div>
                <h1 className="text-2xl font-black text-white mt-1">
                  Add New Bakery Item / नया आइटम
                </h1>
                <p className="text-xs text-neutral-400">
                  Left column me details bharein, right column me live preview dekhein. Jaise hi aap 'Publish' karenge, turant customer app me live reflect hoga!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('customer');
                    setCustomerTab('home');
                    showToast('Switched to Customer App! Look for your newly added item.');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-rose-200 text-xs font-bold flex items-center gap-1.5 border border-neutral-700 transition shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>👀 Open Customer App</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('products')}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1.5 border border-neutral-700 transition"
                >
                  <FolderTree className="w-3.5 h-3.5" />
                  <span>All Products Table</span>
                </button>
              </div>
            </div>

            {/* 2-Column Responsive Layout: Left = Entry Form, Right = Live Preview & Recent Additions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: Input Form (7 cols) */}
              <div className="lg:col-span-7 bg-[#241712] border border-[#3E251B] rounded-3xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-700/70">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-rose-200" />
                    <span>Delicacy Entry Details (आइटम की जानकारी)</span>
                  </h2>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Direct to Customer Store
                  </span>
                </div>

                <form onSubmit={handlePublishNewItem} className="space-y-4 text-xs">
                  {/* Row 1: Item Name */}
                  <div>
                    <label className="block font-bold text-neutral-200 mb-1">
                      Item Name / केक या आइटम का नाम <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Belgian Royal Truffle Chocolate Cake"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-semibold text-sm focus:border-[#8B2F3C] focus:outline-none transition"
                    />
                  </div>

                  {/* Row 2: Category & Dietary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-neutral-200">
                          Bakery Category / कैटेगरी <span className="text-rose-400">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategoryId(null);
                            setCatName('');
                            setCatSlug('');
                            setShowCategoryModal(true);
                          }}
                          className="text-[10px] text-rose-200 hover:underline"
                        >
                          + New Category
                        </button>
                      </div>
                      <select
                        value={newItemCategory}
                        onChange={(e) => setNewItemCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-semibold focus:border-[#8B2F3C] focus:outline-none"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.slug}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-200 mb-1">
                        Dietary Preference / प्रकार
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewItemIsEggless(true)}
                          className={`py-2 px-2 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition ${
                            newItemIsEggless
                              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm'
                              : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-sm border border-emerald-500 flex items-center justify-center p-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          </span>
                          <span>100% Veg</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewItemIsEggless(false)}
                          className={`py-2 px-2 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition ${
                            !newItemIsEggless
                              ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-sm'
                              : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-sm border border-rose-500 flex items-center justify-center p-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          </span>
                          <span>Contains Egg</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Pricing with Auto-calculated Discount */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-700">
                    <div>
                      <label className="block font-bold text-neutral-200 mb-1">
                        Selling / Offer Price (₹) <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-neutral-400 font-bold">₹</span>
                        <input
                          type="number"
                          required
                          min="1"
                          placeholder="499"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(e.target.value)}
                          className="w-full pl-7 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-rose-200 font-black text-sm focus:border-[#8B2F3C] focus:outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-neutral-400 mt-1 block">
                        Customer will pay this amount in App
                      </span>
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-200 mb-1">
                        MRP / Strikethrough Price (₹) <span className="text-neutral-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-neutral-400 font-bold">₹</span>
                        <input
                          type="number"
                          min="1"
                          placeholder="649"
                          value={newItemDiscountPrice}
                          onChange={(e) => setNewItemDiscountPrice(e.target.value)}
                          className="w-full pl-7 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-300 font-bold text-sm focus:border-[#8B2F3C] focus:outline-none"
                        />
                      </div>
                      {newItemDiscountPrice && Number(newItemDiscountPrice) > Number(newItemPrice) ? (
                        <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
                          🎉 {Math.round(((Number(newItemDiscountPrice) - Number(newItemPrice)) / Number(newItemDiscountPrice)) * 100)}% Discount tag will be shown!
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-400 mt-1 block">
                          Leave empty if no discount ribbon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Photo Selection with Device Upload & Quick Presets */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-neutral-200">
                        Item Photo (फोटो चुनें या अपलोड करें) <span className="text-rose-400">*</span>
                      </label>
                      <label
                        htmlFor="new-item-file-upload"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#8B2F3C]/20 text-rose-300 border border-[#8B2F3C]/40 text-xs font-semibold hover:bg-[#8B2F3C]/30 cursor-pointer transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from Device</span>
                      </label>
                      <input
                        id="new-item-file-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFileUpload(e, setNewItemImage)}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      {newItemImage ? (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-900 flex-shrink-0 group">
                          <img
                            src={newItemImage}
                            alt="Selected preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setNewItemImage('')}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition"
                            title="Remove image"
                          >
                            <X className="w-4 h-4 text-rose-400" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl border border-dashed border-neutral-700 bg-neutral-900/50 flex flex-col items-center justify-center text-neutral-500 flex-shrink-0">
                          <ImageIcon className="w-5 h-5 mb-0.5" />
                          <span className="text-[9px]">No photo</span>
                        </div>
                      )}

                      <div className="flex-1">
                        <input
                          type="text"
                          required
                          placeholder="Paste image URL (https://...) or upload above"
                          value={newItemImage}
                          onChange={(e) => setNewItemImage(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:border-[#8B2F3C] focus:outline-none text-sm"
                        />
                      </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="mt-2.5 space-y-1.5">
                      <span className="text-[10px] font-bold text-neutral-400 block">
                        ⚡ Quick Select Professional Bakery Photos (1-Click):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {SAMPLE_PRESET_IMAGES.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setNewItemImage(preset.url)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                              newItemImage === preset.url
                                ? 'bg-[#8B2F3C] border-[#8B2F3C]/50 text-white'
                                : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row 5: Flavours & Sizes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-200 mb-1">
                        Available Flavours (कॉमा से अलग करें)
                      </label>
                      <input
                        type="text"
                        placeholder="Dutch Truffle, Belgian, Hazelnut"
                        value={newItemFlavours}
                        onChange={(e) => setNewItemFlavours(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-medium focus:border-[#8B2F3C] focus:outline-none"
                      />
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {['Dutch Truffle', 'Red Velvet', 'Black Forest', 'Butterscotch', 'Pineapple'].map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => {
                              if (!newItemFlavours.includes(f)) {
                                setNewItemFlavours((prev) => (prev ? `${prev}, ${f}` : f));
                              }
                            }}
                            className="px-1.5 py-0.5 rounded bg-neutral-900 text-[10px] text-neutral-400 hover:text-rose-200 border border-neutral-700"
                          >
                            +{f}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-200 mb-1">
                        Available Sizes / Weights (कॉमा से अलग करें)
                      </label>
                      <input
                        type="text"
                        placeholder="0.5 kg, 1.0 kg, 2.0 kg"
                        value={newItemSizes}
                        onChange={(e) => setNewItemSizes(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-medium focus:border-[#8B2F3C] focus:outline-none"
                      />
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {['0.5 kg', '1.0 kg', '1.5 kg', '2.0 kg', 'Pack of 4', 'Single'].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              if (!newItemSizes.includes(s)) {
                                setNewItemSizes((prev) => (prev ? `${prev}, ${s}` : s));
                              }
                            }}
                            className="px-1.5 py-0.5 rounded bg-neutral-900 text-[10px] text-neutral-400 hover:text-rose-200 border border-neutral-700"
                          >
                            +{s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row 6: Stock & Bestseller Toggles */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newItemInStock}
                        onChange={(e) => setNewItemInStock(e.target.checked)}
                        className="w-4 h-4 rounded text-[#8B2F3C] accent-[#8B2F3C]"
                      />
                      <div>
                        <span className="font-bold text-white block">In Stock (उपलब्ध है)</span>
                        <span className="text-[10px] text-neutral-400">Available immediately for customer orders</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newItemIsBestseller}
                        onChange={(e) => setNewItemIsBestseller(e.target.checked)}
                        className="w-4 h-4 rounded text-[#8B2F3C] accent-[#8B2F3C]"
                      />
                      <div>
                        <span className="font-bold text-rose-200 block">⭐ Chef Bestseller Badge</span>
                        <span className="text-[10px] text-neutral-400">Show golden "Bestseller" ribbon</span>
                      </div>
                    </label>
                  </div>

                  {/* Row 7: Description */}
                  <div>
                    <label className="block font-bold text-neutral-200 mb-1">
                      Description & Flavor Profile / विवरण
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Handcrafted with 64% single-origin Belgian chocolate, Madagascar vanilla bean sponge, and dusted cocoa..."
                      value={newItemDesc}
                      onChange={(e) => setNewItemDesc(e.target.value)}
                      className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:border-[#8B2F3C] focus:outline-none"
                    />
                  </div>

                  {/* Submit CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 rounded-2xl bg-[#8B2F3C] hover:bg-[#8B2F3C]/90 text-white font-extrabold text-sm shadow-lg shadow-[#8B2F3C]/30 border border-[#8B2F3C]/40 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>🚀 Publish Item & Reflect in Live App (ऐप में लाइव करें)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewItemName('');
                        setNewItemPrice('599');
                        setNewItemDiscountPrice('');
                        setNewItemDesc('Fresh artisanal bake');
                        showToast('Form cleared');
                      }}
                      className="py-3 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 font-bold transition"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>

              {/* RIGHT COLUMN: Live Customer App Mobile Card Preview & Recently Added (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Live Card Preview */}
                <div className="bg-[#241712] border border-[#3E251B] rounded-3xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-700/60">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <Eye className="w-4 h-4 text-rose-200" />
                      <span>Live Customer App Preview</span>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Real-time
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-400">
                    This is exactly how customers will see your new delicacy on their mobile screens:
                  </p>

                  {/* Simulated Mobile Card */}
                  <div className="rounded-2xl border border-neutral-700 bg-neutral-900 overflow-hidden shadow-2xl relative max-w-sm mx-auto">
                    {/* Image Box */}
                    <div className="relative h-44 w-full bg-neutral-950 overflow-hidden">
                      <img
                        src={newItemImage || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80'}
                        alt={newItemName || 'Delicacy Preview'}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />

                      {/* Dietary Veg/Egg Badge */}
                      <div className="absolute top-2.5 left-2.5 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs p-1 rounded-md shadow">
                        <div
                          className={`w-3.5 h-3.5 border flex items-center justify-center ${
                            newItemIsEggless ? 'border-emerald-600' : 'border-rose-600'
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              newItemIsEggless ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
                        {newItemDiscountPrice && Number(newItemDiscountPrice) > Number(newItemPrice) && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow">
                            {Math.round(((Number(newItemDiscountPrice) - Number(newItemPrice)) / Number(newItemDiscountPrice)) * 100)}% OFF
                          </span>
                        )}
                        {newItemIsBestseller && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8B2F3C] text-white shadow-sm shadow flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            Bestseller
                          </span>
                        )}
                      </div>

                      {!newItemInStock && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="px-3 py-1 rounded-xl bg-rose-600 text-white font-bold text-xs uppercase tracking-wider">
                            Sold Out (Out of Stock)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-200">
                          {categories.find((c) => c.slug === newItemCategory)?.name || newItemCategory}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-rose-200 font-bold">
                          <Star className="w-3 h-3 fill-[#E8C15A] text-[#E8C15A]" />
                          <span>4.9 (1)</span>
                        </div>
                      </div>

                      <h3 className="font-extrabold text-white text-sm leading-tight line-clamp-1">
                        {newItemName || 'Your Item Title Appears Here'}
                      </h3>

                      <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                        {newItemDesc || 'Freshly baked artisanal recipe with premium ingredients.'}
                      </p>

                      {/* Portions / Sizes Chips */}
                      {newItemSizes && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {newItemSizes.split(',').slice(0, 3).map((sz, idx) => (
                            <span
                              key={idx}
                              className={`text-[9px] px-2 py-0.5 rounded-md font-semibold ${
                                idx === 0
                                  ? 'bg-[#8B2F3C]/30 text-rose-200 border border-[#8B2F3C]/40'
                                  : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                              }`}
                            >
                              {sz.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Price & Add to Cart Button */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#362118]">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-white">
                              ₹{newItemPrice || '0'}
                            </span>
                            {newItemDiscountPrice && Number(newItemDiscountPrice) > Number(newItemPrice) && (
                              <span className="text-xs text-neutral-500 line-through">
                                ₹{newItemDiscountPrice}
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-neutral-400 block">Taxes included</span>
                        </div>

                        <button
                          type="button"
                          className="px-3.5 py-1.5 rounded-xl bg-[#8B2F3C] hover:bg-[#8B2F3C]/90 text-white font-bold text-xs shadow border border-[#8B2F3C]/40 transition active:scale-95 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Switch to customer app CTA */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('customer');
                        setCustomerTab('home');
                        showToast('Customer app opened! Look for your live bakes.');
                      }}
                      className="w-full py-2.5 px-3 rounded-2xl bg-neutral-900 hover:bg-neutral-950 text-rose-200 font-bold text-xs border border-[#8B2F3C]/40 flex items-center justify-center gap-2 transition shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>👀 Switch to Customer App to View Live Result</span>
                    </button>
                  </div>
                </div>

                {/* Recently Added Delicacies Card */}
                <div className="bg-[#241712] border border-[#3E251B] rounded-3xl p-5 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Cake className="w-3.5 h-3.5 text-rose-200" />
                      <span>Recently Added Delicacies ({products.length} Total)</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveAdminTab('products')}
                      className="text-[10px] text-rose-200 hover:underline"
                    >
                      View Table →
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    {products.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-700/70 flex items-center justify-between gap-3 hover:border-neutral-600 transition"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-xl object-cover bg-neutral-950 flex-shrink-0"
                          />
                          <div className="truncate">
                            <span className="font-bold text-white block truncate">{p.name}</span>
                            <span className="text-[10px] text-rose-200 font-semibold">
                              ₹{p.price} • {p.isEggless ? 'Veg' : 'Egg'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleProductStock(p.id)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                              p.inStock
                                ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                                : 'bg-rose-900/60 text-rose-300 border border-rose-700'
                            }`}
                          >
                            {p.inStock ? 'In Stock' : 'Out'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove "${p.name}"?`)) {
                                deleteProduct(p.id);
                                showToast(`Removed ${p.name}`);
                              }
                            }}
                            className="p-1 rounded-lg bg-neutral-800 hover:bg-rose-900/50 text-rose-300"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: PRODUCT MANAGEMENT & PRICE MANAGER */}
        {activeAdminTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#362118]">
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <span>Bakery Products & Price Manager</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#8B2F3C]/40 text-rose-200 border border-[#8B2F3C]/60 font-bold">
                    Live Sync
                  </span>
                </h1>
                <p className="text-xs text-[#C4ABA1]">
                  Change prices for 1-pound, 2-pound, or any cake with 1 click. Updates automatically reflect live across the Customer App!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveAdminTab('add-product')}
                  className="px-4 py-2 rounded-xl bg-[#8B2F3C] hover:bg-[#722430] text-white text-xs font-bold flex items-center gap-1.5 shadow-md border border-[#8B2F3C]/50 transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>➕ Add New Delicacy</span>
                </button>
                <button
                  onClick={() => {
                    setEditingProductId(null);
                    setProdName('');
                    setProdPrice('599');
                    setProdDiscountPrice('499');
                    setProdDesc('Fresh handcrafted artisanal bake');
                    setShowProductModal(true);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#281812] hover:bg-[#342018] text-[#FAF4EE] text-xs font-bold flex items-center gap-1.5 border border-[#44281E] transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Quick Modal</span>
                </button>
              </div>
            </div>

            {/* QUICK CAKE PRICE MANAGER CARD */}
            {(() => {
              const selectedCake = products.find((p) => p.id === quickPriceCakeId) || products[0];
              return (
                <div className="p-4 sm:p-5 rounded-3xl bg-[#251712] border border-[#42291E] shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3A2219] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#8B2F3C]/30 text-rose-300 flex items-center justify-center font-black">
                        ⚡
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-[#FAF4EE]">
                          Instant Price Modifier (तुरंत केक प्राइज़ बदलें)
                        </h3>
                        <p className="text-[11px] text-[#C4ABA1]">
                          Select any cake, adjust the price, and save. It immediately updates on the Customer Home Screen & Cart!
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-800/40 self-start sm:self-auto">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Customer App Auto-Reflect Active</span>
                    </div>
                  </div>

                  {/* Cake Selector Chips */}
                  <div>
                    <div className="text-[11px] font-bold text-[#C4ABA1] mb-1.5">
                      Select Cake to Edit Price (प्राइज़ बदलने के लिए केक चुनें):
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                      {products.map((cake) => {
                        const isSelected = cake.id === (selectedCake?.id);
                        return (
                          <button
                            key={cake.id}
                            type="button"
                            onClick={() => handleSelectQuickCake(cake.id)}
                            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                              isSelected
                                ? 'bg-[#8B2F3C] text-white font-bold shadow-sm border border-[#A63848]'
                                : 'bg-[#1D120E] text-[#D8C2B8] hover:text-[#FAF4EE] hover:bg-[#2A1A14] border border-[#3A2219]'
                            }`}
                          >
                            <img
                              src={cake.image}
                              alt={cake.name}
                              referrerPolicy="no-referrer"
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span className="truncate max-w-[140px] sm:max-w-[180px]">{cake.name}</span>
                            <span className="font-extrabold text-[10px] opacity-90">
                              ₹{cake.discountPrice || cake.price}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Cake Price Controls */}
                  {selectedCake && (
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#1A100C] border border-[#3E251B]">
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedCake.image}
                          alt={selectedCake.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-2xl object-cover border border-[#4E2E23] flex-shrink-0 shadow-sm"
                        />
                        <div>
                          <div className="text-xs px-2 py-0.5 rounded-full bg-[#8B2F3C]/20 text-rose-300 font-bold border border-[#8B2F3C]/40 inline-block mb-1 capitalize">
                            {selectedCake.categorySlug.replace('-', ' ')}
                          </div>
                          <h4 className="font-black text-sm text-[#FAF4EE]">{selectedCake.name}</h4>
                          <div className="text-xs text-[#C4ABA1] mt-0.5">
                            Current Selling: <span className="font-bold text-emerald-400">₹{selectedCake.discountPrice || selectedCake.price}</span>
                            {selectedCake.discountPrice && (
                              <span className="line-through text-[10px] ml-1.5 opacity-60">₹{selectedCake.price}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick Pricing Inputs & Quick Steppers */}
                      <form
                        onSubmit={handleSaveQuickPrice}
                        className="flex flex-wrap items-center gap-3 w-full md:w-auto"
                      >
                        <div className="flex items-center gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-[#C4ABA1] block uppercase tracking-wider">
                              Regular MRP (₹)
                            </label>
                            <input
                              type="number"
                              value={quickRegularPrice}
                              onChange={(e) => setQuickRegularPrice(e.target.value)}
                              className="w-24 px-2.5 py-1.5 rounded-xl bg-[#261813] border border-[#4E2E23] text-white font-extrabold text-sm focus:border-[#8B2F3C] focus:outline-none"
                              placeholder="MRP"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-[#C4ABA1] block uppercase tracking-wider">
                              Offer / App Price (₹)
                            </label>
                            <input
                              type="number"
                              value={quickOfferPrice}
                              onChange={(e) => setQuickOfferPrice(e.target.value)}
                              className="w-24 px-2.5 py-1.5 rounded-xl bg-[#261813] border border-emerald-600/50 text-emerald-400 font-extrabold text-sm focus:border-emerald-500 focus:outline-none"
                              placeholder="Offer"
                            />
                          </div>
                        </div>

                        {/* Quick +/- Buttons */}
                        <div className="flex items-center gap-1 pt-3 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => {
                              const curr = Number(quickOfferPrice || quickRegularPrice);
                              setQuickOfferPrice(Math.max(10, curr - 50).toString());
                            }}
                            className="px-2 py-1 rounded-lg bg-[#261813] hover:bg-[#342018] text-xs font-bold text-[#C4ABA1] border border-[#44281E]"
                            title="Decrease by ₹50"
                          >
                            -₹50
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const curr = Number(quickOfferPrice || quickRegularPrice);
                              setQuickOfferPrice((curr + 50).toString());
                            }}
                            className="px-2 py-1 rounded-lg bg-[#261813] hover:bg-[#342018] text-xs font-bold text-[#C4ABA1] border border-[#44281E]"
                            title="Increase by ₹50"
                          >
                            +₹50
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const curr = Number(quickOfferPrice || quickRegularPrice);
                              setQuickOfferPrice((curr + 100).toString());
                            }}
                            className="px-2 py-1 rounded-lg bg-[#261813] hover:bg-[#342018] text-xs font-bold text-[#C4ABA1] border border-[#44281E]"
                            title="Increase by ₹100"
                          >
                            +₹100
                          </button>
                        </div>

                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-[#8B2F3C] hover:bg-[#722430] text-white font-black text-xs shadow-md border border-[#A63848] transition flex items-center gap-1.5 cursor-pointer mt-3 sm:mt-0"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Save & Reflect in App</span>
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Category Filter & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { slug: 'all', label: `All Bakes (${products.length})` },
                  {
                    slug: '1-pound',
                    label: `🎂 1 Pound (Chote Cake - ${products.filter((p) => p.categorySlug === '1-pound').length})`,
                  },
                  {
                    slug: '2-pounds',
                    label: `🎂 2 Pounds (Bade Cake - ${products.filter((p) => p.categorySlug === '2-pounds').length})`,
                  },
                  {
                    slug: 'bento',
                    label: `🧁 Bento (${products.filter((p) => p.categorySlug === 'bento').length})`,
                  },
                  {
                    slug: 'birthday-cakes',
                    label: `🎉 Birthday (${products.filter((p) => p.categorySlug === 'birthday-cakes').length})`,
                  },
                ].map((tab) => (
                  <button
                    key={tab.slug}
                    type="button"
                    onClick={() => setProductCategoryFilter(tab.slug)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      productCategoryFilter === tab.slug
                        ? 'bg-[#8B2F3C] text-white shadow-sm border border-[#A63848]'
                        : 'bg-[#221510] text-[#C4ABA1] hover:text-[#FAF4EE] hover:bg-[#2C1B14] border border-[#3A2219]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A68F85]" />
                <input
                  type="text"
                  value={productSearchFilter}
                  onChange={(e) => setProductSearchFilter(e.target.value)}
                  placeholder="Search cake name / केक खोजें..."
                  className="w-full md:w-64 pl-8 pr-3 py-1.5 rounded-xl bg-[#221510] border border-[#3E251B] text-xs text-[#FAF4EE] placeholder-[#A68F85] focus:outline-none focus:border-[#8B2F3C]"
                />
              </div>
            </div>

            {/* Products Table with Direct Inline Price Editing */}
            {(() => {
              const displayedProducts = products.filter((p) => {
                if (productCategoryFilter !== 'all' && p.categorySlug !== productCategoryFilter) return false;
                if (productSearchFilter.trim()) {
                  const q = productSearchFilter.toLowerCase();
                  if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) {
                    return false;
                  }
                }
                return true;
              });

              return (
                <div className="overflow-x-auto rounded-3xl border border-[#3E251B] bg-[#241712]">
                  <table className="w-full text-left text-xs text-[#E8DACD]">
                    <thead className="bg-[#1A100C] text-[#C4ABA1] font-bold uppercase text-[10px] border-b border-[#3E251B]">
                      <tr>
                        <th className="p-3">Cake / Delicacy</th>
                        <th className="p-3">Category</th>
                        <th className="p-3 min-w-[200px]">
                          Price Control (प्राइज़ बदलें - App Reflect)
                        </th>
                        <th className="p-3">Dietary</th>
                        <th className="p-3">Stock Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#362118]">
                      {displayedProducts.map((prod) => {
                        const editState = rowPriceEdits[prod.id] || {
                          price: prod.price.toString(),
                          discountPrice: prod.discountPrice ? prod.discountPrice.toString() : '',
                        };

                        return (
                          <tr key={prod.id} className="hover:bg-[#2C1B15]/50 transition">
                            <td className="p-3 flex items-center gap-3">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-2xl object-cover border border-[#44281E] flex-shrink-0"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (!target.src.includes('unsplash.com')) {
                                    target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=80';
                                  }
                                }}
                              />
                              <div>
                                <div className="font-bold text-[#FAF4EE] flex items-center gap-1.5">
                                  <span>{prod.name}</span>
                                  {prod.categorySlug === '1-pound' && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40 font-bold">
                                      0.5 kg (Chota)
                                    </span>
                                  )}
                                  {prod.categorySlug === '2-pounds' && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950/40 text-rose-300 border border-rose-800/40 font-bold">
                                      1.0 kg (Bada)
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-[#A68F85] truncate max-w-xs">
                                  {prod.description}
                                </div>
                              </div>
                            </td>
                            <td className="p-3 font-semibold capitalize text-[#FAF4EE]">
                              {prod.categorySlug.replace('-', ' ')}
                            </td>
                            {/* Interactive Inline Price Edit Cell */}
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div>
                                  <div className="text-[9px] text-[#A68F85] font-semibold">MRP (₹)</div>
                                  <input
                                    type="number"
                                    value={editState.price}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setRowPriceEdits((prev) => ({
                                        ...prev,
                                        [prod.id]: {
                                          price: val,
                                          discountPrice: prev[prod.id]?.discountPrice ?? (prod.discountPrice?.toString() || ''),
                                        },
                                      }));
                                    }}
                                    className="w-16 px-2 py-1 rounded-lg bg-[#180E0B] border border-[#482D22] text-[#FAF4EE] font-bold text-xs focus:outline-none focus:border-[#8B2F3C]"
                                    title="Regular MRP"
                                  />
                                </div>
                                <div>
                                  <div className="text-[9px] text-emerald-400 font-semibold">Offer (₹)</div>
                                  <input
                                    type="number"
                                    value={editState.discountPrice}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setRowPriceEdits((prev) => ({
                                        ...prev,
                                        [prod.id]: {
                                          price: prev[prod.id]?.price ?? prod.price.toString(),
                                          discountPrice: val,
                                        },
                                      }));
                                    }}
                                    placeholder="Optional"
                                    className="w-16 px-2 py-1 rounded-lg bg-[#180E0B] border border-emerald-800/50 text-emerald-400 font-bold text-xs focus:outline-none focus:border-emerald-500"
                                    title="Selling / Discounted Price shown in app"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleSaveRowPrice(prod.id)}
                                  className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1 cursor-pointer self-end ${
                                    editState.saved
                                      ? 'bg-emerald-600 text-white shadow'
                                      : 'bg-[#8B2F3C] hover:bg-[#722430] text-white'
                                  }`}
                                  title="Save price & apply to customer app"
                                >
                                  {editState.saved ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      <span>Saved!</span>
                                    </>
                                  ) : (
                                    <span>Save ₹</span>
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  prod.isEggless
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-[#8B2F3C]/20 text-rose-300 border border-[#8B2F3C]/30'
                                }`}
                              >
                                {prod.isEggless ? '100% Eggless' : 'Contains Egg'}
                              </span>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => toggleProductStock(prod.id)}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                                  prod.inStock ? 'bg-emerald-600 text-white' : 'bg-rose-700 text-white'
                                }`}
                              >
                                {prod.inStock ? 'In Stock' : 'Out of Stock'}
                              </button>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    handleSelectQuickCake(prod.id);
                                    showToast(`Selected "${prod.name}" in quick price manager!`);
                                  }}
                                  className="p-1.5 rounded-lg bg-[#2A1A14] hover:bg-[#38221A] text-rose-200 border border-[#44281E]"
                                  title="Edit Price in Top Panel"
                                >
                                  <DollarSign className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    duplicateProduct(prod.id);
                                    showToast(`Duplicated "${prod.name}" successfully!`);
                                  }}
                                  className="p-1.5 rounded-lg bg-[#8B2F3C]/30 hover:bg-[#8B2F3C]/50 text-rose-200 border border-[#8B2F3C]/40"
                                  title="Duplicate Delicacy"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenEditProduct(prod)}
                                  className="p-1.5 rounded-lg bg-[#2A1A14] hover:bg-[#38221A] text-[#FAF4EE] border border-[#44281E]"
                                  title="Full Edit Modal"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete "${prod.name}" from the bakery catalog?`)) {
                                      deleteProduct(prod.id);
                                      showToast(`Delicacy "${prod.name}" removed.`);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 5: CATEGORIES */}
        {activeAdminTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#362118]">
              <div>
                <h1 className="text-2xl font-black text-white">Categories Management</h1>
                <p className="text-xs text-neutral-400">
                  Organize bakery delicacies into custom collections (Birthday Cakes, Pastries, Cookies, etc.).
                </p>
              </div>

              <button
                id="add-new-category-btn"
                onClick={handleOpenAddCategory}
                className="px-4 py-2 rounded-2xl bg-[#8B2F3C] hover:bg-[#8B2F3C]/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-md self-start transition active:scale-95 border border-[#8B2F3C]/40"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const count = products.filter((p) => p.categorySlug === cat.slug).length;
                return (
                  <div
                    key={cat.id}
                    className="p-4 rounded-3xl bg-[#241712] border border-neutral-700 flex items-center justify-between shadow-sm hover:border-neutral-600 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-2xl object-cover border border-neutral-700"
                      />
                      <div>
                        <div className="font-bold text-white text-sm">{cat.name}</div>
                        <div className="text-[10px] text-rose-200 font-mono">slug: /{cat.slug}</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">
                          {count} {count === 1 ? 'Delicacy' : 'Delicacies'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditCategory(cat)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-700 transition"
                        title="Edit Category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
                            deleteCategory(cat.id);
                            showToast(`Category "${cat.name}" deleted.`);
                          }
                        }}
                        className="p-2 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-neutral-700 transition"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 6: COUPONS */}
        {activeAdminTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#362118]">
              <div>
                <h1 className="text-2xl font-black text-white">Coupons & Discounts</h1>
                <p className="text-xs text-neutral-400">
                  Create promo discount codes for customer celebrations.
                </p>
              </div>

              <button
                onClick={() => setShowCouponModal(true)}
                className="px-4 py-2 rounded-xl bg-[#8B2F3C] hover:bg-[#8B2F3C]/90 text-white text-xs font-bold flex items-center gap-1.5 border border-[#8B2F3C]/40"
              >
                <Plus className="w-4 h-4" />
                <span>New Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((cp) => (
                <div
                  key={cp.id}
                  className="p-4 rounded-3xl bg-[#241712] border border-neutral-700 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl bg-[#8B2F3C]/20 text-rose-200 font-mono font-black text-sm border border-dashed border-[#8B2F3C]/50">
                      {cp.code}
                    </span>
                    <button
                      onClick={() => toggleCoupon(cp.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cp.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-700 text-neutral-400'
                      }`}
                    >
                      {cp.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <p className="text-xs text-neutral-300 font-medium">{cp.description}</p>
                  <div className="text-[10px] text-neutral-400 pt-1 border-t border-neutral-700 flex justify-between">
                    <span>Min Cart: ₹{cp.minOrderValue}</span>
                    <button
                      onClick={() => deleteCoupon(cp.id)}
                      className="text-rose-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 7: BANNERS */}
        {activeAdminTab === 'banners' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#362118]">
              <div>
                <h1 className="text-2xl font-black text-white">Promotional Hero Banners</h1>
                <p className="text-xs text-neutral-400">
                  Manage high-visibility promotional slides on the customer app home screen.
                </p>
              </div>

              <button
                id="add-new-banner-btn"
                onClick={handleOpenAddBanner}
                className="px-4 py-2 rounded-2xl bg-[#8B2F3C] hover:bg-[#8B2F3C]/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-md self-start transition active:scale-95 border border-[#8B2F3C]/40"
              >
                <Plus className="w-4 h-4" />
                <span>Add Hero Banner</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="relative rounded-3xl overflow-hidden border border-neutral-700 h-48 group shadow-lg bg-neutral-950"
                >
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent p-4 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-[#8B2F3C] text-white shadow-sm text-[10px] font-black uppercase rounded-full">
                        {b.badge}
                      </span>
                      <div className="flex items-center gap-1.5 bg-neutral-900/80 backdrop-blur-md rounded-2xl p-1 border border-neutral-700">
                        <button
                          onClick={() => toggleBanner(b.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.isActive ? 'bg-emerald-600 text-white' : 'bg-neutral-700 text-neutral-400'
                          }`}
                        >
                          {b.isActive ? 'Active' : 'Disabled'}
                        </button>
                        <button
                          onClick={() => handleOpenEditBanner(b)}
                          className="p-1 text-neutral-300 hover:text-white"
                          title="Edit Banner"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this banner?')) {
                              deleteBanner(b.id);
                              showToast('Banner removed.');
                            }
                          }}
                          className="p-1 text-neutral-300 hover:text-rose-400"
                          title="Delete Banner"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-base leading-snug">{b.title}</h3>
                      <p className="text-xs text-neutral-300 line-clamp-1">{b.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 8: PUSH NOTIFICATIONS BROADCAST */}
        {activeAdminTab === 'notifications' && (
          <div className="space-y-6 max-w-xl">
            <div className="pb-4 border-b border-[#362118]">
              <h1 className="text-2xl font-black text-white">FCM Push Notification Broadcast</h1>
              <p className="text-xs text-neutral-400">
                Broadcast instant promotional alerts, weekend discount codes, and bakery announcements.
              </p>
            </div>

            <form onSubmit={handleSendNotification} className="p-5 rounded-3xl bg-[#241712] border border-neutral-700 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">
                  Notification Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flash 30% OFF on Belgium Truffle Cakes!"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">
                  Notification Message Body
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Treat your weekend sweet cravings with fresh bakes delivered in 30 mins. Code: TRUFFLE30"
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                  <input
                    type="radio"
                    name="ntype"
                    checked={notifType === 'offer'}
                    onChange={() => setNotifType('offer')}
                  />
                  <span>Special Offer Tag</span>
                </label>
                <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                  <input
                    type="radio"
                    name="ntype"
                    checked={notifType === 'announcement'}
                    onChange={() => setNotifType('announcement')}
                  />
                  <span>Bakery Announcement</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#8B2F3C] hover:bg-[#8B2F3C]/90 text-white font-bold shadow-md transition flex items-center justify-center gap-2 border border-[#8B2F3C]/40"
              >
                <Bell className="w-4 h-4" />
                <span>Broadcast via Firebase Cloud Messaging (FCM)</span>
              </button>
            </form>
          </div>
        )}

        {/* VIEW 8: CUSTOMERS DIRECTORY */}
        {activeAdminTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#362118]">
              <div>
                <h1 className="text-2xl font-black text-white">8. Registered Customer Directory</h1>
                <p className="text-xs text-neutral-400">
                  Total {customers.length} registered patron accounts, lifetime order history and addresses.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {customers.map((c) => (
                <div key={c.id} className="p-4 rounded-3xl bg-[#241712] border border-neutral-700 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#8B2F3C]/40 text-rose-200 font-bold flex items-center justify-center text-xs">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm block">{c.name}</span>
                        <span className="text-[10px] text-neutral-400">Joined {c.joinedDate}</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8B2F3C]/20 text-rose-200 font-bold border border-[#8B2F3C]/40">
                      {c.tier}
                    </span>
                  </div>
                  <div className="space-y-1 text-neutral-400">
                    <p>{c.phone}</p>
                    <p className="text-neutral-500 truncate">{c.email}</p>
                    {c.addresses && c.addresses.length > 0 && (
                      <p className="text-[11px] text-neutral-400 bg-neutral-900/60 p-2 rounded-xl">
                        📍 {c.addresses[0].houseFlat}, {c.addresses[0].area}, {c.addresses[0].city}
                      </p>
                    )}
                  </div>
                  <div className="pt-2 border-t border-neutral-700 flex justify-between text-neutral-300 font-semibold">
                    <span>{c.totalOrders} Orders Placed</span>
                    <span className="text-rose-200 font-bold">₹{c.totalSpent.toLocaleString()} Spent</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 9: REVIEWS & MODERATION */}
        {activeAdminTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#362118]">
              <div>
                <h1 className="text-2xl font-black text-white">9. Reviews & Moderation Center</h1>
                <p className="text-xs text-neutral-400">
                  Moderate customer feedback, approve verified buyer reviews, and maintain bakery rating integrity.
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-800 border border-neutral-700 text-xs">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setReviewFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg font-bold capitalize transition ${
                      reviewFilter === filter
                        ? 'bg-[#8B2F3C] text-white border border-[#8B2F3C]/40'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {filter} ({filter === 'all' ? reviews.length : reviews.filter((r) => r.status.toLowerCase() === filter).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviews
                .filter((r) => reviewFilter === 'all' || r.status.toLowerCase() === reviewFilter)
                .map((rev) => {
                  const prod = products.find((p) => p.id === rev.productId);
                  return (
                    <div
                      key={rev.id}
                      className="p-4 rounded-3xl bg-[#241712] border border-neutral-700 space-y-3 text-xs shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          {prod && (
                            <img
                              src={prod.image}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{rev.userName}</span>
                              {rev.isVerified && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                                  Verified Buyer
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-rose-200 font-medium">
                              On: {prod?.name || 'Bakery Delicacy'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center text-rose-200">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= rev.rating ? 'fill-[#E8C15A] text-[#E8C15A]' : 'text-neutral-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              rev.status === 'Approved'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : rev.status === 'Pending'
                                ? 'bg-[#8B2F3C]/20 text-rose-200 animate-pulse border border-[#8B2F3C]/40'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {rev.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-neutral-300 bg-neutral-900/60 p-3 rounded-2xl leading-relaxed">
                        "{rev.comment}"
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-400">
                        <span>Date: {rev.date}</span>
                        <div className="flex items-center gap-2">
                          {rev.status !== 'Approved' && (
                            <button
                              onClick={() => {
                                updateReviewStatus(rev.id, 'Approved');
                                showToast('Review approved and published to customer store!');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 transition"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {rev.status !== 'Rejected' && (
                            <button
                              onClick={() => {
                                updateReviewStatus(rev.id, 'Rejected');
                                showToast('Review marked as rejected.');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-neutral-200 font-bold flex items-center gap-1 transition"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              deleteReview(rev.id);
                              showToast('Review deleted.');
                            }}
                            className="p-1.5 rounded-xl bg-rose-900/40 hover:bg-rose-900 text-rose-300 transition"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* VIEW 10: BAKERY SETTINGS */}
        {activeAdminTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#362118]">
              <div>
                <h1 className="text-2xl font-black text-white">Bakery Master Control Hub</h1>
                <p className="text-xs text-neutral-400">
                  Update any app feature, banners, ticker notices, delivery charges, and store status live.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setJsonText(exportConfigJSON());
                    setImportExportMode('export');
                    setShowImportExportModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold border border-neutral-700 flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-rose-200" />
                  <span>Export JSON</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setJsonText('');
                    setImportExportMode('import');
                    setShowImportExportModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold border border-neutral-700 flex items-center gap-1.5 transition"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Import JSON</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset all app items, categories, banners, and settings back to factory default?')) {
                      resetToDefaults();
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold border border-rose-800/60 flex items-center gap-1.5 transition"
                  title="Reset everything to factory initial data"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateSettings(settingsForm);
                    showToast('All bakery settings updated and reflected live in customer app!');
                  }}
                  className="px-5 py-2 rounded-xl bg-[#8B2F3C] hover:bg-[#8B2F3C]/90 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition active:scale-95 border border-[#8B2F3C]/40"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </div>
            </div>

            {/* Supabase Cloud Database Status & Quick Sync Card */}
            <div className="p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${isSupabaseEnabled ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60' : 'bg-amber-950/40 text-amber-400 border border-amber-800/50'}`}>
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white">Supabase Cloud Database</h3>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        isSupabaseEnabled
                          ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
                          : 'bg-amber-900/60 text-amber-300 border border-amber-700/60'
                      }`}>
                        {isSupabaseEnabled ? '🟢 Cloud Connected' : '🟡 Local Storage Mode (Offline)'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {isSupabaseEnabled
                        ? 'Real-time cloud database active. Products, orders, and settings sync live to Supabase.'
                        : 'Currently running safely on local browser storage. Connect Supabase to sync data across all devices.'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="https://supabase.com/dashboard/project/fwecdysawguawwuhnnol"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold border border-neutral-700 flex items-center gap-1.5 transition"
                  >
                    <span>Open Supabase Dashboard</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setShowSqlModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold border border-neutral-700 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>View SQL Schema</span>
                  </button>

                  <button
                    type="button"
                    disabled={isTestingSupabase}
                    onClick={async () => {
                      setIsTestingSupabase(true);
                      const res = await testSupabaseConnection();
                      setSupabaseTestResult(res);
                      setIsTestingSupabase(false);
                      showToast(res.message);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold border border-neutral-700 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isTestingSupabase ? 'animate-spin' : ''}`} />
                    <span>{isTestingSupabase ? 'Testing...' : 'Test Connection'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSyncingSupabase}
                    onClick={async () => {
                      setIsSyncingSupabase(true);
                      await syncAllToSupabase();
                      setIsSyncingSupabase(false);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    <span>{isSyncingSupabase ? 'Pushing Data...' : '⚡ Push Local Data to Supabase'}</span>
                  </button>
                </div>
              </div>

              {/* Supabase status test result */}
              {supabaseTestResult && (
                <div className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                  supabaseTestResult.success
                    ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
                    : 'bg-rose-950/40 border border-rose-800/60 text-rose-300'
                }`}>
                  {supabaseTestResult.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                  <span>{supabaseTestResult.message}</span>
                </div>
              )}

              {/* Credentials Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Supabase Project URL:
                  </label>
                  <input
                    type="text"
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(e.target.value)}
                    placeholder="https://yourproject.supabase.co"
                    className="w-full bg-[#18110E] border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Supabase Anon Public Key:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={supabaseKeyInput}
                      onChange={(e) => setSupabaseKeyInput(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="flex-1 bg-[#18110E] border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      disabled={isTestingSupabase}
                      onClick={async () => {
                        updateSupabaseCredentials(supabaseUrlInput, supabaseKeyInput);
                        setIsTestingSupabase(true);
                        const res = await testSupabaseConnection();
                        setSupabaseTestResult(res);
                        setIsTestingSupabase(false);
                        showToast(res.message);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shrink-0 flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isTestingSupabase ? 'Connecting...' : 'Save & Connect'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Setup guide */}
              <div className="p-3.5 rounded-2xl bg-[#1A1412] border border-[#3E251B] text-xs text-neutral-300 space-y-2">
                <p className="font-bold text-neutral-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C9A227]" />
                  <span>⚡ Supabase Database Connect Karne Ka 2-Step Process:</span>
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-neutral-400 text-[11px] leading-relaxed pl-1">
                  <li>
                    Apne Supabase dashboard mein left side <strong>`&gt;_` (SQL Editor)</strong> par click karein.
                  </li>
                  <li>
                    Upar <strong>View SQL Schema</strong> button par click karke SQL script copy karein, Supabase SQL editor mein paste karein aur <strong>"Run"</strong> dabayein (is se tables ban jayengi).
                  </li>
                  <li>
                    Wapas aakar yahan <strong>"Test Connection"</strong> dabayein, fir <strong>"⚡ Push Local Data to Supabase"</strong> par click karein aur aapke sare cakes cloud mein live ho jayenge!
                  </li>
                </ol>
              </div>
            </div>

            {/* Store Status Toggle */}
            <div className={`p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              settingsForm.isOpen
                ? 'bg-emerald-950/30 border-emerald-700/60 text-emerald-200'
                : 'bg-rose-950/30 border-rose-700/60 text-rose-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${settingsForm.isOpen ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
                <div>
                  <h3 className="font-black text-sm text-white flex items-center gap-2">
                    <span>Store Status:</span>
                    <span className={settingsForm.isOpen ? 'text-emerald-400 font-extrabold' : 'text-rose-400 font-extrabold'}>
                      {settingsForm.isOpen ? 'LIVE & ACCEPTING ORDERS' : 'STORE PAUSED / CLOSED'}
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {settingsForm.isOpen
                      ? 'Customers can browse delicacies, place orders, and track deliveries.'
                      : 'Kitchen is paused. Customers will see a closed banner with your notice.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSettingsForm({ ...settingsForm, isOpen: !settingsForm.isOpen })}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black shadow-sm transition ${
                    settingsForm.isOpen
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {settingsForm.isOpen ? 'Pause / Close Store' : 'Open Store Now'}
                </button>
              </div>
            </div>

            {!settingsForm.isOpen && (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-xs space-y-1">
                <label className="block font-bold text-rose-200">Custom Closed Notice Message</label>
                <input
                  type="text"
                  value={settingsForm.closedNotice || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, closedNotice: e.target.value })}
                  placeholder="e.g. Kitchen closed for maintenance. Taking pre-orders for tomorrow morning!"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-rose-700/50 text-white"
                />
              </div>
            )}

            {/* Announcement Ticker Bar Controls */}
            <div className="p-5 rounded-3xl bg-[#241712] border border-neutral-700 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-rose-200" />
                  <span>Top Announcement Marquee Ticker</span>
                </h3>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settingsForm.noticeBarEnabled}
                    onChange={(e) => setSettingsForm({ ...settingsForm, noticeBarEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8B2F3C] accent-[#8B2F3C]"
                  />
                  <span className="font-bold text-neutral-300">Enable Announcement Ticker</span>
                </label>
              </div>

              {settingsForm.noticeBarEnabled && (
                <div className="space-y-3 pt-2 border-t border-neutral-700">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Ticker Announcement Text</label>
                    <input
                      type="text"
                      value={settingsForm.noticeBarText || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, noticeBarText: e.target.value })}
                      placeholder="e.g. 🎉 Grand Opening Special: Flat 20% OFF on all Truffle Cakes! Use code SWEET20"
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Ticker Theme Color</label>
                    <div className="flex items-center gap-3">
                      {(['amber', 'emerald', 'rose', 'indigo'] as const).map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, noticeBarColor: color })}
                          className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] border flex items-center gap-1.5 transition ${
                            settingsForm.noticeBarColor === color
                              ? 'border-white bg-neutral-700 text-white shadow-sm'
                              : 'border-neutral-700 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              color === 'amber'
                                ? 'bg-[#8B2F3C]'
                                : color === 'emerald'
                                ? 'bg-emerald-500'
                                : color === 'rose'
                                ? 'bg-rose-500'
                                : 'bg-indigo-500'
                            }`}
                          />
                          <span>{color}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Festival / Offer Promo Popup Modal Controls */}
            <div className="p-5 rounded-3xl bg-[#241712] border border-neutral-700 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-200" />
                  <span>Celebration & Festival Promo Popup Modal</span>
                </h3>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settingsForm.popupEnabled}
                    onChange={(e) => setSettingsForm({ ...settingsForm, popupEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8B2F3C] accent-[#8B2F3C]"
                  />
                  <span className="font-bold text-neutral-300">Enable Promo Popup Modal</span>
                </label>
              </div>

              {settingsForm.popupEnabled && (
                <div className="space-y-3 pt-2 border-t border-neutral-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">Popup Heading Title</label>
                      <input
                        type="text"
                        value={settingsForm.popupTitle || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, popupTitle: e.target.value })}
                        placeholder="e.g. Festival of Belgian Chocolate 🍫"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">Call to Action Button Text</label>
                      <input
                        type="text"
                        value={settingsForm.popupButtonText || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, popupButtonText: e.target.value })}
                        placeholder="e.g. Design 3D Cake Now"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Subtitle / Promo Message</label>
                    <textarea
                      rows={2}
                      value={settingsForm.popupSubtitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, popupSubtitle: e.target.value })}
                      placeholder="e.g. Order custom 3D designer cakes handcrafted 100% pure eggless with fresh dairy delivery."
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">Banner Image URL</label>
                      <input
                        type="text"
                        value={settingsForm.popupImageUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, popupImageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">Button Click Action</label>
                      <select
                        value={settingsForm.popupButtonAction || 'custom-cake'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, popupButtonAction: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                      >
                        <option value="custom-cake">Open 3D Custom Cake Studio</option>
                        <option value="categories">Open All Categories Screen</option>
                        <option value="offers">Open Offers Screen</option>
                        <option value="close">Just Dismiss Popup</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* General Info & Brand Identity */}
            <div className="p-5 rounded-3xl bg-[#241712] border border-neutral-700 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-rose-200" />
                <span>Bakery Brand Identity & Contact Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Store Brand Name</label>
                  <input
                    type="text"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Brand Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Contact Phone (WhatsApp)</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Support Email</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-neutral-400 mb-1 font-semibold">Kitchen Studio Address</label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Financials & Delivery Logistics */}
            <div className="p-5 rounded-3xl bg-[#241712] border border-neutral-700 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-rose-200" />
                <span>Financial & Delivery Logistics</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Delivery Charge (₹)</label>
                  <input
                    type="number"
                    value={settingsForm.deliveryCharge}
                    onChange={(e) => setSettingsForm({ ...settingsForm, deliveryCharge: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Free Delivery Above (₹)</label>
                  <input
                    type="number"
                    value={settingsForm.freeDeliveryThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Minimum Order Value (₹)</label>
                  <input
                    type="number"
                    value={settingsForm.minimumOrder}
                    onChange={(e) => setSettingsForm({ ...settingsForm, minimumOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Tax Rate (GST %)</label>
                  <input
                    type="number"
                    value={settingsForm.taxPercentage}
                    onChange={(e) => setSettingsForm({ ...settingsForm, taxPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Free Delivery Radius (km)</label>
                  <input
                    type="number"
                    value={settingsForm.freeDeliveryKm ?? 6}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryKm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-bold"
                  />
                  <p className="text-[10px] text-emerald-400 mt-0.5">Upto this distance: 100% FREE</p>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Extra Charge Above Radius (₹/km)</label>
                  <input
                    type="number"
                    value={settingsForm.perKmCharge ?? 20}
                    onChange={(e) => setSettingsForm({ ...settingsForm, perKmCharge: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-bold"
                  />
                  <p className="text-[10px] text-amber-400 mt-0.5">₹20 per km beyond 6 km</p>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Estimated Delivery Time Display</label>
                <input
                  type="text"
                  value={settingsForm.estimatedDeliveryTime}
                  onChange={(e) => setSettingsForm({ ...settingsForm, estimatedDeliveryTime: e.target.value })}
                  placeholder="e.g. 35 - 45 mins"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                />
              </div>

              {/* Payment Methods */}
              <div className="pt-3 border-t border-neutral-700 flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.enableCod}
                    onChange={(e) => setSettingsForm({ ...settingsForm, enableCod: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8B2F3C] accent-[#8B2F3C]"
                  />
                  <span className="font-semibold text-neutral-200">Enable Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.enableOnline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, enableOnline: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8B2F3C] accent-[#8B2F3C]"
                  />
                  <span className="font-semibold text-neutral-200">Enable Online Payment (UPI / Cards / NetBanking)</span>
                </label>
              </div>
            </div>

            {/* Official Bakery Location, WhatsApp & Cheque Banking Details */}
            <div className="p-5 rounded-3xl bg-[#241712] border border-neutral-700 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-rose-200" />
                <span>Bakery WhatsApp, Google Maps & Cheque Banking</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">
                    Bakery WhatsApp Notification Number (9653930001)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    placeholder="9653930001"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-mono"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Customer orders are automatically dispatched to this WhatsApp phone number.
                  </p>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">
                    Bakery Google Maps Location Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={settingsForm.mapUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, mapUrl: e.target.value })}
                      placeholder="https://maps.google.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                    />
                    {settingsForm.mapUrl && (
                      <a
                        href={settingsForm.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white font-bold flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-3">
                <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wider block">
                  Official Bank Details (From Bank Cheque)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Account Beneficiary</label>
                    <input
                      type="text"
                      value={settingsForm.bankBeneficiary || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bankBeneficiary: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Bank Name</label>
                    <input
                      type="text"
                      value={settingsForm.bankName || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bankName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Bank Account Number</label>
                    <input
                      type="text"
                      value={settingsForm.bankAccountNumber || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bankAccountNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">IFSC Code</label>
                    <input
                      type="text"
                      value={settingsForm.bankIfsc || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bankIfsc: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Official UPI ID</label>
                    <input
                      type="text"
                      value={settingsForm.upiId || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 12: DEDICATED SUPABASE CLOUD DATABASE CENTER */}
        {activeAdminTab === 'supabase' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#362118]">
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
                  <Database className="w-6 h-6 text-emerald-400" />
                  <span>Supabase Cloud Database - Permanent Connection</span>
                </h1>
                <p className="text-xs text-neutral-400">
                  Connect your real Supabase PostgreSQL database to store and sync all products, orders, and customer data permanently.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold border border-neutral-700 flex items-center gap-1.5 transition"
                >
                  <span>Open Supabase.com</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setShowSqlModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-900/60 hover:bg-indigo-900/80 text-indigo-200 text-xs font-bold border border-indigo-700/60 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View SQL Schema</span>
                </button>
              </div>
            </div>

            {/* Live Connection Status Banner */}
            <div className={`p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isSupabaseEnabled
                ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                : 'bg-amber-950/40 border-amber-700/60 text-amber-200'
            }`}>
              <div className="flex items-center gap-3.5">
                <div className={`w-4 h-4 rounded-full flex-shrink-0 ${isSupabaseEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <div>
                  <h3 className="font-black text-sm text-white flex items-center gap-2">
                    <span>Database Status:</span>
                    <span className={isSupabaseEnabled ? 'text-emerald-400 font-extrabold' : 'text-amber-400 font-extrabold'}>
                      {isSupabaseEnabled ? '🟢 PERMANENTLY CONNECTED TO SUPABASE CLOUD' : '🟡 NOT CONNECTED YET (RUNNING ON LOCAL STORAGE)'}
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {isSupabaseEnabled
                      ? 'All orders, custom cakes, and product catalog updates sync live across all customer devices.'
                      : 'Enter your Supabase URL & Anon Key below, click "Save & Connect", and push your data to the cloud.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isTestingSupabase}
                  onClick={async () => {
                    setIsTestingSupabase(true);
                    const res = await testSupabaseConnection();
                    setSupabaseTestResult(res);
                    setIsTestingSupabase(false);
                    showToast(res.message);
                  }}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold border border-neutral-700 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isTestingSupabase ? 'animate-spin' : ''}`} />
                  <span>{isTestingSupabase ? 'Testing...' : 'Test Connection'}</span>
                </button>

                <button
                  type="button"
                  disabled={isSyncingSupabase}
                  onClick={async () => {
                    setIsSyncingSupabase(true);
                    await syncAllToSupabase();
                    setIsSyncingSupabase(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Cloud className="w-3.5 h-3.5" />
                  <span>{isSyncingSupabase ? 'Pushing Data...' : '⚡ Push All Data to Supabase'}</span>
                </button>
              </div>
            </div>

            {/* Test result message if any */}
            {supabaseTestResult && (
              <div className={`p-4 rounded-2xl text-xs font-mono flex items-center gap-2.5 ${
                supabaseTestResult.success
                  ? 'bg-emerald-950/50 border border-emerald-800/80 text-emerald-300'
                  : 'bg-rose-950/50 border border-rose-800/80 text-rose-300'
              }`}>
                {supabaseTestResult.success ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                <span className="font-semibold">{supabaseTestResult.message}</span>
              </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="text-neutral-400 font-semibold mb-1">Products in Catalog</div>
                <div className="text-2xl font-black text-white">{products.length}</div>
                <div className="text-[10px] text-emerald-400 mt-1">Ready for Cloud Sync</div>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="text-neutral-400 font-semibold mb-1">Menu Categories</div>
                <div className="text-2xl font-black text-white">{categories.length}</div>
                <div className="text-[10px] text-emerald-400 mt-1">Ready for Cloud Sync</div>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="text-neutral-400 font-semibold mb-1">Total Customer Orders</div>
                <div className="text-2xl font-black text-white">{orders.length}</div>
                <div className="text-[10px] text-indigo-400 mt-1">Real-time Order Feed</div>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="text-neutral-400 font-semibold mb-1">Custom Cake Requests</div>
                <div className="text-2xl font-black text-white">{customCakeRequests.length}</div>
                <div className="text-[10px] text-amber-400 mt-1">Instant Notification</div>
              </div>
            </div>

            {/* Configuration Credentials Card */}
            <div className="p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-md space-y-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <SettingsIcon className="w-4 h-4 text-emerald-400" />
                <span>Supabase API Credentials</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    1. Supabase Project URL:
                  </label>
                  <input
                    type="text"
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(e.target.value)}
                    placeholder="https://yourproject.supabase.co"
                    className="w-full bg-[#18110E] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-neutral-100 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Found in Supabase Dashboard &gt; Project Settings &gt; API &gt; Project URL
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    2. Supabase Anon Public Key:
                  </label>
                  <input
                    type="password"
                    value={supabaseKeyInput}
                    onChange={(e) => setSupabaseKeyInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-[#18110E] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-neutral-100 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Found in Supabase Dashboard &gt; Project Settings &gt; API &gt; Project API keys (anon public)
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  disabled={isTestingSupabase}
                  onClick={async () => {
                    updateSupabaseCredentials(supabaseUrlInput, supabaseKeyInput);
                    setIsTestingSupabase(true);
                    const res = await testSupabaseConnection();
                    setSupabaseTestResult(res);
                    setIsTestingSupabase(false);
                    showToast(res.message);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isTestingSupabase ? 'Connecting...' : 'Save & Connect Permanently'}</span>
                </button>

                <p className="text-xs text-neutral-400">
                  Credentials are saved permanently in your browser storage and loaded on every app startup.
                </p>
              </div>
            </div>

            {/* Step-by-Step Hindi Setup Guide */}
            <div className="p-5 rounded-3xl bg-[#1A1412] border border-[#3E251B] text-xs text-neutral-300 space-y-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A227]" />
                <span>Supabase Permanently Connect Karne Ka Aasan 3-Step Process:</span>
              </h3>

              <div className="space-y-2.5 text-neutral-300 text-xs pl-1">
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B2F3C] text-white flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
                  <div>
                    <strong className="text-white">Supabase par Free Project Banayein:</strong>{' '}
                    <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">supabase.com</a> par jakar login karein aur "New Project" banayein (apna database password set karein).
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B2F3C] text-white flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
                  <div>
                    <strong className="text-white">SQL Schema Run Karein:</strong>{' '}
                    Upar <strong>"View SQL Schema"</strong> button dabayein, script ko <strong>"Copy SQL Script"</strong> karein. Fir Supabase Dashboard mein left side <strong>SQL Editor (&gt;_)</strong> par click karke paste karein aur <strong>Run</strong> daba dein. Is se aapki sari tables (<code className="text-amber-300">products</code>, <code className="text-amber-300">orders</code>, <code className="text-amber-300">categories</code>) ban jayengi!
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B2F3C] text-white flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
                  <div>
                    <strong className="text-white">URL & Anon Key Paste Karke Connect Karein:</strong>{' '}
                    Supabase Project Settings &gt; API se apna <strong>Project URL</strong> aur <strong>anon public key</strong> yahan paste karein aur <strong>"Save & Connect Permanently"</strong> par click karein.
                    Fir <strong>"⚡ Push All Data to Supabase"</strong> dabayein aur aapka poora bakery data cloud me live ho jayega!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Add / Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-neutral-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border border-neutral-700 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#362118]">
              <h2 className="text-lg font-black text-white">
                {editingProductId ? 'Edit Product' : 'Add New Bakery Delicacy'}
              </h2>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-neutral-300">Product Image</label>
                  <label
                    htmlFor="edit-prod-file-upload"
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-rose-900/30 text-rose-300 border border-rose-800/40 text-[11px] font-semibold hover:bg-rose-900/50 cursor-pointer transition"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Device Image</span>
                  </label>
                  <input
                    id="edit-prod-file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFileUpload(e, setProdImage)}
                  />
                </div>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or upload above"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-sm"
                />

                {/* Quick Presets & Preview */}
                <div className="mt-2 flex items-center gap-3">
                  {prodImage && (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950 flex-shrink-0 group">
                      <img
                        src={prodImage}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setProdImage('')}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5 text-rose-400" />
                      </button>
                    </div>
                  )}
                  <div className="text-[10px] text-neutral-400 space-y-1">
                    <span className="font-bold text-neutral-300 block">Sample Quick Photos:</span>
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => setProdImage('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80')}
                        className="px-2 py-0.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-rose-200 border border-neutral-700"
                      >
                        Chocolate
                      </button>
                      <button
                        type="button"
                        onClick={() => setProdImage('https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=700&q=80')}
                        className="px-2 py-0.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-rose-200 border border-neutral-700"
                      >
                        Berry Cake
                      </button>
                      <button
                        type="button"
                        onClick={() => setProdImage('https://images.unsplash.com/photo-1518047601542-4505c67d1e8a?auto=format&fit=crop&w=700&q=80')}
                        className="px-2 py-0.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-rose-200 border border-neutral-700"
                      >
                        Red Velvet Heart
                      </button>
                      <button
                        type="button"
                        onClick={() => setProdImage('https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=700&q=80')}
                        className="px-2 py-0.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-rose-200 border border-neutral-700"
                      >
                        2-Tier Grand
                      </button>
                      <button
                        type="button"
                        onClick={() => setProdImage('https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=700&q=80')}
                        className="px-2 py-0.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-rose-200 border border-neutral-700"
                      >
                        Pastry / Cupcake
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Available Flavours</label>
                  <input
                    type="text"
                    value={prodFlavours}
                    onChange={(e) => setProdFlavours(e.target.value)}
                    placeholder="Dutch Truffle, Red Velvet"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Available Sizes</label>
                  <input
                    type="text"
                    value={prodSizes}
                    onChange={(e) => setProdSizes(e.target.value)}
                    placeholder="0.5 kg, 1.0 kg"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsEggless}
                    onChange={(e) => setProdIsEggless(e.target.checked)}
                  />
                  <span>100% Eggless Vegetarian</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodInStock}
                    onChange={(e) => setProdInStock(e.target.checked)}
                  />
                  <span>Currently In Stock</span>
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#8B2F3C] hover:bg-[#8B2F3C]/90 text-white font-bold shadow-md border border-[#8B2F3C]/40"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-neutral-900 rounded-3xl max-w-sm w-full p-6 border border-neutral-700 shadow-2xl space-y-4 text-xs">
            <h2 className="text-base font-bold text-white">Create New Coupon</h2>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <input
                type="text"
                placeholder="Coupon Code (e.g. SWEET30)"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white uppercase font-mono font-bold"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Discount %"
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                />
                <input
                  type="number"
                  placeholder="Min Order ₹"
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                />
              </div>
              <input
                type="text"
                placeholder="Description"
                value={newCouponDesc}
                onChange={(e) => setNewCouponDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="w-1/2 py-2 rounded-xl bg-neutral-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-[#8B2F3C] hover:bg-[#8B2F3C]/90 text-white font-bold border border-[#8B2F3C]/40"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {selectedInvoiceOrder && (
        <PrintInvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      {/* Category Add / Edit Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-neutral-900 rounded-3xl max-w-md w-full p-6 border border-neutral-700 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#362118]">
              <h2 className="text-base font-black text-white">
                {editingCategoryId ? 'Edit Category' : 'Create New Bakery Category'}
              </h2>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">Category Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Designer Cheesecakes"
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (!editingCategoryId) {
                      setCatSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Category URL Slug (Unique)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. designer-cheesecakes"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]+/g, ''))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-rose-200 font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-neutral-300">Thumbnail Cover Image</label>
                  <label
                    htmlFor="cat-file-upload"
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-rose-900/30 text-rose-300 border border-rose-800/40 text-[11px] font-semibold hover:bg-rose-900/50 cursor-pointer transition"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Image</span>
                  </label>
                  <input
                    id="cat-file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFileUpload(e, setCatImage)}
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/... or upload above"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-sm"
                />
                {catImage && (
                  <div className="relative mt-2 h-24 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950 group">
                    <img
                      src={catImage}
                      alt="Category Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setCatImage('')}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition"
                      title="Clear photo"
                    >
                      <X className="w-4 h-4 text-rose-400" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#8B2F3C] hover:bg-[#8B2F3C]/90 text-white font-bold shadow-md transition active:scale-95 border border-[#8B2F3C]/40"
                >
                  {editingCategoryId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero Banner Add / Edit Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-neutral-900 rounded-3xl max-w-md w-full p-6 border border-neutral-700 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#362118]">
              <h2 className="text-base font-black text-white">
                {editingBannerId ? 'Edit Hero Banner' : 'Create Promotional Banner'}
              </h2>
              <button
                onClick={() => setShowBannerModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-3">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">Banner Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Belgian Chocolate Royal Feast"
                  value={banTitle}
                  onChange={(e) => setBanTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Subtitle / Sub-text</label>
                <input
                  type="text"
                  placeholder="e.g. Freshly baked layers with 64% pure cocoa ganache"
                  value={banSubtitle}
                  onChange={(e) => setBanSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Badge Ribbon Label</label>
                  <input
                    type="text"
                    placeholder="e.g. 20% OFF"
                    value={banBadge}
                    onChange={(e) => setBanBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Active Visibility</label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={banActive}
                      onChange={(e) => setBanActive(e.target.checked)}
                      className="w-4 h-4 rounded text-[#8B2F3C] accent-[#8B2F3C]"
                    />
                    <span className="text-neutral-200 font-bold">Show on App</span>
                  </label>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-neutral-300">Banner Background Image</label>
                  <label
                    htmlFor="banner-file-upload"
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-rose-900/30 text-rose-300 border border-rose-800/40 text-[11px] font-semibold hover:bg-rose-900/50 cursor-pointer transition"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Image</span>
                  </label>
                  <input
                    id="banner-file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFileUpload(e, setBanImage)}
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/... or upload above"
                  value={banImage}
                  onChange={(e) => setBanImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-sm"
                />
                {banImage && (
                  <div className="relative mt-2 h-28 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950 group">
                    <img
                      src={banImage}
                      alt="Banner Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setBanImage('')}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition"
                      title="Clear photo"
                    >
                      <X className="w-4 h-4 text-rose-400" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBannerModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#8B2F3C] hover:bg-[#8B2F3C]/90 text-white font-bold shadow-md transition active:scale-95 border border-[#8B2F3C]/40"
                >
                  {editingBannerId ? 'Save Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JSON Import & Export Backup Modal */}
      {showImportExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-neutral-900 rounded-3xl max-w-2xl w-full p-6 border border-neutral-700 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#362118]">
              <div className="flex items-center gap-2">
                {importExportMode === 'export' ? (
                  <Download className="w-5 h-5 text-rose-200" />
                ) : (
                  <Upload className="w-5 h-5 text-emerald-400" />
                )}
                <h2 className="text-base font-black text-white">
                  {importExportMode === 'export'
                    ? 'Export Complete Bakery Database Backup'
                    : 'Import Bakery Configuration JSON'}
                </h2>
              </div>
              <button
                onClick={() => setShowImportExportModal(false)}
                className="text-neutral-400 hover:text-white text-base"
              >
                ✕
              </button>
            </div>

            <p className="text-neutral-400">
              {importExportMode === 'export'
                ? 'Copy this JSON or save it as a backup file. It contains all products, categories, coupons, banners, custom requests, and operational settings.'
                : 'Paste a previously exported Bakery configuration JSON below to restore or sync all data instantaneously.'}
            </p>

            <div>
              <textarea
                rows={12}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder={importExportMode === 'import' ? 'Paste your exported JSON here...' : ''}
                readOnly={importExportMode === 'export'}
                className="w-full p-3 rounded-2xl bg-neutral-950 border border-neutral-700 text-neutral-300 font-mono text-[11px] focus:border-[#8B2F3C] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                {importExportMode === 'export' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(jsonText);
                        showToast('JSON database copied to clipboard!');
                      }}
                      className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold border border-neutral-700 transition"
                    >
                      Copy JSON to Clipboard
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const blob = new Blob([jsonText], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `cravvy-bakery-backup-${new Date().toISOString().slice(0, 10)}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        showToast('Backup JSON file downloaded!');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#8B2F3C] hover:bg-[#8B2F3C]/90 text-white font-bold transition shadow-sm border border-[#8B2F3C]/40"
                    >
                      Download .json File
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!jsonText.trim()) {
                        showToast('Please paste valid JSON text first.');
                        return;
                      }
                      const ok = importConfigJSON(jsonText);
                      if (ok) {
                        showToast('Database imported successfully! All settings refreshed.');
                        setShowImportExportModal(false);
                      } else {
                        showToast('Invalid JSON format. Please check and try again.');
                      }
                    }}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm"
                  >
                    Apply & Restore JSON
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowImportExportModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supabase SQL Schema Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-neutral-900 rounded-3xl max-w-2xl w-full p-6 border border-neutral-700 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#362118]">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-black text-white">
                  Supabase Database SQL Schema
                </h2>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-neutral-400 hover:text-white text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-neutral-400">
              Copy this SQL script, open your Supabase Dashboard ➔ <strong>SQL Editor</strong>, paste it, and click <strong>Run</strong>. This will automatically create all required tables (<code className="text-amber-300">products</code>, <code className="text-amber-300">orders</code>, <code className="text-amber-300">categories</code>, <code className="text-amber-300">bakery_settings</code>, <code className="text-amber-300">custom_cake_requests</code>) and set up the access policies.
            </p>

            <div className="relative">
              <textarea
                rows={11}
                readOnly
                value={`-- CRAVVY CAKES - SUPABASE DATABASE SCHEMA
CREATE TABLE IF NOT EXISTS bakery_settings (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

ALTER TABLE bakery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_cake_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon all on bakery_settings" ON bakery_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on custom_cake_requests" ON custom_cake_requests FOR ALL USING (true) WITH CHECK (true);`}
                className="w-full p-3 rounded-2xl bg-neutral-950 border border-neutral-700 text-neutral-300 font-mono text-[11px] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const sqlContent = `-- CRAVVY CAKES - SUPABASE DATABASE SCHEMA
CREATE TABLE IF NOT EXISTS bakery_settings (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

ALTER TABLE bakery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_cake_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon all on bakery_settings" ON bakery_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on custom_cake_requests" ON custom_cake_requests FOR ALL USING (true) WITH CHECK (true);`;
                  navigator.clipboard.writeText(sqlContent);
                  showToast('SQL Schema copied to clipboard! Paste in Supabase SQL editor.');
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL Script</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
