import React from 'react';
import { Product } from '../../types';
import { useBakery } from '../../context/BakeryContext';
import { Star, Plus, Minus, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect?: () => void;
  layout?: 'grid' | 'horizontal';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  layout = 'grid',
}) => {
  const { addToCart, updateCartQuantity, cart, setSelectedProduct } = useBakery();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const isCustomisable =
    (product.availableSizes && product.availableSizes.length > 1) ||
    (product.availableFlavours && product.availableFlavours.length > 1);

  const handleCardClick = () => {
    if (onSelect) {
      onSelect();
    } else {
      setSelectedProduct(product);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, {
      quantity: 1,
      flavour: product.availableFlavours?.[0],
      size: product.availableSizes?.[0],
      isEggless: product.isEggless,
    });
  };

  if (layout === 'horizontal') {
    return (
      <div
        id={`product-card-horizontal-${product.id}`}
        onClick={handleCardClick}
        className="flex items-center gap-3 p-3 bg-white dark:bg-[#30221D] rounded-2xl border border-[#E8DACD] dark:border-[#46332B] shadow-xs hover:shadow-md transition cursor-pointer group"
      >
        <div className="relative w-22 h-22 flex-shrink-0 rounded-2xl overflow-hidden bg-[#FDF2E4]">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('unsplash.com')) {
                target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80';
              }
            }}
          />
          {/* Subtle Natural Veg/Eggless Icon */}
          <span
            title={product.isEggless ? '100% Eggless Vegetarian' : 'Contains Egg'}
            className="absolute top-1.5 left-1.5 w-4 h-4 bg-white/95 rounded-sm border border-[#E8DACD] flex items-center justify-center shadow-xs"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                product.isEggless ? 'bg-emerald-600' : 'bg-[#3B2118]'
              }`}
            ></span>
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-[#2B1A15] dark:text-[#FAF4EE] truncate group-hover:text-[#8B2F3C] transition-colors">
              {product.name}
            </h4>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-[#C9A227] mt-0.5">
            <Star className="w-3 h-3 fill-[#C9A227]" />
            <span className="text-[#3B2118] dark:text-[#FAF4EE] font-extrabold">{product.rating}</span>
            <span className="text-[#7A6A63] text-[10px] font-normal">({product.reviewCount})</span>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-[#3B2118] dark:text-[#FAF4EE]">
                ₹{product.discountPrice || product.price}
              </span>
              {product.discountPrice && (
                <span className="text-[11px] text-[#7A6A63]/70 line-through">
                  ₹{product.price}
                </span>
              )}
            </div>

            {cartItem ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between bg-white dark:bg-[#30221D] border-2 border-[#8B2F3C] rounded-xl shadow-xs overflow-hidden h-7 w-20 px-1"
              >
                <button
                  onClick={() => updateCartQuantity(cartItem.id, -1)}
                  className="w-5 h-5 flex items-center justify-center text-[#8B2F3C] dark:text-[#FAF4EE] font-bold hover:bg-[#8B2F3C]/10 rounded"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-extrabold text-xs text-[#8B2F3C] dark:text-[#FAF4EE]">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() => updateCartQuantity(cartItem.id, 1)}
                  className="w-5 h-5 flex items-center justify-center text-[#8B2F3C] dark:text-[#FAF4EE] font-bold hover:bg-[#8B2F3C]/10 rounded"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleQuickAdd}
                className="flex items-center justify-center px-3 py-1 rounded-xl border-2 border-[#8B2F3C] bg-[#8B2F3C] text-white font-extrabold text-xs shadow-xs hover:bg-[#742531] transition"
              >
                <span>ADD</span>
                <Plus className="w-3 h-3 ml-0.5 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="flex flex-col bg-white dark:bg-[#30221D] rounded-3xl border border-[#E8DACD] dark:border-[#46332B] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-[#FDF2E4] dark:bg-[#261B16] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('unsplash.com')) {
              target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80';
            }
          }}
        />

        {/* Veg / Eggless Indicator (Subtle Natural Green) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span
            title={product.isEggless ? '100% Eggless Pure Veg' : 'Contains Egg'}
            className="w-5 h-5 bg-white/95 backdrop-blur-xs rounded-md shadow-xs border border-[#E8DACD] flex items-center justify-center"
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                product.isEggless ? 'bg-emerald-600' : 'bg-[#3B2118]'
              }`}
            ></span>
          </span>

          {product.isEggless && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-700 text-white shadow-xs">
              Pure Veg
            </span>
          )}
        </div>

        {/* Top Right Badges: Champagne Gold for Bestseller, Burgundy for Discount */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
          {product.isBestSeller && (
            <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-[#C9A227] text-[#2B1A15] shadow-sm">
              Bestseller
            </span>
          )}
          {product.discountPrice && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#8B2F3C] text-white shadow-sm border border-[#C9A227]/30">
              ₹{product.price - product.discountPrice} OFF
            </span>
          )}
        </div>

        {/* Bottom Floating Bar: Delivery ETA & Rating */}
        <div className="absolute bottom-2 inset-x-2 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#2B1A15]/85 backdrop-blur-md text-white text-[11px] font-bold shadow-md">
            <Star className="w-3 h-3 fill-[#C9A227] text-[#C9A227]" />
            <span>{product.rating}</span>
            <span className="text-[#E8DACD]/80 text-[9px] font-normal">({product.reviewCount})</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#2B1A15]/85 backdrop-blur-md text-[#FAF4EE] text-[10px] font-semibold">
            <Zap className="w-3 h-3 text-[#C9A227] fill-[#C9A227]" />
            <span>{product.prepTimeMinutes || 30}m</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-sm text-[#2B1A15] dark:text-[#FAF4EE] line-clamp-1 group-hover:text-[#8B2F3C] transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-[#7A6A63] dark:text-[#B8A8A1] line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Variations Preview */}
        {product.availableFlavours && product.availableFlavours.length > 0 && (
          <div className="mt-1.5 text-[10px] text-[#8B2F3C] dark:text-[#C9A227] font-medium truncate">
            ✨ {product.availableFlavours.slice(0, 2).join(', ')}
            {product.availableFlavours.length > 2 ? ` +${product.availableFlavours.length - 2} more` : ''}
          </div>
        )}

        {/* Price & Swiggy ADD / Stepper Button */}
        <div className="mt-3 pt-2 border-t border-[#E8DACD]/60 dark:border-[#46332B] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-[#3B2118] dark:text-[#FAF4EE]">
                ₹{product.discountPrice || product.price}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-[#7A6A63]/70 line-through">
                  ₹{product.price}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#7A6A63] dark:text-[#B8A8A1] block font-medium">
              {product.availableSizes?.[0] || '0.5 kg standard'}
            </span>
          </div>

          <div className="flex flex-col items-center">
            {cartItem ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between bg-white dark:bg-[#30221D] border-2 border-[#8B2F3C] rounded-xl shadow-xs overflow-hidden h-8 w-22 px-1"
              >
                <button
                  onClick={() => updateCartQuantity(cartItem.id, -1)}
                  className="w-6 h-6 flex items-center justify-center text-[#8B2F3C] dark:text-[#FAF4EE] font-black hover:bg-[#8B2F3C]/10 rounded transition active:scale-90"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <span className="font-black text-xs text-[#8B2F3C] dark:text-[#FAF4EE]">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() => updateCartQuantity(cartItem.id, 1)}
                  className="w-6 h-6 flex items-center justify-center text-[#8B2F3C] dark:text-[#FAF4EE] font-black hover:bg-[#8B2F3C]/10 rounded transition active:scale-90"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              <button
                id={`btn-add-cart-${product.id}`}
                onClick={handleQuickAdd}
                className="flex items-center justify-center px-4 py-1.5 rounded-xl border-2 border-[#8B2F3C] bg-[#8B2F3C] text-white text-xs font-black shadow-xs hover:bg-[#742531] transition active:scale-95 group/btn"
              >
                <span>ADD</span>
                <Plus className="w-3.5 h-3.5 ml-0.5 stroke-[3]" />
              </button>
            )}
            {isCustomisable && (
              <span className="text-[9px] text-[#7A6A63] dark:text-[#B8A8A1] mt-0.5 tracking-tight font-medium">
                Customisable
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
