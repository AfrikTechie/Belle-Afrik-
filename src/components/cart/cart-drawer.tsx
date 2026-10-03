"use client";

import { ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { ProductArtwork } from "@/components/product/product-artwork";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { LinkButton } from "@/components/ui/button";
import { FREE_SHIPPING_THRESHOLD, useCart } from "@/context/cart-context";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    detailedLines,
    itemCount,
    subtotal,
    updateQuantity,
    removeItem,
    lastAddedId,
    hydrated,
  } = useCart();

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeCart();
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="absolute inset-0 bg-bark/40 backdrop-blur-sm"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className="relative flex h-full w-full max-w-md animate-drawer-in flex-col bg-shell shadow-2xl shadow-bark/30"
      >
        <header className="flex items-center justify-between border-b border-clay/70 px-6 py-5">
          <div>
            <p className="font-display text-xl">Your bag</p>
            <p className="text-xs text-stone">
              {hydrated ? `${itemCount} item${itemCount === 1 ? "" : "s"}` : "Loading…"}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="grid h-10 w-10 place-items-center rounded-full text-stone transition hover:bg-sand hover:text-bark"
          >
            <X size={18} />
          </button>
        </header>

        <div className="border-b border-clay/70 px-6 py-4">
          {remaining > 0 ? (
            <p className="text-xs text-stone">
              You are <span className="font-medium text-bark">{formatPrice(remaining)}</span> away
              from free shipping.
            </p>
          ) : (
            <p className="text-xs font-medium text-moss">Nice one - your order ships free.</p>
          )}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-sand">
            <div
              className="h-full rounded-full bg-moss transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {detailedLines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-sand text-moss">
              <ShoppingBag size={22} />
            </span>
            <p className="font-display text-lg">Your bag is empty</p>
            <p className="text-sm text-stone">
              Start with a bestseller - most people begin with the Marula Glow Face Oil.
            </p>
            <LinkButton href="/shop" variant="moss" size="sm" onClick={closeCart}>
              Shop bestsellers
            </LinkButton>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-clay/60 overflow-y-auto px-6">
            {detailedLines.map((line) => (
              <li
                key={line.product.id}
                className={cn(
                  "flex gap-4 py-5",
                  lastAddedId === line.product.id ? "bg-moss-soft/70" : "bg-transparent",
                )}
              >
                <Link
                  href={`/products/${line.product.slug}`}
                  onClick={closeCart}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-sand"
                >
                  <ProductArtwork
                    shape={line.product.shape}
                    palette={line.product.palette}
                    slug={line.product.slug}
                    name={line.product.name}
                    variant="c"
                    showLabel={false}
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{line.product.name}</p>
                      <p className="mt-0.5 text-xs text-stone">{line.product.size}</p>
                    </div>
                    <p className="shrink-0 text-sm font-medium">{formatPrice(line.lineTotal)}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    <QuantityStepper
                      size="sm"
                      value={line.quantity}
                      onChange={(quantity) => updateQuantity(line.product.id, quantity)}
                      label={`Quantity for ${line.product.name}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(line.product.id)}
                      className="text-xs text-stone underline decoration-clay underline-offset-4 transition hover:text-rose"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {detailedLines.length > 0 ? (
          <footer className="border-t border-clay/70 px-6 py-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-stone-light">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <LinkButton href="/checkout" variant="moss" onClick={closeCart} className="w-full">
                Checkout
              </LinkButton>
              <LinkButton href="/cart" variant="soft" onClick={closeCart} className="w-full">
                View bag
              </LinkButton>
            </div>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
