export type CategoryId =
  | 'all'
  | 'bento'
  | '1-pound'
  | '2-pounds'
  | '3-pounds'
  | 'customize-cake'
  | 'loved-one-cakes'
  | 'birthday-cakes'
  | 'anniversary-cakes'
  | 'photo-cakes'
  | 'pastries'
  | 'cupcakes'
  | 'cookies'
  | 'brownies'
  | 'chocolates'
  | 'snacks'
  | 'custom-cakes';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  itemCount?: number;
  isActive: boolean;
}

export type CakeFlavour =
  | 'Belgian Chocolate'
  | 'Dutch Truffle'
  | 'Red Velvet Cream Cheese'
  | 'Black Forest'
  | 'Vanilla Buttercream'
  | 'Butterscotch Crunch'
  | 'Fresh Mango Passion'
  | 'Blueberry Bliss'
  | 'Nutella Hazelnut'
  | 'Pineapple Delight';

export type CakeSize =
  | 'Bento (Mini)'
  | '1 Pound (0.5 kg)'
  | '2 Pounds (1.0 kg)'
  | '3 Pounds (1.5 kg)'
  | '0.5 kg'
  | '1.0 kg'
  | '1.5 kg'
  | '2.0 kg'
  | '2.5 kg'
  | '3.0 kg'
  | '3.0 kg (2-Tier)'
  | '5.0 kg (3-Tier)'
  | 'Single Piece'
  | 'Pack of 4'
  | 'Pack of 6'
  | 'Box of 12';

export interface Product {
  id: string;
  name: string;
  categorySlug: string;
  price: number;
  discountPrice?: number;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  isEggless: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isSpecialOffer?: boolean;
  availableFlavours?: CakeFlavour[];
  availableSizes?: CakeSize[];
  inStock: boolean;
  prepTimeMinutes: number;
  calories?: number;
  tags: string[];
  ingredients?: string[];
  allergens?: string[];
  storageInstructions?: string;
  stockCount?: number;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  imageUrl?: string;
  status: 'approved' | 'pending' | 'hidden';
}

export interface BakerySettings {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  isOpen: boolean;
  closedNotice: string;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  minimumOrder: number;
  taxPercentage: number;
  estimatedDeliveryTime: string;
  enableCod: boolean;
  enableOnline: boolean;
  enablePayLater: boolean;
  noticeBarEnabled: boolean;
  noticeBarText: string;
  noticeBarColor: 'amber' | 'emerald' | 'rose' | 'indigo';
  popupEnabled: boolean;
  popupTitle: string;
  popupSubtitle: string;
  popupImageUrl: string;
  popupButtonText: string;
  popupButtonAction: 'custom-cake' | 'categories' | 'offers' | 'close';
  razorpayKeyId: string;
  fcmEnabled: boolean;
  mapUrl?: string;
  whatsappNumber?: string;
  upiId?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankBeneficiary?: string;
}

export interface BakeryCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  registeredDate: string;
  savedAddresses: Address[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedFlavour?: CakeFlavour;
  selectedSize?: CakeSize;
  isEggless: boolean;
  cakeMessage?: string;
  customInstructions?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  pincode: string;
  landmark?: string;
  type: 'Home' | 'Work' | 'Other';
  isDefault?: boolean;
}

export type OrderStatus =
  | 'Placed'
  | 'Confirmed'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'Razorpay' | 'Cash on Delivery' | 'UPI' | 'Bank / UPI Transfer';
export type PaymentStatus =
  | 'Pending'
  | 'Paid'
  | 'Failed'
  | 'Refunded'
  | 'Pending Verification'
  | 'Payment Verification Pending'
  | 'Verified'
  | 'Rejected';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  couponCode?: string;
  taxAmount: number;
  finalTotal: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: Address;
  deliveryDate: string;
  deliveryTimeSlot: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  utrTransactionId?: string;
  paymentScreenshot?: string;
  paymentDate?: string;
  paymentRejectionReason?: string;
  status: OrderStatus;
  orderDate: string;
  specialInstructions?: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export type CustomCakeStatus = 'Pending Quote' | 'Approved & Quoted' | 'Converted to Order' | 'Rejected';

export interface CustomCakeRequest {
  id: string;
  requestNumber: string;
  customerName: string;
  customerPhone: string;
  cakeType: 'Fondant Theme' | 'Tiered Wedding' | 'Photo Cake' | 'Buttercream Floral' | 'Pinata Cake' | 'Drip Cake';
  flavour: CakeFlavour;
  weightSize: CakeSize;
  isEggless: boolean;
  cakeMessage: string;
  referenceImageUrl: string;
  specialInstructions: string;
  requiredDeliveryDate: string;
  deliveryTimeSlot: string;
  deliveryAddress: string;
  status: CustomCakeStatus;
  quotedPrice?: number;
  adminNote?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent?: number;
  flatDiscount?: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  description: string;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  badge: string;
  actionUrl?: string;
  isActive: boolean;
  backgroundColor: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  addresses: Address[];
  fcmToken?: string;
  isLoggedIn: boolean;
  isGuest?: boolean;
}

export interface BakeryNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'offer' | 'announcement';
  date: string;
  isRead: boolean;
  orderId?: string;
}
