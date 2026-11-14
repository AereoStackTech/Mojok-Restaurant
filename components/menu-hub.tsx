'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, QrCode, Search, Sparkles, X } from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { getCopy } from '@/lib/i18n';
import { BISTRO_HERO_IMAGE, CATEGORIES, MENU_ITEMS } from '@/lib/menu-data';
import type { CategoryId } from '@/lib/types';
import { CartDrawer } from './cart-drawer';
import { DishCard } from './dish-card';
import { OrderCartPanel } from './order-cart-panel';
import { QuickViewModal } from './quick-view-modal';

export function MenuHub() {
  const { lang, setQuickViewSlug } = useApp();
  const t = getCopy(lang);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const matchesCat =
        selectedCategory === 'all' ||
        (selectedCategory === 'daily-specials' ? item.isDailySpecial : item.category === selectedCategory);
      if (!matchesCat) return false;
      if (!query) return true;
      return (
        item.name.fr.toLowerCase().includes(query) ||
        item.name.ar.toLowerCase().includes(query) ||
        item.shortDesc.fr.toLowerCase().includes(query) ||
        item.shortDesc.ar.toLowerCase().includes(query)
      );
    });
  }, [selectedCategory, searchQuery]);

  const jumpToDailySpecials = () => {
    setSelectedCategory('daily-specials');
    const el = document.getElementById('menu-catalog');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Compact Editorial Bistro Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-6 pb-8 sm:px-6 lg:px-8 lg:pt-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
          <div className="flex flex-col justify-between rounded-2xl border border-[#E6DFD5] bg-white p-6 sm:p-8 lg:col-span-6">
            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-wide text-[#4A6B53]">
                {t.heroKicker}
              </p>
              <h1 className="font-display text-3xl font-semibold leading-[1.15] text-[#1E1B18] sm:text-4xl lg:text-[2.65rem]">
                {t.heroTitle}
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-[#635B52] sm:text-base">
                {t.heroSubtitle}
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#menu-catalog"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-[#C85A32] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#B34B26] whitespace-nowrap"
              >
                <span>{t.heroCtaPrimary}</span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </a>

              <Link
                href="/table/14"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] px-4 py-2.5 text-sm font-semibold text-[#1E1B18] transition-colors hover:border-[#C85A32] hover:text-[#C85A32] whitespace-nowrap"
              >
                <QrCode className="h-4 w-4 text-[#4A6B53]" aria-hidden="true" />
                <span>{t.heroCtaTable}</span>
              </Link>
            </div>
          </div>

          <div className="relative min-h-[240px] overflow-hidden rounded-2xl border border-[#E6DFD5] bg-[#EAE3D8] lg:col-span-6">
            <Image
              src={BISTRO_HERO_IMAGE}
              alt="Atlas Boulevard Café & Bistro sunlit counter and coastal dining room"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Daily Specials Highlight Banner */}
      <section
        id="daily-specials"
        className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-4 rounded-2xl border border-[#4A6B53]/25 bg-[#EFF3EF] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3A5641]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.specialBannerLabel}</span>
            </div>
            <p className="font-display text-lg font-semibold text-[#1E1B18]">
              {t.specialBannerTitle}
            </p>
            <p className="text-xs text-[#4D5A50] sm:text-sm">{t.specialBannerDesc}</p>
          </div>

          <button
            type="button"
            onClick={jumpToDailySpecials}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#4A6B53] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#3A5641] whitespace-nowrap shrink-0"
          >
            {t.specialBannerAction}
          </button>
        </div>
      </section>

      {/* Sticky Category Filter Bar */}
      <div
        id="menu-catalog"
        className="sticky top-0 z-20 border-y border-[#E6DFD5] bg-[#FAF8F5]/95 backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[40px] rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#1E1B18] text-white'
                    : 'bg-white border border-[#E6DFD5] text-[#635B52] hover:border-[#1E1B18] hover:text-[#1E1B18]'
                }`}
              >
                {cat.label[lang]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Desktop Split: Menu Feed Left, Sticky Cart Right */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Menu Feed */}
          <div className="space-y-5 lg:col-span-8">
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 start-3.5 h-4 w-4 -translate-y-1/2 text-[#9A9084]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                aria-label={t.searchPlaceholder}
                className="min-h-[46px] w-full rounded-xl border border-[#E6DFD5] bg-white ps-10 pe-10 text-sm text-[#1E1B18] placeholder:text-[#9A9084] focus:border-[#C85A32] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 end-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#635B52] hover:text-[#1E1B18]"
                  aria-label={t.resetSearch}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {filteredItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#DFD6C9] bg-white p-10 text-center">
                <p className="text-sm font-medium text-[#635B52]">
                  {t.allCategoriesEmpty}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-3 inline-flex min-h-[40px] items-center rounded-xl border border-[#E6DFD5] px-4 text-xs font-semibold text-[#1E1B18] hover:border-[#C85A32]"
                >
                  {t.resetSearch}
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {filteredItems.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onOpenQuickView={(slug) => setQuickViewSlug(slug)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Desktop Sticky Cart Column */}
          <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-20">
            <div className="rounded-2xl border border-[#E6DFD5] bg-white p-5">
              <OrderCartPanel />
            </div>
          </aside>
        </div>
      </main>

      <QuickViewModal />
      <CartDrawer />
    </div>
  );
}
