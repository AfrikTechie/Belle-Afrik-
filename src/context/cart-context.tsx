"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Product } from "@/lib/products";
import { getProductById } from "@/lib/queries";

const STORAGE_KEY = "belle-afrik.cart.v1";

/** Free shipping threshold used by the drawer, cart page and checkout. */
export const FREE_SHIPPING_THRESHOLD = 50;
export const FLAT_SHIPPING_RATE = 6.95;

export interface CartLine {
  id: string;
  quantity: number;
}

export interface DetailedCartLine {
  product: Product;
  quantity: number;
  lineTotal: number;
}

interface CartContextValue {
  /** Raw persisted lines (product id + quantity). */
  lines: CartLine[];
  /** Lines joined with catalog data, ready to render. */
  detailedLines: DetailedCartLine[];
  itemCount: number;
  subtotal: number;
  /** True once localStorage has been read (avoids hydration flashes). */
  hydrated: boolean;
  isOpen: boolean;
  /** Product id most recently added - used to highlight it in the drawer. */
  lastAddedId: string | null;
  addItem: (id: string, quantity?: number, options?: { openDrawer?: boolean }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<CartLine>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.quantity === "number" &&
    Number.isFinite(candidate.quantity) &&
    candidate.quantity > 0
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore the cart from the previous visit.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setLines(parsed.filter(isCartLine));
      }
    } catch {
      // Ignore unreadable storage - start with an empty cart.
    }
    setHydrated(true);
  }, []);

  // Persist on every change once hydrated.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Storage can be full or blocked (private mode) - the cart still works in memory.
    }
  }, [lines, hydrated]);

  // Keep multiple open tabs in sync.
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        const parsed: unknown = JSON.parse(event.newValue);
        if (Array.isArray(parsed)) setLines(parsed.filter(isCartLine));
      } catch {
        // Ignore malformed payloads from other tabs.
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addItem = useCallback<CartContextValue["addItem"]>((id, quantity = 1, options) => {
    if (!getProductById(id)) return;

    setLines((current) => {
      const existing = current.find((line) => line.id === id);
      if (!existing) return [...current, { id, quantity }];
      return current.map((line) =>
        line.id === id ? { ...line, quantity: Math.min(line.quantity + quantity, 20) } : line,
      );
    });

    setLastAddedId(id);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setLastAddedId(null), 2200);

    if (options?.openDrawer !== false) setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.id !== id)
        : current.map((line) => (line.id === id ? { ...line, quantity } : line)),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setLines((current) => current.filter((line) => line.id !== id));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((open) => !open), []);

  useEffect(
    () => () => {
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
    },
    [],
  );

  const detailedLines = useMemo<DetailedCartLine[]>(() => {
    return lines.flatMap((line) => {
      const product = getProductById(line.id);
      if (!product) return [];
      return [{ product, quantity: line.quantity, lineTotal: product.price * line.quantity }];
    });
  }, [lines]);

  const itemCount = useMemo(
    () => detailedLines.reduce((total, line) => total + line.quantity, 0),
    [detailedLines],
  );

  const subtotal = useMemo(
    () => detailedLines.reduce((total, line) => total + line.lineTotal, 0),
    [detailedLines],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      detailedLines,
      itemCount,
      subtotal,
      hydrated,
      isOpen,
      lastAddedId,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    }),
    [
      lines,
      detailedLines,
      itemCount,
      subtotal,
      hydrated,
      isOpen,
      lastAddedId,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
