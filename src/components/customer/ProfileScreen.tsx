import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Bell,
  HelpCircle,
  Shield,
  FileText,
  LogOut,
  LayoutDashboard,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  Sparkles,
  MessageCircle,
  ExternalLink,
  CreditCard,
} from 'lucide-react';
import {
  BAKERY_WHATSAPP_NUMBER,
  BAKERY_MAPS_URL,
  BAKERY_ADDRESS_TEXT,
} from '../../utils/whatsapp';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    logout,
    savedAddresses,
    addAddress,
    deleteAddress,
    setViewMode,
    setCustomerTab,
    setIsAuthModalOpen,
    showToast,
  } = useBakery();

  const [activeSubView, setActiveSubView] = useState<'profile' | 'addresses' | 'support' | 'privacy'>('profile');

  // Address add form
  const [showAddModal, setShowAddModal] = useState(false);
  const [house, setHouse] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Jalandhar');
  const [pincode, setPincode] = useState('144003');
  const [addrType, setAddrType] = useState<'Home' | 'Work' | 'Other'>('Home');

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!house || !area) {
      showToast('Please enter house number and area.');
      return;
    }
    addAddress({
      name: user.name,
      phone: user.phone,
      houseFlat: house,
      street: street || 'Main Street',
      area,
      city,
      pincode,
      type: addrType,
    });
    setHouse('');
    setStreet('');
    setArea('');
    setShowAddModal(false);
  };

  return (
    <div className="p-4 sm:p-5 space-y-5 pb-24 max-w-xl mx-auto" id="profile-screen">
      {/* User Header Card */}
      {user.isLoggedIn ? (
        <div className="p-4 rounded-3xl bg-[#3B2118] text-white shadow-xl border border-[#C9A227]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#8B2F3C] flex items-center justify-center text-white text-xl font-black shadow-md border-2 border-[#C9A227]">
              {user.name ? user.name.charAt(0).toUpperCase() : 'K'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">{user.name}</h2>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#C9A227] text-[#2B1A15] font-black">
                  Patron
                </span>
              </div>
              <p className="text-xs text-[#FAF4EE]/80 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-[#C9A227]" />
                <span>{user.phone}</span>
              </p>
              <p className="text-xs text-[#FAF4EE]/70 flex items-center gap-1">
                <Mail className="w-3 h-3 text-[#C9A227]" />
                <span>{user.email}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="p-2 rounded-xl bg-[#2B1A15] hover:bg-[#20120d] text-xs text-[#C9A227] font-semibold transition border border-[#C9A227]/30"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-3xl bg-[#3B2118] text-white shadow-xl border border-[#C9A227]/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#8B2F3C] flex items-center justify-center text-white text-lg font-bold border border-[#C9A227]/50">
                <User className="w-6 h-6 text-[#C9A227]" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">Browsing as Guest</h2>
                <p className="text-xs text-[#FAF4EE]/80">
                  Explore fresh bakery menus & custom cakes
                </p>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-2xl bg-[#8B2F3C] hover:bg-[#742531] text-white font-black text-xs shadow-md border border-[#C9A227]/40 transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#C9A227]" />
              <span>Login with Mobile Number (OTP)</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Menu Options */}
      <div className="p-2 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] shadow-xs space-y-1">
        <button
          onClick={() => setActiveSubView('addresses')}
          className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-[#FFF8F0] dark:hover:bg-[#261B16] text-left transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFF8F0] dark:bg-[#261B16] text-[#8B2F3C] dark:text-[#C9A227] border border-[#E8DACD] dark:border-[#46332B] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2B1A15] dark:text-[#FAF4EE]">
                Saved Delivery Addresses
              </div>
              <div className="text-[11px] text-[#7A6A63] dark:text-[#B8A8A1]">
                {savedAddresses.length} addresses saved
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#7A6A63]" />
        </button>

        <button
          onClick={() => setCustomerTab('orders')}
          className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-[#FFF8F0] dark:hover:bg-[#261B16] text-left transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFF8F0] dark:bg-[#261B16] text-[#8B2F3C] dark:text-[#C9A227] border border-[#E8DACD] dark:border-[#46332B] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2B1A15] dark:text-[#FAF4EE]">
                Order History & Invoices
              </div>
              <div className="text-[11px] text-[#7A6A63] dark:text-[#B8A8A1]">
                Past orders, active status, instant re-order
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#7A6A63]" />
        </button>

        <button
          onClick={() => setActiveSubView('support')}
          className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-[#FFF8F0] dark:hover:bg-[#261B16] text-left transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFF8F0] dark:bg-[#261B16] text-[#8B2F3C] dark:text-[#C9A227] border border-[#E8DACD] dark:border-[#46332B] flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2B1A15] dark:text-[#FAF4EE]">
                Help & Bakery Support
              </div>
              <div className="text-[11px] text-[#7A6A63] dark:text-[#B8A8A1]">
                FAQ, delivery slots, ingredients query
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#7A6A63]" />
        </button>

        <button
          onClick={() => setActiveSubView('privacy')}
          className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-[#FFF8F0] dark:hover:bg-[#261B16] text-left transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFF8F0] dark:bg-[#261B16] text-[#8B2F3C] dark:text-[#C9A227] border border-[#E8DACD] dark:border-[#46332B] flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2B1A15] dark:text-[#FAF4EE]">
                Privacy Policy & Hygiene Standards
              </div>
              <div className="text-[11px] text-[#7A6A63] dark:text-[#B8A8A1]">
                FSSAI certified kitchen protocols
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#7A6A63]" />
        </button>
      </div>

      {/* Switch to Admin Panel Direct Card */}
      <div className="p-4 rounded-3xl bg-[#FFF8F0] dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#8B2F3C] dark:text-[#C9A227]">
            Bakery Owner & Staff Portal
          </span>
          <h3 className="text-sm font-bold text-[#2B1A15] dark:text-[#FAF4EE]">
            Switch to Bakery Admin Panel
          </h3>
          <p className="text-xs text-[#7A6A63] dark:text-[#B8A8A1]">
            Manage orders, update baking stages, quote custom cakes, and edit catalog.
          </p>
        </div>
        <button
          onClick={() => setViewMode('admin')}
          className="px-3.5 py-2 rounded-xl bg-[#3B2118] text-white hover:bg-[#2B1A15] text-xs font-bold shadow-md transition flex items-center gap-1.5 border border-[#C9A227]/40"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Admin</span>
        </button>
      </div>

      {/* Official Bakery Store & Location Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#8B2F3C] text-white flex items-center justify-center shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-[#2B1A15] dark:text-[#FAF4EE]">
                Kuku Bakery / Cravvy Cakes Store
              </h3>
              <p className="text-[10px] text-[#7A6A63] dark:text-[#B8A8A1]">
                {BAKERY_ADDRESS_TEXT}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Open 8 AM - 11:30 PM
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={BAKERY_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-2xl bg-[#FFF8F0] dark:bg-[#261B16] hover:bg-[#FDF2E4] border border-[#E8DACD] dark:border-[#46332B] flex items-center justify-center gap-1.5 text-xs font-bold text-[#8B2F3C] dark:text-[#C9A227] transition shadow-2xs"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <a
            href={`https://wa.me/91${BAKERY_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Kuku Bakery, I want to inquire about cakes/delivery.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 text-xs font-bold transition shadow-2xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Us</span>
          </a>
        </div>

        {/* Bank & UPI Info Preview */}
        <div className="p-3 rounded-2xl bg-[#FFF8F0]/70 dark:bg-[#261B16]/80 border border-[#E8DACD]/80 dark:border-[#46332B] text-[11px] space-y-1">
          <div className="flex items-center justify-between font-bold text-[#2B1A15] dark:text-[#FAF4EE]">
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#8B2F3C] dark:text-[#C9A227]" />
              Official UPI & Bank Transfer
            </span>
            <span className="font-mono text-[10px] text-[#8B2F3C] dark:text-[#C9A227]">Kotak Bank</span>
          </div>
          <p className="text-[#7A6A63] dark:text-[#B8A8A1]">
            UPI ID: <strong className="text-[#2B1A15] dark:text-[#FAF4EE] font-mono">q490463229@ybl</strong> • Phone: <strong className="text-[#2B1A15] dark:text-[#FAF4EE]">+91 {BAKERY_WHATSAPP_NUMBER}</strong>
          </p>
        </div>
      </div>

      {/* Addresses Modal / Inline Subview */}
      {activeSubView === 'addresses' && (
        <div className="p-4 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#2B1A15] dark:text-[#FAF4EE]">
              Manage Addresses
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs font-bold text-[#8B2F3C] dark:text-[#C9A227] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New</span>
            </button>
          </div>

          <div className="space-y-2">
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className="p-3 rounded-2xl bg-[#FFF8F0]/80 dark:bg-[#261B16] border border-[#E8DACD] dark:border-[#46332B] flex items-start justify-between"
              >
                <div className="text-xs space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2B1A15] dark:text-[#FAF4EE]">{addr.name}</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#E8DACD] dark:bg-[#46332B] text-[10px] font-bold text-[#3B2118] dark:text-[#FAF4EE]">
                      {addr.type}
                    </span>
                  </div>
                  <p className="text-[#7A6A63] dark:text-[#B8A8A1]">
                    {addr.houseFlat}, {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                  </p>
                </div>
                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="p-1.5 text-[#7A6A63] hover:text-[#8B2F3C]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {showAddModal && (
            <form onSubmit={handleSaveAddress} className="p-3 rounded-2xl bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD] dark:border-[#46332B] space-y-2 text-xs">
              <input
                type="text"
                placeholder="House / Flat No."
                value={house}
                onChange={(e) => setHouse(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Street / Colony"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Area (e.g. Model Town, Urban Estate)"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Pincode (e.g. 144003)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] text-xs font-bold text-[#7A6A63] hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-[#8B2F3C] hover:bg-[#742531] text-white text-xs font-bold border border-[#C9A227]/30"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Support FAQ subview */}
      {activeSubView === 'support' && (
        <div className="p-4 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] space-y-3 text-xs">
          <h3 className="font-bold text-sm text-[#2B1A15] dark:text-[#FAF4EE]">
            Frequently Asked Questions
          </h3>
          <div className="space-y-2 text-[#7A6A63] dark:text-[#B8A8A1]">
            <div className="p-2.5 rounded-xl bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD]/60 dark:border-[#46332B]">
              <strong className="text-[#2B1A15] dark:text-[#FAF4EE] block mb-0.5 font-bold">
                Q: Are all cakes available in 100% Eggless?
              </strong>
              <span>Yes! Every cake at Cravvy Cakes has a dedicated 100% egg-free recipe crafted with high-grade dairy and fruit pectins.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD]/60 dark:border-[#46332B]">
              <strong className="text-[#2B1A15] dark:text-[#FAF4EE] block mb-0.5 font-bold">
                Q: What is the lead time for Custom Theme Cakes?
              </strong>
              <span>Custom tiered and 3D fondant cakes require 4 to 24 hours depending on structural intricacy. Submit your request for an instant WhatsApp quote.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD]/60 dark:border-[#46332B]">
              <strong className="text-[#2B1A15] dark:text-[#FAF4EE] block mb-0.5 font-bold">
                Q: Can I schedule a Midnight Delivery surprise?
              </strong>
              <span>Yes, choose the "11:45 PM - 12:15 AM Midnight Slot" during checkout for on-the-dot celebratory deliveries.</span>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Subview */}
      {activeSubView === 'privacy' && (
        <div className="p-4 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] space-y-2 text-xs text-[#7A6A63] dark:text-[#B8A8A1] leading-relaxed">
          <h3 className="font-bold text-sm text-[#2B1A15] dark:text-[#FAF4EE]">
            Cravvy Cakes Kitchen & Hygiene Charter
          </h3>
          <p>
            • FSSAI License: <strong className="text-[#2B1A15] dark:text-[#FAF4EE]">11223994000182</strong> (Artisanal Bakery & Confectionery).
          </p>
          <p>
            • All dairy, Belgian chocolates, and butter are temperature-controlled at 4°C.
          </p>
          <p>
            • Payments are encrypted end-to-end via Razorpay Level 1 PCI-DSS standard.
          </p>
        </div>
      )}

      {/* Logout / Login Footer Action */}
      {user.isLoggedIn ? (
        <button
          onClick={logout}
          className="w-full py-3 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout from Cravvy Cakes</span>
        </button>
      ) : (
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="w-full py-3 rounded-2xl bg-[#8B2F3C] hover:bg-[#742531] text-white font-bold text-xs shadow-md border border-[#C9A227]/40 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Phone className="w-4 h-4 text-[#C9A227]" />
          <span>Login / Register with Mobile Number</span>
        </button>
      )}
    </div>
  );
};
