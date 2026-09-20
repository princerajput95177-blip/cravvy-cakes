import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { CheckoutModal } from './CheckoutModal';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  Sparkles,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cake,
} from 'lucide-react';

export const CartScreen: React.FC = () => {
  const {
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    coupons,
    cartSubtotal,
    cartDeliveryCharge,
    cartDiscount,
    cartTax,
    cartTotal,
    setCustomerTab,
    setActiveTrackingOrderId,
    showToast,
  } = useBakery();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleOrderSuccess = (orderId: string) => {
    setIsCheckoutOpen(false);
    setActiveTrackingOrderId(orderId);
    setCustomerTab('orders');
  };

  if (cart.length === 0) {
    return (
      <div className="p-8 text-center my-auto py-20 space-y-4 max-w-sm mx-auto" id="empty-cart-view">
        <div className="w-20 h-20 rounded-full bg-[#FFF8F0] dark:bg-[#30221D] text-[#8B2F3C] border border-[#E8DACD] dark:border-[#46332B] flex items-center justify-center mx-auto shadow-xs">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-xl font-bold text-[#2B1A15] dark:text-[#FAF4EE]">
          Your Bakery Basket is Empty
        </h2>
        <p className="text-xs text-[#7A6A63] dark:text-[#B8A8A1] leading-relaxed">
          Looks like you haven't added any delicious cakes, brownies or artisan pastries to your cart yet.
        </p>
        <button
          id="btn-empty-cart-browse"
          onClick={() => setCustomerTab('home')}
          className="px-6 py-3 rounded-2xl bg-[#8B2F3C] hover:bg-[#742531] text-white text-xs font-bold shadow-md transition-transform active:scale-95 border border-[#C9A227]/30"
        >
          Explore Fresh Bakes
        </button>
      </div>
    );
  }

  // Free delivery progress calculation (Free above ₹500)
  const freeDeliveryThreshold = 500;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  return (
    <div className="p-4 sm:p-5 space-y-5 pb-24 max-w-xl mx-auto" id="cart-screen">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8DACD] dark:border-[#46332B]">
        <div>
          <h1 className="text-xl font-black text-[#2B1A15] dark:text-[#FAF4EE] flex items-center gap-2">
            <span>My Bakery Basket</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#8B2F3C]/10 dark:bg-[#30221D] text-[#8B2F3C] dark:text-[#C9A227] font-bold border border-[#8B2F3C]/20">
              {cart.length} {cart.length === 1 ? 'item' : 'items'}
            </span>
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-[#8B2F3C] hover:underline font-semibold"
        >
          Clear Cart
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-[#3B2118] dark:text-[#FAF4EE]">
            {amountToFreeDelivery === 0
              ? '🎉 You unlocked FREE Delivery!'
              : `Add ₹${amountToFreeDelivery} more for FREE Delivery!`}
          </span>
          <span className="text-[#C9A227] font-black">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD]/50 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#C9A227] to-[#b89422] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="space-y-3">
        {cart.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-2xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] shadow-xs flex items-start gap-3"
          >
            {/* Product Image */}
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FFF8F0] dark:bg-[#261B16] flex-shrink-0 border border-[#E8DACD]/50">
              <img
                src={item.product.image}
                alt={item.product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {item.isEggless && (
                <span
                  title="Eggless"
                  className="absolute bottom-1 left-1 w-3.5 h-3.5 bg-white rounded-xs border border-emerald-600 flex items-center justify-center shadow-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                </span>
              )}
            </div>

            {/* Item Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold text-[#2B1A15] dark:text-[#FAF4EE] truncate">
                {item.product.name}
              </h3>

              {/* Selected Options Tags */}
              <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-[#7A6A63]">
                {item.selectedSize && (
                  <span className="px-1.5 py-0.2 rounded bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD] text-[#3B2118] dark:text-[#E8DACD] font-medium">
                    {item.selectedSize}
                  </span>
                )}
                {item.selectedFlavour && (
                  <span className="px-1.5 py-0.2 rounded bg-[#8B2F3C]/10 text-[#8B2F3C] dark:text-[#C9A227] font-medium">
                    {item.selectedFlavour}
                  </span>
                )}
                {item.isEggless && (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-600/30">
                    Eggless
                  </span>
                )}
              </div>

              {/* Message on Cake if any */}
              {item.cakeMessage && (
                <p className="text-[10px] text-[#8B2F3C] dark:text-[#C9A227] italic mt-0.5 truncate">
                  ✍️ Inscription: "{item.cakeMessage}"
                </p>
              )}

              {/* Unit Price and Quantity Control */}
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-sm font-black text-[#3B2118] dark:text-[#FAF4EE]">
                  ₹{item.totalPrice}
                </span>

                <div className="flex items-center gap-2">
                  <div className="flex items-center border-2 border-[#8B2F3C] rounded-xl overflow-hidden bg-white dark:bg-[#30221D]">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-[#8B2F3C]/10 text-[#8B2F3C] dark:text-[#FAF4EE]"
                    >
                      <Minus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                    <span className="px-2 text-xs font-black text-[#8B2F3C] dark:text-[#FAF4EE] min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-[#8B2F3C]/10 text-[#8B2F3C] dark:text-[#FAF4EE]"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      toggleWishlist(item.product.id);
                      removeFromCart(item.id);
                      showToast(`Moved "${item.product.name}" to Wishlist`);
                    }}
                    className="text-[10px] text-[#8B2F3C] dark:text-[#C9A227] hover:underline font-semibold"
                  >
                    Save for later
                  </button>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 rounded-md text-[#7A6A63] hover:text-[#8B2F3C] transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Complete Your Celebration Add-ons */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#C9A227]" />
            <span className="text-xs font-black text-[#2B1A15] dark:text-[#FAF4EE] uppercase tracking-wider">
              Complete Your Celebration
            </span>
          </div>
          <span className="text-[10px] text-[#8B2F3C] dark:text-[#C9A227] font-bold bg-[#8B2F3C]/10 dark:bg-[#261B16] px-2 py-0.5 rounded-full border border-[#8B2F3C]/20">
            Recommended Add-ons
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            {
              name: 'Gold Metallic Candles',
              price: 49,
              image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=300&q=80',
              category: 'accessories',
            },
            {
              name: 'Golden Birthday Topper',
              price: 99,
              image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=300&q=80',
              category: 'accessories',
            },
            {
              name: 'Sparkling Pyro Fountain',
              price: 79,
              image: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=300&q=80',
              category: 'accessories',
            },
            {
              name: 'Belgian Ganache Dip',
              price: 89,
              image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=300&q=80',
              category: 'accessories',
            },
            {
              name: 'Luxury Greeting Card',
              price: 49,
              image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=300&q=80',
              category: 'accessories',
            },
            {
              name: 'Wooden Knife & Server',
              price: 69,
              image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80',
              category: 'accessories',
            },
          ].map((addon, idx) => (
            <div
              key={idx}
              className="p-2 rounded-2xl bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD] dark:border-[#46332B] flex flex-col justify-between shadow-2xs text-center"
            >
              <div className="w-full h-16 rounded-xl overflow-hidden mb-1.5 bg-white dark:bg-[#30221D]">
                <img
                  src={addon.image}
                  alt={addon.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-[11px] font-bold text-[#2B1A15] dark:text-[#FAF4EE] line-clamp-1">
                {addon.name}
              </h4>
              <span className="text-[11px] font-black text-[#3B2118] dark:text-[#FAF4EE] mt-0.5">
                ₹{addon.price}
              </span>
              <button
                type="button"
                onClick={() => {
                  addToCart({
                    id: `addon-${idx}-${Date.now()}`,
                    name: addon.name,
                    categorySlug: 'accessories',
                    price: addon.price,
                    description: `Celebration add-on: ${addon.name}`,
                    image: addon.image,
                    rating: 4.9,
                    reviewCount: 30,
                    isEggless: true,
                    inStock: true,
                    prepTimeMinutes: 5,
                    tags: ['Add-on', 'Celebration'],
                  });
                  showToast(`Added ${addon.name} (+₹${addon.price})`);
                }}
                className="mt-1.5 py-1 px-2 rounded-lg bg-[#8B2F3C] hover:bg-[#742531] text-white font-black text-[10px] transition shadow-2xs"
              >
                + Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Coupon Application Box */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] space-y-2 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#2B1A15] dark:text-[#FAF4EE] flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#8B2F3C] dark:text-[#C9A227]" />
            <span>Bakery Coupons & Promo Code</span>
          </span>
        </div>

        {appliedCoupon ? (
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                  Code '{appliedCoupon.code}' Applied!
                </div>
                <div className="text-[10px] text-emerald-600">
                  {appliedCoupon.description}
                </div>
              </div>
            </div>
            <button
              onClick={removeCoupon}
              className="text-xs font-bold text-[#8B2F3C] hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon (e.g. CRAVVY20)"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              className="flex-1 px-3 py-2 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-[#FFF8F0] dark:bg-[#261B16] text-xs font-bold text-[#2B1A15] dark:text-[#FAF4EE] uppercase focus:ring-2 focus:ring-[#8B2F3C] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#8B2F3C] hover:bg-[#742531] text-white text-xs font-bold shadow-xs transition"
            >
              Apply
            </button>
          </form>
        )}

        {couponError && (
          <p className="text-[11px] text-[#8B2F3C] font-medium">{couponError}</p>
        )}

        {/* Quick Promo Pills */}
        {!appliedCoupon && coupons.filter((cp) => cp.isActive).length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto pt-1 no-scrollbar">
            {coupons
              .filter((cp) => cp.isActive)
              .map((cp) => (
                <button
                  key={cp.id}
                  type="button"
                  onClick={() => {
                    const res = applyCoupon(cp.code);
                    if (!res.success) setCouponError(res.message);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#FFF8F0] dark:bg-[#261B16] border border-dashed border-[#C9A227] text-[10px] font-bold text-[#8B2F3C] dark:text-[#C9A227] flex-shrink-0 hover:bg-[#FDF2E4]"
                >
                  🏷️ {cp.code}
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Bill Details Breakdown */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] space-y-2 text-xs shadow-xs">
        <h3 className="font-bold text-[#2B1A15] dark:text-[#FAF4EE] pb-1 border-b border-[#E8DACD] dark:border-[#46332B]">
          Bill Details
        </h3>

        <div className="flex justify-between text-[#7A6A63] dark:text-[#B8A8A1]">
          <span>Items Subtotal:</span>
          <span className="font-bold text-[#2B1A15] dark:text-[#FAF4EE]">₹{cartSubtotal}</span>
        </div>

        {cartDiscount > 0 && (
          <div className="flex justify-between text-[#8B2F3C] dark:text-[#C9A227] font-bold">
            <span>Coupon Discount ({appliedCoupon?.code}):</span>
            <span>-₹{cartDiscount}</span>
          </div>
        )}

        <div className="flex justify-between text-[#7A6A63] dark:text-[#B8A8A1]">
          <span>Delivery Partner Fee:</span>
          <span>
            {cartDeliveryCharge === 0 ? (
              <span className="text-emerald-600 font-bold">FREE</span>
            ) : (
              `₹${cartDeliveryCharge}`
            )}
          </span>
        </div>

        <div className="flex justify-between text-[#7A6A63] dark:text-[#B8A8A1]">
          <span>Taxes & GST (5%):</span>
          <span>₹{cartTax}</span>
        </div>

        <div className="pt-2 border-t border-[#E8DACD] dark:border-[#46332B] flex justify-between text-base font-black text-[#2B1A15] dark:text-[#FAF4EE]">
          <span>To Pay:</span>
          <span className="text-[#3B2118] dark:text-[#FAF4EE]">₹{cartTotal}</span>
        </div>
      </div>

      {/* Checkout Floating Bar */}
      <div className="sticky bottom-16 sm:bottom-0 p-3 bg-white/95 dark:bg-[#30221D]/95 backdrop-blur-md rounded-3xl border border-[#E8DACD] dark:border-[#46332B] shadow-xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-[#7A6A63] dark:text-[#B8A8A1] uppercase font-bold block">
            Final Total
          </span>
          <span className="text-lg font-black text-[#3B2118] dark:text-[#FAF4EE]">
            ₹{cartTotal}
          </span>
        </div>

        <button
          id="btn-cart-proceed-checkout"
          onClick={() => setIsCheckoutOpen(true)}
          className="flex-1 py-3 px-5 rounded-2xl bg-[#8B2F3C] hover:bg-[#742531] text-white font-extrabold text-xs sm:text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 border border-[#C9A227]/30"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          onClose={() => setIsCheckoutOpen(false)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
};
