'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Languages } from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { getCopy } from '@/lib/i18n';

export function BistroHeader() {
  const { lang, toggleLang } = useApp();
  const pathname = usePathname();
  const t = getCopy(lang);

  const navItems = [
    { href: '/', label: t.navMenu, active: pathname === '/' },
    { href: '/#daily-specials', label: t.navSpecials, active: false },
    { href: '/table/14', label: t.navTableDemo, active: pathname.startsWith('/table/') },
    {
      href: '/order-confirmation',
      label: t.navOrder,
      active: pathname.startsWith('/order-confirmation'),
    },
  ];

  return (
    <header className="border-b border-[#E6DFD5] bg-[#FAF8F5]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-[#1E1B18] whitespace-nowrap shrink-0"
        >
          {t.brandName}
        </Link>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#635B52]"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#1E1B18] ${
                item.active
                  ? 'text-[#1E1B18] underline decoration-[#C85A32] decoration-2 underline-offset-4'
                  : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={toggleLang}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#E6DFD5] bg-white px-3.5 py-2 text-xs font-semibold text-[#1E1B18] transition-colors hover:border-[#C85A32] hover:text-[#C85A32] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C85A32] whitespace-nowrap shrink-0"
            aria-label={lang === 'fr' ? 'Passer en arabe' : 'Switch to French'}
          >
            <Languages className="h-4 w-4 text-[#C85A32]" aria-hidden="true" />
            <span>{t.langSwitch}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
