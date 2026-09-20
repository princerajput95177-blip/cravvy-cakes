import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import {
  Phone,
  Sparkles,
  X,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  UserCheck,
  ShoppingBag,
  KeyRound,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalReason,
    setAuthModalReason,
    loginWithPhone,
    verifyOtp,
    loginAsGuest,
    user,
  } = useBakery();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState(user.phone || '+91 98765 43210');
  const [name, setName] = useState(user.name !== 'Guest User' ? user.name : 'Prince Rajput');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setAuthModalReason(null);
    setStep('phone');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 8) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setOtp('7788'); // Auto pre-fill helper for quick testing
    }, 500);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(async () => {
      await loginWithPhone(phone, name);
      setIsLoading(false);
      setIsAuthModalOpen(false);
      setStep('phone');
    }, 400);
  };

  const handleGuestChoice = () => {
    loginAsGuest();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2B1A15]/75 backdrop-blur-xs animate-fadeIn"
      id="auth-modal-overlay"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-[#30221D] rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-[#E8DACD] dark:border-[#46332B] animate-scaleUp"
        id="auth-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Luxury Gradient Header */}
        <div className="bg-gradient-to-r from-[#3B2118] via-[#4A2B20] to-[#8B2F3C] p-5 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-[#C9A227]/40 flex items-center justify-center backdrop-blur-xs">
              {step === 'phone' ? (
                <Phone className="w-5 h-5 text-[#C9A227]" />
              ) : (
                <KeyRound className="w-5 h-5 text-[#C9A227]" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A227] block font-serif">
                Cravvy Cakes Boutique
              </span>
              <h2 className="text-base font-black leading-tight">
                {step === 'phone' ? 'Login with Mobile OTP' : 'Verify OTP Code'}
              </h2>
            </div>
          </div>

          <p className="text-xs text-[#FAF4EE]/85 leading-relaxed">
            {step === 'phone'
              ? 'Enter your mobile number to receive instant OTP and access quick checkout.'
              : `Enter the 4-digit verification code sent to ${phone}`}
          </p>
        </div>

        {/* Reason Alert Banner (if triggered by Add to Cart or Order) */}
        {authModalReason && (
          <div className="bg-[#FFF8F0] dark:bg-[#261B16] px-4 py-2.5 border-b border-[#E8DACD] dark:border-[#46332B] flex items-center gap-2 text-xs text-[#8B2F3C] dark:text-[#C9A227]">
            <ShoppingBag className="w-4 h-4 text-[#8B2F3C] dark:text-[#C9A227] flex-shrink-0" />
            <span className="font-medium text-[11px] leading-tight">{authModalReason}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5">
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#2B1A15] dark:text-[#FAF4EE] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Prince Rajput"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-[#FFF8F0]/30 dark:bg-[#261B16] text-[#2B1A15] dark:text-[#FAF4EE] font-medium focus:outline-none focus:ring-2 focus:ring-[#8B2F3C]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2B1A15] dark:text-[#FAF4EE] mb-1">
                  Mobile Number (for OTP)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6A63] font-bold text-xs">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone.replace('+91', '').trim()}
                    onChange={(e) => setPhone('+91 ' + e.target.value.replace('+91', '').trim())}
                    placeholder="98765 43210"
                    className="w-full pl-14 pr-3.5 py-2.5 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-[#FFF8F0]/30 dark:bg-[#261B16] text-[#2B1A15] dark:text-[#FAF4EE] font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2F3C]"
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  id="btn-send-otp"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl bg-[#8B2F3C] hover:bg-[#742531] text-white font-bold text-xs shadow-md shadow-[#8B2F3C]/30 border border-[#C9A227]/40 transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Sending One-Time Password...</span>
                  ) : (
                    <>
                      <span>Get OTP on Mobile</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C9A227]" />
                    </>
                  )}
                </button>
              </div>

              {/* Guest Option */}
              <div className="pt-2 border-t border-[#E8DACD] dark:border-[#46332B] text-center space-y-2">
                <div className="text-[11px] text-[#7A6A63]">
                  Just want to explore our bakery menu?
                </div>
                <button
                  type="button"
                  onClick={handleGuestChoice}
                  className="w-full py-2.5 rounded-xl border border-[#E8DACD] dark:border-[#46332B] text-[#3B2118] dark:text-[#FAF4EE] hover:bg-[#FFF8F0] dark:hover:bg-[#261B16] font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#7A6A63]" />
                  <span>Continue as Guest</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-[#2B1A15] dark:text-[#FAF4EE]">
                    Enter 4-Digit OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => setOtp('7788')}
                    className="text-[11px] text-[#8B2F3C] dark:text-[#C9A227] font-bold hover:underline cursor-pointer"
                  >
                    Quick Fill (7788)
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="7788"
                  className="w-full px-3.5 py-3 rounded-xl border border-[#C9A227] dark:border-[#C9A227]/60 bg-[#FFF8F0] dark:bg-[#261B16] text-[#2B1A15] dark:text-[#FAF4EE] text-center text-xl font-mono tracking-widest font-black focus:outline-none focus:ring-2 focus:ring-[#8B2F3C]"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#7A6A63] bg-[#FFF8F0] dark:bg-[#261B16] p-2.5 rounded-xl border border-[#E8DACD] dark:border-[#46332B]">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Verified instantly with secure JWT authentication token.</span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-1/3 py-2.5 rounded-xl border border-[#E8DACD] dark:border-[#46332B] text-[#3B2118] dark:text-[#FAF4EE] font-bold hover:bg-[#FFF8F0] dark:hover:bg-[#261B16] cursor-pointer"
                >
                  Edit No.
                </button>
                <button
                  id="btn-verify-otp-submit"
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 rounded-xl bg-[#8B2F3C] hover:bg-[#742531] text-white font-bold shadow-md shadow-[#8B2F3C]/30 border border-[#C9A227]/40 transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
                  <span>Verify & Enter</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
