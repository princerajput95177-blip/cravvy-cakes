import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { OrderStatus } from '../../types';
import {
  getBakeryWhatsAppUrl,
  BAKERY_WHATSAPP_NUMBER,
  BAKERY_MAPS_URL,
  BAKERY_ADDRESS_TEXT,
} from '../../utils/whatsapp';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ChefHat,
  Truck,
  Package,
  Calendar,
  Sparkles,
  ArrowLeft,
  MessageCircle,
  FileText,
  ShieldCheck,
  AlertCircle,
  QrCode,
  UploadCloud,
  Check,
  X,
  ExternalLink,
  Banknote,
} from 'lucide-react';

interface OrderTrackingViewProps {
  orderId?: string;
  onBack?: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orderId,
  onBack,
}) => {
  const { orders, activeTrackingOrderId, updateOrderStatus, setCustomerTab, resubmitPaymentDetails } = useBakery();

  const targetId = orderId || activeTrackingOrderId;
  const order = orders.find((o) => o.id === targetId) || orders[0];

  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [newUtr, setNewUtr] = useState('');
  const [newScreenshot, setNewScreenshot] = useState<string | null>(null);
  const [showScreenshotZoom, setShowScreenshotZoom] = useState(false);

  if (!order) {
    return (
      <div className="p-8 text-center my-auto py-16 space-y-4">
        <Package className="w-12 h-12 text-neutral-400 mx-auto" />
        <h3 className="text-base font-bold text-neutral-800 dark:text-white">
          No Active Order Found
        </h3>
        <p className="text-xs text-neutral-500">
          Place an order from our bakery menu to view live baking & delivery timeline.
        </p>
        <button
          onClick={() => setCustomerTab('home')}
          className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold"
        >
          Go to Menu
        </button>
      </div>
    );
  }

  const handleResubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUtr.trim()) return;
    resubmitPaymentDetails(order.id, newUtr.trim(), newScreenshot || undefined);
    setShowResubmitModal(false);
    setNewUtr('');
    setNewScreenshot(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewScreenshot(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const steps: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
    {
      key: 'Placed',
      label: 'Order Placed',
      desc: 'Received at Cravvy Cakes register',
      icon: Package,
    },
    {
      key: 'Confirmed',
      label: 'Order Confirmed',
      desc: 'Accepted by kitchen staff',
      icon: CheckCircle2,
    },
    {
      key: 'Preparing',
      label: 'Baking & Piping',
      desc: 'Chef crafting fresh sponge & ganache',
      icon: ChefHat,
    },
    {
      key: 'Out for Delivery',
      label: 'Out for Delivery',
      desc: 'Direct dispatch in temperature-safe box',
      icon: Truck,
    },
    {
      key: 'Delivered',
      label: 'Delivered with Joy',
      desc: 'Enjoy your fresh bakery delight!',
      icon: Sparkles,
    },
  ];

  const statusOrder: OrderStatus[] = [
    'Placed',
    'Confirmed',
    'Preparing',
    'Out for Delivery',
    'Delivered',
  ];

  const currentStepIndex = statusOrder.indexOf(order.status);

  // Advance simulation for demo
  const handleAdvanceStatus = () => {
    if (currentStepIndex < statusOrder.length - 1) {
      const nextStatus = statusOrder[currentStepIndex + 1];
      updateOrderStatus(order.id, nextStatus);
    }
  };

  return (
    <div className="p-4 sm:p-5 space-y-5 pb-24 max-w-xl mx-auto" id="order-tracking-view">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8DACD] dark:border-[#46332B]">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-[#FFF8F0] dark:hover:bg-[#261B16] text-[#7A6A63] dark:text-[#FAF4EE] transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-lg font-black text-[#2B1A15] dark:text-[#FAF4EE] font-serif">
              Live Order Tracker
            </h1>
            <p className="text-xs text-[#7A6A63]">
              Order ID: <strong className="text-[#8B2F3C] dark:text-[#C9A227]">{order.orderNumber}</strong>
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
            order.status === 'Delivered'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-[#8B2F3C]/10 text-[#8B2F3C] dark:bg-[#8B2F3C]/30 dark:text-[#C9A227] border border-[#C9A227]/30 animate-pulse'
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* WhatsApp Kitchen Dispatch Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <MessageCircle className="w-4 h-4 fill-white/20" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-emerald-950 dark:text-emerald-200">
                Sent to Bakery WhatsApp (+91 {BAKERY_WHATSAPP_NUMBER})
              </span>
              <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.2 rounded">
                Live
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
              Kitchen desk notified with order summary and customer contact.
            </p>
          </div>
        </div>

        <a
          href={getBakeryWhatsAppUrl(order, BAKERY_WHATSAPP_NUMBER)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 flex-shrink-0 shadow-xs transition"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Chat / Resend</span>
        </a>
      </div>

      {/* Hero ETA Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#2B1A15] via-[#3B2118] to-[#8B2F3C] text-white shadow-xl flex items-center justify-between relative overflow-hidden border border-[#C9A227]/30">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-1.5 text-xs text-[#C9A227] font-bold">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>
              {order.status === 'Delivered'
                ? 'Order Completed'
                : 'Estimated Arrival: ~25-35 mins'}
            </span>
          </div>
          <h2 className="text-xl font-black font-serif">
            {order.status === 'Preparing'
              ? 'Chef is Piping Ganache'
              : order.status === 'Out for Delivery'
              ? 'Bakery Courier on Route'
              : order.status === 'Delivered'
              ? 'Delivered with Sweetness'
              : 'Kitchen Preparing Ingredients'}
          </h2>
          <p className="text-xs text-[#FAF4EE]/80">
            Slot: {order.deliveryDate} • {order.deliveryTimeSlot}
          </p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] backdrop-blur-xs">
          <ChefHat className="w-9 h-9" />
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] space-y-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A6A63] dark:text-[#B8A8A1]">
          Kitchen & Delivery Progress
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8DACD] dark:before:bg-[#46332B]">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const Icon = step.icon;

            return (
              <div key={step.key} className="relative flex items-start gap-3">
                {/* Step Circle Indicator */}
                <div
                  className={`absolute -left-6 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
                    isCompleted
                      ? 'bg-[#8B2F3C] border-[#8B2F3C] text-white shadow-xs'
                      : 'bg-white dark:bg-[#261B16] border-[#E8DACD] dark:border-[#46332B] text-[#7A6A63]'
                  } ${isCurrent ? 'ring-4 ring-[#C9A227]/30 animate-pulse' : ''}`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-[#7A6A63]"></div>}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-xs font-bold ${
                        isCurrent
                          ? 'text-[#8B2F3C] dark:text-[#C9A227] text-sm'
                          : isCompleted
                          ? 'text-[#2B1A15] dark:text-[#FAF4EE]'
                          : 'text-[#7A6A63] dark:text-[#7A6A63]'
                      }`}
                    >
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] bg-[#8B2F3C]/10 text-[#8B2F3C] dark:text-[#C9A227] font-extrabold px-1.5 py-0.5 rounded border border-[#C9A227]/30">
                        Active Stage
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#7A6A63] dark:text-[#B8A8A1] mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo Status Step Simulator Trigger */}
        {order.status !== 'Delivered' && (
          <div className="pt-2 border-t border-[#E8DACD] dark:border-[#46332B]">
            <button
              onClick={handleAdvanceStatus}
              className="w-full py-2 rounded-xl bg-[#FFF8F0] dark:bg-[#261B16] hover:bg-[#FDF2E4] border border-[#E8DACD] dark:border-[#46332B] text-[#8B2F3C] dark:text-[#C9A227] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Simulate Next Stage ({statusOrder[currentStepIndex + 1] || 'Done'})</span>
            </button>
          </div>
        )}
      </div>

      {/* Bakery Support & Contact Card */}
      <div className="p-3.5 rounded-2xl bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD] dark:border-[#46332B] space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B2F3C] text-[#C9A227] flex items-center justify-center shadow-xs">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2B1A15] dark:text-[#FAF4EE]">
                Cravvy / Kuku Bakery Kitchen Desk
              </h4>
              <p className="text-[10px] text-[#7A6A63] dark:text-[#B8A8A1]">
                {BAKERY_ADDRESS_TEXT}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={`https://wa.me/91${BAKERY_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello, I have an inquiry about my order ${order.orderNumber}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 text-[11px] font-bold shadow-xs transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:+91${BAKERY_WHATSAPP_NUMBER}`}
              className="p-2 rounded-xl bg-[#8B2F3C] hover:bg-[#742531] text-white flex items-center gap-1 text-[11px] font-bold shadow-xs border border-[#C9A227]/40 transition"
            >
              <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Call</span>
            </a>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E8DACD]/60 dark:border-[#46332B]/60 flex items-center justify-between text-[11px]">
          <span className="text-[#7A6A63] dark:text-[#B8A8A1]">📍 Bakery Shop in Jalandhar:</span>
          <a
            href={BAKERY_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B2F3C] dark:text-[#C9A227] font-bold hover:underline flex items-center gap-1"
          >
            <span>Open on Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Instant Online Payment Card (Google Pay, PhonePe, Paytm, CRED, Cards, NetBanking) */}
      {order.paymentMethod !== 'Bank / UPI Transfer' && order.paymentMethod !== 'Cash on Delivery' && (
        <div className="p-4 rounded-3xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 text-xs space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-sm block text-emerald-950 dark:text-emerald-100">
                  Payment Verified & Completed
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 block font-semibold">
                  Paid via {order.paymentMethod} • Auto-Verified by Gateway
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
              Paid ✓
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 dark:bg-neutral-900/80 border border-emerald-200/70 dark:border-emerald-800/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-600 dark:text-neutral-400">Total Paid:</span>
              <span className="font-black text-emerald-700 dark:text-emerald-400 text-sm">₹{order.finalTotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-600 dark:text-neutral-400">Transaction ID:</span>
              <span className="font-mono font-bold text-neutral-900 dark:text-white select-all text-[11px]">
                {order.paymentId || `TXN_${order.orderNumber}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-600 dark:text-neutral-400">Delivery Status:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-[11px]">
                ⚡ Kitchen Baking in Progress
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bank / UPI Payment Verification Card */}
      {order.paymentMethod === 'Bank / UPI Transfer' && (
        <div
          className={`p-4 rounded-3xl border text-xs space-y-3 transition ${
            order.paymentStatus === 'Verified'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : order.paymentStatus === 'Rejected'
              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              : 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {order.paymentStatus === 'Verified' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : order.paymentStatus === 'Rejected' ? (
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              ) : (
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-spin" />
              )}
              <div>
                <span className="font-black text-sm block">
                  {order.paymentStatus === 'Verified'
                    ? 'Payment Verified by Bakery'
                    : order.paymentStatus === 'Rejected'
                    ? 'Payment Verification Issue'
                    : 'Payment Verification Pending'}
                </span>
                <span className="text-[10px] opacity-80 block">
                  Method: Bank / UPI Transfer • {order.paymentDate || 'Today'}
                </span>
              </div>
            </div>

            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                order.paymentStatus === 'Verified'
                  ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                  : order.paymentStatus === 'Rejected'
                  ? 'bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200'
                  : 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200'
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 dark:bg-neutral-900/80 border border-current/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-600 dark:text-neutral-400">Transaction / UTR ID:</span>
              <span className="font-mono font-black text-neutral-900 dark:text-white select-all">
                {order.utrTransactionId || 'Not Provided'}
              </span>
            </div>

            {order.paymentScreenshot && (
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <span className="font-bold text-neutral-600 dark:text-neutral-400">Payment Screenshot:</span>
                <button
                  type="button"
                  onClick={() => setShowScreenshotZoom(true)}
                  className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  <img
                    src={order.paymentScreenshot}
                    alt="Receipt Thumbnail"
                    className="w-7 h-7 rounded-lg object-cover border border-amber-300"
                  />
                  <span>View Proof</span>
                </button>
              </div>
            )}

            {order.paymentRejectionReason && (
              <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 text-xs font-semibold">
                Reason: {order.paymentRejectionReason}
              </div>
            )}
          </div>

          {order.paymentStatus === 'Rejected' && (
            <button
              type="button"
              onClick={() => setShowResubmitModal(true)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow transition cursor-pointer"
            >
              Resubmit Valid Payment Proof (UTR & Screenshot)
            </button>
          )}

          {order.paymentStatus === 'Pending Verification' && (
            <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
              Your payment will be verified by CRAVVY Cakes before the order is dispatched. You can track status here in real time.
            </p>
          )}
        </div>
      )}

      {/* Cash on Delivery (COD) Payment Card */}
      {order.paymentMethod === 'Cash on Delivery' && (
        <div
          className={`p-4 rounded-3xl border text-xs space-y-3 transition ${
            order.paymentStatus === 'Paid'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-sm block">
                  {order.paymentStatus === 'Paid' ? 'Cash Payment Received ✓' : 'Cash on Delivery (COD)'}
                </span>
                <span className="text-[10px] opacity-80 block">
                  {order.paymentStatus === 'Paid'
                    ? `Settled upon delivery on ${order.deliveryDate || 'Today'}`
                    : 'To be collected upon doorstep delivery'}
                </span>
              </div>
            </div>

            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                order.paymentStatus === 'Paid'
                  ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 animate-pulse'
              }`}
            >
              {order.paymentStatus === 'Paid' ? 'Paid' : 'Collect on Delivery'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-700/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-900 dark:text-white">
              <span>Amount Payable on Handover:</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                ₹{order.finalTotal}
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
              {order.paymentStatus === 'Paid'
                ? 'Thank you! The payment has been received and your receipt has been updated.'
                : 'You can pay the delivery partner with exact cash or scan their UPI QR code (Google Pay, PhonePe, Paytm, BHIM) on the spot.'}
            </p>
          </div>
        </div>
      )}

      {/* Delivery Address Brief */}
      <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-neutral-500 font-bold uppercase text-[10px]">
          <MapPin className="w-3.5 h-3.5 text-amber-600" />
          <span>Delivery Address</span>
        </div>
        <p className="font-bold text-neutral-900 dark:text-white">
          {order.deliveryAddress.name} ({order.deliveryAddress.phone})
        </p>
        <p className="text-neutral-600 dark:text-neutral-300">
          {order.deliveryAddress.houseFlat}, {order.deliveryAddress.street}, {order.deliveryAddress.area}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
        </p>
      </div>

      {/* Ordered Items Summary */}
      <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3 text-xs">
        <div className="flex items-center justify-between font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-700 pb-2">
          <span>Items Ordered ({order.items.length})</span>
          <span className="text-amber-900 dark:text-amber-300">₹{order.finalTotal} ({order.paymentMethod})</span>
        </div>

        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {item.quantity}x {item.product.name}
                </span>
                {item.selectedSize && (
                  <span className="text-[10px] text-neutral-400 block">
                    {item.selectedSize} {item.selectedFlavour ? `• ${item.selectedFlavour}` : ''}
                  </span>
                )}
                {item.cakeMessage && (
                  <span className="text-[10px] text-amber-600 block italic">
                    "{item.cakeMessage}"
                  </span>
                )}
              </div>
              <span className="font-bold text-neutral-900 dark:text-white">₹{item.totalPrice}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Screenshot Zoom Modal */}
      {showScreenshotZoom && order.paymentScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-3xl max-w-sm w-full space-y-3 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs">Payment Proof (UTR: {order.utrTransactionId || 'N/A'})</span>
              <button
                type="button"
                onClick={() => setShowScreenshotZoom(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 max-h-80">
              <img
                src={order.paymentScreenshot}
                alt="Full Payment Screenshot"
                className="w-full h-auto object-contain max-h-80"
              />
            </div>
            <p className="text-[10px] text-neutral-500 text-center">
              Uploaded on {order.paymentDate || 'Order Date'}
            </p>
          </div>
        </div>
      )}

      {/* Resubmit Payment Modal */}
      {showResubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form
            onSubmit={handleResubmit}
            className="bg-white dark:bg-neutral-900 p-5 rounded-3xl max-w-md w-full space-y-4 shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-neutral-900 dark:text-white">
                  Resubmit Payment Details
                </h3>
                <p className="text-[10px] text-neutral-500">
                  Order {order.orderNumber} • ₹{order.finalTotal}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowResubmitModal(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  12-Digit UTR / UPI Ref ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 424883109241"
                  value={newUtr}
                  onChange={(e) => setNewUtr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Upload New Payment Screenshot (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-neutral-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200"
                />
              </div>

              {newScreenshot && (
                <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 text-emerald-800 text-[10px]">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>New receipt screenshot loaded</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResubmitModal(false)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newUtr.trim()}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-extrabold shadow"
              >
                Submit for Verification
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
