'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getDishById, NEIGHBORHOODS } from '@/lib/menu-data';
import type {
  CartItem,
  ConfirmedOrderTicket,
  FulfillmentMode,
  FulfillmentState,
  Language,
  MenuItem,
} from '@/lib/types';

interface AppContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  cart: CartItem[];
  addToCart: (params: {
    dish: MenuItem;
    portionId?: string;
    addonIds?: string[];
    note?: string;
    quantity?: number;
  }) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  fulfillment: FulfillmentState;
  setFulfillmentMode: (mode: FulfillmentMode) => void;
  updateFulfillment: (patch: Partial<FulfillmentState>) => void;
  totalItemsCount: number;
  subtotalMad: number;
  deliveryFeeMad: number;
  totalMad: number;
  estimatedPrepMinutes: number;
  isCartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  quickViewSlug: string | null;
  setQuickViewSlug: (slug: string | null) => void;
  lastConfirmedTicket: ConfirmedOrderTicket | null;
  saveConfirmedTicket: (ticket: ConfirmedOrderTicket) => void;
  getTicketByCode: (code: string) => ConfirmedOrderTicket | null;
  hydrated: boolean;
}

const STORAGE_KEYS = {
  lang: 'atlas_bistro_lang_v1',
  cart: 'atlas_bistro_cart_v1',
  fulfillment: 'atlas_bistro_fulfillment_v1',
  tickets: 'atlas_bistro_tickets_v1',
};

