"use client";

import { ArrowRight, Lock, RotateCcw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { GoogleIcon } from "@/components/brand/google-icon";
import { ProductArtwork } from "@/components/product/product-artwork";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { Button, LinkButton } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { FLAT_SHIPPING_RATE, FREE_SHIPPING_THRESHOLD, useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";

const PROMO_CODES: Record<string, number> = {
  BELLE10: 0.1,
  WELCOME15: 0.15,
};

export function CartPageClient() {
  const { detailedLines, subtotal, itemCount, hydrated, updateQuantity, removeItem } = useCart();
  const { user, hydrated: authHydrated, startGoogleSignIn } = useAuth();
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; rate: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const discount = promo ? subtotal * promo.rate : 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING_RATE;
  const tax = (subtotal - discount) * 0.075;
  const total = subtotal - discount + shipping + tax;

  function applyPromo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = promoInput.trim().toUpperCase();
    const rate = PROMO_CODES[code];

    if (!rate) {
      setPromo(null);
      setPromoError("That code is not recognised. Try BELLE10.");
      return;
    }

    setPromo({ code, rate });
    setPromoError(null);
    setPromoInput("");
  }

  if (!hydrated) {
    return (
      <div className="container-page py-24">
        <p className="text-sm text-stone">Loading your bag…</p>
      </div>
    );
  }

  if (detailedLines.length === 0) {
    return (
      <div className="container-page py-24">
        <div className="mx-auto max-w-lg rounded-[32px] border border-clay/70 bg-sand/40 px-8 py-16 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-shell text-moss">
            <ShoppingBag size={24} />
          </span>
          <h1 className="mt-6 font-display text-3xl">Your bag is empty</h1>
          <p className="mt-3 text-sm text-stone">
            Add a cleanser, serum or body ritual and it will show up here.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LinkButton href="/shop" variant="moss">
              Shop all products
            </LinkButton>
            <LinkButton href="/shop?sort=rating" variant="outline">
              Shop bestsellers
            </LinkButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <nav aria-label="Breadcrumb" className="text-xs text-stone">
        <Link href="/" className="transition hover:text-bark">
          Home
        </Link>
        <span className="mx-2 text-stone-light">/</span>
        <span className="text-bark">Bag</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl">Your bag</h1>
        <p className="text-sm text-stone">
          {itemCount} {itemCount === 1 ? "item" : "items"} · {formatPrice(subtotal)}
        </p>
      </div>

      {authHydrated && !user ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-clay/70 bg-moss-soft/60 px-6 py-5">
          <p className="text-sm text-bark-soft">
            Sign in to keep your bag across devices and check out faster.
          </p>
          <Button type="button" variant="primary" size="sm" onClick={() => startGoogleSignIn("/cart")}>
            <GoogleIcon size={15} />
            Continue with Google
          </Button>
        </div>
      ) : null}

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        <ul className="divide-y divide-clay/70">
          {detailedLines.map((line) => (
            <li key={line.product.id} className="flex gap-5 py-6 first:pt-0">
              <Link
                href={`/products/${line.product.slug}`}
                className="h-28 w-28 shrink-0 overflow-hidden rounded-3xl bg-sand sm:h-32 sm:w-32"
              >
                <ProductArtwork
                  shape={line.product.shape}
                  palette={line.product.palette}
                  slug={line.product.slug}
                  name={line.product.name}
                  variant="b"
                  showLabel={false}
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-wrap justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-display text-lg leading-snug">
                      <Link href={`/products/${line.product.slug}`} className="hover:text-moss">
                        {line.product.name}
                      </Link>
                    </h2>
                    <p className="mt-1 text-xs uppercase tracking-wider text-stone-light">
                      {line.product.size} · {formatPrice(line.product.price)} each
                    </p>
                    <p className="mt-2 text-xs text-moss">{line.product.stockNote}</p>
                  </div>
                  <p className="font-medium">{formatPrice(line.lineTotal)}</p>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                  <QuantityStepper
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

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[28px] border border-clay/70 bg-sand/40 p-6">
            <p className="font-display text-xl">Order summary</p>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              {promo ? (
                <div className="flex justify-between text-moss">
                  <dt>Discount ({promo.code})</dt>
                  <dd>-{formatPrice(discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt className="text-stone">Shipping</dt>
                <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone">Estimated tax</dt>
                <dd>{formatPrice(tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-clay/70 pt-3 text-base font-medium">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            <form onSubmit={applyPromo} className="mt-6">
              <label className="text-xs uppercase tracking-wider text-stone-light" htmlFor="promo">
                Promo code
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="promo"
                  value={promoInput}
                  onChange={(event) => setPromoInput(event.target.value)}
                  placeholder="BELLE10"
                  className="min-w-0 flex-1 rounded-full border border-clay bg-white px-4 py-2.5 text-sm outline-none transition focus:border-moss"
                />
                <Button type="submit" variant="outline" size="sm">
                  Apply
                </Button>
              </div>
              {promoError ? (
                <p className="mt-2 text-xs text-rose">{promoError}</p>
              ) : promo ? (
                <p className="mt-2 text-xs text-moss">Code {promo.code} applied.</p>
              ) : (
                <p className="mt-2 text-xs text-stone-light">Demo codes: BELLE10 or WELCOME15.</p>
              )}
            </form>

            <div className="mt-6 space-y-2">
              <LinkButton href="/checkout" variant="moss" className="w-full">
                Checkout <ArrowRight size={16} />
              </LinkButton>
              <LinkButton href="/shop" variant="soft" className="w-full">
                Continue shopping
              </LinkButton>
            </div>

            <ul className="mt-6 space-y-2 text-xs text-stone">
              <li className="flex items-center gap-2">
                <Lock size={13} className="text-moss" /> Secure demo checkout - no card is charged
              </li>
              <li className="flex items-center gap-2">
                <Truck size={13} className="text-moss" /> Free shipping over{" "}
                {formatPrice(FREE_SHIPPING_THRESHOLD)}
              </li>
              <li className="flex items-center gap-2">
                <RotateCcw size={13} className="text-moss" /> 60-day returns
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={13} className="text-moss" /> Cruelty-free &amp; vegan
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
