'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ShoppingBag, X } from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { getCopy } from '@/lib/i18n';
import { OrderCartPanel } from './order-cart-panel';

interface CartDrawerProps {
  lockedTableNumber?: string;
}

export function CartDrawer({ lockedTableNumber }: CartDrawerProps) {
  const {
    lang,
    isCartDrawerOpen,
    setCartDrawerOpen,
    totalItemsCount,
    totalMad,
    hydrated,
  } = useApp();
  const t = getCopy(lang);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCartDrawerOpen(false);
      }
    };
    if (isCartDrawerOpen) {
      window.addEventListener('keydown', onKey);
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [isCartDrawerOpen, setCartDrawerOpen]);

  const countLabel =
    totalItemsCount === 1 ? t.itemsCountSingular : t.itemsCountPlural;

  return (
    <>
      {/* Mobile / Tablet Floating Bottom Cart Bar (<= 15% viewport height cap) */}
      {hydrated && totalItemsCount > 0 && (
        <div className="fixed inset-x-0 bottom-3 z-30 px-4 lg:hidden pointer-events-none">
          <button
            type="button"
            onClick={() => setCartDrawerOpen(true)}
            className="pointer-events-auto mx-auto flex h-13 w-full max-w-lg items-center justify-between gap-3 rounded-2xl bg-[#1E1B18] px-4 text-white shadow-lg transition-transform active:scale-[0.98]"
          >
            <span className="flex items-center gap-2.5 text-sm font-semibold whitespace-nowrap">
              <ShoppingBag className="h-4 w-4 text-[#E38664]" aria-hidden="true" />
              <span className="font-mono-num">
                {totalItemsCount} {countLabel}
              </span>
            </span>
            <span className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap">
              <span>{t.viewCartMobile}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num text-[#F7C5B2]">
                {totalMad} {t.currency}
              </span>
            </span>
          </button>
        </div>
      )}

      {/* Slide-Over Cart Drawer */}
      <AnimatePresence>
        {isCartDrawerOpen && (
          <div
            className="fixed inset-0 z-50 flex justify-end"
            role="dialog"
            aria-modal="true"
            aria-label={t.cartTitle}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setCartDrawerOpen(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-[2px]"
            />

            <motion.div
              initial={{ x: lang === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: lang === 'ar' ? '-100%' : '100%' }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#FAF8F5] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#E6DFD5] px-5 py-3.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#635B52]">
                  {t.brandName}
                </span>
                <button
                  type="button"
                  onClick={() => setCartDrawerOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E6DFD5] bg-white text-[#1E1B18] hover:border-[#C85A32]"
                  aria-label="Close cart"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                <OrderCartPanel lockedTableNumber={lockedTableNumber} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
