'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { getCopy } from '@/lib/i18n';
import type { MenuItem } from '@/lib/types';
import { CartDrawer } from './cart-drawer';
import { DishCustomizer } from './dish-customizer';

export function DishDetailView({ dish }: { dish: MenuItem }) {
  const { lang, setCartDrawerOpen } = useApp();
  const router = useRouter();
  const t = getCopy(lang);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[#635B52] transition-colors hover:text-[#1E1B18]"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          <span>{t.backToMenu}</span>
        </Link>
      </div>

      <div className="rounded-3xl border border-[#E6DFD5] bg-white p-5 sm:p-8">
        <DishCustomizer
          dish={dish}
          onAdded={() => {
            setCartDrawerOpen(true);
            router.refresh();
          }}
        />
      </div>

      <CartDrawer />
    </main>
  );
}
