import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Logo } from './Logo';
import {
  Smartphone,
  LayoutDashboard,
  Code2,
  ShoppingBag,
  Bell,
  Sparkles,
  Maximize2,
  Minimize2,
  Cake,
  Sun,
  Moon,
  Download,
} from 'lucide-react';
import { ApkDownloadModal } from '../modals/ApkDownloadModal';

interface HeaderProps {
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const {
    viewMode,
    setViewMode,
    deviceFrame,
    setDeviceFrame,
    cart,
    unreadNotificationCount,
    setCustomerTab,
    setCustomCakeModalOpen,
    orders,
    isDarkMode,
    toggleDarkMode,
  } = useBakery();

  const [activeMenu, setActiveMenu] = useState(false);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Placed' || o.status === 'Confirmed' || o.status === 'Preparing'
  ).length;

  return (
    <header className="bg-[#3B2118] border-b border-[#4E2E23] text-[#FAF4EE] sticky top-0 z-40 px-3 md:px-6 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-4">
          <div onClick={() => setViewMode('customer')} className="cursor-pointer">
            <Logo size="md" variant="light" />
          </div>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-[#4E2E23] text-xs text-[#FAF4EE]/70">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C9A227]/15 text-[#C9A227] border border-[#C9A227]/30 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Kitchen Online
            </span>
          </div>
        </div>

        {/* Center: Mode Switcher Tabs */}
        <div className="flex items-center bg-[#2B1A15] p-1 rounded-2xl border border-[#4E2E23] shadow-inner">
          <button
            id="nav-tab-customer-app"
            onClick={() => setViewMode('customer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all ${
              viewMode === 'customer'
                ? 'bg-[#8B2F3C] text-white shadow-md border border-[#C9A227]/30'
                : 'text-[#FAF4EE]/75 hover:text-white hover:bg-[#3B2118]'
            }`}
          >
            <Smartphone className="w-4 h-4 text-[#C9A227]" />
            <span className="hidden sm:inline">Customer App</span>
            <span className="sm:hidden">App</span>
          </button>

          <button
            id="nav-tab-admin-panel"
            onClick={() => setViewMode('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all relative ${
              viewMode === 'admin'
                ? 'bg-[#8B2F3C] text-white shadow-md border border-[#C9A227]/30'
                : 'text-[#FAF4EE]/75 hover:text-white hover:bg-[#3B2118]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#C9A227]" />
            <span className="hidden sm:inline">Admin Panel</span>
            <span className="sm:hidden">Admin</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#8B2F3C] text-white font-bold border border-[#C9A227]/40 animate-pulse">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-codebase-hub"
            onClick={() => setViewMode('codebase')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all ${
              viewMode === 'codebase'
                ? 'bg-[#8B2F3C] text-white shadow-md border border-[#C9A227]/30'
                : 'text-[#FAF4EE]/75 hover:text-white hover:bg-[#3B2118]'
            }`}
          >
            <Code2 className="w-4 h-4 text-[#C9A227]" />
            <span className="hidden sm:inline">Flutter & Backend Code</span>
            <span className="sm:hidden">Code</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* APK / App Download Button */}
          <button
            id="btn-header-apk-download"
            onClick={() => setIsApkModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-sm transition-transform hover:scale-105 border border-emerald-400/40"
            title="Download APK or Install on Phone"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Get APK / App</span>
            <span className="sm:hidden">APK</span>
          </button>

          {/* Theme Toggle (Warm Cream vs Dark Mode) */}
          <button
            id="btn-header-theme-toggle"
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Warm Cream Theme' : 'Switch to Dark Mode'}
            className="flex items-center justify-center p-2 rounded-xl bg-[#2B1A15] hover:bg-[#4E2E23] text-[#C9A227] border border-[#4E2E23] text-xs transition"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Custom Cake Fast Action */}
          <button
            id="btn-open-custom-cake"
            onClick={() => {
              setViewMode('customer');
              setCustomCakeModalOpen(true);
            }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B2F3C] hover:bg-[#732531] text-white text-xs font-semibold shadow-md border border-[#C9A227]/40 transition-transform hover:scale-105"
          >
            <Cake className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Custom Cake Studio</span>
          </button>

          {/* Device Frame Toggle (in Customer View) */}
          {viewMode === 'customer' && (
            <button
              id="btn-toggle-device-frame"
              onClick={() => setDeviceFrame(!deviceFrame)}
              title={deviceFrame ? 'Switch to Full Screen View' : 'Switch to Mobile Frame'}
              className="hidden sm:flex items-center justify-center p-2 rounded-xl bg-[#2B1A15] text-[#FAF4EE]/80 hover:text-white hover:bg-[#4E2E23] border border-[#4E2E23] text-xs transition"
            >
              {deviceFrame ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          )}

          {/* Notifications Button */}
          <button
            id="btn-header-notifications"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-[#2B1A15] hover:bg-[#4E2E23] text-[#FAF4EE]/80 hover:text-white border border-[#4E2E23] transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C9A227] text-[10px] font-black text-[#2B1A15]">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Cart Quick Button (Customer Mode) */}
          {viewMode === 'customer' && (
            <button
              id="btn-header-cart"
              onClick={() => setCustomerTab('cart')}
              className="relative p-2 rounded-xl bg-[#8B2F3C]/30 hover:bg-[#8B2F3C]/50 text-[#FAF4EE] border border-[#8B2F3C]/60 transition flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-[#C9A227]" />
              {cart.length > 0 && (
                <span className="font-bold text-xs bg-[#C9A227] text-[#2B1A15] px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* APK & App Download Modal */}
      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </header>
  );
};
