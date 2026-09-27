import React, { useState, useEffect } from 'react';
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
  Lock,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  Sparkles,
  MessageCircle,
  ExternalLink,
  CreditCard,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  ArrowLeft,
  Copy,
  Info,
  Globe,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
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
    deleteUserAccount,
    requestWebAccountDeletion,
    savedAddresses,
    addAddress,
    deleteAddress,
    setViewMode,
    openAdminPortal,
    isAdminUnlocked,
    setCustomerTab,
    setIsAuthModalOpen,
    showToast,
  } = useBakery();

  const [activeSubView, setActiveSubView] = useState<
    'profile' | 'addresses' | 'support' | 'privacy' | 'delete-account'
  >(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get('view') === 'delete-account' ||
        params.get('tab') === 'delete-account' ||
        params.get('action') === 'delete-account'
      ) {
        return 'delete-account';
      }
    }
    return 'profile';
  });

  // Keep synced with URL search params for direct browser links
  useEffect(() => {
    const handleUrlCheck = () => {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get('view') === 'delete-account' ||
        params.get('tab') === 'delete-account'
      ) {
        setActiveSubView('delete-account');
      }
    };
    window.addEventListener('popstate', handleUrlCheck);
    return () => window.removeEventListener('popstate', handleUrlCheck);
  }, []);

  // In-app deletion state
  const [deleteReason, setDeleteReason] = useState('No longer using the app');
  const [agreeWipe, setAgreeWipe] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Web Deletion Request Portal state
  const [webIdentifier, setWebIdentifier] = useState(user.phone || '');
  const [webReason, setWebReason] = useState('Account and data deletion requested via Play Store Web Portal');
  const [isWebSubmitting, setIsWebSubmitting] = useState(false);
  const [webSuccessData, setWebSuccessData] = useState<{ refId: string; message: string } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const webDeletionUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?view=delete-account`
      : 'https://ais-pre-c6plbw2lip7zulw67q4pni-67795857064.asia-southeast1.run.app/?view=delete-account';

  const handleCopyPlayStoreLink = () => {
    navigator.clipboard.writeText(webDeletionUrl);
    setCopiedUrl(true);
    showToast('Play Store Account Deletion URL copied!');
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleInAppDeleteAccount = async () => {
    if (!agreeWipe) {
      showToast('Please check the confirmation box to proceed.');
      return;
    }
    setIsDeleting(true);
    try {
      await deleteUserAccount();
      setShowConfirmDialog(false);
      setAgreeWipe(false);
      setActiveSubView('profile');
      showToast('Your Cravvy Cakes account has been permanently deleted.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleWebDeletionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webIdentifier.trim()) {
      showToast('Please enter your registered mobile number or email.');
      return;
    }
    setIsWebSubmitting(true);
    try {
      const res = await requestWebAccountDeletion(webIdentifier, webReason);
      setWebSuccessData({ refId: res.refId, message: res.message });
      showToast('Account deletion request processed.');
    } finally {
      setIsWebSubmitting(false);
    }
  };

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

        {/* Play Store Compliant Account Deletion Option */}
        <button
          onClick={() => setActiveSubView('delete-account')}
          className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left transition group border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <span>Delete Account & Erase Data</span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200">
                  Play Store Policy
                </span>
              </div>
              <div className="text-[11px] text-[#7A6A63] dark:text-[#B8A8A1]">
                Permanent account wipe & Google Play deletion portal
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
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
          onClick={openAdminPortal}
          className="px-3.5 py-2 rounded-xl bg-[#3B2118] text-white hover:bg-[#2B1A15] text-xs font-bold shadow-md transition flex items-center gap-1.5 border border-[#C9A227]/40 cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>{isAdminUnlocked ? 'Open Admin' : 'Admin Login'}</span>
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
                Cravvy Cakes Store
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
            href={`https://wa.me/91${BAKERY_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Cravvy Cakes, I want to inquire about cakes/delivery.')}`}
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSubView('profile')}
                className="p-1.5 rounded-lg bg-[#FFF8F0] dark:bg-[#261B16] text-[#8B2F3C] dark:text-[#C9A227] hover:bg-[#FDF2E4]"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="font-bold text-sm text-[#2B1A15] dark:text-[#FAF4EE]">
                Manage Addresses
              </h3>
            </div>
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubView('profile')}
              className="p-1.5 rounded-lg bg-[#FFF8F0] dark:bg-[#261B16] text-[#8B2F3C] dark:text-[#C9A227] hover:bg-[#FDF2E4]"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-sm text-[#2B1A15] dark:text-[#FAF4EE]">
              Frequently Asked Questions
            </h3>
          </div>
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubView('profile')}
              className="p-1.5 rounded-lg bg-[#FFF8F0] dark:bg-[#261B16] text-[#8B2F3C] dark:text-[#C9A227] hover:bg-[#FDF2E4]"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-sm text-[#2B1A15] dark:text-[#FAF4EE]">
              Cravvy Cakes Kitchen & Hygiene Charter
            </h3>
          </div>
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

      {/* Play Store & GDPR Compliant Account Deletion Subview */}
      {activeSubView === 'delete-account' && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#30221D] border border-rose-200 dark:border-rose-900/60 shadow-md space-y-4 text-xs">
          {/* Top Bar with Back Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveSubView('profile')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD] dark:border-[#46332B] text-xs font-bold text-[#8B2F3C] dark:text-[#C9A227] hover:bg-[#FDF2E4] transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Profile</span>
            </button>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-rose-600" />
              <span>Google Play Policy</span>
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-base font-black text-rose-800 dark:text-rose-400 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-600" />
              <span>Delete Account & Erase Personal Data</span>
            </h2>
            <p className="text-xs text-[#7A6A63] dark:text-[#B8A8A1] leading-relaxed">
              In strict compliance with <strong>Google Play Store Data Safety & Account Deletion Policy</strong> and the <strong>Digital Personal Data Protection (DPDP) Act</strong>, you have the full legal right to permanently delete your account, saved delivery addresses, and personal identifiable information.
            </p>
          </div>

          {/* Information Notice: What gets deleted vs retained */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-1.5">
              <span className="text-[11px] font-black text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                Data Deleted Immediately:
              </span>
              <ul className="text-[11px] text-rose-900/80 dark:text-rose-200/80 space-y-1 list-disc list-inside">
                <li>Your registered phone number & profile name</li>
                <li>All saved delivery addresses (Home, Work, etc.)</li>
                <li>Shopping bag items, saved vouchers & custom cake drafts</li>
                <li>Active login sessions and cached security tokens</li>
              </ul>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1.5">
              <span className="text-[11px] font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Statutory Retention (Required by Law):
              </span>
              <p className="text-[11px] text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                Past tax invoices and payment transaction IDs for fulfilled orders are archived strictly for statutory accounting and GST audits as mandated by Section 36 of the CGST Act.
              </p>
            </div>
          </div>

          {/* If Logged In: Direct In-App Account Deletion */}
          {user.isLoggedIn && (
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#261B16] border-2 border-rose-300 dark:border-rose-800 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-rose-100 dark:border-rose-900/50">
                <span className="text-xs font-black text-[#2B1A15] dark:text-[#FAF4EE]">
                  Active Logged In Account:
                </span>
                <span className="text-xs font-mono font-bold text-[#8B2F3C] dark:text-[#C9A227] bg-[#FFF8F0] dark:bg-[#30221D] px-2 py-0.5 rounded-lg border border-[#E8DACD]">
                  {user.name} ({user.phone || user.email})
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#2B1A15] dark:text-[#FAF4EE] mb-1">
                  Why are you deleting your account? (Optional)
                </label>
                <select
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-[#FFF8F0] dark:bg-[#30221D] text-xs text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="No longer using the app">No longer using the app</option>
                  <option value="Privacy and personal data removal">Privacy and personal data removal</option>
                  <option value="Created duplicate / alternate account">Created duplicate / alternate account</option>
                  <option value="Taking a temporary break">Taking a temporary break</option>
                  <option value="Other reason">Other reason</option>
                </select>
              </div>

              <label className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeWipe}
                  onChange={(e) => setAgreeWipe(e.target.checked)}
                  className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="text-[11px] font-medium text-rose-900 dark:text-rose-200">
                  I understand that this action is irreversible. My profile, saved delivery addresses, and personal data will be completely wiped immediately.
                </span>
              </label>

              <button
                type="button"
                disabled={!agreeWipe || isDeleting}
                onClick={handleInAppDeleteAccount}
                className={`w-full py-2.5 px-4 rounded-xl font-black text-xs text-white shadow-md flex items-center justify-center gap-2 transition cursor-pointer ${
                  agreeWipe && !isDeleting
                    ? 'bg-rose-600 hover:bg-rose-700 active:scale-98'
                    : 'bg-rose-300 dark:bg-rose-900/50 opacity-60 cursor-not-allowed'
                }`}
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Wiping Account & Data...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Permanently Delete My Cravvy Cakes Account</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Web Account Deletion Portal (Play Store Mandatory Link) */}
          <div className="p-3.5 rounded-2xl bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD] dark:border-[#46332B] space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#8B2F3C] dark:text-[#C9A227]" />
              <h3 className="font-bold text-xs text-[#2B1A15] dark:text-[#FAF4EE]">
                Google Play Store Web Deletion Request Portal
              </h3>
            </div>
            <p className="text-[11px] text-[#7A6A63] dark:text-[#B8A8A1]">
              If you have uninstalled the app or wish to request data erasure without logging in, enter your registered mobile number or email below:
            </p>

            {webSuccessData ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Account Deletion Request Processed!</span>
                </div>
                <p className="text-[11px] text-emerald-900/80 dark:text-emerald-200/80">
                  {webSuccessData.message}
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                  <span>Reference ID: <strong>{webSuccessData.refId}</strong></span>
                  <span>Status: Completed</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleWebDeletionSubmit} className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter Registered Mobile (+91...) or Email"
                  value={webIdentifier}
                  onChange={(e) => setWebIdentifier(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] text-xs text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Reason for deletion request (optional)"
                  value={webReason}
                  onChange={(e) => setWebReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] text-xs text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isWebSubmitting}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#3B2118] hover:bg-[#2B1A15] text-[#C9A227] font-bold text-xs border border-[#C9A227]/40 shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {isWebSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Submit Web Deletion Request</span>
                </button>
              </form>
            )}
          </div>

          {/* Developer / Store Owner Play Store Submission URL Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <Info className="w-3 h-3 text-amber-600" />
                Play Console Submission Link
              </span>
              <button
                onClick={handleCopyPlayStoreLink}
                className="px-2.5 py-1 rounded-lg bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 text-[10px] font-bold flex items-center gap-1 hover:bg-amber-300 transition cursor-pointer"
              >
                {copiedUrl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedUrl ? 'Copied URL!' : 'Copy Play Store URL'}</span>
              </button>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-[#211713] border border-amber-200 dark:border-amber-900 font-mono text-[10px] text-[#2B1A15] dark:text-[#FAF4EE] break-all select-all">
              {webDeletionUrl}
            </div>
            <p className="text-[10px] text-[#7A6A63] dark:text-[#B8A8A1]">
              Paste this URL in <strong>Google Play Console &gt; Policy and programs &gt; App content &gt; Data safety &gt; Account deletion URL</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Logout / Login Footer Action */}
      {user.isLoggedIn ? (
        <div className="space-y-2">
          <button
            onClick={logout}
            className="w-full py-3 rounded-2xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] hover:bg-[#FFF8F0] dark:hover:bg-[#261B16] text-[#7A6A63] dark:text-[#FAF4EE] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout from Cravvy Cakes</span>
          </button>

          <button
            onClick={() => setActiveSubView('delete-account')}
            className="w-full py-2.5 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100/60 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Cravvy Cakes Account & Personal Data</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full py-3 rounded-2xl bg-[#8B2F3C] hover:bg-[#742531] text-white font-bold text-xs shadow-md border border-[#C9A227]/40 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Phone className="w-4 h-4 text-[#C9A227]" />
            <span>Login / Register with Mobile Number</span>
          </button>

          <div className="text-center">
            <button
              onClick={() => setActiveSubView('delete-account')}
              className="text-[11px] text-[#7A6A63] dark:text-[#B8A8A1] hover:text-rose-600 dark:hover:text-rose-400 underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Play Store Account Deletion Request Portal</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
