import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Order } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Eye,
  X,
  Phone,
  QrCode,
  Building2,
  FileText,
  AlertTriangle,
  ZoomIn,
} from 'lucide-react';

export const PaymentVerificationView: React.FC = () => {
  const { orders, verifyPayment, rejectPayment, showToast } = useBakery();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  // Zoomed screenshot modal
  const [zoomedImage, setZoomedImage] = useState<{
    url: string;
    orderNumber: string;
    utr?: string;
    customerName: string;
    amount: number;
  } | null>(null);

  // Rejection modal
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // All Bank/UPI orders
  const bankOrders = orders.filter((o) => o.paymentMethod === 'Bank / UPI Transfer');

  // Counts
  const pendingOrders = bankOrders.filter(
    (o) => o.paymentStatus === 'Pending Verification' || o.paymentStatus === 'Payment Verification Pending'
  );
  const verifiedOrders = bankOrders.filter((o) => o.paymentStatus === 'Verified');
  const rejectedOrders = bankOrders.filter((o) => o.paymentStatus === 'Rejected');

  const pendingAmount = pendingOrders.reduce((sum, o) => sum + o.finalTotal, 0);
  const verifiedAmount = verifiedOrders.reduce((sum, o) => sum + o.finalTotal, 0);

  // Filtered list
  const filteredOrders = bankOrders.filter((ord) => {
    // Status filter
    if (statusFilter === 'pending') {
      if (ord.paymentStatus !== 'Pending Verification' && ord.paymentStatus !== 'Payment Verification Pending') {
        return false;
      }
    } else if (statusFilter === 'verified') {
      if (ord.paymentStatus !== 'Verified') return false;
    } else if (statusFilter === 'rejected') {
      if (ord.paymentStatus !== 'Rejected') return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchOrder = ord.orderNumber.toLowerCase().includes(q);
      const matchCustomer = ord.customerName.toLowerCase().includes(q);
      const matchPhone = ord.customerPhone.toLowerCase().includes(q);
      const matchUtr = ord.utrTransactionId ? ord.utrTransactionId.toLowerCase().includes(q) : false;
      if (!matchOrder && !matchCustomer && !matchPhone && !matchUtr) {
        return false;
      }
    }

    return true;
  });

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    showToast(`UTR ${utr} copied to clipboard!`);
    setTimeout(() => setCopiedUtr(null), 2500);
  };

  const handleConfirmRejection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingOrder) return;
    rejectPayment(rejectingOrder.id, rejectionReason.trim() || undefined);
    setRejectingOrder(null);
    setRejectionReason('');
  };

  const quickRejectionReasons = [
    'UTR / Reference number not found in Kotak bank account statement',
    'Payment screenshot is blurry or unreadable',
    'Transferred amount does not match order total',
    'Duplicate UTR submission detected',
  ];

  return (
    <div className="space-y-6" id="payment-verification-panel">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-rose-300" />
              <span>PAYMENT VERIFICATION</span>
            </h1>
            {pendingOrders.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#8B2F3C]/20 border border-[#8B2F3C]/40 text-rose-300 animate-pulse">
                {pendingOrders.length} Pending
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Manual verification desk for Bank Transfers & UPI QR Scanner orders. Verify UTR against bank records before dispatch.
          </p>
        </div>

        {/* Quick Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search UTR / Order # / Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#8B2F3C] w-64"
            />
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700 shadow space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-rose-300" />
          </div>
          <div className="text-2xl font-black text-rose-300">
            {pendingOrders.length}
          </div>
          <p className="text-[11px] text-neutral-400">
            Totaling ₹{pendingAmount.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700 shadow space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold">
            <span>Verified & Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {verifiedOrders.length}
          </div>
          <p className="text-[11px] text-neutral-400">
            Totaling ₹{verifiedAmount.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700 shadow space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold">
            <span>Rejected / Issues</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">
            {rejectedOrders.length}
          </div>
          <p className="text-[11px] text-neutral-400">
            Awaiting customer re-upload
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700 shadow space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold">
            <span>Kotak Pro Account</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-sm font-black text-white font-mono">
            4311966246
          </div>
          <p className="text-[10px] text-neutral-400">
            IFSC: KKBK0004019 • UPI: q490463229@ybl
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-800/80 border border-neutral-700">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#8B2F3C] text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Bank / UPI ({bankOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-[#8B2F3C] text-white shadow-xs'
                : 'text-rose-300 hover:text-white'
            }`}
          >
            <span>Pending Verification</span>
            {pendingOrders.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#8B2F3C] text-white font-black">
                {pendingOrders.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('verified')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'verified'
                ? 'bg-[#8B2F3C] text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Verified ({verifiedOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'rejected'
                ? 'bg-[#8B2F3C] text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Rejected ({rejectedOrders.length})
          </button>
        </div>

        <span className="text-xs text-neutral-400 font-medium">
          Showing {filteredOrders.length} verification {filteredOrders.length === 1 ? 'record' : 'records'}
        </span>
      </div>

      {/* Orders Verification Cards */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-neutral-800/40 border border-neutral-700/60 space-y-3">
          <ShieldCheck className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Payment Records Found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {searchQuery
              ? `No transactions match your search query "${searchQuery}".`
              : 'There are currently no Bank / UPI transfer orders in this category.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const isPending =
              ord.paymentStatus === 'Pending Verification' || ord.paymentStatus === 'Payment Verification Pending';
            const isVerified = ord.paymentStatus === 'Verified';
            const isRejected = ord.paymentStatus === 'Rejected';

            return (
              <div
                key={ord.id}
                className={`p-5 rounded-3xl border transition shadow-lg ${
                  isPending
                    ? 'bg-neutral-800/90 border-[#8B2F3C]/60 shadow-rose-950/20'
                    : isVerified
                    ? 'bg-neutral-800/70 border-emerald-500/40'
                    : 'bg-neutral-800/70 border-rose-500/40'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Left Column: Order & Customer Info (4 cols) */}
                  <div className="lg:col-span-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-white">{ord.orderNumber}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isVerified
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isRejected
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-[#8B2F3C]/20 text-rose-300 border border-[#8B2F3C]/30 animate-pulse'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#1F1410] border border-[#3E251B] space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block">Customer</span>
                        <span className="font-bold text-white text-sm">{ord.customerName}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-neutral-800">
                        <a
                          href={`tel:${ord.customerPhone}`}
                          className="flex items-center gap-1 text-neutral-300 hover:text-white font-mono"
                        >
                          <Phone className="w-3.5 h-3.5 text-rose-300" />
                          <span>{ord.customerPhone}</span>
                        </a>
                        <a
                          href={`https://wa.me/${ord.customerPhone.replace(/\D/g, '')}?text=Hello ${ord.customerName}, regarding your CRAVVY Cakes payment for order ${ord.orderNumber}...`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>

                      <div className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-800">
                        <span>Items: </span>
                        <span className="text-neutral-200">
                          {ord.items.map((it) => `${it.quantity}x ${it.product.name}`).join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="text-neutral-400">Order Placed:</span>
                      <span className="text-neutral-300 font-medium">{ord.orderDate}</span>
                    </div>
                  </div>

                  {/* Middle Column: Payment Details & UTR (5 cols) */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="p-4 rounded-2xl bg-[#1F1410] border border-[#3E251B] space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#362118]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#8B2F3C]/20 text-rose-300 flex items-center justify-center">
                            <QrCode className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-xs text-white block">Payment Details</span>
                            <span className="text-[10px] text-neutral-400">
                              Selected: Bank / UPI Transfer
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-[#C4ABA1] block">Payable Amount</span>
                          <span className="text-lg font-black text-[#FAF4EE]">₹{ord.finalTotal}</span>
                        </div>
                      </div>

                      {/* Transaction ID / UTR */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                          Entered Transaction ID / 12-Digit UTR
                        </span>
                        <div className="flex items-center justify-between bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                          <span className="font-mono text-sm font-black text-white select-all tracking-wider">
                            {ord.utrTransactionId || 'No UTR ID Entered'}
                          </span>
                          {ord.utrTransactionId && (
                            <button
                              type="button"
                              onClick={() => handleCopyUtr(ord.utrTransactionId!)}
                              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                            >
                              {copiedUtr === ord.utrTransactionId ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400 text-[11px]">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span className="text-[11px]">Copy</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Payment Date / Time */}
                      <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                        <span>Customer Payment Time:</span>
                        <span className="text-neutral-200 font-mono font-medium">
                          {ord.paymentDate || ord.orderDate}
                        </span>
                      </div>

                      {/* Rejection reason if any */}
                      {ord.paymentRejectionReason && (
                        <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs">
                          <strong className="block text-rose-400 text-[10px] uppercase">Rejection Reason:</strong>
                          <span>{ord.paymentRejectionReason}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Screenshot & Actions (3 cols) */}
                  <div className="lg:col-span-3 space-y-3">
                    {/* Screenshot Preview */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                        Payment Proof Screenshot
                      </span>

                      {ord.paymentScreenshot ? (
                        <div
                          onClick={() =>
                            setZoomedImage({
                              url: ord.paymentScreenshot!,
                              orderNumber: ord.orderNumber,
                              utr: ord.utrTransactionId,
                              customerName: ord.customerName,
                              amount: ord.finalTotal,
                            })
                          }
                          className="group relative rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-950 cursor-pointer aspect-video flex items-center justify-center hover:border-[#8B2F3C] transition"
                        >
                          <img
                            src={ord.paymentScreenshot}
                            alt={`Receipt ${ord.orderNumber}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 text-white text-xs font-bold transition">
                            <ZoomIn className="w-4 h-4" />
                            <span>Click to Enlarge</span>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-neutral-700 p-4 text-center text-neutral-500 text-xs">
                          No screenshot attached
                        </div>
                      )}
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="space-y-2 pt-1">
                      {isPending ? (
                        <>
                          <button
                            type="button"
                            onClick={() => verifyPayment(ord.id)}
                            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Verify & Confirm Payment</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setRejectingOrder(ord);
                              setRejectionReason('');
                            }}
                            className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-rose-950/60 border border-neutral-700 hover:border-rose-600 text-neutral-300 hover:text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                            <span>Reject Payment</span>
                          </button>
                        </>
                      ) : isVerified ? (
                        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-center text-xs space-y-1">
                          <div className="flex items-center justify-center gap-1 font-bold">
                            <Check className="w-4 h-4" />
                            <span>Payment Verified</span>
                          </div>
                          <p className="text-[10px] text-emerald-400/80">
                            Order is Confirmed & in Kitchen Queue
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-center text-xs">
                            <span className="font-bold block">Payment Rejected</span>
                            <span className="text-[10px] text-rose-400/80">Waiting for customer re-submission</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => verifyPayment(ord.id)}
                            className="w-full py-1.5 rounded-xl bg-neutral-800 hover:bg-emerald-800 text-neutral-300 hover:text-white font-semibold text-xs transition cursor-pointer"
                          >
                            Re-Verify Payment
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rejection Reason Dialog Modal */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form
            onSubmit={handleConfirmRejection}
            className="bg-[#241712] border border-[#3E251B] p-5 rounded-3xl max-w-md w-full space-y-4 shadow-2xl text-[#FAF4EE]"
          >
            <div className="flex items-center justify-between border-b border-[#362118] pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="font-extrabold text-sm text-white">
                  Reject Payment for {rejectingOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-neutral-400">
                The customer will be notified with this reason and prompted to re-submit valid payment proof or contact support.
              </p>

              {/* Preset quick reasons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-400">Quick Select Reason:</span>
                <div className="space-y-1">
                  {quickRejectionReasons.map((reason, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRejectionReason(reason)}
                      className={`w-full text-left p-2 rounded-xl border text-[11px] transition cursor-pointer ${
                        rejectionReason === reason
                          ? 'border-[#8B2F3C] bg-[#8B2F3C]/20 text-rose-200'
                          : 'border-neutral-800 bg-neutral-800/60 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  Custom Note / Reason to Customer:
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. UTR not reflected in Kotak bank statement. Please check the transaction ID and re-upload screenshot..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </form>
        </div>
      )}

      {/* High-Res Screenshot Zoom Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-[#241712] border border-[#3E251B] rounded-3xl max-w-lg w-full p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#362118] pb-2">
              <div>
                <h4 className="font-extrabold text-sm text-white">
                  Payment Proof • {zoomedImage.orderNumber} (₹{zoomedImage.amount})
                </h4>
                <p className="text-[11px] text-neutral-400 font-mono">
                  UTR: {zoomedImage.utr || 'N/A'} • Customer: {zoomedImage.customerName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setZoomedImage(null)}
                className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 max-h-[70vh] flex items-center justify-center">
              <img
                src={zoomedImage.url}
                alt="Enlarged Payment Proof"
                className="w-full h-auto object-contain max-h-[70vh]"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
              <span>Inspect transaction ID and amount carefully.</span>
              <a
                href={zoomedImage.url}
                target="_blank"
                rel="noreferrer"
                className="text-rose-200 hover:underline flex items-center gap-1 font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in New Tab</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
