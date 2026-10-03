"use client";

import { ArrowLeft, CircleCheck, Lock, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { GoogleIcon } from "@/components/brand/google-icon";
import { ProductArtwork } from "@/components/product/product-artwork";
import { Button, LinkButton } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { FLAT_SHIPPING_RATE, FREE_SHIPPING_THRESHOLD, useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";

const INPUT_CLASS =
  "mt-1.5 w-full rounded-xl border border-clay bg-white px-4 py-3 text-sm text-bark outline-none transition focus:border-moss";
const LABEL_CLASS = "block text-xs uppercase tracking-wider text-stone-light";

const DELIVERY_OPTIONS = [
  { id: "standard", label: "Standard", detail: "3-5 business days", price: 0 },
  { id: "express", label: "Express", detail: "1-2 business days", price: 12 },
] as const;

type DeliveryId = (typeof DELIVERY_OPTIONS)[number]["id"];

export function CheckoutClient() {
  const { detailedLines, subtotal, itemCount, hydrated, clearCart } = useCart();
  const { user, hydrated: authHydrated, startGoogleSignIn } = useAuth();

  const [delivery, setDelivery] = useState<DeliveryId>("standard");
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const shipping =
    delivery === "express"
      ? 12
      : subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : FLAT_SHIPPING_RATE;
  const tax = subtotal * 0.075;
  const total = subtotal + shipping + tax;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    // Simulated order placement - no network request is made.
    setTimeout(() => {
      setOrderId(`BA-${Math.floor(10000 + Math.random() * 89999)}`);
      setSubmitting(false);
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  }

  if (!hydrated || !authHydrated) {
    return (
      <div className="container-page py-24">
        <p className="text-sm text-stone">Preparing checkout…</p>
      </div>
    );
  }

  if (orderId) {
    return (
      <div className="container-page py-24">
        <div className="mx-auto max-w-xl rounded-[32px] border border-clay/70 bg-sand/40 px-8 py-14 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-moss text-shell">
            <CircleCheck size={26} />
          </span>
          <h1 className="mt-6 font-display text-3xl">Thank you - order placed</h1>
          <p className="mt-3 text-sm text-stone">
            Order <span className="font-medium text-bark">{orderId}</span> is confirmed. A receipt is
            on its way to {user?.email ?? "your inbox"}.
          </p>
          <p className="mt-2 text-xs text-stone-light">
            Demo build: no payment was taken and nothing will ship.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LinkButton href="/account" variant="moss">
              View your orders
            </LinkButton>
            <LinkButton href="/shop" variant="outline">
              Continue shopping
            </LinkButton>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-page py-24">
        <div className="mx-auto max-w-lg rounded-[32px] border border-clay/70 bg-sand/40 px-8 py-14 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-shell text-moss">
            <Lock size={22} />
          </span>
          <h1 className="mt-6 font-display text-3xl">Sign in to check out</h1>
          <p className="mt-3 text-sm text-stone">
            We keep your details on your account so you only type them once.
          </p>
          <div className="mt-8 space-y-3">
            <Button type="button" variant="primary" className="w-full" onClick={() => startGoogleSignIn("/checkout")}>
              <GoogleIcon size={16} />
              Continue with Google
            </Button>
            <LinkButton
              href={{ pathname: "/login", query: { redirect: "/checkout" } }}
              variant="outline"
              className="w-full"
            >
              Use email instead
            </LinkButton>
          </div>
        </div>
      </div>
    );
  }

  if (detailedLines.length === 0) {
    return (
      <div className="container-page py-24">
        <div className="mx-auto max-w-lg rounded-[32px] border border-clay/70 bg-sand/40 px-8 py-14 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-shell text-moss">
            <ShoppingBag size={22} />
          </span>
          <h1 className="mt-6 font-display text-3xl">Nothing to check out yet</h1>
          <p className="mt-3 text-sm text-stone">Add a product and come back to complete your order.</p>
          <div className="mt-8 flex justify-center">
            <LinkButton href="/shop" variant="moss">
              Shop all products
            </LinkButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl">Checkout</h1>
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-stone transition hover:text-bark"
        >
          <ArrowLeft size={15} /> Back to bag
        </Link>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-10">
          <section>
            <h2 className="font-display text-xl">1 · Contact</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className={LABEL_CLASS}>
                Email
                <input
                  type="email"
                  defaultValue={user.email}
                  required
                  className={INPUT_CLASS}
                  autoComplete="email"
                />
              </label>
              <label className={LABEL_CLASS}>
                Phone
                <input
                  type="tel"
                  placeholder="+27 82 000 0000"
                  className={INPUT_CLASS}
                  autoComplete="tel"
                />
              </label>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl">2 · Shipping address</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className={LABEL_CLASS}>
                First name
                <input
                  defaultValue={user.name.split(" ")[0]}
                  required
                  className={INPUT_CLASS}
                  autoComplete="given-name"
                />
              </label>
              <label className={LABEL_CLASS}>
                Last name
                <input
                  defaultValue={user.name.split(" ").slice(1).join(" ")}
                  className={INPUT_CLASS}
                  autoComplete="family-name"
                />
              </label>
              <label className={`${LABEL_CLASS} sm:col-span-2`}>
                Address
                <input
                  placeholder="14 Kloof Street"
                  required
                  className={INPUT_CLASS}
                  autoComplete="street-address"
                />
              </label>
              <label className={LABEL_CLASS}>
                City
                <input
                  defaultValue="Cape Town"
                  required
                  className={INPUT_CLASS}
                  autoComplete="address-level2"
                />
              </label>
              <label className={LABEL_CLASS}>
                Postal code
                <input
                  defaultValue="8001"
                  required
                  className={INPUT_CLASS}
                  autoComplete="postal-code"
                />
              </label>
              <label className={`${LABEL_CLASS} sm:col-span-2`}>
                Country / region
                <select defaultValue="ZA" className={INPUT_CLASS}>
                  <option value="ZA">South Africa</option>
                  <option value="NG">Nigeria</option>
                  <option value="KE">Kenya</option>
                  <option value="GH">Ghana</option>
                  <option value="GB">United Kingdom</option>
                  <option value="US">United States</option>
                </select>
              </label>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl">3 · Delivery</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {DELIVERY_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                    delivery === option.id
                      ? "border-moss bg-moss-soft/60"
                      : "border-clay bg-white hover:border-bark/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={delivery === option.id}
                    onChange={() => setDelivery(option.id)}
                    className="mt-1 accent-moss"
                  />
                  <span className="text-sm">
                    <span className="font-medium">{option.label}</span>
                    <span className="mt-0.5 block text-xs text-stone">{option.detail}</span>
                    <span className="mt-1 block text-xs text-moss">
                      {option.price === 0
                        ? subtotal >= FREE_SHIPPING_THRESHOLD
                          ? "Free"
                          : formatPrice(FLAT_SHIPPING_RATE)
                        : formatPrice(option.price)}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl">4 · Payment</h2>
            <div className="mt-5 rounded-2xl border border-clay bg-white p-5">
              <div className="grid gap-4 sm:grid-cols-[1.6fr_1fr_1fr]">
                <label className={LABEL_CLASS}>
                  Card number
                  <input
                    inputMode="numeric"
                    placeholder="4242 4242 4242 4242"
                    className={INPUT_CLASS}
                    autoComplete="cc-number"
                  />
                </label>
                <label className={LABEL_CLASS}>
                  Expiry
                  <input
                    placeholder="12 / 28"
                    className={INPUT_CLASS}
                    autoComplete="cc-exp"
                  />
                </label>
                <label className={LABEL_CLASS}>
                  CVC
                  <input
                    inputMode="numeric"
                    placeholder="123"
                    className={INPUT_CLASS}
                    autoComplete="cc-csc"
                  />
                </label>
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs text-stone-light">
                <Lock size={12} /> Demo checkout - card details are never submitted or stored.
              </p>
            </div>
          </section>

          <div className="space-y-3">
            <Button type="submit" variant="moss" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Placing order…" : `Place order - ${formatPrice(total)}`}
            </Button>
            <p className="text-center text-xs text-stone-light">
              By placing this order you agree to our demo terms. Nothing will be charged or shipped.
            </p>
          </div>
        </form>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[28px] border border-clay/70 bg-sand/40 p-6">
            <p className="font-display text-xl">Your order</p>
            <p className="mt-1 text-xs text-stone">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>

            <ul className="mt-5 space-y-4">
              {detailedLines.map((line) => (
                <li key={line.product.id} className="flex gap-3">
                  <span className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-shell">
                    <ProductArtwork
                      shape={line.product.shape}
                      palette={line.product.palette}
                      slug={line.product.slug}
                      name={line.product.name}
                      variant="c"
                      showLabel={false}
                    />
                  </span>
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="block truncate font-medium">{line.product.name}</span>
                    <span className="mt-0.5 block text-xs text-stone">
                      Qty {line.quantity} · {line.product.size}
                    </span>
                  </span>
                  <span className="text-sm">{formatPrice(line.lineTotal)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2 border-t border-clay/70 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone">
                  Shipping ({delivery === "express" ? "Express" : "Standard"})
                </dt>
                <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone">Tax</dt>
                <dd>{formatPrice(tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-clay/70 pt-3 text-base font-medium">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            <div className="mt-6 rounded-2xl bg-shell p-4 text-xs leading-relaxed text-stone">
              Signed in as <span className="font-medium text-bark">{user.email}</span>. Order updates
              will be sent to this address.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
