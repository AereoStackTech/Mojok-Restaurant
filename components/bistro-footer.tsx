'use client';

import Link from 'next/link';
import { useApp } from '@/components/providers/app-provider';
import { getCopy } from '@/lib/i18n';

export function BistroFooter() {
  const { lang } = useApp();
  const t = getCopy(lang);

  return (
    <footer className="border-t border-[#E6DFD5] bg-[#F3EFE9] pb-24 lg:pb-10">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl space-y-2">
            <p className="font-display text-lg font-semibold text-[#1E1B18]">
              Atlas Boulevard Café &amp; Bistro
            </p>
            <p className="text-xs leading-relaxed text-[#635B52]">
              {t.portfolioDisclaimer}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-[#635B52]">
            <Link href="/" className="hover:text-[#1E1B18] transition-colors whitespace-nowrap">
              {t.navMenu}
            </Link>
            <Link href="/table/14" className="hover:text-[#1E1B18] transition-colors whitespace-nowrap">
              {t.navTableDemo}
            </Link>
            <Link
              href="/order-confirmation"
              className="hover:text-[#1E1B18] transition-colors whitespace-nowrap"
            >
              {t.navOrder}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
