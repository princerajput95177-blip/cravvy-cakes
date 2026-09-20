import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Order } from '../../types';
import {
  Package,
  Calendar,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Cake,
  CheckCircle2,
} from 'lucide-react';

interface OrderHistoryViewProps {
  onTrackOrder: (orderId: string) => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ onTrackOrder }) => {
  const {
    orders,
    customCakeRequests,
    addToCart,
    setCustomerTab,
    setCustomCakeModalOpen,
    convertCustomCakeToOrder,
    acceptCustomCakeQuote,
    rejectCustomCakeQuote,
    showToast,
  } = useBakery();

  const [activeTab, setActiveTab] = useState<'orders' | 'custom-cakes'>('orders');

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.product, {
        quantity: item.quantity,
        flavour: item.selectedFlavour,
        size: item.selectedSize,
        isEggless: item.isEggless,
        cakeMessage: item.cakeMessage,
      });
    });
    setCustomerTab('cart');
    showToast('Items added to cart for quick re-order!');
  };

  return (
    <div className="p-4 sm:p-5 space-y-4 pb-24 max-w-xl mx-auto" id="order-history-screen">
      {/* Top Header */}
      <div className="pb-2 border-b border-[#E8DACD] dark:border-[#46332B] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#2B1A15] dark:text-[#FAF4EE] font-serif">
            My Bakery Activity
          </h1>
          <p className="text-xs text-[#7A6A63]">
            Track active deliveries and view previous celebration cakes
          </p>
        </div>
      </div>

      {/* Switcher Tab */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD] dark:border-[#46332B] rounded-2xl">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#8B2F3C] text-white shadow-xs'
              : 'text-[#7A6A63] dark:text-[#B8A8A1]'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('custom-cakes')}
          className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'custom-cakes'
              ? 'bg-[#8B2F3C] text-white shadow-xs'
              : 'text-[#7A6A63] dark:text-[#B8A8A1]'
          }`}
        >
          <Cake className="w-3.5 h-3.5" />
          <span>Custom Cake Quotes ({customCakeRequests.length})</span>
        </button>
      </div>

      {/* Orders Tab Body */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="p-8 text-center my-8 space-y-3">
              <Package className="w-10 h-10 text-[#7A6A63] mx-auto" />
              <h3 className="text-sm font-bold text-[#2B1A15] dark:text-[#FAF4EE]">
                No orders yet
              </h3>
              <button
                onClick={() => setCustomerTab('home')}
                className="px-4 py-2 rounded-xl bg-[#8B2F3C] hover:bg-[#742531] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] shadow-xs space-y-3"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#E8DACD] dark:border-[#46332B] text-xs">
                  <div>
                    <span className="font-extrabold text-[#2B1A15] dark:text-[#FAF4EE] text-sm">
                      {order.orderNumber}
                    </span>
                    <span className="text-[#7A6A63] block text-[10px]">
                      {order.orderDate}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-[#8B2F3C]/10 text-[#8B2F3C] dark:bg-[#8B2F3C]/30 dark:text-[#C9A227] border border-[#C9A227]/30 animate-pulse'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items preview */}
                <div className="space-y-1.5 text-xs text-[#3B2118] dark:text-[#FAF4EE]">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="truncate pr-2 text-[#7A6A63] dark:text-[#B8A8A1]">
                        {item.quantity}x {item.product.name}
                        {item.selectedSize ? ` (${item.selectedSize})` : ''}
                      </span>
                      <span className="font-bold flex-shrink-0 text-[#2B1A15] dark:text-[#FAF4EE]">₹{item.totalPrice}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Total and Actions */}
                <div className="pt-2 border-t border-[#E8DACD] dark:border-[#46332B] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#7A6A63] block">Total Paid</span>
                    <span className="text-sm font-black text-[#2B1A15] dark:text-[#C9A227]">
                      ₹{order.finalTotal}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3 py-1.5 rounded-xl bg-[#FFF8F0] dark:bg-[#261B16] hover:bg-[#FDF2E4] border border-[#E8DACD] dark:border-[#46332B] text-[#3B2118] dark:text-[#FAF4EE] text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#8B2F3C] dark:text-[#C9A227]" />
                      <span>Reorder</span>
                    </button>

                    <button
                      onClick={() => onTrackOrder(order.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#8B2F3C] hover:bg-[#742531] text-white text-xs font-bold shadow-xs flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>Track</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C9A227]" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Custom Cake Requests Tab */}
      {activeTab === 'custom-cakes' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button
              onClick={() => setCustomCakeModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#8B2F3C] hover:bg-[#742531] text-white text-xs font-bold flex items-center gap-1 shadow-xs border border-[#C9A227]/40 cursor-pointer"
            >
              <Cake className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>+ New Custom Cake Request</span>
            </button>
          </div>

          {customCakeRequests.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-3xl bg-white dark:bg-[#30221D] border border-[#E8DACD] dark:border-[#46332B] shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-neutral-900 border border-[#C9A227]/40 flex-shrink-0">
                    <img
                      src={req.referenceImageUrl}
                      alt="Ref"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#2B1A15] dark:text-[#FAF4EE]">
                        {req.requestNumber}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD] dark:border-[#46332B] text-[#8B2F3C] dark:text-[#C9A227] font-bold">
                        {req.cakeType}
                      </span>
                    </div>
                    <p className="text-xs text-[#7A6A63] mt-0.5">
                      {req.weightSize} • {req.flavour}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    req.status === 'Approved & Quoted'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : req.status === 'Converted to Order'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-[#8B2F3C]/10 text-[#8B2F3C] dark:bg-[#8B2F3C]/30 dark:text-[#C9A227] border border-[#C9A227]/30'
                  }`}
                >
                  {req.status}
                </span>
              </div>

              {/* Inscription & Date */}
              <div className="text-xs text-[#3B2118] dark:text-[#FAF4EE] bg-[#FFF8F0]/50 dark:bg-[#261B16] border border-[#E8DACD]/60 dark:border-[#46332B] p-2.5 rounded-2xl space-y-1">
                {req.cakeMessage && (
                  <div>
                    <strong className="text-[#7A6A63]">Message:</strong> "{req.cakeMessage}"
                  </div>
                )}
                <div>
                  <strong className="text-[#7A6A63]">Required:</strong> {req.requiredDeliveryDate} ({req.deliveryTimeSlot})
                </div>
                {req.adminNote && (
                  <div className="text-[#8B2F3C] dark:text-[#C9A227] font-medium">
                    <strong>Bakery Chef Note:</strong> {req.adminNote}
                  </div>
                )}
              </div>

              {/* Quotation & Convert CTA */}
              {req.status === 'Approved & Quoted' && (
                <div className="p-3 rounded-2xl bg-[#FFF8F0] dark:bg-[#261B16] border border-[#C9A227] space-y-2">
                  <div className="flex items-center gap-1.5 text-[#8B2F3C] dark:text-[#C9A227] font-extrabold text-xs">
                    <Sparkles className="w-4 h-4 text-[#C9A227]" />
                    <span>Your custom cake quote is ready.</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#7A6A63]">
                      Artisan Chef Quoted Price:
                    </span>
                    <span className="text-base font-black text-[#8B2F3C] dark:text-[#C9A227]">
                      ₹{req.quotedPrice}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => acceptCustomCakeQuote(req.id)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-xs flex items-center justify-center gap-1 transition active:scale-95 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ACCEPT QUOTE</span>
                    </button>
                    <button
                      onClick={() => rejectCustomCakeQuote(req.id)}
                      className="py-2 px-3 rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-[#3B2118] dark:text-neutral-200 text-xs font-bold transition cursor-pointer"
                    >
                      REJECT QUOTE
                    </button>
                  </div>
                </div>
              )}

              {req.status !== 'Approved & Quoted' && (
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-[#7A6A63] block">Chef Quoted Price</span>
                    <span className="text-base font-black text-[#8B2F3C] dark:text-[#C9A227]">
                      {req.quotedPrice ? `₹${req.quotedPrice}` : 'Quotation In Review'}
                    </span>
                  </div>

                  {req.status === 'Converted to Order' && (
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Order Confirmed & Baking</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
