import { Order } from '../types';

export const BAKERY_WHATSAPP_NUMBER = '9653930001';
export const BAKERY_MAPS_URL = 'https://maps.google.com/maps?q=31.3353649%2C75.5736301&z=17&hl=en';
export const BAKERY_ADDRESS_TEXT = 'Tanda Road, Jalandhar, Punjab - 144004';

export function formatOrderWhatsAppMessage(order: Order, bakeryName: string = 'KUKU BAKERY / CRAVVY CAKES'): string {
  const itemsList = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.product?.name || 'Cake Item'}* (x${item.quantity}) - ₹${item.totalPrice || item.unitPrice * item.quantity}${
          item.selectedSize ? ` [Size: ${item.selectedSize}]` : ''
        }${item.cakeMessage ? `\n   ↳ Cake Message: "${item.cakeMessage}"` : ''}`
    )
    .join('\n');

  const fullAddress = `${order.deliveryAddress.houseFlat}, ${order.deliveryAddress.street}, ${order.deliveryAddress.area}, ${order.deliveryAddress.city} - ${order.deliveryAddress.pincode}${
    order.deliveryAddress.landmark ? ` (Landmark: ${order.deliveryAddress.landmark})` : ''
  }`;

  return `🎂 *NEW ONLINE ORDER RECEIVED*
━━━━━━━━━━━━━━━━━━━━
🏬 *Bakery:* ${bakeryName}
🆔 *Order ID:* #${order.orderNumber}
👤 *Customer Name:* ${order.customerName}
📞 *Customer Phone:* ${order.customerPhone}
📅 *Delivery Date:* ${order.deliveryDate}
⏰ *Time Slot:* ${order.deliveryTimeSlot}

📍 *Delivery Address (Jalandhar):*
${fullAddress}
${order.specialInstructions ? `\n📝 *Kitchen Note:* ${order.specialInstructions}` : ''}

🛒 *Ordered Items:*
${itemsList}

💰 *Payment Breakdown:*
• Subtotal: ₹${order.subtotal}
• Delivery Charge: ₹${order.deliveryCharge}${order.deliveryCharge === 0 ? ' (FREE Delivery)' : ''}
${order.discountAmount ? `• Discount: -₹${order.discountAmount} (${order.couponCode || 'Promo'})\n` : ''}• GST/Tax: ₹${order.taxAmount}
*Total Payable: ₹${order.finalTotal}*
💳 *Payment Mode:* ${order.paymentMethod}
Status: *${order.paymentStatus}*
${order.utrTransactionId ? `📌 *UPI/UTR Ref ID:* ${order.utrTransactionId}\n` : ''}━━━━━━━━━━━━━━━━━━━━
⚡ _Order submitted via Online Delivery App to Bakery Desk_`;
}

export function getBakeryWhatsAppUrl(order: Order, phone: string = BAKERY_WHATSAPP_NUMBER): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const destination = cleanPhone.startsWith('91') && cleanPhone.length === 12 ? cleanPhone : `91${cleanPhone}`;
  const text = formatOrderWhatsAppMessage(order);
  return `https://api.whatsapp.com/send?phone=${destination}&text=${encodeURIComponent(text)}`;
}

export function openWhatsAppOrderSummary(order: Order, phone: string = BAKERY_WHATSAPP_NUMBER): void {
  try {
    const url = getBakeryWhatsAppUrl(order, phone);
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (e) {
    console.warn('Unable to open WhatsApp automatically:', e);
  }
}
