import React, { useState, useEffect } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { ProductCard } from './ProductCard';
import {
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  ChevronRight,
  Flame,
  Cake,
  Gift,
  Heart,
  TrendingUp,
  Percent,
  Star,
  Clock,
  Zap,
  ShieldCheck,
  User as UserIcon,
  ChevronDown,
  CheckCircle2,
  Tag,
  Crown,
} from 'lucide-react';

type FilterType = 'all' | 'under30' | 'rating45' | 'offers' | 'bestsellers' | 'budget' | 'twopounds';

export const HomeScreen: React.FC = () => {
  const {
    products,
    categories,
    banners,
    selectedAddress,
    setCustomerTab,
    setSelectedCategorySlug,
    setSelectedProduct,
    setCustomCakeModalOpen,
    searchQuery,
    setSearchQuery,
    currentUser,
    wishlist,
    unreadNotificationCount,
    showToast,
  } = useBakery();

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isPureVegOnly, setIsPureVegOnly] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  // Active banners from admin panel
  const displayBanners = banners.filter((b) => b.isActive !== false);
  const finalBanners = displayBanners.length > 0 ? displayBanners : banners;

  // Auto rotate banners
  useEffect(() => {
    if (finalBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % finalBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [finalBanners.length]);

  const handleCategoryClick = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCustomerTab('categories');
  };

  // Filter products based on Veg toggle and active quick filter
  const filteredProducts = products.filter((product) => {
    if (isPureVegOnly && !product.isEggless) {
      return false;
    }
    if (selectedFilter === 'under30' && (product.prepTimeMinutes || 30) > 30) {
      return false;
    }
    if (selectedFilter === 'rating45' && product.rating < 4.5) {
      return false;
    }
    if (selectedFilter === 'offers' && !product.discountPrice && !product.isSpecialOffer) {
      return false;
    }
    if (selectedFilter === 'bestsellers' && !product.isBestSeller) {
      return false;
    }
    if (selectedFilter === 'budget' && (product.discountPrice || product.price) > 499) {
      return false;
    }
    if (selectedFilter === 'twopounds' && product.categorySlug !== '2-pounds') {
      return false;
    }
    return true;
  });

  const bestSellers = filteredProducts.filter((p) => p.isBestSeller);
  const newArrivals = filteredProducts.filter((p) => p.isNewArrival);
  const specialOffers = filteredProducts.filter((p) => p.isSpecialOffer || p.discountPrice);
  const twoPoundCakes = products.filter((p) => p.categorySlug === '2-pounds');

  return (
    <div className="space-y-5 pb-24" id="customer-home-screen">
      {/* Top Swiggy-Style Location Header */}
      <div className="px-4 pt-3.5 pb-1 flex items-center justify-between">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-[#8B2F3C]/10 text-[#8B2F3C] dark:text-[#C9A227] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#8B2F3C]/20">
            <MapPin className="w-5 h-5 fill-[#8B2F3C]/20" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => setCustomerTab('profile')}>
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#8B2F3C] dark:text-[#C9A227] block">
                Deliver To:
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                ⚡ Jalandhar
              </span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => setCustomerTab('profile')}>
              <span className="text-sm font-black tracking-tight text-[#2B1A15] dark:text-[#FAF4EE] flex items-center gap-1 truncate">
                {selectedAddress ? `${selectedAddress.area}, Jalandhar` : 'Select Delivery Address'}
                <ChevronDown className="w-3.5 h-3.5 text-[#7A6A63] flex-shrink-0" />
              </span>
            </div>
            <p className="text-[11px] text-[#7A6A63] dark:text-[#B8A8A1] truncate max-w-[200px] sm:max-w-xs">
              {selectedAddress
                ? `${selectedAddress.houseFlat}, ${selectedAddress.street}`
                : 'Tap to add your home or office address in Jalandhar'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Wishlist Button */}
          <button
            id="btn-header-wishlist"
            onClick={() => setCustomerTab('wishlist')}
            className="relative p-2 rounded-2xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] hover:border-[#8B2F3C] text-[#2B1A15] dark:text-[#FAF4EE] transition active:scale-95 shadow-2xs"
            title="My Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-[#8B2F3C] text-[#8B2F3C]' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#8B2F3C] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* User profile avatar / Login shortcut */}
          <button
            onClick={() => setCustomerTab('profile')}
            className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] hover:border-[#C9A227] transition active:scale-95 shadow-2xs"
            title="Account Profile"
          >
            <div className="w-7 h-7 rounded-xl bg-[#8B2F3C] text-white flex items-center justify-center font-bold text-xs shadow-xs border border-[#C9A227]/40">
              {currentUser ? currentUser.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
          </button>
        </div>
      </div>

      {/* Swiggy Search Bar & Quick Voice/Filter */}
      <div className="px-4">
        <div className="relative flex items-center shadow-xs rounded-2xl">
          <Search className="w-4 h-4 text-[#8B2F3C] dark:text-[#C9A227] absolute left-3.5" />
          <input
            type="text"
            placeholder="Search 'Dutch Truffle Cake', 'Brownies'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery) setCustomerTab('categories');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setCustomerTab('categories');
            }}
            className="w-full pl-10 pr-20 py-3 rounded-2xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] text-[#2B1A15] dark:text-[#FAF4EE] text-xs placeholder:text-[#7A6A63] focus:outline-none focus:ring-2 focus:ring-[#8B2F3C] transition shadow-xs"
          />
          <div className="absolute right-3 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#7A6A63] hover:text-[#2B1A15] text-xs font-bold"
              >
                ✕
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedCategorySlug('all');
                  setCustomerTab('categories');
                }}
                className="text-[11px] font-bold text-[#8B2F3C] dark:text-[#C9A227] flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 100% Pure Veg Kitchen Guarantee Banner */}
      <div className="px-4">
        <div className="flex items-center justify-between p-2.5 px-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-600/30 text-emerald-900 dark:text-emerald-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-xs border-2 border-emerald-600 flex items-center justify-center bg-white flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            </span>
            <span className="text-xs font-black tracking-tight">
              100% Pure Veg & Eggless Bakery
            </span>
          </div>
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-700 text-white shadow-2xs">
            🌱 Pure Veg Kitchen
          </span>
        </div>
      </div>

      {/* Swiggy Pure Veg Mode & Custom Cake Pill Row */}
      <div className="px-4 flex items-center justify-between gap-2">
        {/* Pure Veg Badge Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-600/30 text-emerald-800 dark:text-emerald-300 shadow-2xs">
          <span className="w-3.5 h-3.5 rounded-xs border border-emerald-600 flex items-center justify-center bg-white">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          </span>
          <span className="text-[11px] font-extrabold">All Bakes 100% Eggless</span>
        </div>

        {/* 3D Custom Cake Studio Button */}
        <button
          id="btn-home-custom-cake-pill"
          onClick={() => setCustomCakeModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#8B2F3C] hover:bg-[#742531] text-white text-[11px] font-black shadow-xs active:scale-95 transition border border-[#C9A227]/30"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Custom Cake 3D</span>
        </button>
      </div>

      {/* Swiggy Quick Filter Pills Horizontal Bar */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition border ${
            selectedFilter === 'all'
              ? 'bg-[#8B2F3C] text-white border-[#8B2F3C] shadow-xs'
              : 'bg-white dark:bg-[#30221D] text-[#7A6A63] dark:text-[#B8A8A1] border-[#E8DACD] dark:border-[#46332B]'
          }`}
        >
          All Items ({products.length})
        </button>

        <button
          onClick={() => setSelectedFilter(selectedFilter === 'twopounds' ? 'all' : 'twopounds')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition border ${
            selectedFilter === 'twopounds'
              ? 'bg-[#8B2F3C] text-white border-[#8B2F3C] shadow-xs ring-2 ring-[#C9A227]/50'
              : 'bg-white dark:bg-[#30221D] text-[#8B2F3C] dark:text-[#C9A227] border-[#8B2F3C]/40 font-extrabold'
          }`}
        >
          <Crown className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>🎂 2 Pounds ({twoPoundCakes.length})</span>
        </button>

        <button
          onClick={() => setSelectedFilter(selectedFilter === 'bestsellers' ? 'all' : 'bestsellers')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-1 transition border ${
            selectedFilter === 'bestsellers'
              ? 'bg-[#8B2F3C] text-white border-[#8B2F3C] shadow-xs'
              : 'bg-white dark:bg-[#30221D] text-[#7A6A63] dark:text-[#B8A8A1] border-[#E8DACD] dark:border-[#46332B]'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-[#C9A227] fill-[#C9A227]" />
          <span>Bestsellers</span>
        </button>

        <button
          onClick={() => setSelectedFilter(selectedFilter === 'under30' ? 'all' : 'under30')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-1 transition border ${
            selectedFilter === 'under30'
              ? 'bg-[#8B2F3C] text-white border-[#8B2F3C] shadow-xs'
              : 'bg-white dark:bg-[#30221D] text-[#7A6A63] dark:text-[#B8A8A1] border-[#E8DACD] dark:border-[#46332B]'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Under 30 Mins</span>
        </button>

        <button
          onClick={() => setSelectedFilter(selectedFilter === 'rating45' ? 'all' : 'rating45')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-1 transition border ${
            selectedFilter === 'rating45'
              ? 'bg-[#8B2F3C] text-white border-[#8B2F3C] shadow-xs'
              : 'bg-white dark:bg-[#30221D] text-[#7A6A63] dark:text-[#B8A8A1] border-[#E8DACD] dark:border-[#46332B]'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-[#C9A227] fill-[#C9A227]" />
          <span>Rating 4.5+</span>
        </button>

        <button
          onClick={() => setSelectedFilter(selectedFilter === 'offers' ? 'all' : 'offers')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-1 transition border ${
            selectedFilter === 'offers'
              ? 'bg-[#8B2F3C] text-white border-[#8B2F3C] shadow-xs'
              : 'bg-white dark:bg-[#30221D] text-[#7A6A63] dark:text-[#B8A8A1] border-[#E8DACD] dark:border-[#46332B]'
          }`}
        >
          <Percent className="w-3.5 h-3.5 text-[#8B2F3C]" />
          <span>Offers & Deals</span>
        </button>

        <button
          onClick={() => setSelectedFilter(selectedFilter === 'budget' ? 'all' : 'budget')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-1 transition border ${
            selectedFilter === 'budget'
              ? 'bg-[#8B2F3C] text-white border-[#8B2F3C] shadow-xs'
              : 'bg-white dark:bg-[#30221D] text-[#7A6A63] dark:text-[#B8A8A1] border-[#E8DACD] dark:border-[#46332B]'
          }`}
        >
          <span>Under ₹499</span>
        </button>
      </div>

      {/* Hero Promotional Carousel */}
      <div className="px-4">
        <div className="relative rounded-3xl overflow-hidden shadow-lg h-44 sm:h-52 bg-neutral-900 group">
          {finalBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={banner.imageUrl}
                alt={banner.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/60 to-transparent"></div>

              <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between text-white z-20">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#C9A227] text-[#2B1A15] text-[10px] font-black uppercase tracking-wider w-max shadow-md">
                  {banner.badge}
                </span>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-md">
                    {banner.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-200 mt-1 max-w-xs line-clamp-2">
                    {banner.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (banner.title.includes('Custom')) {
                        setCustomCakeModalOpen(true);
                      } else {
                        setSelectedCategorySlug('birthday-cakes');
                        setCustomerTab('categories');
                      }
                    }}
                    className="px-4 py-1.5 rounded-xl bg-[#8B2F3C] hover:bg-[#742531] text-white text-xs font-black shadow-md transition active:scale-95 flex items-center gap-1 border border-[#C9A227]/30"
                  >
                    <span>Order Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Dots Indicator */}
          <div className="absolute bottom-3 right-4 z-30 flex items-center gap-1.5">
            {finalBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBannerIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentBannerIndex ? 'w-5 bg-[#C9A227]' : 'w-1.5 bg-white/50'
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>

      {/* Jalandhar Exclusive Delivery Guarantee Banner */}
      <div className="px-4">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#8B2F3C]/10 to-amber-500/10 dark:from-[#3B2118] dark:to-[#261B16] border border-[#C9A227]/40 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8B2F3C] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <MapPin className="w-4 h-4 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-[#2B1A15] dark:text-[#FAF4EE]">
                  Delivering Exclusively in Jalandhar City
                </span>
                <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-[#7A6A63] dark:text-[#B8A8A1]">
                Model Town • Urban Estate Phase 1 & 2 • Cantt • Rama Mandi • Civil Lines
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase text-[#8B2F3C] dark:text-[#C9A227] tracking-wider hidden sm:block">
            ⚡ 30-45 Mins
          </span>
        </div>
      </div>

      {/* "What's On Your Mind?" Swiggy Circular Category Slider */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-4">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-[#2B1A15] dark:text-[#FAF4EE]">
              What's on your mind?
            </h2>
            <p className="text-[11px] text-[#7A6A63] dark:text-[#B8A8A1]">Curated bakes delivered fresh to your door</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug('all');
              setCustomerTab('categories');
            }}
            className="text-xs font-black text-[#8B2F3C] dark:text-[#C9A227] hover:underline flex items-center gap-0.5"
          >
            <span>Explore Menu</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-3.5 overflow-x-auto px-4 pb-2 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group w-20 text-center"
            >
              <div className="relative w-18 h-18 rounded-full overflow-hidden bg-white dark:bg-[#30221D] p-0.5 border-2 border-[#E8DACD] dark:border-[#46332B] group-hover:border-[#8B2F3C] transition shadow-xs group-hover:scale-105">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('unsplash.com')) {
                      target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80';
                    }
                  }}
                />
              </div>
              <span className="text-[11px] font-bold text-[#2B1A15] dark:text-[#FAF4EE] line-clamp-1 group-hover:text-[#8B2F3C] transition">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2 Pound Celebration Cakes Showcase Section (Featured & Updated) */}
      {twoPoundCakes.length > 0 && (
        <div className="space-y-3 px-4" id="home-section-2-pounds">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-[#8B2F3C] text-[#C9A227] shadow-xs">
                <Crown className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-[#2B1A15] dark:text-[#FAF4EE]">
                    2 Pound Celebration Cakes
                  </h2>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#C9A227] text-[#2B1A15] shadow-xs">
                    4 Delicacies
                  </span>
                </div>
                <p className="text-[11px] text-[#7A6A63] dark:text-[#B8A8A1]">
                  Grand 1.0 kg celebrations • Handcrafted & 100% Pure Veg
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedCategorySlug('2-pounds');
                setCustomerTab('categories');
              }}
              className="text-xs font-black text-[#8B2F3C] dark:text-[#C9A227] hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {twoPoundCakes.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Best Sellers Section */}
      <div className="space-y-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#C9A227] text-[#2B1A15]">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#2B1A15] dark:text-[#FAF4EE]">
                Best Sellers in Jalandhar
              </h2>
              <p className="text-[11px] text-[#7A6A63] dark:text-[#B8A8A1]">Most ordered across Jalandhar city</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Special Offers Section */}
      {specialOffers.length > 0 && (
        <div className="space-y-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-[#8B2F3C] text-white">
                <Percent className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-base font-black text-[#2B1A15] dark:text-[#FAF4EE]">
                  Special Bakery Offers
                </h2>
                <p className="text-[11px] text-[#7A6A63] dark:text-[#B8A8A1]">Handcrafted delights at sweet discounts</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {specialOffers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* New Arrivals Section */}
      <div className="space-y-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#C9A227] text-[#2B1A15]">
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#2B1A15] dark:text-[#FAF4EE]">
                New Gourmet Creations
              </h2>
              <p className="text-[11px] text-[#7A6A63] dark:text-[#B8A8A1]">Fresh from our master pastry chef</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Swiggy Trust & Safety Footer Badges */}
      <div className="px-4 pt-4 border-t border-[#E8DACD] dark:border-[#46332B]">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] flex flex-col items-center shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
            <span className="text-[10px] font-bold text-[#2B1A15] dark:text-[#FAF4EE]">100% Hygienic</span>
            <span className="text-[9px] text-[#7A6A63]">Kitchen sanitized</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] flex flex-col items-center shadow-2xs">
            <Clock className="w-5 h-5 text-[#8B2F3C] mb-1" />
            <span className="text-[10px] font-bold text-[#2B1A15] dark:text-[#FAF4EE]">Express Delivery</span>
            <span className="text-[9px] text-[#7A6A63]">Baked fresh today</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] flex flex-col items-center shadow-2xs">
            <Tag className="w-5 h-5 text-[#C9A227] mb-1" />
            <span className="text-[10px] font-bold text-[#2B1A15] dark:text-[#FAF4EE]">Best Price</span>
            <span className="text-[9px] text-[#7A6A63]">Direct bakery rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
