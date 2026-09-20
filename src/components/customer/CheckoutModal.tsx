import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { ZomatoPaymentGateway } from './ZomatoPaymentGateway';
import { PaymentMethod } from '../../types';
import {
  MapPin,
  Calendar,
  CreditCard,
  Banknote,
  Sparkles,
  ShieldCheck,
  X,
  Plus,
  Check,
  Smartphone,
  Building2,
  Lock,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface CheckoutModalProps {
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  onClose,
  onOrderSuccess,
}) => {
  const {
    cart,
    cartSubtotal,
    cartDeliveryCharge,
    cartDiscount,
    cartTax,
    cartTotal,
    savedAddresses,
    selectedAddress,
    setSelectedAddress,
    placeOrder,
    user,
    showToast,
  } = useBakery();

  const [deliveryDate, setDeliveryDate] = useState('Today');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('Standard (within 45 mins)');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Google Pay');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  // Quick Address modal toggle
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrHouse, setNewAddrHouse] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrArea, setNewAddrArea] = useState('');
  const [newAddrPincode, setNewAddrPincode] = useState('144003');

  const handleCreateOrder = async (payInfo?: { paymentId: string; method: PaymentMethod }) => {
    try {
      setIsSubmitting(true);
      const chosenMethod = payInfo?.method || paymentMethod;
      const isOnlinePaid = chosenMethod !== 'Cash on Delivery';

      const newOrder = await placeOrder({
        deliveryDate,
        deliveryTimeSlot,
        paymentMethod: chosenMethod,
        paymentStatus: isOnlinePaid ? 'Paid' : 'Pending',
        paymentId: payInfo?.paymentId || (isOnlinePaid ? `PAY_${Date.now()}` : undefined),
        specialInstructions: specialInstructions.trim() || undefined,
      });

      setIsSubmitting(false);
      setShowPaymentGateway(false);
      onOrderSuccess(newOrder.id);
    } catch (err: any) {
      setIsSubmitting(false);
      setShowPaymentGateway(false);
      showToast(err.message || 'Error creating order');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddress) {
      showToast('Please select or add a delivery address.');
      return;
    }

    if (paymentMethod === 'Cash on Delivery') {
      handleCreateOrder();
    } else {
      // Launch Zomato-style direct payment gateway overlay
      setShowPaymentGateway(true);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
        id="checkout-modal-overlay"
      >
        <div
          className="bg-white dark:bg-[#2A1D18] rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#E8DACD] dark:border-[#46332B] animate-scaleUp"
          id="checkout-modal"
        >
          {/* Header - Zomato Style */}
          <div className="p-4 sm:p-5 border-b border-[#E8DACD] dark:border-[#46332B] flex items-center justify-between bg-white dark:bg-[#2A1D18]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#2B1A15] dark:text-[#FAF4EE]">
                  Review & Place Order
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5" /> 45m Express
                </span>
              </div>
              <p className="text-xs text-[#7A6A63] dark:text-[#B8A8A1]">
                Cravvy Cakes Bakery • Jalandhar City
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#FFF8F0] dark:hover:bg-[#382620] text-[#7A6A63] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form / Scroll Content */}
          <form onSubmit={handleCheckoutSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            {/* 1. Delivery Address Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-[#3B2118] dark:text-[#FAF4EE] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8B2F3C] dark:text-[#C9A227]" />
                  <span>1. Delivery Address</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="text-xs font-bold text-[#8B2F3C] dark:text-[#C9A227] hover:underline flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                  <span>{showAddAddress ? 'Cancel' : 'Add New'}</span>
                </button>
              </div>

              {showAddAddress ? (
                <div className="p-3.5 rounded-2xl bg-[#FFF8F0] dark:bg-[#33231D] border border-[#E8DACD] dark:border-[#46332B] space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder="House / Flat / Block No."
                    value={newAddrHouse}
                    onChange={(e) => setNewAddrHouse(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#2A1D18] text-[#2B1A15] dark:text-[#FAF4EE]"
                  />
                  <input
                    type="text"
                    placeholder="Street / Colony / Landmark"
                    value={newAddrStreet}
                    onChange={(e) => setNewAddrStreet(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#2A1D18] text-[#2B1A15] dark:text-[#FAF4EE]"
                  />
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#7A6A63] dark:text-[#B8A8A1]">Quick Select Jalandhar Area:</label>
                    <div className="flex flex-wrap gap-1">
                      {['Model Town', 'Urban Estate II', 'Cantt', 'Rama Mandi', 'Civil Lines', 'BMC Chowk'].map((areaName) => (
                        <button
                          key={areaName}
                          type="button"
                          onClick={() => setNewAddrArea(areaName)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition ${
                            newAddrArea === areaName
                              ? 'bg-[#8B2F3C] text-white border-[#8B2F3C]'
                              : 'bg-white dark:bg-[#2A1D18] text-[#7A6A63] dark:text-[#B8A8A1] border-[#E8DACD] dark:border-[#46332B]'
                          }`}
                        >
                          {areaName}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Area (e.g. Model Town)"
                      value={newAddrArea}
                      onChange={(e) => setNewAddrArea(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#2A1D18] text-[#2B1A15] dark:text-[#FAF4EE]"
                    />
                    <input
                      type="text"
                      placeholder="Pincode (e.g. 144003)"
                      value={newAddrPincode}
                      onChange={(e) => setNewAddrPincode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#2A1D18] text-[#2B1A15] dark:text-[#FAF4EE]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newAddrHouse || !newAddrArea) {
                        showToast('Please enter house number and area.');
                        return;
                      }
                      const newAddress = {
                        name: user.name,
                        phone: user.phone,
                        houseFlat: newAddrHouse,
                        street: newAddrStreet || 'Main Road',
                        area: newAddrArea,
                        city: 'Jalandhar',
                        pincode: newAddrPincode || '144003',
                        type: 'Home' as const,
                      };
                      setSelectedAddress({ ...newAddress, id: 'addr-' + Date.now() });
                      setShowAddAddress(false);
                      showToast('Delivery address saved & selected!');
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#8B2F3C] hover:bg-[#742531] text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Save & Select This Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-start justify-between ${
                        selectedAddress?.id === addr.id
                          ? 'border-[#8B2F3C] bg-[#FFF8F0] dark:bg-[#33231D] text-[#2B1A15] dark:text-[#FAF4EE] shadow-xs ring-1 ring-[#8B2F3C]'
                          : 'border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#2A1D18] text-[#7A6A63] dark:text-[#B8A8A1]'
                      }`}
                    >
                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#2B1A15] dark:text-[#FAF4EE]">{addr.name}</span>
                          <span className="px-1.5 py-0.2 rounded bg-[#8B2F3C]/10 text-[#8B2F3C] dark:text-[#C9A227] text-[10px] font-bold">
                            {addr.type}
                          </span>
                        </div>
                        <p className="text-[#7A6A63] dark:text-[#B8A8A1] line-clamp-1">
                          {addr.houseFlat}, {addr.street}, {addr.area}, Jalandhar - {addr.pincode}
                        </p>
                      </div>
                      {selectedAddress?.id === addr.id && (
                        <div className="w-5 h-5 rounded-full bg-[#8B2F3C] text-white flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Delivery Date & Time Slot */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-[#3B2118] dark:text-[#FAF4EE] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#8B2F3C] dark:text-[#C9A227]" />
                <span>2. Delivery Slot</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#2A1D18] text-xs font-bold text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
                >
                  <option value="Today">Today (Fast Delivery)</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Day After Tomorrow">Day After Tomorrow</option>
                </select>

                <select
                  value={deliveryTimeSlot}
                  onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#2A1D18] text-xs font-bold text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
                >
                  <option value="Standard (within 45 mins)">⚡ Express (~45 mins)</option>
                  <option value="6:00 PM - 8:00 PM">🌆 Evening (6 PM - 8 PM)</option>
                  <option value="8:00 PM - 10:00 PM">🌙 Night (8 PM - 10 PM)</option>
                  <option value="11:45 PM - 12:15 AM">🎂 Midnight 12 AM Slot</option>
                </select>
              </div>
            </div>

            {/* 3. Zomato-Style Direct Payment Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-[#3B2118] dark:text-[#FAF4EE] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#8B2F3C] dark:text-[#C9A227]" />
                  <span>3. Payment Options</span>
                </label>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-black flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> 100% Automatic & Instant
                </span>
              </div>

              {/* Group A: UPI Instant 1-Click Apps */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-black uppercase tracking-wider text-[#7A6A63] dark:text-[#B8A8A1] px-1">
                  UPI Apps (Instant • No screenshot needed)
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Google Pay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Google Pay')}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                      paymentMethod === 'Google Pay'
                        ? 'border-[#8B2F3C] bg-[#FFF8F0] dark:bg-[#33231D] text-[#2B1A15] dark:text-[#FAF4EE] ring-2 ring-[#8B2F3C]/40 shadow-xs'
                        : 'border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#2A1D18] text-[#7A6A63] dark:text-[#B8A8A1] hover:border-[#8B2F3C]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-white border border-[#E8DACD] flex items-center justify-center font-black text-xs text-[#4285F4] shadow-2xs">
                        G
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-[#2B1A15] dark:text-[#FAF4EE]">Google Pay</div>
                        <div className="text-[9px] text-emerald-600 font-bold">⚡ 1-Click Pay</div>
                      </div>
                    </div>
                    {paymentMethod === 'Google Pay' && (
                      <div className="w-4 h-4 rounded-full bg-[#8B2F3C] text-white flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>

                  {/* PhonePe */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PhonePe')}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                      paymentMethod === 'PhonePe'
                        ? 'border-[#5f259f] bg-[#f8f2fd] dark:bg-[#29173b] text-[#2B1A15] dark:text-[#FAF4EE] ring-2 ring-[#5f259f]/40 shadow-xs'
                        : 'border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#2A1D18] text-[#7A6A63] dark:text-[#B8A8A1] hover:border-[#5f259f]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-[#5f259f] text-white flex items-center justify-center font-black text-xs shadow-2xs">
                        पे
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-[#2B1A15] dark:text-[#FAF4EE]">PhonePe</div>
                        <div className="text-[9px] text-[#5f259f] dark:text-[#b88ee8] font-bold">⚡ Fastest</div>
                      </div>
                    </div>
                    {paymentMethod === 'PhonePe' && (
                      <div className="w-4 h-4 rounded-full bg-[#5f259f] text-white flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>

                  {/* Paytm */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Paytm')}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                      paymentMethod === 'Paytm'
                        ? 'border-[#002e6e] bg-[#f0f5fc] dark:bg-[#152336] text-[#2B1A15] dark:text-[#FAF4EE] ring-2 ring-[#002e6e]/40 shadow-xs'
                        : 'border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#2A1D18] text-[#7A6A63] dark:text-[#B8A8A1] hover:border-[#002e6e]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-[#00baf2] text-white flex items-center justify-center font-black text-[10px] shadow-2xs">
                        Pay
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-[#2B1A15] dark:text-[#FAF4EE]">Paytm UPI</div>
                        <div className="text-[9px] text-[#00baf2] font-bold">Instant</div>
                      </div>
                    </div>
                    {paymentMethod === 'Paytm' && (
                      <div className="w-4 h-4 rounded-full bg-[#002e6e] text-white flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>

                  {/* CRED Pay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CRED')}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                      paymentMethod === 'CRED'
                        ? 'border-black dark:border-white bg-neutral-100 dark:bg-neutral-800 text-[#2B1A15] dark:text-[#FAF4EE] ring-2 ring-black/40 dark:ring-white/40 shadow-xs'
                        : 'border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#2A1D18] text-[#7A6A63] dark:text-[#B8A8A1] hover:border-black'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs shadow-2xs">
                        C
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-[#2B1A15] dark:text-[#FAF4EE]">CRED UPI</div>
                        <div className="text-[9px] text-[#7A6A63] font-bold">Cashback</div>
                      </div>
                    </div>
                    {paymentMethod === 'CRED' && (
                      <div className="w-4 h-4 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Group B: Credit/Debit Cards & Net Banking */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-black uppercase tracking-wider text-[#7A6A63] dark:text-[#B8A8A1] px-1">
                  Cards & Net Banking
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Cards */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Credit/Debit Card')}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                      paymentMethod === 'Credit/Debit Card'
                        ? 'border-[#8B2F3C] bg-[#FFF8F0] dark:bg-[#33231D] text-[#2B1A15] dark:text-[#FAF4EE] ring-2 ring-[#8B2F3C]/40 shadow-xs'
                        : 'border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#2A1D18] text-[#7A6A63] dark:text-[#B8A8A1]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-5 h-5 text-[#8B2F3C] dark:text-[#C9A227]" />
                      <div>
                        <div className="font-extrabold text-xs text-[#2B1A15] dark:text-[#FAF4EE]">Debit / Credit</div>
                        <div className="text-[9px] text-[#7A6A63]">Visa, RuPay</div>
                      </div>
                    </div>
                    {paymentMethod === 'Credit/Debit Card' && (
                      <div className="w-4 h-4 rounded-full bg-[#8B2F3C] text-white flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>

                  {/* NetBanking */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Net Banking')}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                      paymentMethod === 'Net Banking'
                        ? 'border-[#8B2F3C] bg-[#FFF8F0] dark:bg-[#33231D] text-[#2B1A15] dark:text-[#FAF4EE] ring-2 ring-[#8B2F3C]/40 shadow-xs'
                        : 'border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#2A1D18] text-[#7A6A63] dark:text-[#B8A8A1]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-5 h-5 text-[#8B2F3C] dark:text-[#C9A227]" />
                      <div>
                        <div className="font-extrabold text-xs text-[#2B1A15] dark:text-[#FAF4EE]">NetBanking</div>
                        <div className="text-[9px] text-[#7A6A63]">HDFC, SBI, ICICI</div>
                      </div>
                    </div>
                    {paymentMethod === 'Net Banking' && (
                      <div className="w-4 h-4 rounded-full bg-[#8B2F3C] text-white flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Group C: Cash on Delivery */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-600/40 shadow-xs'
                      : 'border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#2A1D18] text-[#7A6A63] dark:text-[#B8A8A1]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-[#2B1A15] dark:text-[#FAF4EE]">
                          Cash on Delivery (COD)
                        </span>
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                          Pay at Doorstep
                        </span>
                      </div>
                      <p className="text-[10px] text-[#7A6A63] dark:text-[#B8A8A1] mt-0.5">
                        Pay cash or scan delivery rider's UPI QR upon arrival
                      </p>
                    </div>
                  </div>
                  {paymentMethod === 'Cash on Delivery' && (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Special delivery instructions */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-[#3B2118] dark:text-[#FAF4EE] block mb-1">
                Bakery & Delivery Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Ring doorbell twice, add 2 celebration candles..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#2A1D18] text-xs text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
              />
            </div>

            {/* Order Items Preview */}
            <div className="p-3.5 rounded-2xl bg-[#FFF8F0] dark:bg-[#33231D] border border-[#E8DACD] dark:border-[#46332B] space-y-1.5 text-xs">
              <div className="flex justify-between font-semibold text-[#7A6A63] dark:text-[#B8A8A1]">
                <span>Items Subtotal ({cart.length} items):</span>
                <span className="font-bold text-[#2B1A15] dark:text-[#FAF4EE]">₹{cartSubtotal}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-[#8B2F3C] dark:text-[#C9A227] font-bold">
                  <span>Coupon Savings:</span>
                  <span>-₹{cartDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#7A6A63] dark:text-[#B8A8A1]">
                <span>Delivery Charge:</span>
                <span>{cartDeliveryCharge === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${cartDeliveryCharge}`}</span>
              </div>
              <div className="flex justify-between text-[#7A6A63] dark:text-[#B8A8A1]">
                <span>GST (5%):</span>
                <span>₹{cartTax}</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#2B1A15] dark:text-[#FAF4EE] pt-1.5 border-t border-[#E8DACD] dark:border-[#46332B]">
                <span>Total Amount:</span>
                <span className="text-[#3B2118] dark:text-[#FAF4EE]">₹{cartTotal}</span>
              </div>
            </div>

            {/* Submit Button - Zomato Style Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-[#8B2F3C] hover:bg-[#742531] active:scale-98 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#C9A227]/30"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Confirming Order...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#C9A227]" />
                  <span>
                    {paymentMethod === 'Cash on Delivery'
                      ? `Place Cash on Delivery Order • ₹${cartTotal}`
                      : `Pay ₹${cartTotal} via ${paymentMethod}`}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Modern Instant Payment Gateway Modal */}
      {showPaymentGateway && (
        <ZomatoPaymentGateway
          isOpen={showPaymentGateway}
          amount={cartTotal}
          paymentMethod={paymentMethod}
          onClose={() => setShowPaymentGateway(false)}
          onSuccess={(payInfo) => handleCreateOrder(payInfo)}
        />
      )}
    </>
  );
};
