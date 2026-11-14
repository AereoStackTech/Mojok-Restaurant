import type { StaticImageData } from 'next/image';

export type Language = 'fr' | 'ar';

export type FulfillmentMode = 'pickup' | 'delivery' | 'dine-in';

export type CategoryId =
  | 'all'
  | 'daily-specials'
  | 'coffee-morning'
  | 'pizzas-pasta'
  | 'seafood-grill'
  | 'burgers-tacos'
  | 'desserts-drinks';

export interface LocalizedText {
  fr: string;
  ar: string;
}

export interface PortionOption {
  id: string;
  label: LocalizedText;
  priceDelta: number;
}

export interface AddonOption {
  id: string;
  label: LocalizedText;
  price: number;
}

export interface MenuItem {
  id: string;
  slug: string;
  category: Exclude<CategoryId, 'all'>;
  name: LocalizedText;
  shortDesc: LocalizedText;
  fullDesc: LocalizedText;
  basePriceMad: number;
  prepMinutes: number;
  image: StaticImageData;
  isDailySpecial?: boolean;
  specialDay?: LocalizedText;
  isTableQuickReorder?: boolean;
  dietaryTag?: LocalizedText;
  portions: PortionOption[];
  addons: AddonOption[];
}

export interface CartItem {
  cartItemId: string;
  dishId: string;
  slug: string;
  portionId: string;
  addonIds: string[];
  note: string;
  quantity: number;
}

export interface FulfillmentState {
  mode: FulfillmentMode;
  pickupSlot: string;
  neighborhood: string;
  addressNote: string;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  paymentPreference: 'cash' | 'card-on-site';
}

export interface ConfirmedOrderLine {
  dishId: string;
  name: LocalizedText;
  portionLabel: LocalizedText;
  addonLabels: LocalizedText[];
  note: string;
  quantity: number;
  unitPriceMad: number;
  lineTotalMad: number;
}

export interface ConfirmedOrderTicket {
  ticketCode: string;
  createdAt: string;
  estimatedMinutes: number;
  language: Language;
  fulfillment: FulfillmentState;
  lines: ConfirmedOrderLine[];
  subtotalMad: number;
  deliveryFeeMad: number;
  totalMad: number;
  whatsappMessage: string;
  whatsappUrl: string;
}

export interface TableServiceRequest {
  id: string;
  tableNumber: string;
  type: 'bill-cash' | 'bill-card' | 'water' | 'cutlery' | 'server';
  label: LocalizedText;
  createdAt: string;
}
