/* ============================================
   VITA ENERGY — CONFIG & UTILS
   ============================================ */

export const WHATSAPP_PHONE = '5538998561869';

/** Brand name */
export const BRAND_NAME = 'Vita Energy';

export interface WhatsAppOrder {
  size: string;
  base: string;
  accompaniments: string[];
  extras: string[];
  couponCode?: string;
  couponDiscount?: number;
  notes: string;
  deliveryType: string;
  address?: string;
  subtotal?: number;
  total: number;
}

/** Generate WhatsApp message URL from order data */
export function buildWhatsAppUrl(order: WhatsAppOrder, phone = WHATSAPP_PHONE): string {
  const accompaniments = order.accompaniments.length > 0 ? order.accompaniments.join(', ') : 'Nenhum';
  const extras = order.extras.length > 0 ? order.extras.join(', ') : 'Nenhum';
  const subtotalLine = order.subtotal && order.subtotal !== order.total
    ? `\n*Subtotal:* R$ ${order.subtotal.toFixed(2)}`
    : '';
  const couponLine = order.couponCode && order.couponDiscount
    ? `\n*Cupom:* ${order.couponCode} (-R$ ${order.couponDiscount.toFixed(2)})`
    : '';

  const message = `Olá! Quero pedir meu Vita Energy:

*Tamanho:* ${order.size}
*Açaí:* ${order.base}
*Acompanhamentos (Grátis):* ${accompaniments}
*Adicionais Pagos:* ${extras}
*Observações:* ${order.notes || 'Nenhuma'}
*Entrega ou retirada:* ${order.deliveryType}
${order.address ? `*Endereço:* ${order.address}` : ''}${subtotalLine}${couponLine}

*Total:* R$ ${order.total.toFixed(2)}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** Open WhatsApp with order */
export function openWhatsApp(order: WhatsAppOrder, phone?: string): void {
  window.open(buildWhatsAppUrl(order, phone), '_blank');
}
