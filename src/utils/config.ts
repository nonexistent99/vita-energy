/* ============================================
   VITA ENERGY — CONFIG & UTILS
   ============================================ */

export const WHATSAPP_PHONE = '5538998561869';

/** Brand name */
export const BRAND_NAME = 'Vita Energy';

/** Generate WhatsApp message URL from order data */
export function buildWhatsAppUrl(order: {
  size: string;
  base: string;
  accompaniments: string[];
  extras: string[];
  notes: string;
  deliveryType: string;
  address?: string;
  total: number;
}): string {
  const accompaniments = order.accompaniments.length > 0 ? order.accompaniments.join(', ') : 'Nenhum';
  const extras = order.extras.length > 0 ? order.extras.join(', ') : 'Nenhum';

  const message = `Olá! Quero pedir meu Vita Energy:

*Tamanho:* ${order.size}
*Açaí:* ${order.base}
*Acompanhamentos (Grátis):* ${accompaniments}
*Adicionais Pagos:* ${extras}
*Observações:* ${order.notes || 'Nenhuma'}
*Entrega ou retirada:* ${order.deliveryType}
${order.address ? `*Endereço:* ${order.address}` : ''}

*Total:* R$ ${order.total.toFixed(2)}`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/** Open WhatsApp with order */
export function openWhatsApp(order: Parameters<typeof buildWhatsAppUrl>[0]): void {
  window.open(buildWhatsAppUrl(order), '_blank');
}

