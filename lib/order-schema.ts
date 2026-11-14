import { z } from 'zod';
import { getDishById, NEIGHBORHOODS, PICKUP_TIME_SLOTS } from './menu-data';
import type { ConfirmedOrderLine, ConfirmedOrderTicket, FulfillmentState, Language } from './types';

export const OrderRequestSchema = z
  .object({
    language: z.enum(['fr', 'ar']),
    items: z
      .array(
        z.object({
          dishId: z.string().min(1),
          portionId: z.string().min(1),
          addonIds: z.array(z.string()),
          note: z.string().max(240).default(''),
          quantity: z.number().int().min(1).max(30),
        })
      )
      .min(1, 'Cart cannot be empty'),
    fulfillment: z.object({
      mode: z.enum(['pickup', 'delivery', 'dine-in']),
      pickupSlot: z.string().default('asap'),
      neighborhood: z.string().default('centre-ville'),
      addressNote: z.string().max(240).default(''),
      tableNumber: z.string().max(12).default(''),
      customerName: z.string().max(80).default(''),
      customerPhone: z.string().max(30).default(''),
      paymentPreference: z.enum(['cash', 'card-on-site']).default('cash'),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.fulfillment.mode === 'pickup') {
      if (!data.fulfillment.customerName.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['fulfillment', 'customerName'],
          message:
            data.language === 'ar'
              ? 'يرجى إدخال الاسم للاستلام من المطعم'
              : 'Veuillez indiquer votre nom pour le retrait',
        });
      }
    }
    if (data.fulfillment.mode === 'delivery') {
      if (!data.fulfillment.customerName.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['fulfillment', 'customerName'],
          message:
            data.language === 'ar'
              ? 'يرجى إدخال الاسم للتوصيل'
              : 'Veuillez indiquer votre nom pour la livraison',
        });
      }
      if (!data.fulfillment.customerPhone.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['fulfillment', 'customerPhone'],
          message:
            data.language === 'ar'
              ? 'يرجى إدخال رقم الهاتف للتوصيل'
              : 'Veuillez indiquer un numéro de téléphone',
        });
      }
      if (!data.fulfillment.addressNote.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['fulfillment', 'addressNote'],
          message:
            data.language === 'ar'
              ? 'يرجى إدخال تفاصيل العنوان للتوصيل'
              : 'Veuillez préciser votre adresse ou bureau',
        });
      }
    }
    if (data.fulfillment.mode === 'dine-in') {
      if (!data.fulfillment.tableNumber.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['fulfillment', 'tableNumber'],
          message:
            data.language === 'ar'
              ? 'يرجى إدخال رقم الطاولة'
              : 'Veuillez indiquer votre numéro de table',
        });
      }
    }
  });

export type ValidatedOrderInput = z.infer<typeof OrderRequestSchema>;

const DEMO_WHATSAPP_NUMBER = '212600000000';

