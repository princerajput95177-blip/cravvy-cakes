import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Heart, ShoppingBag, Trash2, ArrowLeft, Star, Sparkles } from 'lucide-react';

export const WishlistScreen: React.FC = () => {
  const { wishlist, toggleWishlist, products, addToCart, setCustomerTab, setSelectedProduct } = useBakery();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="p-6 text-center my-auto py-24 space-y-4 max-w-sm mx-auto animate-fadeIn" id="wishlist-empty-view">
        <div className="w-20 h-20 rounded-full bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD] dark:border-[#46332B] text-[#8B2F3C] dark:text-[#C9A227] flex items-center justify-center mx-auto shadow-inner">
          <Heart className="w-10 h-10 fill-[#8B2F3C]/20 dark:fill-[#C9A227]/20" />
        </div>
        <h2 className="text-xl font-black text-[#2B1A15] dark:text-[#FAF4EE] font-serif">
          Your Wishlist is Empty
        </h2>
        <p className="text-xs text-[#7A6A63] leading-relaxed">
          Save your favourite artisanal celebration cakes, pastries, and brownies here to order them later.
        </p>
        <button
          id="btn-wishlist-explore"
          onClick={() => setCustomerTab('home')}
          className="px-6 py-3 rounded-2xl bg-[#8B2F3C] hover:bg-[#742531] text-white text-xs font-bold shadow-lg shadow-[#8B2F3C]/30 border border-[#C9A227]/40 transition active:scale-95 cursor-pointer"
        >
          Explore Celebration Bakes
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 space-y-5 pb-28 max-w-xl mx-auto" id="wishlist-screen">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8DACD] dark:border-[#46332B]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCustomerTab('home')}
            className="p-1.5 rounded-full hover:bg-[#FFF8F0] dark:hover:bg-[#261B16] text-[#7A6A63] dark:text-[#FAF4EE] transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#2B1A15] dark:text-[#FAF4EE] flex items-center gap-2 font-serif">
              <span>My Wishlist</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#8B2F3C]/10 dark:bg-[#8B2F3C]/30 text-[#8B2F3C] dark:text-[#C9A227] border border-[#C9A227]/30 font-bold">
                {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'}
              </span>
            </h1>
            <p className="text-xs text-[#7A6A63]">
              Saved CRAVVY Cakes delicacies
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Wishlist items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {wishlistedProducts.map((product) => {
          const currentPrice = product.discountPrice || product.price;
          return (
            <div
              key={product.id}
              className="group p-3 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Image container */}
                <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 mb-3 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent"></div>

                  {/* Veg / Eggless badge */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-xs ${
                        product.isEggless ? 'bg-emerald-700' : 'bg-[#8B2F3C]'
                      }`}
                    >
                      {product.isEggless ? 'Eggless' : 'Contains Egg'}
                    </span>
                  </div>

                  {/* Wishlist remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-[#30221D]/90 text-[#8B2F3C] flex items-center justify-center shadow-md hover:bg-rose-50 transition cursor-pointer"
                    title="Remove from Wishlist"
                  >
                    <Heart className="w-4 h-4 fill-[#8B2F3C]" />
                  </button>

                  {/* Rating pill */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#C9A227] text-[#2B1A15] text-[10px] font-black">
                    <Star className="w-3 h-3 fill-[#2B1A15]" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                {/* Details */}
                <h3
                  onClick={() => setSelectedProduct(product)}
                  className="text-sm font-bold text-[#2B1A15] dark:text-[#FAF4EE] line-clamp-1 hover:text-[#8B2F3C] cursor-pointer"
                >
                  {product.name}
                </h3>
                <p className="text-[11px] text-[#7A6A63] line-clamp-2 mt-0.5">
                  {product.description}
                </p>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#E8DACD] dark:border-[#46332B]">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-[#3B2118] dark:text-[#C9A227]">
                      ₹{currentPrice}
                    </span>
                    {product.discountPrice && (
                      <span className="text-xs text-[#7A6A63] line-through">
                        ₹{product.price}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="px-3 py-1.5 rounded-xl bg-[#8B2F3C] hover:bg-[#742531] text-white text-xs font-bold shadow-xs transition flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
