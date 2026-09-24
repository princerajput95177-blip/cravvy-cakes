import React from 'react';
import { Order } from '../../types';
import { useBakery } from '../../context/BakeryContext';
import { X, Printer, CheckCircle2, Cake, Sparkles } from 'lucide-react';

interface PrintInvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({
  order,
  onClose,
}) => {
  const { settings } = useBakery();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      id="invoice-modal-overlay"
    >
      <div
        className="bg-white text-neutral-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-scaleUp p-6 space-y-5"
        id="invoice-modal"
      >
        {/* Actions header (hidden on print) */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 print:hidden">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Official Bakery Tax Invoice
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-[#8B2F3C] hover:bg-[#722430] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm border border-[#8B2F3C]/40"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document */}
        <div className="space-y-4 font-mono text-xs" id="printable-bill">
          {/* Bakery Header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-neutral-300">
            <div className="text-lg font-black tracking-wider uppercase font-sans">
              {settings.name || 'CRAVVY CAKES'}
            </div>
            <p className="text-[11px] text-neutral-600">
              {settings.tagline || 'Handcrafted Bakes, Custom 3D Cakes & Confectionery'}
            </p>
            <p className="text-[10px] text-neutral-600 font-bold">
              {settings.address || 'Tanda Road, Jalandhar, Punjab - 144004'}
            </p>
            <p className="text-[10px] text-neutral-500">
              Official WhatsApp & Order Desk: {settings.phone || '+91 96539 30001'}
            </p>
            <p className="text-[10px] text-neutral-500">
              Bank: {settings.bankName || 'Kotak Mahindra Bank'} • A/C: {settings.bankAccountNumber || '4311966246'} • IFSC: {settings.bankIfsc || 'KKBK0004019'} • UPI: {settings.upiId || 'q490463229@ybl'}
            </p>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pb-2 border-b border-dashed border-neutral-300">
            <div>
              <p><strong>Order No:</strong> {order.orderNumber}</p>
              <p><strong>Date:</strong> {order.orderDate}</p>
              <p><strong>Slot:</strong> {order.deliveryDate} ({order.deliveryTimeSlot})</p>
            </div>
            <div className="text-right">
              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Phone:</strong> {order.customerPhone}</p>
              <p><strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})</p>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="text-[10px] pb-2 border-b border-dashed border-neutral-300">
            <strong>Delivery Address:</strong>
            <p className="text-neutral-600">
              {order.deliveryAddress.houseFlat}, {order.deliveryAddress.street}, {order.deliveryAddress.area}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
            </p>
          </div>

          {/* Items Table */}
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 font-bold">
                <th className="py-1">Item Description</th>
                <th className="py-1 text-center">Qty</th>
                <th className="py-1 text-right">Price</th>
                <th className="py-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-1.5 pr-2">
                    <div className="font-bold">{item.product.name}</div>
                    <div className="text-[10px] text-neutral-500">
                      {item.selectedSize} {item.selectedFlavour ? `• ${item.selectedFlavour}` : ''}
                      {item.isEggless ? ' • [Eggless]' : ''}
                    </div>
                    {item.cakeMessage && (
                      <div className="text-[9px] text-[#8B2F3C] font-semibold italic">
                        Message: "{item.cakeMessage}"
                      </div>
                    )}
                  </td>
                  <td className="py-1.5 text-center">{item.quantity}</td>
                  <td className="py-1.5 text-right">₹{item.unitPrice}</td>
                  <td className="py-1.5 text-right font-bold">₹{item.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Calculation Breakdown */}
          <div className="pt-2 border-t-2 border-neutral-900 space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{order.subtotal}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-neutral-600">
                <span>Discount ({order.couponCode || 'Promo'}):</span>
                <span>-₹{order.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Delivery Charges:</span>
              <span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>CGST (2.5%) + SGST (2.5%):</span>
              <span>₹{order.taxAmount}</span>
            </div>
            <div className="flex justify-between text-sm font-black pt-1 border-t border-neutral-900">
              <span>FINAL TOTAL:</span>
              <span>₹{order.finalTotal}</span>
            </div>

            {/* Cash on Delivery Courier Notice */}
            {order.paymentMethod === 'Cash on Delivery' && (
              <div
                className={`mt-2 p-2 rounded border text-center text-xs font-black tracking-wide ${
                  order.paymentStatus === 'Paid'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                    : 'bg-[#8B2F3C]/10 border-[#8B2F3C] text-[#8B2F3C]'
                }`}
              >
                {order.paymentStatus === 'Paid'
                  ? '✓ CASH ON DELIVERY SETTLED & VERIFIED'
                  : `⚠️ COLLECT CASH ON DELIVERY: ₹${order.finalTotal} (CASH / UPI)`}
              </div>
            )}
          </div>

          {/* Footer message */}
          <div className="text-center pt-4 pb-2 border-t border-dashed border-neutral-300 text-[10px] text-neutral-500 space-y-1">
            <p className="font-bold text-neutral-800">
              Thank you for celebrating with Cravvy Cakes! 🎂
            </p>
            <p>For custom cake inquiries & catering: +91 96539 30001</p>
            <p>Location: Tanda Road, Jalandhar (Punjab) • maps.google.com/maps?q=31.3353649,75.5736301</p>
          </div>
        </div>
      </div>
    </div>
  );
};
