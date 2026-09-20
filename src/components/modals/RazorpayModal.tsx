import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Smartphone, Building, Sparkles, CheckCircle2, Lock, X } from 'lucide-react';

interface RazorpayModalProps {
  amount: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  amount,
  orderNumber,
  customerName,
  customerPhone,
  onSuccess,
  onCancel,
}) => {
  const [paymentTab, setPaymentTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'custom'>('gpay');
  const [customVpa, setCustomVpa] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const generatedPaymentId = `pay_rzp_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;
      setTimeout(() => {
        onSuccess(generatedPaymentId);
      }, 1000);
    }, 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
      id="razorpay-modal-overlay"
    >
      <div
        className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-scaleUp"
        id="razorpay-modal"
      >
        {/* Razorpay Brand Header */}
        <div className="bg-[#0C2340] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-wide">Razorpay</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-blue-500/30 text-blue-200 rounded font-medium">
                  Verified Merchant
                </span>
              </div>
              <p className="text-[10px] text-blue-200">Cravvy Cakes Handcrafted Foods</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-blue-200 uppercase tracking-wider">Amount Payable</div>
            <div className="text-base font-extrabold text-white">₹{amount}</div>
          </div>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Payment Successful!
            </h3>
            <p className="text-xs text-neutral-500">
              Authenticated via 128-bit Banking Gateway. Redirecting back to Cravvy Cakes...
            </p>
          </div>
        ) : (
          <div className="p-4 sm:p-5 space-y-4">
            {/* Order Brief */}
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              <span>Order: <strong>{orderNumber}</strong></span>
              <span>Customer: <strong>{customerName}</strong></span>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setPaymentTab('upi')}
                className={`py-2 text-xs font-bold rounded-xl transition flex flex-col items-center gap-1 ${
                  paymentTab === 'upi'
                    ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('card')}
                className={`py-2 text-xs font-bold rounded-xl transition flex flex-col items-center gap-1 ${
                  paymentTab === 'card'
                    ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('netbanking')}
                className={`py-2 text-xs font-bold rounded-xl transition flex flex-col items-center gap-1 ${
                  paymentTab === 'netbanking'
                    ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>NetBanking</span>
              </button>
            </div>

            {/* UPI Option Body */}
            {paymentTab === 'upi' && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'gpay', label: 'Google Pay' },
                    { id: 'phonepe', label: 'PhonePe' },
                    { id: 'paytm', label: 'Paytm UPI' },
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setUpiApp(app.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                        upiApp === app.id
                          ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-bold'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {app.label}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-[11px] font-bold text-neutral-500 block mb-1">
                    Or Enter Any UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. mobile@okhdfcbank"
                    value={customVpa}
                    onChange={(e) => setCustomVpa(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Card Option Body */}
            {paymentTab === 'card' && (
              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-bold text-neutral-500 block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    defaultValue="4315 •••• •••• 8892"
                    readOnly
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-500 block mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      defaultValue="08/29"
                      readOnly
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-500 block mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      defaultValue="•••"
                      readOnly
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* NetBanking Body */}
            {paymentTab === 'netbanking' && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-neutral-500 block">
                  Select Popular Bank
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 text-left font-medium text-neutral-800 dark:text-neutral-200"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 pt-2">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Secured by 256-bit Razorpay PCI-DSS Level 1 Encryption</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={isProcessing}
                className="w-1/3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Processing ₹{amount}...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ₹{amount}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
