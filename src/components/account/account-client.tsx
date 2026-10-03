"use client";

import { LogOut, MapPin, Package, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { GoogleIcon } from "@/components/brand/google-icon";
import { Button, LinkButton } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { MOCK_ORDERS } from "@/lib/content";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

const STATUS_STYLES: Record<string, string> = {
  Delivered: "bg-moss-soft text-moss-dark",
  Refunded: "bg-rose-soft text-gold",
  Processing: "bg-sand text-stone",
};

export function AccountClient() {
  const { user, hydrated, signOut, startGoogleSignIn } = useAuth();
  const { itemCount } = useCart();
  const [prefs, setPrefs] = useState({ restock: true, journal: true, sms: false });

  if (!hydrated) {
    return (
      <div className="container-page py-24">
        <p className="text-sm text-stone">Loading your account…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-page py-24">
        <div className="mx-auto max-w-lg rounded-[32px] border border-clay/70 bg-sand/40 px-8 py-14 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-shell text-moss">
            <User size={22} />
          </span>
          <h1 className="mt-6 font-display text-3xl">You are not signed in</h1>
          <p className="mt-3 text-sm text-stone">
            Sign in to see your orders, rewards points and saved details.
          </p>
          <div className="mt-8 space-y-3">
            <Button type="button" variant="primary" className="w-full" onClick={() => startGoogleSignIn("/account")}>
              <GoogleIcon size={16} />
              Continue with Google
            </Button>
            <LinkButton
              href={{ pathname: "/login", query: { redirect: "/account" } }}
              variant="outline"
              className="w-full"
            >
              Sign in with email
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
        <span className="text-bark">Account</span>
      </nav>

      <header className="mt-6 flex flex-wrap items-center justify-between gap-6 rounded-[32px] border border-clay/70 bg-sand/40 p-7">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-moss text-lg font-medium text-shell">
            {user.initials}
          </span>
          <div>
            <h1 className="font-display text-3xl">Hello, {user.name.split(" ")[0]}</h1>
            <p className="mt-1 text-sm text-stone">{user.email}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-moss">
              {user.method === "google" ? "Signed in with Google" : "Signed in with email"} · member
              since {user.memberSince}
            </p>
          </div>
        </div>

        <Button type="button" variant="outline" size="sm" onClick={signOut}>
          <LogOut size={15} /> Sign out
        </Button>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Orders placed" value={String(MOCK_ORDERS.length)} />
        <StatCard icon={Sparkles} label="Rewards points" value={String(user.rewardsPoints)} />
        <StatCard icon={Package} label="Items in bag" value={String(itemCount)} />
        <StatCard icon={MapPin} label="Saved addresses" value="1" />
      </div>

      <section id="orders" className="mt-10 rounded-[28px] border border-clay/70 bg-shell p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl">Order history</h2>
          <Link href="/shop" className="text-sm text-moss transition hover:text-moss-dark">
            Start a new order
          </Link>
        </div>

        <ul className="mt-6 divide-y divide-clay/70">
          {MOCK_ORDERS.map((order) => (
            <li key={order.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
              <div>
                <p className="text-sm font-medium">
                  {order.id}
                  <span
                    className={cn(
                      "ml-3 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest",
                      STATUS_STYLES[order.status] ?? STATUS_STYLES.Processing,
                    )}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="mt-1 text-xs text-stone">
                  {order.date} · {order.items.join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-5">
                <span className="text-sm font-medium">{formatPrice(order.total)}</span>
                <button
                  type="button"
                  className="rounded-full border border-bark/15 px-4 py-2 text-xs font-medium transition hover:border-bark"
                >
                  Buy again
                </button>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-xs text-stone-light">
          Mock order history for the demo - no real orders exist behind these rows.
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-clay/70 bg-shell p-7">
          <h2 className="font-display text-2xl">Email preferences</h2>
          <p className="mt-2 text-sm text-stone">Choose what lands in your inbox.</p>

          <ul className="mt-6 space-y-4">
            <PreferenceRow
              label="Restock alerts"
              copy="Tell me when a sold-out formula is back."
              checked={prefs.restock}
              onChange={() => setPrefs((current) => ({ ...current, restock: !current.restock }))}
            />
            <PreferenceRow
              label="Skin school journal"
              copy="One ingredient guide a month, no noise."
              checked={prefs.journal}
              onChange={() => setPrefs((current) => ({ ...current, journal: !current.journal }))}
            />
            <PreferenceRow
              label="SMS delivery updates"
              copy="Only used on the day your parcel arrives."
              checked={prefs.sms}
              onChange={() => setPrefs((current) => ({ ...current, sms: !current.sms }))}
            />
          </ul>
        </div>

        <div className="rounded-[28px] border border-clay/70 bg-shell p-7">
          <h2 className="font-display text-2xl">Saved details</h2>

          <div className="mt-6 rounded-2xl border border-clay/70 bg-sand/40 p-5">
            <p className="text-[11px] uppercase tracking-wider text-stone-light">Shipping address</p>
            <p className="mt-2 text-sm leading-relaxed">
              {user.name}
              <br />
              14 Kloof Street
              <br />
              Cape Town, 8001
              <br />
              South Africa
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-clay/70 bg-sand/40 p-5">
            <p className="text-[11px] uppercase tracking-wider text-stone-light">Payment method</p>
            <p className="mt-2 text-sm">Visa ending 4242 · expires 12/28</p>
            <p className="mt-1 text-xs text-stone-light">Demo record - no card is stored.</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" variant="outline" size="sm">
              Edit address
            </Button>
            <Button type="button" variant="outline" size="sm">
              Change password
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Package;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-clay/70 bg-shell p-5">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-moss-soft text-moss-dark">
        <Icon size={16} />
      </span>
      <p className="mt-4 font-display text-2xl">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-stone-light">{label}</p>
    </div>
  );
}

function PreferenceRow({
  label,
  copy,
  checked,
  onChange,
}: {
  label: string;
  copy: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <li className="flex items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="mt-0.5 block text-xs text-stone">{copy}</span>
      </span>
      <button
        type="button"
        onClick={onChange}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition",
          checked ? "bg-moss" : "bg-clay",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-shell transition-all",
            checked ? "left-5.5" : "left-0.5",
          )}
        />
      </button>
    </li>
  );
}