const DEFAULT_FULFILLMENT: FulfillmentState = {
  mode: 'pickup',
  pickupSlot: 'asap',
  neighborhood: 'centre-ville',
  addressNote: '',
  tableNumber: '',
  customerName: '',
  customerPhone: '',
  paymentPreference: 'cash',
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('fr');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [fulfillment, setFulfillment] = useState<FulfillmentState>(DEFAULT_FULFILLMENT);
  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null);
  const [ticketsMap, setTicketsMap] = useState<Record<string, ConfirmedOrderTicket>>({});
  const [lastTicketCode, setLastTicketCode] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      try {
        const savedLang = window.localStorage.getItem(STORAGE_KEYS.lang);
        if (savedLang === 'fr' || savedLang === 'ar') {
          setLangState(savedLang);
        }

        const savedCart = window.localStorage.getItem(STORAGE_KEYS.cart);
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) {
            setCart(parsed);
          }
        }

        const savedFulfillment = window.localStorage.getItem(STORAGE_KEYS.fulfillment);
        if (savedFulfillment) {
          const parsed = JSON.parse(savedFulfillment);
          if (parsed && typeof parsed === 'object') {
            setFulfillment((prev) => ({ ...prev, ...parsed }));
          }
        }

        const savedTickets = window.localStorage.getItem(STORAGE_KEYS.tickets);
        if (savedTickets) {
          const parsed = JSON.parse(savedTickets);
          if (parsed && typeof parsed === 'object') {
            setTicketsMap(parsed);
            const keys = Object.keys(parsed);
            if (keys.length > 0) {
              setLastTicketCode(keys[keys.length - 1]);
            }
          }
        }
      } catch {
        // Ignore storage access issues
      } finally {
        if (active) {
          setHydrated(true);
        }
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    if (hydrated) {
      try {
        window.localStorage.setItem(STORAGE_KEYS.lang, lang);
      } catch {
        // Ignore storage write error
      }
    }
  }, [lang, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
    } catch {
      // Ignore storage write error
    }
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEYS.fulfillment, JSON.stringify(fulfillment));
    } catch {
      // Ignore storage write error
    }
  }, [fulfillment, hydrated]);

  const setLang = useCallback((nextLang: Language) => {
    setLangState(nextLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === 'fr' ? 'ar' : 'fr'));
  }, []);

  const addToCart = useCallback(
    ({
      dish,
      portionId,
      addonIds = [],
      note = '',
      quantity = 1,
    }: {
      dish: MenuItem;
      portionId?: string;
      addonIds?: string[];
      note?: string;
      quantity?: number;
    }) => {
      const resolvedPortion = portionId || dish.portions[0]?.id || 'default';
      const sortedAddons = [...addonIds].sort();
      const trimmedNote = note.trim();
      const signature = `${dish.id}::${resolvedPortion}::${sortedAddons.join(',')}::${trimmedNote}`;

      setCart((prev) => {
        const existingIndex = prev.findIndex((item) => item.cartItemId === signature);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: Math.min(30, updated[existingIndex].quantity + quantity),
          };
          return updated;
        }
        return [
          ...prev,
          {
            cartItemId: signature,
            dishId: dish.id,
            slug: dish.slug,
            portionId: resolvedPortion,
            addonIds: sortedAddons,
            note: trimmedNote,
            quantity,
          },
        ];
      });
    },
    []
  );

  const updateQuantity = useCallback((cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const setFulfillmentMode = useCallback((mode: FulfillmentMode) => {
    setFulfillment((prev) => ({ ...prev, mode }));
  }, []);

  const updateFulfillment = useCallback((patch: Partial<FulfillmentState>) => {
    setFulfillment((prev) => ({ ...prev, ...patch }));
  }, []);

  const saveConfirmedTicket = useCallback((ticket: ConfirmedOrderTicket) => {
    setTicketsMap((prev) => {
      const next = { ...prev, [ticket.ticketCode]: ticket };
      try {
        window.localStorage.setItem(STORAGE_KEYS.tickets, JSON.stringify(next));
      } catch {
        // Ignore storage write error
      }
      return next;
    });
    setLastTicketCode(ticket.ticketCode);
  }, []);

  const getTicketByCode = useCallback(
    (code: string) => {
      return ticketsMap[code] ?? null;
    },
    [ticketsMap]
  );

  const { totalItemsCount, subtotalMad, estimatedPrepMinutes } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    let maxPrep = 0;

    for (const item of cart) {
      const dish = getDishById(item.dishId);
      if (!dish) continue;
      const portion = dish.portions.find((p) => p.id === item.portionId) ?? dish.portions[0];
      const addonsSum = dish.addons
        .filter((a) => item.addonIds.includes(a.id))
        .reduce((sum, a) => sum + a.price, 0);
      const unitPrice = Math.max(1, dish.basePriceMad + (portion?.priceDelta ?? 0) + addonsSum);
      count += item.quantity;
      subtotal += unitPrice * item.quantity;
      if (dish.prepMinutes > maxPrep) {
        maxPrep = dish.prepMinutes;
      }
    }

    const prep =
      count === 0
        ? 0
        : fulfillment.mode === 'delivery'
          ? maxPrep + 15
          : maxPrep + 2;

    return {
      totalItemsCount: count,
      subtotalMad: subtotal,
      estimatedPrepMinutes: prep,
    };
  }, [cart, fulfillment.mode]);

  const deliveryFeeMad = useMemo(() => {
    if (cart.length === 0 || fulfillment.mode !== 'delivery') return 0;
    return NEIGHBORHOODS.find((n) => n.id === fulfillment.neighborhood)?.feeMad ?? 15;
  }, [cart.length, fulfillment.mode, fulfillment.neighborhood]);

  const totalMad = subtotalMad + deliveryFeeMad;
  const lastConfirmedTicket = lastTicketCode ? (ticketsMap[lastTicketCode] ?? null) : null;

  const value = useMemo<AppContextValue>(
    () => ({
      lang,
      setLang,
      toggleLang,
      cart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      fulfillment,
      setFulfillmentMode,
      updateFulfillment,
      totalItemsCount,
      subtotalMad,
      deliveryFeeMad,
      totalMad,
      estimatedPrepMinutes,
      isCartDrawerOpen,
      setCartDrawerOpen,
      quickViewSlug,
      setQuickViewSlug,
      lastConfirmedTicket,
      saveConfirmedTicket,
      getTicketByCode,
      hydrated,
    }),
    [
      lang,
      setLang,
      toggleLang,
      cart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      fulfillment,
      setFulfillmentMode,
      updateFulfillment,
      totalItemsCount,
      subtotalMad,
      deliveryFeeMad,
      totalMad,
      estimatedPrepMinutes,
      isCartDrawerOpen,
      quickViewSlug,
      lastConfirmedTicket,
      saveConfirmedTicket,
      getTicketByCode,
      hydrated,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
