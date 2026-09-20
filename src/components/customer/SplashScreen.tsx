import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Sparkles, ArrowRight, Cake, Heart, Phone, UserCheck, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const { setIsAuthModalOpen, loginAsGuest } = useBakery();

  const handlePhoneLogin = () => {
    onEnter();
    setIsAuthModalOpen(true);
  };

  const handleGuestEnter = () => {
    loginAsGuest();
    onEnter();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-neutral-950 via-neutral-900 to-amber-950 text-white select-none animate-fadeIn"
      id="bakery-splash-screen"
    >
      {/* Top Floating Glow */}
      <div className="absolute top-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full flex justify-between items-center">
        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
          Cravvy Cakes Express
        </span>
        <span className="text-[10px] text-neutral-400">
          v2.4 (Flutter)
        </span>
      </div>

      {/* Center Bakery Emblem & Animation */}
      <div className="flex flex-col items-center text-center space-y-5 max-w-sm">
        <div className="relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-2xl shadow-amber-600/40 animate-pulse border-2 border-amber-300">
            <Cake className="w-14 h-14 sm:w-16 sm:h-16 stroke-[2]" />
          </div>
          <span className="absolute -bottom-2 -right-2 p-2 rounded-full bg-amber-400 text-neutral-950 shadow-lg">
            <Sparkles className="w-4 h-4 fill-neutral-950" />
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            CRAVVY <span className="text-amber-500 italic font-serif">CAKES</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
            Handcrafted Cakes & Custom 3D Studio
          </p>
          <p className="text-xs text-neutral-300 max-w-xs leading-relaxed pt-1">
            Freshly baked celebration cakes, Belgian truffles, brownies, and custom tiered fondant cakes delivered in 30-45 mins.
          </p>
        </div>
      </div>

      {/* Starting Auth / Guest Choice Buttons */}
      <div className="w-full max-w-sm space-y-3">
        {/* Option 1: Mobile Login */}
        <button
          id="btn-splash-phone-login"
          onClick={handlePhoneLogin}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-sm shadow-xl shadow-amber-600/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4 text-neutral-950" />
          <span>Login with Mobile Number (OTP)</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Option 2: Guest Continue */}
        <button
          id="btn-splash-guest-login"
          onClick={handleGuestEnter}
          className="w-full py-3.5 px-4 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <UserCheck className="w-4 h-4 text-amber-400" />
          <span>Continue as Guest (Explore Menu)</span>
        </button>

        <div className="flex items-center justify-center gap-3 text-[10px] text-neutral-400 pt-1">
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>100% Eggless Options</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>FSSAI Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
