'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BellRing,
  CheckCircle2,
  Coffee,
  CreditCard,
  Droplets,
  QrCode,
  Receipt,
  Utensils,
} from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { getCopy } from '@/lib/i18n';
import { MENU_ITEMS } from '@/lib/menu-data';
import type { TableServiceRequest } from '@/lib/types';
import { CartDrawer } from './cart-drawer';
import { DishCard } from './dish-card';
import { OrderCartPanel } from './order-cart-panel';
import { QuickViewModal } from './quick-view-modal';

export function TableServiceView({ tableNumber }: { tableNumber: string }) {
  const { lang, updateFulfillment, setQuickViewSlug } = useApp();
  const t = getCopy(lang);
  const [recentRequest, setRecentRequest] = useState<TableServiceRequest | null>(null);
  const [showFullMenu, setShowFullMenu] = useState(false);
  const requestSeqRef = useRef(100);

  useEffect(() => {
    updateFulfillment({ mode: 'dine-in', tableNumber });
  }, [tableNumber, updateFulfillment]);

  const quickReorderItems = useMemo(
    () => MENU_ITEMS.filter((item) => item.isTableQuickReorder),
    []
  );

  const secondaryItems = useMemo(
    () => MENU_ITEMS.filter((item) => !item.isTableQuickReorder),
    []
  );

  const quickRequests: {
    type: TableServiceRequest['type'];
    label: string;
    icon: typeof Receipt;
  }[] = [
    { type: 'bill-cash', label: t.reqBillCash, icon: Receipt },
    { type: 'bill-card', label: t.reqBillCard, icon: CreditCard },
    { type: 'water', label: t.reqWater, icon: Droplets },
    { type: 'cutlery', label: t.reqCutlery, icon: Utensils },
    { type: 'server', label: t.reqServer, icon: BellRing },
  ];

  const handleQuickRequest = (type: TableServiceRequest['type'], labelText: string) => {
    requestSeqRef.current += 1;
    setRecentRequest({
      id: `REQ-${requestSeqRef.current}`,
      tableNumber,
      type,
      label: { fr: labelText, ar: labelText },
      createdAt: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-MA' : 'fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Contextual QR Table Header */}
      <section className="mb-6 rounded-2xl border border-[#4A6B53]/30 bg-[#EFF3EF] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3A5641]">
              <QrCode className="h-4 w-4" aria-hidden="true" />
              <span>{t.tableHeaderBadge}</span>
            </div>
            <h1 className="font-display text-2xl font-semibold text-[#1E1B18] sm:text-3xl">
              {t.tableTitlePrefix} {tableNumber}
            </h1>
            <p className="max-w-2xl text-sm text-[#4D5A50]">{t.tableSubtitle}</p>
          </div>
        </div>

        {/* Express Waiter / Bill Requests */}
        <div className="mt-5 border-t border-[#4A6B53]/15 pt-4">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-[#3A5641]">
            {t.tableQuickRequestsTitle}
          </p>
          <div className="flex flex-wrap gap-2">
            {quickRequests.map((req) => {
              const Icon = req.icon;
              return (
                <button
                  key={req.type}
                  type="button"
                  onClick={() => handleQuickRequest(req.type, req.label)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#D4DFD5] bg-white px-3.5 py-2 text-xs font-semibold text-[#1E1B18] transition-colors hover:border-[#4A6B53] hover:text-[#2E4836] active:scale-[0.98] whitespace-nowrap"
                >
                  <Icon className="h-4 w-4 text-[#4A6B53]" aria-hidden="true" />
                  <span>{req.label}</span>
                </button>
              );
            })}
          </div>

          {recentRequest && (
            <div
              role="status"
              className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#4A6B53]/35 bg-white px-4 py-3 text-xs font-medium text-[#1E1B18]"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#4A6B53]" aria-hidden="true" />
                <span>
                  {t.tableRequestSent} {recentRequest.tableNumber} :{' '}
                  <strong className="font-semibold">{recentRequest.label[lang]}</strong>
                </span>
              </span>
              <span className="font-mono-num text-[#635B52] shrink-0">
                {recentRequest.createdAt}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 2-Column Split: Quick Reorder + Menu on Left, Table Order Cart on Right */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="space-y-8 lg:col-span-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-[#1E1B18]">
                <Coffee className="h-5 w-5 text-[#C85A32]" aria-hidden="true" />
                <span>{t.tableQuickReorderTitle}</span>
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {quickReorderItems.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  onOpenQuickView={(slug) => setQuickViewSlug(slug)}
                />
              ))}
            </div>
          </section>

          <section className="space-y-4 border-t border-[#E6DFD5] pt-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold text-[#1E1B18]">
                {t.tableFullMenuTitle}
              </h2>
              <button
                type="button"
                onClick={() => setShowFullMenu((prev) => !prev)}
                className="min-h-[40px] rounded-xl border border-[#E6DFD5] bg-white px-3.5 text-xs font-semibold text-[#1E1B18] hover:border-[#C85A32] whitespace-nowrap"
              >
                {showFullMenu
                  ? lang === 'ar'
                    ? 'إخفاء القائمة'
                    : 'Masquer'
                  : lang === 'ar'
                    ? 'عرض الكل'
                    : 'Afficher tout'}
              </button>
            </div>

            {showFullMenu && (
              <div className="grid gap-5 sm:grid-cols-2">
                {secondaryItems.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onOpenQuickView={(slug) => setQuickViewSlug(slug)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-6">
          <div className="rounded-2xl border border-[#E6DFD5] bg-white p-5">
            <OrderCartPanel lockedTableNumber={tableNumber} />
          </div>
        </aside>
      </div>

      <QuickViewModal />
      <CartDrawer lockedTableNumber={tableNumber} />
    </main>
  );
}
