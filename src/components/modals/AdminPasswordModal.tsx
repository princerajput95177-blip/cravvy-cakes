import React, { useState, useEffect, useRef } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Lock, Eye, EyeOff, X, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export const AdminPasswordModal: React.FC = () => {
  const {
    adminPasswordModalOpen,
    setAdminPasswordModalOpen,
    verifyAdminPassword,
  } = useBakery();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adminPasswordModalOpen) {
      setPassword('');
      setErrorMessage('');
      setIsSuccess(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [adminPasswordModalOpen]);

  if (!adminPasswordModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage('Kripya password enter karein.');
      return;
    }

    const ok = verifyAdminPassword(password);
    if (ok) {
      setIsSuccess(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Galat password! Access denied. Kripya sahi password darj karein.');
      setPassword('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#211713] text-[#FAF4EE] border border-[#46332B] shadow-2xl p-6 overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C9A227] via-[#8B2F3C] to-[#C9A227]"></div>

        {/* Close Button */}
        <button
          onClick={() => setAdminPasswordModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#30221D] hover:bg-[#3E271F] flex items-center justify-center text-[#B8A8A1] hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8B2F3C] to-[#B23B4E] border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] shadow-lg mb-3">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-white">Bakery Admin Portal</h3>
          <p className="text-xs text-[#B8A8A1] mt-1 max-w-[240px]">
            Admin dashboard open karne ke liye authorized security password enter karein.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {isSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Password verified! Opening Admin Dashboard...</span>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#B8A8A1] mb-1.5">
              Enter Admin Password
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Enter password..."
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl bg-[#170F0C] border border-[#46332B] text-white text-sm font-medium placeholder:text-neutral-500 focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setAdminPasswordModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-[#46332B] hover:bg-[#30221D] text-[#B8A8A1] hover:text-white text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#8B2F3C] to-[#A33444] hover:from-[#732531] hover:to-[#8B2F3C] text-white text-xs font-black shadow-md border border-[#C9A227]/30 transition flex items-center justify-center gap-1.5"
            >
              <span>Unlock Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
