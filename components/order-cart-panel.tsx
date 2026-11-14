'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  Bike,
  Clock,
  MessageCircle,
  Minus,
  Plus,
  QrCode,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { getCopy } from '@/lib/i18n';
import { getDishById, NEIGHBORHOODS, PICKUP_TIME_SLOTS } from '@/lib/menu-data';
import type { FulfillmentMode } from '@/lib/types';

interface OrderCartPanelProps {
  lockedTableNumber?: string;
  onOrderSuccess?: () => void;
}

export function OrderCartPanel({ lockedTableNumber, onOrderSuccess }: OrderCartPanelProps) {
  const router = useRouter();
  const {
    lang,
    cart,
    updateQuantity,
    removeItem,
    clearCart,
    fulfillment,
    setFulfillmentMode,
    updateFulfillment,
    subtotalMad,
    deliveryFeeMad,
    totalMad,
    estimatedPrepMinutes,
    saveConfirmedTicket,
    setCartDrawerOpen,
  } = useApp();

  const t = getCopy(lang);
  const [submittingMode, setSubmittingMode] = useState<'whatsapp' | 'ticket' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeMode: FulfillmentMode = lockedTableNumber ? 'dine-in' : fulfillment.mode;
  const effectiveTable = lockedTableNumber ?? fulfillment.tableNumber;

  const modes: { id: FulfillmentMode; label: string; icon: typeof ShoppingBag }[] = [
    { id: 'pickup', label: t.modePickup, icon: ShoppingBag },
    { id: 'delivery', label: t.modeDelivery, icon: Bike },
    { id: 'dine-in', label: t.modeDineIn, icon: QrCode },
  ];

  const handleSubmitOrder = async (channel: 'whatsapp' | 'ticket') => {
    if (cart.length === 0) return;
    setErrorMsg(null);
    setSubmittingMode(channel);

    try {
      const payload = {
        language: lang,
        items: cart.map((c) => ({
          dishId: c.dishId,
          portionId: c.portionId,
          addonIds: c.addonIds,
          note: c.note,
          quantity: c.quantity,
        })),
        fulfillment: {
          ...fulfillment,
          mode: activeMode,
          tableNumber: effectiveTable,
        },
      };

      const res = await fetch('/api/orders/format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        const firstFieldErr = data?.fieldErrors
          ? (Object.values(data.fieldErrors)[0] as string)
          : null;
        setErrorMsg(firstFieldErr || t.validationErrorGeneric);
        setSubmittingMode(null);
        return;
      }

      saveConfirmedTicket(data.ticket);
      clearCart();
      setCartDrawerOpen(false);
      onOrderSuccess?.();
      router.push(
        `/order-confirmation?ticket=${encodeURIComponent(data.ticket.ticketCode)}&channel=${channel}`
      );
    } catch {
      setErrorMsg(t.validationErrorGeneric);
    } finally {
      setSubmittingMode(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-3.5">
        <div className="flex items-center gap-2.5">
          <h2 className="font-display text-xl font-semibold text-[#1E1B18]">{t.cartTitle}</h2>
          {cart.length > 0 && (
            <span className="font-mono-num text-xs font-medium text-[#635B52]">
              · {estimatedPrepMinutes} {t.minutesShort}
            </span>
          )}
        </div>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-medium text-[#635B52] hover:text-[#C85A32] transition-colors"
          >
            {t.clearCart}
          </button>
        )}
      </div>

      {/* 3-Mode Fulfillment Switcher */}
      {!lockedTableNumber ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#635B52]">
            {t.fulfillmentLabel}
          </p>
          <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-[#EFE9DF] p-1">
            {modes.map((m) => {
              const Icon = m.icon;
              const isActive = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setFulfillmentMode(m.id);
                    setErrorMsg(null);
                  }}
                  className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#1E1B18] shadow-xs'
                      : 'text-[#635B52] hover:text-[#1E1B18]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-[#C85A32]" aria-hidden="true" />
                  <span className="truncate">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-[#4A6B53]/30 bg-[#4A6B53]/10 px-3.5 py-2.5 text-xs font-semibold text-[#2E4836]">
          <span className="flex items-center gap-2">
            <QrCode className="h-4 w-4 text-[#4A6B53]" aria-hidden="true" />
            <span>
              {t.modeDineIn} · {t.tableTitlePrefix} {lockedTableNumber}
            </span>
          </span>
        </div>
      )}

      {/* Cart Items */}
      {cart.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#DFD6C9] bg-[#FAF8F5] px-4 py-8 text-center">
          <ShoppingBag className="mx-auto mb-2.5 h-7 w-7 text-[#9A9084]" aria-hidden="true" />
          <p className="text-sm font-semibold text-[#1E1B18]">{t.cartEmptyTitle}</p>
          <p className="mt-1 text-xs text-[#635B52]">{t.cartEmptyDesc}</p>
        </div>
      ) : (
        <ul className="divide-y divide-[#F0EAE0]">
          {cart.map((item) => {
            const dish = getDishById(item.dishId);
            if (!dish) return null;
            const portion =
              dish.portions.find((p) => p.id === item.portionId) ?? dish.portions[0];
            const selectedAddons = dish.addons.filter((a) => item.addonIds.includes(a.id));
            const unitPrice = Math.max(
              1,
              dish.basePriceMad +
                (portion?.priceDelta ?? 0) +
                selectedAddons.reduce((s, a) => s + a.price, 0)
            );
            const lineTotal = unitPrice * item.quantity;

            return (
              <li key={item.cartItemId} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#1E1B18] leading-snug">
                      {dish.name[lang]}
                    </p>
                    <p className="mt-0.5 text-xs text-[#635B52]">
                      {portion?.label[lang]}
                      {selectedAddons.length > 0 && (
                        <> · +{selectedAddons.map((a) => a.label[lang]).join(', ')}</>
                      )}
                    </p>
                    {item.note && (
                      <p className="mt-1 text-xs italic text-[#8A7E71]">
                        “{item.note}”
                      </p>
                    )}
                  </div>

                  <span className="font-mono-num text-sm font-semibold text-[#1E1B18] shrink-0">
                    {lineTotal} {t.currency}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-lg border border-[#E6DFD5] bg-[#FAF8F5]">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartItemId, -1)}
                      className="flex h-9 w-9 items-center justify-center text-[#1E1B18] hover:text-[#C85A32]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <span className="font-mono-num min-w-[1.5rem] text-center text-xs font-semibold text-[#1E1B18]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartItemId, 1)}
                      className="flex h-9 w-9 items-center justify-center text-[#1E1B18] hover:text-[#C85A32]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.cartItemId)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#9A9084] hover:bg-[#FAF8F5] hover:text-[#B93829] transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Conditional Fulfillment Inputs */}
      {cart.length > 0 && (
        <div className="space-y-3 border-t border-[#E6DFD5] pt-4">
          {activeMode === 'pickup' && (
            <div>
              <label
                htmlFor="pickup-slot"
                className="mb-1 block text-xs font-semibold text-[#635B52]"
              >
                {t.pickupSlotLabel}
              </label>
              <select
                id="pickup-slot"
                value={fulfillment.pickupSlot}
                onChange={(e) => updateFulfillment({ pickupSlot: e.target.value })}
                className="min-h-[44px] w-full rounded-xl border border-[#E6DFD5] bg-white px-3 text-sm text-[#1E1B18] focus:border-[#C85A32] focus:outline-none"
              >
                {PICKUP_TIME_SLOTS.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.label[lang]}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeMode === 'delivery' && (
            <>
              <div>
                <label
                  htmlFor="delivery-neighborhood"
                  className="mb-1 block text-xs font-semibold text-[#635B52]"
                >
                  {t.neighborhoodLabel}
                </label>
                <select
                  id="delivery-neighborhood"
                  value={fulfillment.neighborhood}
                  onChange={(e) => updateFulfillment({ neighborhood: e.target.value })}
                  className="min-h-[44px] w-full rounded-xl border border-[#E6DFD5] bg-white px-3 text-sm text-[#1E1B18] focus:border-[#C85A32] focus:outline-none"
                >
                  {NEIGHBORHOODS.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label[lang]} (+{n.feeMad} {t.currency})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="delivery-address"
                  className="mb-1 block text-xs font-semibold text-[#635B52]"
                >
                  {t.addressNoteLabel}
                </label>
                <input
                  id="delivery-address"
                  type="text"
                  value={fulfillment.addressNote}
                  onChange={(e) => updateFulfillment({ addressNote: e.target.value })}
                  placeholder={t.addressNotePlaceholder}
                  className="min-h-[44px] w-full rounded-xl border border-[#E6DFD5] bg-white px-3 text-sm text-[#1E1B18] placeholder:text-[#9A9084] focus:border-[#C85A32] focus:outline-none"
                />
              </div>
            </>
          )}

          {activeMode === 'dine-in' && !lockedTableNumber && (
            <div>
              <label
                htmlFor="table-number"
                className="mb-1 block text-xs font-semibold text-[#635B52]"
              >
                {t.tableNumberLabel}
              </label>
              <input
                id="table-number"
                type="text"
                inputMode="numeric"
                value={fulfillment.tableNumber}
                onChange={(e) => updateFulfillment({ tableNumber: e.target.value })}
                placeholder={t.tableNumberPlaceholder}
                className="min-h-[44px] w-full rounded-xl border border-[#E6DFD5] bg-white px-3 text-sm text-[#1E1B18] placeholder:text-[#9A9084] focus:border-[#C85A32] focus:outline-none"
              />
            </div>
          )}

          {activeMode !== 'dine-in' && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="customer-name"
                  className="mb-1 block text-xs font-semibold text-[#635B52]"
                >
                  {t.customerNameLabel}
                </label>
                <input
                  id="customer-name"
                  type="text"
                  value={fulfillment.customerName}
                  onChange={(e) => updateFulfillment({ customerName: e.target.value })}
                  placeholder={t.customerNamePlaceholder}
                  className="min-h-[44px] w-full rounded-xl border border-[#E6DFD5] bg-white px-3 text-sm text-[#1E1B18] placeholder:text-[#9A9084] focus:border-[#C85A32] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="customer-phone"
                  className="mb-1 block text-xs font-semibold text-[#635B52]"
                >
                  {t.customerPhoneLabel}
                </label>
                <input
                  id="customer-phone"
                  type="tel"
                  value={fulfillment.customerPhone}
                  onChange={(e) => updateFulfillment({ customerPhone: e.target.value })}
                  placeholder={t.customerPhonePlaceholder}
                  className="min-h-[44px] w-full rounded-xl border border-[#E6DFD5] bg-white px-3 text-sm text-[#1E1B18] placeholder:text-[#9A9084] focus:border-[#C85A32] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Payment Preference */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-xs font-semibold text-[#635B52]">{t.paymentLabel}</span>
            <div className="flex items-center gap-1 rounded-lg bg-[#EFE9DF] p-0.5 text-xs">
              <button
                type="button"
                onClick={() => updateFulfillment({ paymentPreference: 'cash' })}
                className={`rounded-md px-2.5 py-1.5 font-medium transition-colors ${
                  fulfillment.paymentPreference === 'cash'
                    ? 'bg-white text-[#1E1B18]'
                    : 'text-[#635B52]'
                }`}
              >
                {t.paymentCash}
              </button>
              <button
                type="button"
                onClick={() => updateFulfillment({ paymentPreference: 'card-on-site' })}
                className={`rounded-md px-2.5 py-1.5 font-medium transition-colors ${
                  fulfillment.paymentPreference === 'card-on-site'
                    ? 'bg-white text-[#1E1B18]'
                    : 'text-[#635B52]'
                }`}
              >
                {t.paymentCard}
              </button>
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-1.5 border-t border-[#E6DFD5] pt-3 text-sm">
            <div className="flex items-center justify-between text-[#635B52]">
              <span>{t.subtotal}</span>
              <span className="font-mono-num">
                {subtotalMad} {t.currency}
              </span>
            </div>
            {activeMode === 'delivery' && (
              <div className="flex items-center justify-between text-[#635B52]">
                <span>{t.deliveryFee}</span>
                <span className="font-mono-num">
                  {deliveryFeeMad} {t.currency}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1 text-base font-bold text-[#1E1B18]">
              <span>{t.total}</span>
              <span className="font-mono-num">
                {totalMad} {t.currency}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#4A6B53]">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {t.prepTimePrefix} ~{estimatedPrepMinutes} {t.minutesShort}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-xl border border-[#B93829]/30 bg-[#FDF2F0] px-3 py-2.5 text-xs font-medium text-[#9B2C1F]"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            {lockedTableNumber ? (
              <button
                type="button"
                disabled={submittingMode !== null}
                onClick={() => handleSubmitOrder('ticket')}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#C85A32] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#B34B26] disabled:opacity-60"
              >
                <QrCode className="h-4 w-4" aria-hidden="true" />
                <span>
                  {submittingMode
                    ? t.submitting
                    : `${t.sendToTable} ${lockedTableNumber} · ${totalMad} ${t.currency}`}
                </span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  disabled={submittingMode !== null}
                  onClick={() => handleSubmitOrder('whatsapp')}
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#C85A32] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#B34B26] disabled:opacity-60"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {submittingMode === 'whatsapp' ? t.submitting : t.submitWhatsApp}
                  </span>
                </button>
                <button
                  type="button"
                  disabled={submittingMode !== null}
                  onClick={() => handleSubmitOrder('ticket')}
                  className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-[#E6DFD5] bg-white px-4 text-xs font-semibold text-[#1E1B18] transition-colors hover:border-[#1E1B18] disabled:opacity-60"
                >
                  {submittingMode === 'ticket' ? t.submitting : t.submitInstantTicket}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
