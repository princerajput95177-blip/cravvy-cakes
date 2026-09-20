import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Bell, X, Check, Sparkles, Package, Tag, ArrowRight } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    markNotificationRead,
    setActiveTrackingOrderId,
    setCustomerTab,
  } = useBakery();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#2B1A15]/60 backdrop-blur-xs animate-fadeIn"
      id="notification-drawer-overlay"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-[#30221D] h-full flex flex-col shadow-2xl border-l border-[#E8DACD] dark:border-[#46332B] animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
        id="notification-drawer"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E8DACD] dark:border-[#46332B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFF8F0] dark:bg-[#261B16] border border-[#E8DACD] dark:border-[#46332B] text-[#8B2F3C] dark:text-[#C9A227] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#2B1A15] dark:text-[#FAF4EE]">
                Boutique Notifications
              </h3>
              <p className="text-[11px] text-[#7A6A63]">Live bake status & exclusive offers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#FFF8F0] dark:hover:bg-[#261B16] text-[#7A6A63] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#7A6A63]">
              No new notifications
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.orderId) {
                    setActiveTrackingOrderId(notif.orderId);
                    setCustomerTab('orders');
                    onClose();
                  }
                }}
                className={`p-3 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                  notif.isRead
                    ? 'bg-white dark:bg-[#261B16]/50 border-[#E8DACD]/60 dark:border-[#46332B]'
                    : 'bg-[#FFF8F0] dark:bg-[#261B16] border-[#E8DACD] dark:border-[#46332B] shadow-xs'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-[#8B2F3C] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                  {notif.type === 'order' ? (
                    <Package className="w-3.5 h-3.5 text-[#C9A227]" />
                  ) : notif.type === 'offer' ? (
                    <Tag className="w-3.5 h-3.5 text-[#C9A227]" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                  )}
                </div>

                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[#2B1A15] dark:text-[#FAF4EE] truncate">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-[#7A6A63]">{notif.date}</span>
                  </div>
                  <p className="text-[#7A6A63] dark:text-[#B8A8A1] text-[11px] mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                  {notif.orderId && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8B2F3C] dark:text-[#C9A227] mt-1">
                      <span>View Live Order</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
