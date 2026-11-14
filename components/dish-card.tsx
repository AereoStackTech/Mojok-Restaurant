'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Plus, SlidersHorizontal, Utensils } from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { getCopy } from '@/lib/i18n';
import type { MenuItem } from '@/lib/types';

interface DishCardProps {
  dish: MenuItem;
  onOpenQuickView?: (slug: string) => void;
}

export function DishCard({ dish, onOpenQuickView }: DishCardProps) {
  const { lang, addToCart } = useApp();
  const t = getCopy(lang);
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleQuickAdd = () => {
    addToCart({ dish });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1100);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#E6DFD5] bg-white transition-transform duration-200 hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAE3D8]">
        {!imgError ? (
          <Image
            src={dish.image}
            alt={dish.name[lang]}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#F3EFE9] to-[#E6DFD5] p-4 text-center text-[#635B52]">
            <Utensils className="h-7 w-7 text-[#C85A32]" aria-hidden="true" />
            <span className="text-xs font-medium">{dish.name[lang]}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-1.5 flex items-center gap-2 text-xs font-medium text-[#635B52]">
          <span className="font-mono-num">
            {dish.prepMinutes} {t.minutesShort}
          </span>
          {(dish.specialDay || dish.dietaryTag) && (
            <>
              <span aria-hidden="true">·</span>
              <span className={dish.isDailySpecial ? 'font-semibold text-[#4A6B53]' : ''}>
                {dish.specialDay ? dish.specialDay[lang] : dish.dietaryTag?.[lang]}
              </span>
            </>
          )}
        </div>

        <h3 className="text-base font-semibold leading-snug text-[#1E1B18]">
          <Link
            href={`/menu/${dish.slug}`}
            className="hover:text-[#C85A32] transition-colors"
          >
            {dish.name[lang]}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 flex-1 text-[13px] leading-relaxed text-[#635B52]">
          {dish.shortDesc[lang]}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F0EAE0] pt-3.5">
          <div className="font-mono-num text-base font-semibold text-[#1E1B18]">
            {dish.basePriceMad}{' '}
            <span className="text-xs font-medium text-[#635B52]">{t.currency}</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenQuickView ? (
              <button
                type="button"
                onClick={() => onOpenQuickView(dish.slug)}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] px-3 text-xs font-medium text-[#1E1B18] transition-colors hover:border-[#C85A32] hover:text-[#C85A32] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C85A32] whitespace-nowrap shrink-0"
                aria-label={`${t.customize} ${dish.name[lang]}`}
                title={t.customize}
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <Link
                href={`/menu/${dish.slug}`}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] px-3 text-xs font-medium text-[#1E1B18] transition-colors hover:border-[#C85A32] hover:text-[#C85A32] whitespace-nowrap shrink-0"
                aria-label={`${t.customize} ${dish.name[lang]}`}
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}

            <button
              type="button"
              onClick={handleQuickAdd}
              className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 text-xs font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C85A32] whitespace-nowrap shrink-0 ${
                justAdded
                  ? 'bg-[#4A6B53]'
                  : 'bg-[#C85A32] hover:bg-[#B34B26] active:scale-[0.98]'
              }`}
            >
              {justAdded ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Plus className="h-4 w-4" aria-hidden="true" />
              )}
              <span>{t.addQuick}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
