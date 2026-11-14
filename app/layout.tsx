import type { Metadata } from 'next';
import {
  Fraunces,
  IBM_Plex_Sans_Arabic,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from 'next/font/google';
import { AppProvider } from '@/components/providers/app-provider';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Atlas Boulevard Café & Bistro — Direct Takeaway & QR Table Ordering',
  description:
    'Bilingual (FR/AR) Phase-2 Direct Takeaway, Local Delivery, and QR Table Ordering Module for Atlas Boulevard Café & Bistro.',
  openGraph: {
    title: 'Atlas Boulevard Café & Bistro — Direct Ordering',
    description:
      'Order specialty coffee, weekday & Friday traditional specials, wood-fired pizza, and bistro dishes for pickup, delivery, or QR table service.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atlas Boulevard Café & Bistro — Direct Ordering',
    description:
      'Bilingual (FR/AR) Direct Takeaway & QR Table Ordering Extension Concept.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      dir="ltr"
      className={`${fraunces.variable} ${plusJakarta.variable} ${ibmPlexArabic.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
