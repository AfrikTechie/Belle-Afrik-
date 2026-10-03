"use client";

import { ChevronRight, LogOut, Menu, Package, Search, ShoppingBag, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand/logo";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/cn";
import { ANNOUNCEMENTS, PRIMARY_NAV } from "@/lib/content";

/** Rotating promo strip above the navigation. */
function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-moss text-shell">
      <div className="container-page flex h-9 items-center justify-center gap-3 text-[11px] tracking-wide">
        <span key={index} className="animate-fade-in text-center">
          {ANNOUNCEMENTS[index]}
        </span>
      </div>
    </div>
  );
}

/** Avatar / sign-in control with a small dropdown. */
function AccountMenu() {
  const { user, hydrated, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (!hydrated) {
    return <span className="hidden h-9 w-9 rounded-full bg-sand sm:block" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="grid h-10 w-10 place-items-center rounded-full text-bark transition hover:bg-sand"
        aria-label="Sign in"
      >
        <User size={18} />
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-moss text-xs font-medium text-shell transition hover:bg-moss-dark"
      >
        {user.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          user.initials
        )}
        <span className="sr-only">Account menu for {user.name}</span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close account menu"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 top-12 z-20 w-60 animate-pop rounded-2xl border border-clay/70 bg-shell p-2 shadow-xl shadow-bark/10"
          >
            <div className="border-b border-clay/60 px-3 pb-3 pt-2">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-stone">{user.email}</p>
              <p className="mt-2 text-[11px] uppercase tracking-wider text-moss">
                {user.method === "google" ? "Signed in with Google" : "Signed in with email"}
              </p>
            </div>
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-sand"
              role="menuitem"
            >
              <User size={15} /> Your account
            </Link>
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-sand"
              role="menuitem"
            >
              <Package size={15} /> Orders
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose transition hover:bg-rose-soft"
              role="menuitem"
            >
              <LogOut size={15} /> Sign out
            </button>
            <p className="px-3 pb-1 pt-2 text-[10px] text-stone-light">
              {user.method === "google" ? "Signed in with Google." : "Demo email session in this browser."}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}

export function SiteHeader() {
  const [isScrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount, openCart, hydrated: cartHydrated } = useCart();
  const { user, signOut } = useAuth();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Any navigation closes the overlay panels.
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen && !searchOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    setSearchOpen(false);
    setMobileOpen(false);
    router.push(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : "/shop");
  }

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    return base === "/" ? pathname === "/" : pathname.startsWith(base);
  };

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />

      <div
        className={cn(
          "border-b bg-shell/90 backdrop-blur-md transition-all duration-300",
          isScrolled
            ? "border-clay shadow-[0_10px_30px_-18px_rgba(43,38,33,0.45)]"
            : "border-transparent",
        )}
      >
        <div className="container-page flex h-[70px] items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-full text-bark transition hover:bg-sand md:hidden"
            >
              <Menu size={20} />
            </button>

            <Wordmark className="hidden md:inline-flex" />

            <nav aria-label="Main" className="ml-8 hidden items-center gap-7 lg:flex">
              {PRIMARY_NAV.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "group relative text-sm transition",
                    isActive(String(link.href)) ? "text-bark" : "text-bark-soft hover:text-bark",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1.5 left-0 h-px bg-moss transition-all duration-300",
                      isActive(String(link.href)) ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
              ))}
            </nav>
          </div>

          <Wordmark className="md:hidden" />

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen((current) => !current)}
              aria-label="Search products"
              aria-expanded={searchOpen}
              className="grid h-10 w-10 place-items-center rounded-full text-bark transition hover:bg-sand"
            >
              <Search size={18} />
            </button>

            <AccountMenu />

            <button
              type="button"
              onClick={openCart}
              aria-label="Open shopping bag"
              className="relative grid h-10 w-10 place-items-center rounded-full text-bark transition hover:bg-sand"
            >
              <ShoppingBag size={18} />
              {cartHydrated && itemCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-moss px-1 text-[10px] font-medium text-shell">
                  {itemCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {searchOpen ? (
          <div className="animate-fade-in border-t border-clay/60 bg-shell">
            <form onSubmit={handleSearch} className="container-page flex items-center gap-3 py-4">
              <Search size={18} className="shrink-0 text-stone" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search serums, clay masks, shea butter..."
                aria-label="Search products"
                className="min-w-0 flex-1 bg-transparent text-sm text-bark outline-none placeholder:text-stone-light"
              />
              <button
                type="submit"
                className="rounded-full bg-bark px-4 py-2 text-xs font-medium text-shell transition hover:bg-moss-dark"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="grid h-9 w-9 place-items-center rounded-full text-stone transition hover:bg-sand"
              >
                <X size={16} />
              </button>
            </form>
          </div>
        ) : null}
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-bark/40 backdrop-blur-sm"
          />
          <div className="relative flex h-full w-[86%] max-w-sm animate-fade-in flex-col bg-shell shadow-2xl">
            <div className="flex items-center justify-between border-b border-clay/70 px-5 py-4">
              <Wordmark onClick={() => setMobileOpen(false)} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-full text-stone transition hover:bg-sand"
              >
                <X size={18} />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-6">
              <p className="text-[10px] uppercase tracking-[0.28em] text-stone-light">Shop</p>
              <ul className="mt-3 divide-y divide-clay/60">
                {PRIMARY_NAV.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between py-3.5 text-[15px] text-bark"
                    >
                      {link.label}
                      <ChevronRight size={16} className="text-stone-light" />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl bg-moss-soft p-5">
                <p className="font-display text-lg text-moss-dark">Not sure where to start?</p>
                <p className="mt-1 text-sm text-bark-soft">
                  Take the 60-second skin quiz - or browse what questions our bestsellers answer.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setMobileOpen(false)}
                  className="mt-4 inline-flex rounded-full bg-moss px-5 py-2.5 text-xs font-medium text-shell"
                >
                  Browse bestsellers
                </Link>
              </div>
            </nav>

            <div className="border-t border-clay/70 px-5 py-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-moss text-xs font-medium text-shell">
                      {user.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{user.name}</span>
                      <span className="block truncate text-xs text-stone">{user.email}</span>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/account"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 rounded-full bg-sand px-4 py-2.5 text-center text-xs font-medium"
                    >
                      Your account
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                        setMobileOpen(false);
                      }}
                      className="flex-1 rounded-full border border-clay px-4 py-2.5 text-xs font-medium text-rose"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-full bg-bark px-4 py-2.5 text-center text-xs font-medium text-shell"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/login?mode=signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-full border border-clay px-4 py-2.5 text-center text-xs font-medium"
                  >
                    Create account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

