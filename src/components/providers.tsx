"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { CartDrawer } from "@/components/cart/cart-drawer";

/**
 * Client-only providers + global overlays (mini cart).
 * Mounted once in the root layout so every route shares the same store.
 * Real Google sessions come from next-auth's SessionProvider.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
