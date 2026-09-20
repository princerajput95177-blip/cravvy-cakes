import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Product, CakeFlavour, CakeSize } from '../../types';
import {
  X,
  Star,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Sparkles,
  Heart,
  Calendar,
  Info,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ThumbsUp,
  Award,
} from 'lucide-react';

interface ProductDetailContentProps {
  product: Product;
  onClose: () => void;
}

const ProductDetailContent: React.FC<ProductDetailContentProps> = ({
  product,
  onClose,
}) => {
  const {
    addToCart,
    setCustomerTab,
    wishlist,
    toggleWishlist,
    reviews,
    addReview,
    user,
    showToast,
  } = useBakery();

  const isCake =
    product.categorySlug.includes('cake') ||
    product.categorySlug === 'custom-cakes' ||
    Boolean(product.availableFlavours?.length);

  // Gallery images (product image + celebration angles)
  const galleryImages = [
    product.image,
    'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=700&q=80',
  ];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [quantity, setQuantity] = useState(1);
  const [selectedFlavour, setSelectedFlavour] = useState<CakeFlavour>(
    product.availableFlavours?.[0] || 'Belgian Chocolate'
  );
  const [selectedSize, setSelectedSize] = useState<CakeSize>(
    product.availableSizes?.[0] || (isCake ? '1.0 kg' : 'Single Piece')
  );
  const [isEggless, setIsEggless] = useState<boolean>(product.isEggless);
  const [cakeMessage, setCakeMessage] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');

  // Delivery Date & Slot
  const [deliveryDate, setDeliveryDate] = useState<'Today' | 'Tomorrow' | 'Custom'>('Today');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<string>('Standard (within 45 mins)');

  // Collapsible Accordions
  const [expandedSection, setExpandedSection] = useState<'details' | 'ingredients' | 'reviews'>('details');

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Wishlist state
  const isWishlisted = wishlist.includes(product.id);

  // Product reviews
  const productReviews = reviews.filter(
    (r) => r.productId === product.id || r.productName === product.name
  );

  // Dynamic price calculation based on size weight
  const basePrice = product.discountPrice || product.price;
  let sizeMultiplier = 1;
  if (selectedSize.includes('0.5 kg')) sizeMultiplier = 0.6;
  else if (selectedSize.includes('1.0 kg')) sizeMultiplier = 1.0;
  else if (selectedSize.includes('1.5 kg')) sizeMultiplier = 1.5;
  else if (selectedSize.includes('2.0 kg')) sizeMultiplier = 2.0;
  else if (selectedSize.includes('2.5 kg')) sizeMultiplier = 2.5;
  else if (selectedSize.includes('3.0 kg')) sizeMultiplier = 3.0;

  const currentUnitPrice = Math.round(basePrice * sizeMultiplier);
  const originalUnitPrice = Math.round(product.price * sizeMultiplier);
  const currentTotalPrice = currentUnitPrice * quantity;
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  // Standard ingredients & allergens if not specified
  const ingredientsList = product.ingredients || [
    'Pure Belgian Dark Couverture Cocoa (54%)',
    'Organic Refined Wheat Flour',
    'Farm-Fresh Dairy Butter & Heavy Cream',
    'Madagascar Bourbon Vanilla Pods',
    'Demerara Raw Cane Sugar',
  ];

  const allergensList = product.allergens || [
    'Milk & Dairy Products',
    'Gluten (Wheat)',
    'Prepared in an environment handling Tree Nuts (Almonds, Walnuts)',
  ];

  const storageInfo =
    product.storageInstructions ||
    'Keep refrigerated between 4°C - 6°C in an airtight container. Allow to rest at room temperature for 10-15 minutes prior to slicing for peak velvety texture. Best consumed within 48 hours.';

  const handleAddToCart = () => {
    addToCart(product, {
      quantity,
      flavour: selectedFlavour,
      size: selectedSize,
      isEggless,
      cakeMessage: cakeMessage.trim() || undefined,
      instructions: instructions.trim() || undefined,
    });
    showToast(`Added ${quantity}x "${product.name}" to cart!`);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, {
      quantity,
      flavour: selectedFlavour,
      size: selectedSize,
      isEggless,
      cakeMessage: cakeMessage.trim() || undefined,
      instructions: instructions.trim() || undefined,
    });
    onClose();
    setCustomerTab('cart');
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showToast('Please write a short review.');
      return;
    }
    addReview({
      productId: product.id,
      productName: product.name,
      customerName: user.name || 'CRAVVY Patron',
      rating: newRating,
      comment: newComment.trim(),
    });
    setNewComment('');
    setShowReviewForm(false);
  };

  // Available Sizes to select
  const availableSizesList: CakeSize[] = product.availableSizes?.length
    ? product.availableSizes
    : isCake
    ? ['0.5 kg', '1.0 kg', '1.5 kg', '2.0 kg', '2.5 kg', '3.0 kg']
    : ['Single Piece'];

  // Available Flavours to select
  const availableFlavoursList: CakeFlavour[] = product.availableFlavours?.length
    ? product.availableFlavours
    : [
        'Belgian Chocolate',
        'Dutch Truffle',
        'Red Velvet Cream Cheese',
        'Butterscotch Crunch',
        'Fresh Mango Passion',
      ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2B1A15]/75 backdrop-blur-xs animate-fadeIn"
      id="product-detail-modal-overlay"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#30221D] rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#E8DACD] dark:border-[#46332B] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
        id="product-detail-modal"
      >
        {/* Gallery / Hero Image */}
        <div className="relative h-64 sm:h-72 w-full bg-neutral-900 flex-shrink-0">
          <img
            src={galleryImages[selectedImageIndex]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-opacity duration-300"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('unsplash.com')) {
                target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80';
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-black/20 to-black/35 pointer-events-none"></div>

          {/* Close button */}
          <button
            id="btn-close-product-detail"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition shadow-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Wishlist button */}
          <button
            id="btn-wishlist-product-detail"
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-3.5 right-14 w-9 h-9 rounded-full bg-white/90 dark:bg-[#30221D]/90 text-[#3B2118] dark:text-white flex items-center justify-center backdrop-blur-md shadow-md hover:bg-rose-50 transition cursor-pointer"
            title="Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted
                  ? 'fill-[#8B2F3C] text-[#8B2F3C]'
                  : 'text-[#7A6A63] dark:text-[#FAF4EE]'
              }`}
            />
          </button>

          {/* Veg / Eggless & Discount Badges */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 shadow-md ${
                isEggless
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#8B2F3C] text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white"></span>
              {isEggless ? '100% Eggless Pure Veg' : 'Contains Egg'}
            </span>

            {discountPercent > 0 && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-[#8B2F3C] text-white shadow-md border border-[#C9A227]/40">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition shadow-md ${
                  selectedImageIndex === idx
                    ? 'border-[#C9A227] scale-105'
                    : 'border-white/60 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Title & Ratings on Image */}
          <div className="absolute bottom-3 left-3 right-32 text-white pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#C9A227] text-[#2B1A15] text-xs font-black shadow-xs">
                <Star className="w-3 h-3 fill-[#2B1A15]" />
                <span>{product.rating}</span>
              </div>
              <span className="text-xs text-neutral-200 font-medium">
                ({product.reviewCount || 12} reviews)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black leading-tight drop-shadow-md line-clamp-1">
              {product.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Price & Timing Banner */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#E8DACD] dark:border-[#46332B]">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#3B2118] dark:text-[#C9A227]">
                  ₹{currentUnitPrice}
                </span>
                {product.discountPrice && (
                  <span className="text-sm text-[#7A6A63] line-through">
                    ₹{originalUnitPrice}
                  </span>
                )}
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                  Inclusive of all taxes
                </span>
              </div>
              <span className="text-[11px] text-[#7A6A63]">
                Price tailored for {selectedSize}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#3B2118] dark:text-[#FAF4EE] bg-[#FFF8F0] dark:bg-[#261B16] px-3 py-1.5 rounded-xl border border-[#E8DACD] dark:border-[#46332B]">
              <Clock className="w-4 h-4 text-[#8B2F3C] dark:text-[#C9A227]" />
              <span>Fresh Bake: ~{product.prepTimeMinutes} mins</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs sm:text-sm text-[#7A6A63] dark:text-[#B8A8A1] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* 100% Pure Veg Guarantee Banner */}
          <div className="bg-[#FFF8F0] dark:bg-[#261B16] p-3 rounded-2xl border border-[#E8DACD] dark:border-[#46332B] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-xs border-2 border-emerald-700 flex items-center justify-center bg-white flex-shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span>
              </span>
              <div>
                <div className="text-xs font-black text-[#2B1A15] dark:text-[#FAF4EE] flex items-center gap-1.5">
                  <span>100% Pure Veg & Eggless</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-700 text-white font-bold">
                    Kitchen Certified
                  </span>
                </div>
                <div className="text-[10px] text-[#7A6A63] dark:text-[#B8A8A1]">
                  Baked exclusively in our dedicated vegetarian, egg-free boutique kitchen
                </div>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-xs">
              Eggless ✓
            </div>
          </div>

          {/* Cake Size Selection (0.5 kg, 1 kg, 1.5 kg, 2 kg, 2.5 kg, 3 kg) */}
          {isCake && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#7A6A63] dark:text-[#B8A8A1]">
                  Select Cake Weight / Size
                </span>
                <span className="text-xs font-bold text-[#8B2F3C] dark:text-[#C9A227]">
                  {selectedSize}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {availableSizesList.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                      selectedSize === size
                        ? 'border-[#8B2F3C] bg-[#8B2F3C] text-white font-bold shadow-xs scale-[1.02]'
                        : 'border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#261B16] text-[#3B2118] dark:text-[#FAF4EE] hover:border-[#C9A227]'
                    }`}
                  >
                    <span>{size}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Flavour Selector */}
          {isCake && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#7A6A63] dark:text-[#B8A8A1]">
                  Select Flavour
                </span>
                <span className="text-xs font-bold text-[#8B2F3C] dark:text-[#C9A227]">
                  {selectedFlavour}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableFlavoursList.map((flavour) => (
                  <button
                    key={flavour}
                    type="button"
                    onClick={() => setSelectedFlavour(flavour)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                      selectedFlavour === flavour
                        ? 'border-[#8B2F3C] bg-[#8B2F3C] text-white font-bold shadow-xs'
                        : 'border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#261B16] text-[#3B2118] dark:text-[#FAF4EE] hover:border-[#C9A227]'
                    }`}
                  >
                    {flavour}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Cake Message (Piping) */}
          {isCake && (
            <div className="space-y-1">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#7A6A63] dark:text-[#B8A8A1]">
                Piping Message on Cake
              </label>
              <input
                type="text"
                maxLength={45}
                placeholder="e.g. Happy 25th Anniversary Mom & Dad! ❤️"
                value={cakeMessage}
                onChange={(e) => setCakeMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-[#FFF8F0]/40 dark:bg-[#261B16] text-[#2B1A15] dark:text-[#FAF4EE] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2F3C]"
              />
              <div className="flex items-center justify-between text-[10px] text-[#7A6A63] px-1">
                <span>Free personalized chocolate calligraphy inscription</span>
                <span>{cakeMessage.length}/45</span>
              </div>
            </div>
          )}

          {/* Delivery Date & Time Selector */}
          <div className="p-3 rounded-2xl bg-[#FFF8F0]/60 dark:bg-[#261B16] border border-[#E8DACD] dark:border-[#46332B] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2B1A15] dark:text-[#FAF4EE] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#8B2F3C] dark:text-[#C9A227]" />
                <span>Delivery Schedule</span>
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                Express Slots Available
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['Today', 'Tomorrow', 'Custom'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDeliveryDate(d)}
                  className={`py-1.5 px-2 rounded-xl font-bold text-center border transition cursor-pointer ${
                    deliveryDate === d
                      ? 'bg-[#8B2F3C] text-white border-[#8B2F3C] shadow-xs'
                      : 'bg-white dark:bg-[#30221D] text-[#3B2118] dark:text-[#FAF4EE] border-[#E8DACD] dark:border-[#46332B]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <select
              value={deliveryTimeSlot}
              onChange={(e) => setDeliveryTimeSlot(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border border-[#E8DACD] dark:border-[#46332B] bg-white dark:bg-[#30221D] text-[#2B1A15] dark:text-[#FAF4EE] focus:outline-none focus:ring-2 focus:ring-[#8B2F3C] font-medium"
            >
              <option value="Standard (within 45 mins)">Standard Express (~45 mins)</option>
              <option value="2:00 PM - 5:00 PM">Afternoon Slot (2:00 PM - 5:00 PM)</option>
              <option value="6:00 PM - 9:00 PM">Evening Celebration (6:00 PM - 9:00 PM)</option>
              <option value="11:30 PM - 12:15 AM">Midnight Surprise (11:30 PM - 12:15 AM)</option>
            </select>
          </div>

          {/* Accordion Tabs for Ingredients, Allergens, Storage & Reviews */}
          <div className="space-y-2 pt-2 border-t border-[#E8DACD] dark:border-[#46332B]">
            {/* Ingredients & Allergens Accordion */}
            <div className="rounded-2xl border border-[#E8DACD] dark:border-[#46332B] overflow-hidden bg-white dark:bg-[#30221D]">
              <button
                type="button"
                onClick={() =>
                  setExpandedSection(expandedSection === 'ingredients' ? 'details' : 'ingredients')
                }
                className="w-full p-3 flex items-center justify-between text-left text-xs font-bold text-[#2B1A15] dark:text-[#FAF4EE] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#8B2F3C] dark:text-[#C9A227]" />
                  <span>Ingredients, Allergens & Storage</span>
                </div>
                {expandedSection === 'ingredients' ? (
                  <ChevronUp className="w-4 h-4 text-[#7A6A63]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#7A6A63]" />
                )}
              </button>

              {expandedSection === 'ingredients' && (
                <div className="p-3 pt-0 text-xs space-y-2.5 border-t border-[#E8DACD]/60 dark:border-[#46332B] bg-[#FFF8F0]/40 dark:bg-[#261B16]/50">
                  <div>
                    <h5 className="font-extrabold text-[#2B1A15] dark:text-[#FAF4EE] mb-1">
                      Artisan Ingredients:
                    </h5>
                    <ul className="list-disc list-inside text-[#7A6A63] dark:text-[#B8A8A1] space-y-0.5 text-[11px]">
                      {ingredientsList.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-extrabold text-rose-800 dark:text-rose-400 mb-1">
                      Allergen Declaration:
                    </h5>
                    <p className="text-[#7A6A63] dark:text-[#B8A8A1] text-[11px]">
                      {allergensList.join(' • ')}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-extrabold text-[#2B1A15] dark:text-[#FAF4EE] mb-1">
                      Storage Instructions:
                    </h5>
                    <p className="text-[#7A6A63] dark:text-[#B8A8A1] text-[11px] leading-relaxed">
                      {storageInfo}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Reviews Accordion */}
            <div className="rounded-2xl border border-[#E8DACD] dark:border-[#46332B] overflow-hidden bg-white dark:bg-[#30221D]">
              <button
                type="button"
                onClick={() =>
                  setExpandedSection(expandedSection === 'reviews' ? 'details' : 'reviews')
                }
                className="w-full p-3 flex items-center justify-between text-left text-xs font-bold text-[#2B1A15] dark:text-[#FAF4EE] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#8B2F3C] dark:text-[#C9A227]" />
                  <span>Customer Reviews ({productReviews.length})</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5 text-[#C9A227] font-extrabold text-xs">
                    <Star className="w-3 h-3 fill-[#C9A227]" />
                    <span>{product.rating}</span>
                  </div>
                  {expandedSection === 'reviews' ? (
                    <ChevronUp className="w-4 h-4 text-[#7A6A63] ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#7A6A63] ml-1" />
                  )}
                </div>
              </button>

              {expandedSection === 'reviews' && (
                <div className="p-3 pt-0 space-y-3 border-t border-[#E8DACD]/60 dark:border-[#46332B] bg-[#FFF8F0]/40 dark:bg-[#261B16]/50">
                  {/* Reviews List */}
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {productReviews.length > 0 ? (
                      productReviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-2.5 rounded-xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#2B1A15] dark:text-[#FAF4EE]">
                              {rev.customerName}
                            </span>
                            <div className="flex items-center gap-0.5 text-[#C9A227]">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-2.5 h-2.5 ${
                                    i < rev.rating ? 'fill-[#C9A227]' : 'text-neutral-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-[11px] text-[#7A6A63] dark:text-[#B8A8A1]">
                            {rev.comment}
                          </p>
                          <span className="text-[9px] text-[#7A6A63] block">{rev.date}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#7A6A63] text-center py-2">
                        No reviews yet for this product. Be the first to share your experience!
                      </p>
                    )}
                  </div>

                  {/* Add Review Toggle */}
                  {!showReviewForm ? (
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(true)}
                      className="w-full py-2 px-3 rounded-xl bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD] dark:border-[#46332B] text-[#8B2F3C] dark:text-[#C9A227] font-bold text-xs hover:bg-[#FDF2E4] transition cursor-pointer"
                    >
                      + Write a Review
                    </button>
                  ) : (
                    <form onSubmit={handleAddReviewSubmit} className="space-y-2 p-2.5 rounded-xl bg-white dark:bg-[#30221D] border border-[#C9A227]/40">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2B1A15] dark:text-[#FAF4EE]">
                          Your Rating:
                        </span>
                        <div className="flex items-center gap-1 text-[#C9A227]">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className="focus:outline-none cursor-pointer"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  star <= newRating ? 'fill-[#C9A227]' : 'text-neutral-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        rows={2}
                        placeholder="Share details about the texture, moistness, delivery experience..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full p-2 text-xs rounded-lg border border-[#E8DACD] dark:border-[#46332B] bg-[#FFF8F0]/30 dark:bg-[#261B16] text-[#2B1A15] dark:text-[#FAF4EE] focus:outline-none focus:ring-2 focus:ring-[#8B2F3C]"
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-2.5 py-1 text-xs text-[#7A6A63] font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-[#8B2F3C] hover:bg-[#742531] text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                        >
                          Submit Review
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF8F0]/60 dark:bg-[#261B16] border border-[#E8DACD] dark:border-[#46332B]">
            <span className="text-xs sm:text-sm font-bold text-[#2B1A15] dark:text-[#FAF4EE]">
              Quantity
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] flex items-center justify-center text-[#3B2118] dark:text-[#FAF4EE] hover:bg-[#FFF8F0] transition shadow-2xs cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm sm:text-base font-extrabold text-[#2B1A15] dark:text-[#FAF4EE] min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] flex items-center justify-center text-[#3B2118] dark:text-[#FAF4EE] hover:bg-[#FFF8F0] transition shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-[#FFF8F0] dark:bg-[#261B16] border-t border-[#E8DACD] dark:border-[#46332B] flex items-center gap-3">
          <div className="flex flex-col min-w-[85px]">
            <span className="text-[10px] text-[#7A6A63] uppercase font-bold tracking-wider">
              Total Amount
            </span>
            <span className="text-xl font-black text-[#3B2118] dark:text-[#C9A227]">
              ₹{currentTotalPrice}
            </span>
          </div>

          <div className="flex-1 flex gap-2">
            <button
              id="btn-modal-add-to-cart"
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] hover:border-[#C9A227] text-[#3B2118] dark:text-[#FAF4EE] font-extrabold text-xs sm:text-sm transition shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#8B2F3C]" />
              <span>Add to Cart</span>
            </button>

            <button
              id="btn-modal-buy-now"
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#8B2F3C] hover:bg-[#742531] text-white font-black text-xs sm:text-sm shadow-md shadow-[#8B2F3C]/30 border border-[#C9A227]/40 transition active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C9A227]" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct } = useBakery();

  if (!selectedProduct) return null;

  return (
    <ProductDetailContent
      key={selectedProduct.id}
      product={selectedProduct}
      onClose={() => setSelectedProduct(null)}
    />
  );
};
