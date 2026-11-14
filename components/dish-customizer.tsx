'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Check, Clock, Minus, Plus, Utensils } from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { getCopy } from '@/lib/i18n';
import type { MenuItem } from '@/lib/types';

interface DishCustomizerProps {
  dish: MenuItem;
  onAdded?: () => void;
  compact?: boolean;
}

export function DishCustomizer({ dish, onAdded, compact = false }: DishCustomizerProps) {
  const { lang, addToCart } = useApp();
  const t = getCopy(lang);

  const [portionId, setPortionId] = useState<string>(dish.portions[0]?.id ?? 'default');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const unitPriceMad = useMemo(() => {
    const portion = dish.portions.find((p) => p.id === portionId) ?? dish.portions[0];
    const addonsSum = dish.addons
      .filter((a) => selectedAddons.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0);
    return Math.max(1, dish.basePriceMad + (portion?.priceDelta ?? 0) + addonsSum);
  }, [dish, portionId, selectedAddons]);

  const totalPriceMad = unitPriceMad * quantity;

  const handleConfirm = () => {
    addToCart({
      dish,
      portionId,
      addonIds: selectedAddons,
      note,
      quantity,
    });
    onAdded?.();
  };

  return (
    <div className={compact ? 'space-y-5' : 'grid gap-8 lg:grid-cols-12 lg:items-start'}>
      <div className={compact ? '' : 'lg:col-span-6 lg:sticky lg:top-8'}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#E6DFD5] bg-[#EAE3D8]">
          {!imgError ? (
            <Image
              src={dish.image}
              alt={dish.name[lang]}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#635B52]">
              <Utensils className="h-8 w-8 text-[#C85A32]" aria-hidden="true" />
              <span className="text-sm font-medium">{dish.name[lang]}</span>
            </div>
          )}
        </div>
      </div>

      <div className={compact ? 'space-y-5' : 'lg:col-span-6 space-y-6'}>
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-[#635B52]">
            <span className="inline-flex items-center gap-1 font-mono-num">
              <Clock className="h-3.5 w-3.5 text-[#4A6B53]" aria-hidden="true" />
              {t.prepTimePrefix} {dish.prepMinutes} {t.minutesShort}
            </span>
            {(dish.specialDay || dish.dietaryTag) && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#4A6B53]">
                  {dish.specialDay ? dish.specialDay[lang] : dish.dietaryTag?.[lang]}
                </span>
              </>
            )}
          </div>

          <h2 className="font-display text-2xl font-semibold leading-tight text-[#1E1B18] sm:text-3xl">
            {dish.name[lang]}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#635B52]">
            {dish.fullDesc[lang]}
          </p>
        </div>

        {/* Portion selector */}
        {dish.portions.length > 0 && (
          <fieldset className="space-y-2.5">
            <legend className="text-xs font-semibold uppercase tracking-wide text-[#635B52]">
              {t.portionLabel}
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {dish.portions.map((portion) => {
                const isSelected = portionId === portion.id;
                const priceDisplay =
                  portion.priceDelta === 0
                    ? `${dish.basePriceMad} ${t.currency}`
                    : `${portion.priceDelta > 0 ? '+' : ''}${portion.priceDelta} ${t.currency}`;
                return (
                  <button
                    key={portion.id}
                    type="button"
                    onClick={() => setPortionId(portion.id)}
                    className={`flex min-h-[46px] items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-start text-sm transition-colors ${
                      isSelected
                        ? 'border-[#C85A32] bg-[#FFF8F5] font-semibold text-[#1E1B18]'
                        : 'border-[#E6DFD5] bg-white text-[#1E1B18] hover:border-[#C85A32]/50'
                    }`}
                  >
                    <span className="truncate">{portion.label[lang]}</span>
                    <span className="font-mono-num text-xs font-semibold text-[#635B52] shrink-0">
                      {priceDisplay}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Addons */}
        {dish.addons.length > 0 && (
          <fieldset className="space-y-2.5">
            <legend className="text-xs font-semibold uppercase tracking-wide text-[#635B52]">
              {t.addonsLabel}
            </legend>
            <div className="divide-y divide-[#F0EAE0] rounded-xl border border-[#E6DFD5] bg-white">
              {dish.addons.map((addon) => {
                const checked = selectedAddons.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className="flex min-h-[48px] w-full items-center justify-between gap-3 px-4 py-2.5 text-start text-sm transition-colors hover:bg-[#FAF8F5]"
                    aria-pressed={checked}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                          checked
                            ? 'border-[#C85A32] bg-[#C85A32] text-white'
                            : 'border-[#CFC6B8] bg-white'
                        }`}
                      >
                        {checked && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                      </span>
                      <span className="font-medium text-[#1E1B18]">{addon.label[lang]}</span>
                    </span>
                    <span className="font-mono-num text-xs font-semibold text-[#635B52] shrink-0">
                      {addon.price > 0 ? `+${addon.price} ${t.currency}` : t.free}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Preparation Notes */}
        <div className="space-y-2">
          <label
            htmlFor={`note-${dish.id}`}
            className="block text-xs font-semibold uppercase tracking-wide text-[#635B52]"
          >
            {t.notesLabel}
          </label>
          <textarea
            id={`note-${dish.id}`}
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t.notesPlaceholder}
            maxLength={200}
            className="w-full rounded-xl border border-[#E6DFD5] bg-white px-3.5 py-2.5 text-sm text-[#1E1B18] placeholder:text-[#9A9084] focus:border-[#C85A32] focus:outline-none"
          />
        </div>

        {/* Sticky / Contiguous Add Action */}
        <div className="flex items-center gap-3 pt-1">
          <div className="flex min-h-[48px] items-center rounded-xl border border-[#E6DFD5] bg-white px-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[#1E1B18] hover:bg-[#FAF8F5]"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="font-mono-num min-w-[2rem] text-center text-sm font-semibold text-[#1E1B18]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[#1E1B18] hover:bg-[#FAF8F5]"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#C85A32] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#B34B26] active:scale-[0.99] whitespace-nowrap"
          >
            <span>{t.addToOrder}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num">
              {totalPriceMad} {t.currency}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
