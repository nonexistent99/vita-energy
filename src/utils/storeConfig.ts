export type DiscountType = 'percent' | 'fixed';

export interface ProductSize {
  id: string;
  label: string;
  ml: string;
  price: number;
  active: boolean;
}

export interface ProductBase {
  id: string;
  label: string;
  emoji: string;
  active: boolean;
}

export interface Accompaniment {
  id: string;
  name: string;
  emoji: string;
  active: boolean;
}

export interface PaidExtra {
  id: string;
  label: string;
  price: number;
  emoji: string;
  active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: DiscountType;
  value: number;
  minOrder: number;
  active: boolean;
}

export interface PromotionBanner {
  id: string;
  badge: string;
  title: string;
  description: string;
  ctaLabel: string;
  targetId: string;
  active: boolean;
}

export interface BusinessSettings {
  brandName: string;
  whatsappPhone: string;
  instagramUrl: string;
  freeAccompanimentsLimit: number;
}

export interface StoreConfig {
  business: BusinessSettings;
  sizes: ProductSize[];
  bases: ProductBase[];
  accompaniments: Accompaniment[];
  paidExtras: PaidExtra[];
  coupons: Coupon[];
  banners: PromotionBanner[];
}

export const STORE_CONFIG_KEY = 'vita-energy-admin-config-v1';
export const STORE_CONFIG_EVENT = 'vita-energy-config-change';

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  business: {
    brandName: 'Vita Energy',
    whatsappPhone: '5538998561869',
    instagramUrl: 'https://instagram.com/vitaenergy',
    freeAccompanimentsLimit: 3,
  },
  sizes: [
    { id: 'size-300', label: 'Pequeno', ml: '300ml', price: 16.9, active: true },
    { id: 'size-500', label: 'Grande', ml: '500ml', price: 21.9, active: true },
  ],
  bases: [
    { id: 'base-tradicional', label: 'Açaí Tradicional', emoji: '🟣', active: true },
    { id: 'base-zero', label: 'Açaí Zero', emoji: '⚪', active: true },
  ],
  accompaniments: [
    { id: 'acc-leite-po', name: 'Leite em Pó', emoji: '🥛', active: true },
    { id: 'acc-amendoim', name: 'Amendoim', emoji: '🥜', active: true },
    { id: 'acc-granola', name: 'Granola', emoji: '🌾', active: true },
    { id: 'acc-leite-condensado', name: 'Leite Condensado', emoji: '🍯', active: true },
    { id: 'acc-oreo', name: 'Oreo', emoji: '🍪', active: true },
    { id: 'acc-ovomaltine', name: 'Ovomaltine', emoji: '🍫', active: true },
    { id: 'acc-mel', name: 'Mel', emoji: '🍯', active: true },
    { id: 'acc-banana', name: 'Banana', emoji: '🍌', active: true },
    { id: 'acc-morango', name: 'Morango', emoji: '🍓', active: true },
    { id: 'acc-abacaxi', name: 'Abacaxi', emoji: '🍍', active: true },
    { id: 'acc-manga', name: 'Manga', emoji: '🥭', active: true },
    { id: 'acc-mousse-maracuja', name: 'Mousse de Maracujá', emoji: '💛', active: true },
    { id: 'acc-mousse-morango', name: 'Mousse de Morango', emoji: '💗', active: true },
  ],
  paidExtras: [
    { id: 'extra-nutella', label: 'Nutella', price: 2.5, emoji: '🍫', active: true },
    { id: 'extra-whey', label: 'Whey Protein', price: 3.5, emoji: '💪', active: true },
  ],
  coupons: [
    {
      id: 'coupon-vita10',
      code: 'VITA10',
      description: '10% de desconto na primeira compra',
      type: 'percent',
      value: 10,
      minOrder: 0,
      active: true,
    },
  ],
  banners: [
    {
      id: 'banner-promocao',
      badge: 'Promoção da semana',
      title: 'Use VITA10 e ganhe 10% OFF',
      description: 'Cupom ativo para pedidos feitos pelo site.',
      ctaLabel: 'Montar pedido',
      targetId: 'pedido',
      active: true,
    },
  ],
};

type PartialStoreConfig = Partial<StoreConfig>;

export function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizeStoreConfig(raw?: PartialStoreConfig | null): StoreConfig {
  return {
    ...DEFAULT_STORE_CONFIG,
    ...raw,
    business: {
      ...DEFAULT_STORE_CONFIG.business,
      ...raw?.business,
    },
    sizes: (raw?.sizes ?? DEFAULT_STORE_CONFIG.sizes).map((item) => ({
      ...item,
      price: Number(item.price) || 0,
      active: item.active ?? true,
    })),
    bases: (raw?.bases ?? DEFAULT_STORE_CONFIG.bases).map((item) => ({
      ...item,
      active: item.active ?? true,
    })),
    accompaniments: (raw?.accompaniments ?? DEFAULT_STORE_CONFIG.accompaniments).map((item) => ({
      ...item,
      active: item.active ?? true,
    })),
    paidExtras: (raw?.paidExtras ?? DEFAULT_STORE_CONFIG.paidExtras).map((item) => ({
      ...item,
      price: Number(item.price) || 0,
      active: item.active ?? true,
    })),
    coupons: (raw?.coupons ?? DEFAULT_STORE_CONFIG.coupons).map((item) => ({
      ...item,
      code: item.code.toUpperCase().trim(),
      value: Number(item.value) || 0,
      minOrder: Number(item.minOrder) || 0,
      active: item.active ?? true,
    })),
    banners: (raw?.banners ?? DEFAULT_STORE_CONFIG.banners).map((item) => ({
      ...item,
      active: item.active ?? true,
    })),
  };
}

export function getStoreConfig(): StoreConfig {
  if (typeof window === 'undefined') return DEFAULT_STORE_CONFIG;

  try {
    const stored = window.localStorage.getItem(STORE_CONFIG_KEY);
    if (!stored) return DEFAULT_STORE_CONFIG;
    return normalizeStoreConfig(JSON.parse(stored) as PartialStoreConfig);
  } catch {
    return DEFAULT_STORE_CONFIG;
  }
}

export function saveStoreConfig(config: StoreConfig): StoreConfig {
  const normalized = normalizeStoreConfig(config);

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORE_CONFIG_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent<StoreConfig>(STORE_CONFIG_EVENT, { detail: normalized }));
  }

  return normalized;
}

export function clearStoreConfig(): StoreConfig {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORE_CONFIG_KEY);
    window.dispatchEvent(new CustomEvent<StoreConfig>(STORE_CONFIG_EVENT, { detail: DEFAULT_STORE_CONFIG }));
  }

  return DEFAULT_STORE_CONFIG;
}

export function findActiveCoupon(coupons: Coupon[], code: string): Coupon | null {
  const normalizedCode = code.trim().toUpperCase();
  if (!normalizedCode) return null;
  return coupons.find((coupon) => coupon.active && coupon.code.trim().toUpperCase() === normalizedCode) ?? null;
}

export function calculateCouponDiscount(coupon: Coupon | null, subtotal: number): number {
  if (!coupon || subtotal < coupon.minOrder) return 0;

  const discount = coupon.type === 'percent'
    ? subtotal * (Math.min(Math.max(coupon.value, 0), 100) / 100)
    : coupon.value;

  return Math.min(Math.max(discount, 0), subtotal);
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
