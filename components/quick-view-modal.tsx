'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { getCopy } from '@/lib/i18n';
import { getDishBySlug } from '@/lib/menu-data';
import { DishCustomizer } from './dish-customizer';

export function QuickViewModal() {
  const { lang, quickViewSlug, setQuickViewSlug, setCartDrawerOpen } = useApp();
  const t = getCopy(lang);
  const dish = quickViewSlug ? getDishBySlug(quickViewSlug) : undefined;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQuickViewSlug(null);
      }
    };
    if (quickViewSlug) {
      window.addEventListener('keydown', onKey);
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [quickViewSlug, setQuickViewSlug]);

  return (
    <AnimatePresence>
      {dish && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={dish.name[lang]}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={() => setQuickViewSlug(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-[#FAF8F5] shadow-2xl sm:rounded-3xl"
          >
            <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-[#D8CFC2] sm:hidden" />

            <div className="flex items-center justify-between border-b border-[#E6DFD5] px-5 py-3">
              <Link
                href={`/menu/${dish.slug}`}
                onClick={() => setQuickViewSlug(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#635B52] hover:text-[#C85A32]"
              >
                <span>{t.customize}</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>

              <button
                type="button"
                onClick={() => setQuickViewSlug(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E6DFD5] bg-white text-[#1E1B18] hover:border-[#C85A32]"
                aria-label="Close customization modal"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <DishCustomizer
                dish={dish}
                compact
                onAdded={() => {
                  setQuickViewSlug(null);
                  if (window.innerWidth < 1024) {
                    setCartDrawerOpen(true);
                  }
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
