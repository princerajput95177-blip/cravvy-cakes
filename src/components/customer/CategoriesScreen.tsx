import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, Check, Cake, Sparkles } from 'lucide-react';

export const CategoriesScreen: React.FC = () => {
  const {
    products,
    categories,
    selectedCategorySlug,
    setSelectedCategorySlug,
    searchQuery,
    setSearchQuery,
    isEgglessFilter,
    setIsEgglessFilter,
    sortBy,
    setSortBy,
    setCustomCakeModalOpen,
  } = useBakery();

  // Filter products
  let filtered = products.filter((p) => {
    // Category match
    if (selectedCategorySlug !== 'all' && p.categorySlug !== selectedCategorySlug) {
      return false;
    }
    // Eggless match
    if (isEgglessFilter !== null && p.isEggless !== isEgglessFilter) {
      return false;
    }
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat = p.categorySlug.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchTag && !matchCat) {
        return false;
      }
    }
    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviewCount - a.reviewCount; // 'popular'
  });

  return (
    <div className="space-y-4 pb-20 px-4 pt-3" id="categories-screen">
      {/* Top Search */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-[#7A6A63] absolute left-3.5" />
        <input
          type="text"
          placeholder="Search by cake, pastry, brownie, or flavour..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] text-[#2B1A15] dark:text-[#FAF4EE] text-xs placeholder:text-[#7A6A63] focus:outline-none focus:ring-2 focus:ring-[#8B2F3C]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 text-[#7A6A63] hover:text-[#2B1A15] text-xs font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Pills Slider */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategorySlug(cat.slug);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex-shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
              selectedCategorySlug === cat.slug
                ? 'bg-[#8B2F3C] text-white shadow-sm border border-[#C9A227]/40 ring-1 ring-[#C9A227]/50'
                : 'bg-white dark:bg-[#30221D] text-[#3B2118] dark:text-[#E8DACD] border border-[#E8DACD] dark:border-[#46332B] hover:border-[#C9A227]'
            }`}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* If Customize Cake section is selected, show custom cake 3D studio banner */}
      {(selectedCategorySlug === 'customize-cake' || selectedCategorySlug === 'custom-cakes') && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#2B1A15] via-[#3B2118] to-[#8B2F3C] text-white border border-[#C9A227]/40 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="px-2 py-0.5 rounded-full bg-[#C9A227] text-[#2B1A15] text-[10px] font-black uppercase tracking-wider">
              3D Interactive Studio
            </span>
            <h3 className="text-sm font-black font-serif">Build Your Dream Custom Cake</h3>
            <p className="text-[11px] text-[#FAF4EE]/80">Pick custom tiers, flavours, cream color & instant chef quote</p>
          </div>
          <button
            onClick={() => setCustomCakeModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#C9A227] hover:bg-[#b89422] text-[#2B1A15] text-xs font-black uppercase tracking-wider shadow-md transition active:scale-95 flex items-center gap-1 cursor-pointer flex-shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch 3D</span>
          </button>
        </div>
      )}

      {/* Filter & Sort Row */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E8DACD] dark:border-[#46332B]">
        {/* 100% Pure Veg Guarantee Badge */}
        <div className="flex items-center gap-1.5">
          <div className="px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>100% Pure Veg & Eggless</span>
            <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
          </div>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-[#7A6A63] hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] text-[#3B2118] dark:text-[#FAF4EE] text-xs font-bold focus:ring-1 focus:ring-[#8B2F3C] focus:outline-none"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Active Filter Tags info */}
      <div className="flex items-center justify-between text-xs text-[#7A6A63] dark:text-[#B8A8A1]">
        <span>
          Showing <strong className="text-[#2B1A15] dark:text-[#FAF4EE]">{filtered.length}</strong> delicacies
        </span>
        {searchQuery && (
          <span className="text-[#8B2F3C] dark:text-[#C9A227] font-bold">
            Search: "{searchQuery}"
          </span>
        )}
      </div>

      {/* Grid of Products */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#FFF8F0] dark:bg-[#30221D] text-[#8B2F3C] border border-[#E8DACD] dark:border-[#46332B] flex items-center justify-center mx-auto">
            <Cake className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#2B1A15] dark:text-[#FAF4EE]">
            No bakery items matched your filter
          </h3>
          <p className="text-xs text-[#7A6A63] dark:text-[#B8A8A1] max-w-xs mx-auto">
            Try adjusting your search keywords, clear eggless filter, or request a custom cake from our pastry chef!
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setIsEgglessFilter(null);
              setSelectedCategorySlug('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#8B2F3C] hover:bg-[#742531] text-white text-xs font-bold shadow-md transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
