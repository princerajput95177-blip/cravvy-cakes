import React from 'react';
import { Sparkles, Cake } from 'lucide-react';
import { useBakery } from '../../context/BakeryContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'amber';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'amber',
  showSubtitle = true,
}) => {
  let storeName = 'CRAVVY Cakes';
  let storeTagline = 'Handcrafted Cakes & Desserts';

  try {
    const bakery = useBakery();
    if (bakery?.settings?.name) storeName = bakery.settings.name;
    if (bakery?.settings?.tagline) storeTagline = bakery.settings.tagline;
  } catch (e) {
    // Fallback if rendered outside context
  }

  const sizeClasses = {
    sm: { icon: 'w-6 h-6', title: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-8 h-8', title: 'text-xl', sub: 'text-[11px]' },
    lg: { icon: 'w-11 h-11', title: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', title: 'text-4xl', sub: 'text-sm' },
  }[size];

  const colorClasses = {
    amber: {
      iconBg: 'bg-[#8B2F3C] text-white shadow-md shadow-[#8B2F3C]/20 border border-[#C9A227]/30',
      title: 'text-[#2B1A15] dark:text-[#FAF4EE]',
      sub: 'text-[#7A6A63] dark:text-[#C9A227]/80 font-medium',
      badge: 'text-[#C9A227]',
      accentWord: 'text-[#8B2F3C] dark:text-[#C9A227]',
    },
    light: {
      iconBg: 'bg-[#8B2F3C] text-white shadow-md shadow-black/30 border border-[#C9A227]/40',
      title: 'text-white',
      sub: 'text-[#FAF4EE]/80',
      badge: 'text-[#C9A227]',
      accentWord: 'text-[#C9A227]',
    },
    dark: {
      iconBg: 'bg-[#30221D] text-[#C9A227] border border-[#C9A227]/40',
      title: 'text-[#FAF4EE]',
      sub: 'text-[#B8A8A1]',
      badge: 'text-[#C9A227]',
      accentWord: 'text-[#C9A227]',
    },
  }[variant];

  // Split storeName into primary and accent words if space exists
  const parts = storeName.split(' ');
  const firstWord = parts[0];
  const remainingWords = parts.slice(1).join(' ');

  return (
    <div className="flex items-center gap-2.5 select-none" id="cravvy-cakes-logo">
      <div
        className={`relative flex items-center justify-center rounded-2xl overflow-hidden p-0.5 transition-transform hover:scale-105 ${sizeClasses.icon} ${colorClasses.iconBg}`}
      >
        <img
          src="/cravvy-icon.png"
          alt="Cravvy Cakes Logo"
          className="w-full h-full object-cover rounded-xl shadow-sm"
          onError={(e) => {
            // Fallback to vector icon if image fails
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A227] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C9A227]"></span>
        </span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className={`font-black tracking-tight leading-none uppercase ${sizeClasses.title} ${colorClasses.title}`}>
            {firstWord}{' '}
            {remainingWords && (
              <span className={`font-serif italic font-semibold lowercase tracking-normal ${colorClasses.accentWord}`}>
                {remainingWords}
              </span>
            )}
          </span>
          <Sparkles className={`w-3.5 h-3.5 ${colorClasses.badge} animate-pulse`} />
        </div>
        {showSubtitle && (
          <span className={`tracking-widest uppercase truncate max-w-[200px] text-[9px] ${colorClasses.sub} mt-0.5 font-medium`}>
            {storeTagline}
          </span>
        )}
      </div>
    </div>
  );
};
