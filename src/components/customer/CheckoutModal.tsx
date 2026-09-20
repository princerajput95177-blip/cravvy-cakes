import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { RazorpayModal } from '../modals/RazorpayModal';
import { BankUpiPaymentModal } from './BankUpiPaymentModal';
import {
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  Banknote,
  Sparkles,
  ShieldCheck,
  X,
  Plus,
  Check,
  AlertCircle,
  QrCode,
  Building2,
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
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'Cash on Delivery' | 'Bank / UPI Transfer'>('Bank / UPI Transfer');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [showBankUpi, setShowBankUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Address modal toggle
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrHouse, setNewAddrHouse] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrArea, setNewAddrArea] = useState('');
  const [newAddrPincode, setNewAddrPincode] = useState('144003');

  const handleCreateOrder = async (paymentId?: string) => {
    try {
      setIsSubmitting(true);
      const newOrder = await placeOrder({
        deliveryDate,
        deliveryTimeSlot,
        paymentMethod,
        specialInstructions: specialInstructions.trim() || undefined,
        paymentId,
      });
      setIsSubmitting(false);
      setShowRazorpay(false);
      onOrderSuccess(newOrder.id);
    } catch (err: any) {
      setIsSubmitting(false);
      showToast(err.message || 'Error creating order');
    }
  };

  const handleBankUpiSubmit = async ({
    utrTransactionId,
    paymentScreenshot,
  }: {
    utrTransactionId: string;
    paymentScreenshot?: string;
  }) => {
    try {
      setIsSubmitting(true);
      const newOrder = await placeOrder({
        deliveryDate,
        deliveryTimeSlot,
        paymentMethod: 'Bank / UPI Transfer',
        specialInstructions: specialInstructions.trim() || undefined,
        utrTransactionId,
        paymentScreenshot,
        paymentStatus: 'Pending Verification',
      });
      setIsSubmitting(false);
      setShowBankUpi(false);
      showToast('Payment details submitted successfully. Verification pending.');
      onOrderSuccess(newOrder.id);
    } catch (err: any) {
      setIsSubmitting(false);
      showToast(err.message || 'Error creating order');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddress) {
      showToast('Please select or add a delivery address.');
      return;
    }

    if (paymentMethod === 'Razorpay') {
      setShowRazorpay(true);
    } else if (paymentMethod === 'Bank / UPI Transfer') {
      setShowBankUpi(true);
    } else {
      handleCreateOrder();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
        id="checkout-modal-overlay"
      >
        <div
          className="bg-white dark:bg-[#30221D] rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#E8DACD] dark:border-[#46332B] animate-scaleUp"
          id="checkout-modal"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E8DACD] dark:border-[#46332B] flex items-center justify-between bg-white dark:bg-[#30221D]">
            <div>
              <h2 className="text-lg font-black text-[#2B1A15] dark:text-[#FAF4EE]">
                Review & Finalize Order
              </h2>
              <p className="text-xs text-[#7A6A63] dark:text-[#B8A8A1]">
                Freshly handcrafted & dispatched from Cravvy Cakes
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#FFF8F0] dark:hover:bg-[#261B16] text-[#7A6A63] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form / Scroll Content */}
          <form onSubmit={handleCheckoutSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            {/* Delivery Address Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-[#3B2118] dark:text-[#FAF4EE] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8B2F3C] dark:text-[#C9A227]" />
                  <span>1. Delivery Address</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="text-xs font-bold text-[#8B2F3C] dark:text-[#C9A227] hover:underline flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                  <span>{showAddAddress ? 'Cancel' : 'New Address'}</span>
                </button>
              </div>

              {showAddAddress ? (
                <div className="p-3.5 rounded-2xl bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD] dark:border-[#46332B] space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder="House / Flat / Block No."
                    value={newAddrHouse}
                    onChange={(e) => setNewAddrHouse(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] text-[#2B1A15] dark:text-[#FAF4EE]"
                  />
                  <input
                    type="text"
                    placeholder="Street / Colony / Landmark"
                    value={newAddrStreet}
                    onChange={(e) => setNewAddrStreet(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] text-[#2B1A15] dark:text-[#FAF4EE]"
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
                              : 'bg-white dark:bg-[#30221D] text-[#7A6A63] dark:text-[#B8A8A1] border-[#E8DACD] dark:border-[#46332B]'
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
                      className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] text-[#2B1A15] dark:text-[#FAF4EE]"
                    />
                    <input
                      type="text"
                      placeholder="Pincode (e.g. 144003)"
                      value={newAddrPincode}
                      onChange={(e) => setNewAddrPincode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] text-[#2B1A15] dark:text-[#FAF4EE]"
                    />
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-[#3B2118]/40 border border-[#C9A227]/30 text-[11px] text-[#2B1A15] dark:text-[#FAF4EE] flex items-center justify-between font-bold">
                    <span>City: Jalandhar, Punjab</span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold">✓ Service Area</span>
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
                      showToast('Jalandhar address saved & selected!');
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#8B2F3C] hover:bg-[#742531] text-white font-bold text-xs shadow-xs"
                  >
                    Save & Use This Address
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
                          ? 'border-[#8B2F3C] bg-[#FFF8F0] dark:bg-[#261B16] text-[#2B1A15] dark:text-[#FAF4EE] shadow-xs ring-1 ring-[#8B2F3C]'
                          : 'border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] text-[#7A6A63] dark:text-[#B8A8A1]'
                      }`}
                    >
                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#2B1A15] dark:text-[#FAF4EE]">{addr.name}</span>
                          <span className="px-1.5 py-0.2 rounded bg-[#8B2F3C]/10 text-[#8B2F3C] dark:text-[#C9A227] text-[10px] font-bold">
                            {addr.type}
                          </span>
                        </div>
                        <p className="text-[#7A6A63] dark:text-[#B8A8A1] line-clamp-2">
                          {addr.houseFlat}, {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                        </p>
                        <p className="text-[#7A6A63]/80 text-[10px]">Phone: {addr.phone}</p>
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

            {/* Delivery Date & Time Slot */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-[#3B2118] dark:text-[#FAF4EE] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#8B2F3C] dark:text-[#C9A227]" />
                <span>2. Delivery Date & Time Slot</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <select
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] text-xs font-bold text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
                  >
                    <option value="Today">Today (Fast Delivery)</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Day After Tomorrow">Day After Tomorrow</option>
                    <option value="Weekend Special">Upcoming Weekend</option>
                  </select>
                </div>

                <div>
                  <select
                    value={deliveryTimeSlot}
                    onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] text-xs font-bold text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
                  >
                    <option value="Standard (within 45 mins)">⚡ Express (~45 mins)</option>
                    <option value="6:00 PM - 8:00 PM">🌆 Evening (6 PM - 8 PM)</option>
                    <option value="8:00 PM - 10:00 PM">🌙 Night (8 PM - 10 PM)</option>
                    <option value="11:45 PM - 12:15 AM">🎂 Midnight 12 AM Slot</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-[#3B2118] dark:text-[#FAF4EE] flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-[#8B2F3C] dark:text-[#C9A227]" />
                  <span>3. Select Payment Method</span>
                </span>
                <span className="text-[10px] text-[#8B2F3C] dark:text-[#C9A227] font-black">
                  3 Methods Available
                </span>
              </label>

              <div className="space-y-2">
                {/* 1. Bank / UPI Transfer */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Bank / UPI Transfer')}
                  className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                    paymentMethod === 'Bank / UPI Transfer'
                      ? 'border-[#8B2F3C] bg-[#FFF8F0] dark:bg-[#261B16] text-[#2B1A15] dark:text-[#FAF4EE] shadow-xs ring-1 ring-[#8B2F3C]'
                      : 'border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] text-[#7A6A63] dark:text-[#B8A8A1] hover:border-[#C9A227]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#8B2F3C]/10 text-[#8B2F3C] dark:text-[#C9A227] flex items-center justify-center flex-shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-[#2B1A15] dark:text-[#FAF4EE]">Pay via Bank / UPI</span>
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-[#C9A227] text-white uppercase tracking-wider">
                          QR & Direct IMPS
                        </span>
                      </div>
                      <p className="text-[10px] text-[#7A6A63] dark:text-[#B8A8A1] mt-0.5">
                        UPI QR Code (PhonePe, GPay, Paytm) or Kotak Bank Transfer
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {paymentMethod === 'Bank / UPI Transfer' && (
                      <div className="w-5 h-5 rounded-full bg-[#8B2F3C] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                </button>

                {/* 2. Razorpay Online */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Razorpay')}
                  className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                    paymentMethod === 'Razorpay'
                      ? 'border-[#8B2F3C] bg-[#FFF8F0] dark:bg-[#261B16] text-[#2B1A15] dark:text-[#FAF4EE] shadow-xs ring-1 ring-[#8B2F3C]'
                      : 'border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] text-[#7A6A63] dark:text-[#B8A8A1] hover:border-[#C9A227]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#8B2F3C]/10 text-[#8B2F3C] dark:text-[#C9A227] flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-[#2B1A15] dark:text-[#FAF4EE]">Razorpay / Online Payment</span>
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#8B2F3C]/10 text-[#8B2F3C] dark:text-[#C9A227]">
                          Instant
                        </span>
                      </div>
                      <p className="text-[10px] text-[#7A6A63] dark:text-[#B8A8A1] mt-0.5">
                        Debit/Credit Cards, NetBanking, Wallets
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {paymentMethod === 'Razorpay' && (
                      <div className="w-5 h-5 rounded-full bg-[#8B2F3C] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                </button>

                {/* 3. Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-[#8B2F3C] bg-[#FFF8F0] dark:bg-[#261B16] text-[#2B1A15] dark:text-[#FAF4EE] shadow-xs ring-1 ring-[#8B2F3C]'
                      : 'border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] text-[#7A6A63] dark:text-[#B8A8A1] hover:border-[#C9A227]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs block text-[#2B1A15] dark:text-[#FAF4EE]">Cash on Delivery (COD)</span>
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-600/30">
                          Zero Advance
                        </span>
                      </div>
                      <p className="text-[10px] text-[#7A6A63] dark:text-[#B8A8A1] mt-0.5">
                        Pay in cash or scan delivery rider's UPI QR upon doorstep arrival
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {paymentMethod === 'Cash on Delivery' && (
                      <div className="w-5 h-5 rounded-full bg-[#8B2F3C] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                </button>
              </div>

              {/* Cash on Delivery Details Card */}
              {paymentMethod === 'Cash on Delivery' && (
                <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold">
                      <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Doorstep Payment Guarantee</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white dark:bg-[#30221D] text-emerald-900 dark:text-emerald-200 border border-emerald-200">
                      Pay on Delivery: ₹{cartTotal}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-emerald-950 dark:text-emerald-300">
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>No advance payment or card required</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Cash or Rider UPI QR accepted</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Inspect packaging before handover</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Free delivery tracking in real-time</span>
                    </div>
                  </div>
                </div>
              )}
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
                className="w-full px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] text-xs text-[#2B1A15] dark:text-[#FAF4EE] focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
              />
            </div>

            {/* Order Items Preview */}
            <div className="p-3.5 rounded-2xl bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD] dark:border-[#46332B] space-y-1.5 text-xs">
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
              <div className="flex justify-between text-sm font-black text-[#2B1A15] dark:text-[#FAF4EE] pt-1.5 border-t border-[#E8DACD] dark:border-[#46332B]">
                <span>Total Amount:</span>
                <span className="text-[#3B2118] dark:text-[#FAF4EE]">₹{cartTotal}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-[#8B2F3C] hover:bg-[#742531] active:scale-98 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#C9A227]/30"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#C9A227]" />
                  <span>
                    {paymentMethod === 'Bank / UPI Transfer'
                      ? `Proceed to Bank / UPI Payment (₹${cartTotal})`
                      : paymentMethod === 'Razorpay'
                      ? `Proceed to Razorpay (₹${cartTotal})`
                      : `Place Cash on Delivery Order • ₹${cartTotal}`}
                  </span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Razorpay Gateway Modal if Online Payment */}
      {showRazorpay && (
        <RazorpayModal
          amount={cartTotal}
          orderNumber={`KB-ORD-${Math.floor(1000 + Math.random() * 9000)}`}
          customerName={user.name}
          customerPhone={user.phone}
          onSuccess={(payId) => handleCreateOrder(payId)}
          onCancel={() => setShowRazorpay(false)}
        />
      )}

      {/* Bank / UPI Transfer Modal */}
      {showBankUpi && (
        <BankUpiPaymentModal
          amount={cartTotal}
          customerName={user.name}
          orderNumber={`CC-${Math.floor(1000 + Math.random() * 9000)}`}
          isOpen={showBankUpi}
          onClose={() => setShowBankUpi(false)}
          onSubmitPayment={handleBankUpiSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};
