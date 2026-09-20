import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  X,
  CreditCard,
  Smartphone,
  Building2,
  Sparkles,
  AlertCircle,
  Clock,
  Check,
} from 'lucide-react';
import { PaymentMethod } from '../../types';

interface ZomatoPaymentGatewayProps {
  isOpen: boolean;
  amount: number;
  paymentMethod: PaymentMethod;
  upiApp?: 'Google Pay' | 'PhonePe' | 'Paytm' | 'CRED' | 'Other UPI';
  onClose: () => void;
  onSuccess: (paymentInfo: {
    paymentId: string;
    method: PaymentMethod;
  }) => void;
}

export const ZomatoPaymentGateway: React.FC<ZomatoPaymentGatewayProps> = ({
  isOpen,
  amount,
  paymentMethod,
  upiApp = 'Google Pay',
  onClose,
  onSuccess,
}) => {
  const [stage, setStage] = useState<'initiating' | 'authorizing' | 'success' | 'failed'>('initiating');
  const [txnId, setTxnId] = useState('');
  const [bankRef, setBankRef] = useState('');

  // Card details if card selected
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');
  const [cardHolder, setCardHolder] = useState('PRINCE RAJPUT');

  // NetBanking bank if selected
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  useEffect(() => {
    if (!isOpen) {
      setStage('initiating');
      return;
    }

    const generatedTxn = `PAY_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedRef = `UPI-REF-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setTxnId(generatedTxn);
    setBankRef(generatedRef);

    // Automatic smooth realistic gateway progress
    const t1 = setTimeout(() => {
      setStage('authorizing');
    }, 1100);

    const t2 = setTimeout(() => {
      setStage('success');
    }, 2400);

    const t3 = setTimeout(() => {
      onSuccess({
        paymentId: generatedTxn,
        method: paymentMethod,
      });
    }, 3900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, paymentMethod]);

  if (!isOpen) return null;

  const getMethodTitle = () => {
    if (paymentMethod === 'Google Pay') return 'Google Pay UPI';
    if (paymentMethod === 'PhonePe') return 'PhonePe UPI';
    if (paymentMethod === 'Paytm') return 'Paytm Payments Bank / UPI';
    if (paymentMethod === 'CRED') return 'CRED Pay UPI';
    if (paymentMethod === 'UPI') return 'Direct UPI Transfer';
    if (paymentMethod === 'Credit/Debit Card') return 'Visa / Mastercard Secure';
    if (paymentMethod === 'Net Banking') return `${selectedBank} NetBanking`;
    return 'Secure Payment Gateway';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn"
      id="zomato-payment-gateway-modal"
    >
      <div className="bg-white dark:bg-[#2A1D18] rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-[#E8DACD] dark:border-[#46332B] flex flex-col animate-scaleUp">
        {/* Top Header - Zomato Safe Gateway */}
        <div className="bg-gradient-to-r from-[#8B2F3C] to-[#A03847] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-black tracking-wide uppercase">Cravvy Cakes Gateway</div>
              <div className="text-[10px] text-white/80 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> 256-Bit SSL Encrypted
              </div>
            </div>
          </div>
          {stage !== 'success' && (
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 text-white/80 transition"
              title="Cancel payment"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Amount Header */}
        <div className="p-5 text-center bg-[#FFF8F0] dark:bg-[#33231D] border-b border-[#E8DACD] dark:border-[#46332B]">
          <span className="text-[11px] uppercase tracking-wider text-[#7A6A63] dark:text-[#B8A8A1] font-bold">
            Total Payable Amount
          </span>
          <div className="text-3xl font-black text-[#2B1A15] dark:text-[#FAF4EE] mt-0.5">
            ₹{amount}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#261B16] border border-[#E8DACD] dark:border-[#46332B] text-xs font-extrabold text-[#8B2F3C] dark:text-[#C9A227] mt-2 shadow-2xs">
            <Smartphone className="w-3.5 h-3.5" />
            <span>{getMethodTitle()}</span>
          </div>
        </div>

        {/* Dynamic Payment Stages */}
        <div className="p-6 space-y-6">
          {stage === 'initiating' && (
            <div className="text-center py-4 space-y-3 animate-fadeIn">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-[#8B2F3C]/20 border-t-[#8B2F3C] animate-spin"></div>
                <div className="absolute inset-2 rounded-full bg-[#FFF8F0] dark:bg-[#33231D] flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-[#8B2F3C] animate-pulse" />
                </div>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#2B1A15] dark:text-[#FAF4EE]">
                  Opening {getMethodTitle()}
                </h4>
                <p className="text-xs text-[#7A6A63] dark:text-[#B8A8A1] mt-0.5">
                  Connecting to banking network securely...
                </p>
              </div>
            </div>
          )}

          {stage === 'authorizing' && (
            <div className="text-center py-4 space-y-3 animate-fadeIn">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
                <div className="absolute inset-2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-emerald-600 animate-bounce" />
                </div>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#2B1A15] dark:text-[#FAF4EE]">
                  Authorizing Payment ₹{amount}
                </h4>
                <p className="text-xs text-[#7A6A63] dark:text-[#B8A8A1] mt-0.5">
                  Verifying transaction with issuing bank...
                </p>
              </div>
            </div>
          )}

          {stage === 'success' && (
            <div className="text-center py-3 space-y-3 animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-1">
                  100% Successful
                </span>
                <h4 className="font-black text-lg text-[#2B1A15] dark:text-[#FAF4EE]">
                  Payment Received!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                  Order placed! Redirecting to live delivery tracking...
                </p>
              </div>

              {/* Transaction Receipt Pill */}
              <div className="p-3 rounded-2xl bg-[#FFF8F0] dark:bg-[#33231D] border border-[#E8DACD] dark:border-[#46332B] text-left text-xs space-y-1">
                <div className="flex justify-between text-[#7A6A63] dark:text-[#B8A8A1]">
                  <span>Transaction ID:</span>
                  <span className="font-mono font-bold text-[#2B1A15] dark:text-[#FAF4EE]">{txnId}</span>
                </div>
                <div className="flex justify-between text-[#7A6A63] dark:text-[#B8A8A1]">
                  <span>Bank Reference:</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{bankRef}</span>
                </div>
                <div className="flex justify-between text-[#7A6A63] dark:text-[#B8A8A1]">
                  <span>Payment Mode:</span>
                  <span className="font-bold text-[#2B1A15] dark:text-[#FAF4EE]">{getMethodTitle()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Security Footer */}
          <div className="pt-3 border-t border-[#E8DACD] dark:border-[#46332B] flex items-center justify-center gap-2 text-[10px] text-[#7A6A63] dark:text-[#B8A8A1]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified by NPCI & RBI Authorized Payment Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
};