export function buildConfirmedOrderTicket(input: ValidatedOrderInput): ConfirmedOrderTicket {
  const lines: ConfirmedOrderLine[] = [];
  let maxPrep = 8;

  for (const item of input.items) {
    const dish = getDishById(item.dishId);
    if (!dish) {
      throw new Error(`Unknown dish: ${item.dishId}`);
    }
    const portion = dish.portions.find((p) => p.id === item.portionId) ?? dish.portions[0];
    const selectedAddons = dish.addons.filter((a) => item.addonIds.includes(a.id));
    const unitPriceMad = Math.max(
      1,
      dish.basePriceMad + portion.priceDelta + selectedAddons.reduce((sum, a) => sum + a.price, 0)
    );
    const lineTotalMad = unitPriceMad * item.quantity;
    if (dish.prepMinutes > maxPrep) {
      maxPrep = dish.prepMinutes;
    }

    lines.push({
      dishId: dish.id,
      name: dish.name,
      portionLabel: portion.label,
      addonLabels: selectedAddons.map((a) => a.label),
      note: item.note.trim(),
      quantity: item.quantity,
      unitPriceMad,
      lineTotalMad,
    });
  }

  const subtotalMad = lines.reduce((sum, l) => sum + l.lineTotalMad, 0);
  const deliveryFeeMad =
    input.fulfillment.mode === 'delivery'
      ? (NEIGHBORHOODS.find((n) => n.id === input.fulfillment.neighborhood)?.feeMad ?? 15)
      : 0;
  const totalMad = subtotalMad + deliveryFeeMad;
  const estimatedMinutes =
    input.fulfillment.mode === 'delivery' ? maxPrep + 15 : maxPrep + 2;

  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const ticketCode = `ATL-${randomCode}`;

  const whatsappMessage = formatWhatsAppOrderMessage({
    ticketCode,
    language: input.language,
    fulfillment: input.fulfillment,
    lines,
    subtotalMad,
    deliveryFeeMad,
    totalMad,
    estimatedMinutes,
  });

  const whatsappUrl = `https://wa.me/${DEMO_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return {
    ticketCode,
    createdAt: new Date().toISOString(),
    estimatedMinutes,
    language: input.language,
    fulfillment: input.fulfillment,
    lines,
    subtotalMad,
    deliveryFeeMad,
    totalMad,
    whatsappMessage,
    whatsappUrl,
  };
}

export function formatWhatsAppOrderMessage(params: {
  ticketCode: string;
  language: Language;
  fulfillment: FulfillmentState;
  lines: ConfirmedOrderLine[];
  subtotalMad: number;
  deliveryFeeMad: number;
  totalMad: number;
  estimatedMinutes: number;
}): string {
  const { ticketCode, language, fulfillment, lines, subtotalMad, deliveryFeeMad, totalMad, estimatedMinutes } =
    params;

  const isAr = language === 'ar';
  const modeLabel =
    fulfillment.mode === 'pickup'
      ? isAr
        ? 'استلام من المطعم (Click & Collect)'
        : 'À emporter (Click & Collect)'
      : fulfillment.mode === 'delivery'
        ? isAr
          ? 'توصيل محلي'
          : 'Livraison locale'
        : isAr
          ? `خدمة الطاولة QR — طاولة ${fulfillment.tableNumber}`
          : `Sur place (QR) — Table ${fulfillment.tableNumber}`;

  const slotObj = PICKUP_TIME_SLOTS.find((s) => s.id === fulfillment.pickupSlot);
  const hoodObj = NEIGHBORHOODS.find((n) => n.id === fulfillment.neighborhood);
  const paymentLabel =
    fulfillment.paymentPreference === 'card-on-site'
      ? isAr
        ? 'بطاقة بنكية عند الاستلام'
        : 'Carte (TPE sur place)'
      : isAr
        ? 'نقداً عند الاستلام'
        : 'Espèces';

  const header = isAr
    ? `🧾 *طلب جديد — أطلس بوليفارد (${ticketCode})*`
    : `🧾 *NOUVELLE COMMANDE — ATLAS BOULEVARD (${ticketCode})*`;

  const modeDetails: string[] = [
    `${isAr ? 'الخدمة' : 'Mode'}: ${modeLabel}`,
  ];

  if (fulfillment.mode === 'pickup' && slotObj) {
    modeDetails.push(`${isAr ? 'الوقت' : 'Créneau'}: ${slotObj.label[language]}`);
  }
  if (fulfillment.mode === 'delivery') {
    if (hoodObj) {
      modeDetails.push(`${isAr ? 'الحي' : 'Quartier'}: ${hoodObj.label[language]}`);
    }
    if (fulfillment.addressNote) {
      modeDetails.push(`${isAr ? 'العنوان' : 'Adresse'}: ${fulfillment.addressNote}`);
    }
  }
  if (fulfillment.customerName) {
    modeDetails.push(`${isAr ? 'العميل' : 'Client'}: ${fulfillment.customerName}`);
  }
  if (fulfillment.customerPhone) {
    modeDetails.push(`${isAr ? 'الهاتف' : 'Tél'}: ${fulfillment.customerPhone}`);
  }
  modeDetails.push(`${isAr ? 'الدفع' : 'Règlement'}: ${paymentLabel}`);

  const itemRows = lines.map((line, index) => {
    const base = `${index + 1}. ${line.quantity}x ${line.name[language]} (${line.portionLabel[language]}) — ${line.lineTotalMad} MAD`;
    const extras =
      line.addonLabels.length > 0
        ? `\n   + ${line.addonLabels.map((a) => a[language]).join(', ')}`
        : '';
    const note = line.note ? `\n   📝 ${line.note}` : '';
    return `${base}${extras}${note}`;
  });

  const totals = [
    `${isAr ? 'المجموع الفرعي' : 'Sous-total'}: ${subtotalMad} MAD`,
    ...(deliveryFeeMad > 0
      ? [`${isAr ? 'التوصيل' : 'Livraison'}: ${deliveryFeeMad} MAD`]
      : []),
    `*${isAr ? 'المجموع الكلي' : 'TOTAL'}: ${totalMad} MAD*`,
    `⏱ ${isAr ? 'الوقت التقديري' : 'Préparation estimée'}: ~${estimatedMinutes} min`,
  ];

  return [header, '', ...modeDetails, '', isAr ? '*الأصناف:*' : '*Articles:*', ...itemRows, '', ...totals].join(
    '\n'
  );
}
