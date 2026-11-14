'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  MessageCircle,
  QrCode,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { getCopy } from '@/lib/i18n';

export function OrderConfirmationView() {
  const { lang, lastConfirmedTicket, getTicketByCode, hydrated } = useApp();
  const searchParams = useSearchParams();
  const t = getCopy(lang);
  const [copied, setCopied] = useState(false);

  const ticketParam = searchParams.get('ticket');
  const ticket = ticketParam
    ? (getTicketByCode(ticketParam) ?? lastConfirmedTicket)
    : lastConfirmedTicket;

  const handleCopy = async () => {
    if (!ticket) return;
    try {
      await navigator.clipboard.writeText(ticket.whatsappMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard fallback ignored
    }
  };

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="h-64 animate-pulse rounded-3xl border border-[#E6DFD5] bg-white" />
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-14 sm:px-6 text-center">
        <div className="rounded-3xl border border-[#E6DFD5] bg-white p-8 sm:p-10 space-y-5">
          <ShoppingBag className="mx-auto h-10 w-10 text-[#C85A32]" aria-hidden="true" />
          <h1 className="font-display text-2xl font-semibold text-[#1E1B18]">
            {lang === 'ar'
              ? 'لا يوجد طلب مؤكد حالياً'
              : 'Aucune commande récente à afficher'}
          </h1>
          <p className="text-sm text-[#635B52]">
            {lang === 'ar'
              ? 'تصفح قائمتنا لاختيار أطباقك المفضلة أو جرّب خدمة الطلب من الطاولة.'
              : 'Parcourez la carte pour composer votre commande ou essayez le service à table QR.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-[#C85A32] px-5 text-sm font-semibold text-white hover:bg-[#B34B26]"
            >
              <span>{t.navMenu}</span>
            </Link>
            <Link
              href="/table/14"
              className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] px-5 text-sm font-semibold text-[#1E1B18] hover:border-[#C85A32]"
            >
              <QrCode className="h-4 w-4 text-[#4A6B53]" aria-hidden="true" />
              <span>{t.navTableDemo}</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const modeSummary =
    ticket.fulfillment.mode === 'pickup'
      ? t.modePickup
      : ticket.fulfillment.mode === 'delivery'
        ? t.modeDelivery
        : `${t.modeDineIn} (${t.tableTitlePrefix} ${ticket.fulfillment.tableNumber})`;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[#635B52] hover:text-[#1E1B18]"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          <span>{t.newOrderBtn}</span>
        </Link>
      </div>

      <div className="space-y-6 rounded-3xl border border-[#E6DFD5] bg-white p-6 sm:p-8">
        {/* Confirmation Banner */}
        <div className="flex flex-col gap-3 border-b border-[#E6DFD5] pb-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#4A6B53]">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span>{t.confirmationBadge}</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-[#1E1B18] sm:text-3xl">
            {t.confirmationTitle}
          </h1>
          <p className="text-sm text-[#635B52]">{t.confirmationSubtitle}</p>
        </div>

        {/* Ticket Key Metrics */}
        <div className="grid gap-4 rounded-2xl border border-[#E6DFD5] bg-[#FAF8F5] p-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-[#635B52]">{t.ticketNumberLabel}</p>
            <p className="font-mono-num mt-1 text-lg font-bold text-[#1E1B18]">
              {ticket.ticketCode}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-[#635B52]">{t.estimatedTimeLabel}</p>
            <p className="font-mono-num mt-1 flex items-center gap-1.5 text-lg font-bold text-[#4A6B53]">
              <Clock className="h-4 w-4" aria-hidden="true" />
              <span>
                ~{ticket.estimatedMinutes} {t.minutesShort}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-[#635B52]">{t.modeSummaryLabel}</p>
            <p className="mt-1 text-sm font-semibold text-[#1E1B18]">{modeSummary}</p>
          </div>
        </div>

        {/* Itemized Digital Receipt */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[#635B52]">
            {t.orderDetailsLabel}
          </h2>
          <ul className="divide-y divide-[#F0EAE0] rounded-2xl border border-[#E6DFD5] bg-white px-4">
            {ticket.lines.map((line, idx) => (
              <li key={`${line.dishId}-${idx}`} className="flex items-start justify-between gap-4 py-3.5">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-[#1E1B18]">
                    <span className="font-mono-num text-[#C85A32]">{line.quantity}×</span>{' '}
                    {line.name[lang]}
                  </p>
                  <p className="text-xs text-[#635B52]">
                    {line.portionLabel[lang]}
                    {line.addonLabels.length > 0 && (
                      <> · +{line.addonLabels.map((a) => a[lang]).join(', ')}</>
                    )}
                  </p>
                  {line.note && (
                    <p className="text-xs italic text-[#8A7E71]">“{line.note}”</p>
                  )}
                </div>
                <span className="font-mono-num text-sm font-semibold text-[#1E1B18] shrink-0">
                  {line.lineTotalMad} {t.currency}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-1.5 px-1 pt-2 text-sm">
            <div className="flex justify-between text-[#635B52]">
              <span>{t.subtotal}</span>
              <span className="font-mono-num">
                {ticket.subtotalMad} {t.currency}
              </span>
            </div>
            {ticket.deliveryFeeMad > 0 && (
              <div className="flex justify-between text-[#635B52]">
                <span>{t.deliveryFee}</span>
                <span className="font-mono-num">
                  {ticket.deliveryFeeMad} {t.currency}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-[#E6DFD5] pt-2 text-base font-bold text-[#1E1B18]">
              <span>{t.total}</span>
              <span className="font-mono-num">
                {ticket.totalMad} {t.currency}
              </span>
            </div>
          </div>
        </section>

        {/* Formatted WhatsApp Dispatch */}
        <section className="space-y-3 border-t border-[#E6DFD5] pt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#635B52]">
            {t.whatsappPreviewLabel}
          </p>
          <pre className="whitespace-pre-wrap rounded-2xl border border-[#E6DFD5] bg-[#FAF8F5] p-4 text-xs leading-relaxed text-[#1E1B18] font-sans">
            {ticket.whatsappMessage}
          </pre>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={ticket.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#25855A] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1E6E4A]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>{t.openWhatsAppBtn}</span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#E6DFD5] bg-white px-5 text-sm font-semibold text-[#1E1B18] transition-colors hover:border-[#1E1B18]"
            >
              {copied ? (
                <Check className="h-4 w-4 text-[#4A6B53]" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
              <span>{copied ? t.copiedMessageBtn : t.copyMessageBtn}</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
