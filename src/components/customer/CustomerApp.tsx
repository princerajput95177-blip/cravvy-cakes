import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { HomeScreen } from './HomeScreen';
import { CategoriesScreen } from './CategoriesScreen';
import { CartScreen } from './CartScreen';
import { OrderTrackingView } from './OrderTrackingView';
import { OrderHistoryView } from './OrderHistoryView';
import { ProfileScreen } from './ProfileScreen';
import { WishlistScreen } from './WishlistScreen';
import { CustomCakeScreen } from './CustomCakeScreen';
import { ProductDetailModal } from './ProductDetailModal';
import { SplashScreen } from './SplashScreen';
import { AuthModal } from './AuthModal';
import { NotificationDrawer } from './NotificationDrawer';
import {
  Home,
  LayoutGrid,
  ShoppingBag,
  Clock,
  User,
  Wifi,
  Battery,
  Signal,
  Sparkles,
  Cake,
  Bell,
  ChevronRight,
  Megaphone,
  AlertTriangle,
  X,
  Store,
} from 'lucide-react';

export const CustomerApp: React.FC = () => {
  const {
    deviceFrame,
    customerTab,
    setCustomerTab,
    cart,
    cartTotal,
    orders,
    selectedProduct,
    customCakeModalOpen,
    setCustomCakeModalOpen,
    activeTrackingOrderId,
    setActiveTrackingOrderId,
    unreadNotificationCount,
    activeToast,
    settings,
  } = useBakery();

  const [showSplash, setShowSplash] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [subView, setSubView] = useState<'normal' | 'tracking'>('normal');
  const [promoDismissed, setPromoDismissed] = useState(false);

  const pendingOrderCount = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;

  const handleTrackOrder = (orderId: string) => {
    setActiveTrackingOrderId(orderId);
    setSubView('tracking');
    setCustomerTab('orders');
  };

  const renderActiveScreen = () => {
    if (customCakeModalOpen) {
      return <CustomCakeScreen onClose={() => setCustomCakeModalOpen(false)} />;
    }

    switch (customerTab) {
      case 'home':
        return <HomeScreen />;
      case 'categories':
        return <CategoriesScreen />;
      case 'cart':
        return <CartScreen />;
      case 'orders':
        if (subView === 'tracking') {
          return (
            <OrderTrackingView
              onBack={() => setSubView('normal')}
            />
          );
        }
        return <OrderHistoryView onTrackOrder={handleTrackOrder} />;
      case 'profile':
        return <ProfileScreen />;
      case 'wishlist':
        return <WishlistScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const appContent = (
    <div className="relative flex flex-col flex-1 h-full w-full bg-[#FFF8F0] dark:bg-[#211713] text-[#2B1A15] dark:text-[#FAF4EE] font-sans overflow-hidden">
      {/* Toast banner */}
      {activeToast && (
        <div className="absolute top-12 left-4 right-4 z-50 p-3 rounded-2xl bg-[#3B2118]/95 text-[#FAF4EE] text-xs font-semibold shadow-2xl border border-[#C9A227]/40 backdrop-blur-md flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
            <span>{activeToast}</span>
          </div>
        </div>
      )}

      {/* Top Announcement Marquee Ticker if Enabled in Admin Settings */}
      {settings.noticeBarEnabled && settings.noticeBarText && (
        <div
          id="admin-announcement-ticker"
          className={`px-3.5 py-1.5 text-xs font-bold flex items-center gap-2 shadow-sm z-30 flex-shrink-0 ${
            settings.noticeBarColor === 'emerald'
              ? 'bg-emerald-700 text-white'
              : settings.noticeBarColor === 'rose'
              ? 'bg-rose-700 text-white'
              : settings.noticeBarColor === 'indigo'
              ? 'bg-indigo-700 text-white'
              : 'bg-[#8B2F3C] text-white'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5 flex-shrink-0 animate-bounce text-[#C9A227]" />
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-[11px] tracking-tight">{settings.noticeBarText}</p>
          </div>
        </div>
      )}

      {/* Dynamic Store Closed Announcement Banner */}
      {!settings.isOpen && (
        <div
          id="store-closed-alert-banner"
          className="bg-[#8B2F3C] text-white px-4 py-2 text-xs font-semibold flex items-center gap-2.5 shadow-md z-30 flex-shrink-0"
        >
          <Store className="w-4 h-4 flex-shrink-0 animate-pulse" />
          <div className="flex-1 leading-tight">
            <span className="font-black uppercase tracking-wider block text-[10px] text-[#C9A227]">
              Kitchen Currently Closed
            </span>
            <span>{settings.closedNotice || 'We are currently not accepting new orders.'}</span>
          </div>
        </div>
      )}

      {/* Main Scrollable Screen Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {renderActiveScreen()}
      </div>

      {/* Swiggy-style Floating Cart Pill (Burgundy Luxury CTA with Gold Highlights) */}
      {cart.length > 0 &&
        (customerTab === 'home' || customerTab === 'categories') &&
        !customCakeModalOpen && (
          <div className="px-3 py-1.5 z-30 bg-gradient-to-t from-[#FFF8F0]/95 dark:from-[#211713]/95 to-transparent">
            <div
              id="swiggy-floating-cart-pill"
              onClick={() => setCustomerTab('cart')}
              className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#8B2F3C] hover:bg-[#742531] text-white shadow-xl shadow-[#8B2F3C]/25 border border-[#C9A227]/40 cursor-pointer active:scale-[0.98] transition duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#C9A227] text-[#2B1A15] flex items-center justify-center font-black text-xs shadow-xs">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#C9A227] font-bold block leading-none">
                    Item Added • Checkout
                  </span>
                  <span className="text-sm font-black tracking-tight leading-snug text-white">
                    ₹{cartTotal}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-black uppercase tracking-wider bg-white/15 px-3 py-1.5 rounded-xl transition">
                <span>View Cart</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        )}

      {/* Bottom Navigation Bar */}
      <nav
        id="customer-bottom-navigation"
        className="sticky bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#30221D]/95 backdrop-blur-md border-t border-[#E8DACD] dark:border-[#46332B] px-2 py-2 shadow-lg"
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {/* 1. Home */}
          <button
            id="nav-btn-home"
            onClick={() => {
              setCustomCakeModalOpen(false);
              setSubView('normal');
              setCustomerTab('home');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              customerTab === 'home' && !customCakeModalOpen
                ? 'text-[#8B2F3C] dark:text-[#C9A227] font-bold scale-105'
                : 'text-[#7A6A63] hover:text-[#2B1A15] dark:text-[#B8A8A1] dark:hover:text-[#FAF4EE]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </button>

          {/* 2. Categories */}
          <button
            id="nav-btn-categories"
            onClick={() => {
              setCustomCakeModalOpen(false);
              setSubView('normal');
              setCustomerTab('categories');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              customerTab === 'categories' && !customCakeModalOpen
                ? 'text-[#8B2F3C] dark:text-[#C9A227] font-bold scale-105'
                : 'text-[#7A6A63] hover:text-[#2B1A15] dark:text-[#B8A8A1] dark:hover:text-[#FAF4EE]'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px]">Menu</span>
          </button>

          {/* Center Custom Cake Studio Button */}
          <button
            id="nav-btn-custom-cake-center"
            onClick={() => setCustomCakeModalOpen(true)}
            className="flex flex-col items-center -mt-5"
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
                customCakeModalOpen
                  ? 'bg-[#742531] ring-4 ring-[#C9A227]/40'
                  : 'bg-[#8B2F3C] hover:bg-[#742531] border-2 border-[#C9A227] hover:scale-105 shadow-[#8B2F3C]/30'
              }`}
            >
              <Cake className="w-6 h-6 stroke-[2.2] text-[#C9A227]" />
            </div>
            <span className="text-[10px] font-bold text-[#8B2F3C] dark:text-[#C9A227] mt-1">
              Custom
            </span>
          </button>

          {/* 3. Cart */}
          <button
            id="nav-btn-cart"
            onClick={() => {
              setCustomCakeModalOpen(false);
              setSubView('normal');
              setCustomerTab('cart');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition relative ${
              customerTab === 'cart' && !customCakeModalOpen
                ? 'text-[#8B2F3C] dark:text-[#C9A227] font-bold scale-105'
                : 'text-[#7A6A63] hover:text-[#2B1A15] dark:text-[#B8A8A1] dark:hover:text-[#FAF4EE]'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px]">Cart</span>
            {cart.length > 0 && (
              <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-[#8B2F3C] text-white text-[9px] font-black flex items-center justify-center shadow-xs border border-white dark:border-[#30221D]">
                {cart.length}
              </span>
            )}
          </button>

          {/* 4. Orders */}
          <button
            id="nav-btn-orders"
            onClick={() => {
              setCustomCakeModalOpen(false);
              setSubView('normal');
              setCustomerTab('orders');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition relative ${
              customerTab === 'orders' && !customCakeModalOpen
                ? 'text-[#8B2F3C] dark:text-[#C9A227] font-bold scale-105'
                : 'text-[#7A6A63] hover:text-[#2B1A15] dark:text-[#B8A8A1] dark:hover:text-[#FAF4EE]'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px]">Orders</span>
            {pendingOrderCount > 0 && (
              <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            )}
          </button>

          {/* 5. Profile */}
          <button
            id="nav-btn-profile"
            onClick={() => {
              setCustomCakeModalOpen(false);
              setSubView('normal');
              setCustomerTab('profile');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              customerTab === 'profile' && !customCakeModalOpen
                ? 'text-[#8B2F3C] dark:text-[#C9A227] font-bold scale-105'
                : 'text-[#7A6A63] hover:text-[#2B1A15] dark:text-[#B8A8A1] dark:hover:text-[#FAF4EE]'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">Profile</span>
          </button>
        </div>
      </nav>

      {/* Modals and Overlays */}
      <ProductDetailModal />
      <AuthModal />
      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );

  if (showSplash) {
    return <SplashScreen onEnter={() => setShowSplash(false)} />;
  }

  // Pure Native Mobile View: 100% full screen edge-to-edge on mobile, strictly mobile width (max-w-md) on desktop
  return (
    <div className="w-full flex-1 flex flex-col min-h-screen bg-[#FFF8F0] dark:bg-[#211713] md:bg-[#EDE0D2] md:dark:bg-[#150D0A] transition-colors">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col bg-[#FFF8F0] dark:bg-[#211713] md:shadow-2xl md:border-x md:border-[#E8DACD] md:dark:border-[#3D2820] overflow-hidden min-h-screen">
        {appContent}
      </div>
    </div>
  );
};
