import Link from "next/link";
import { Leaf, Recycle, ShieldCheck, Truck } from "lucide-react";
import { BrandMark } from "@/components/brand/logo";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { FOOTER_COLUMNS } from "@/lib/content";

const SERVICE_NOTES = [
  { icon: Truck, label: "Free shipping over $50" },
  { icon: Recycle, label: "Refill pouches available" },
  { icon: ShieldCheck, label: "60-day skin promise" },
  { icon: Leaf, label: "Vegan & cruelty-free" },
];

const SOCIAL_LINKS = ["Instagram", "TikTok", "Pinterest", "YouTube"];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-bark text-shell">
      <div className="border-b border-shell/10">
        <div className="container-page grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_NOTES.map((note) => (
            <div key={note.label} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-shell/10 text-shell">
                <note.icon size={18} />
              </span>
              <span className="text-sm text-shell/85">{note.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1.2fr_2fr_1.4fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 text-shell">
            <BrandMark className="h-8 w-8 text-shell" />
            <span className="font-display text-lg tracking-[0.22em]">BELLE AFRIK</span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-shell/70">
            Natural skincare formulated in small batches with cold-pressed African botanicals.
            Made in Cape Town, shipped worldwide.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-shell/60">
            {SOCIAL_LINKS.map((social) => (
              <li key={social}>
                <span className="cursor-pointer underline decoration-shell/25 underline-offset-4 transition hover:text-shell">
                  {social}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-[10px] uppercase tracking-[0.28em] text-shell/45">
                {column.title}
              </p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-shell/80 transition hover:text-shell"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <p className="font-display text-xl">Join the ritual</p>
          <p className="mt-2 text-sm text-shell/70">
            Early access to launches, restocks and skin school notes.
          </p>
          <div className="mt-5">
            <NewsletterForm variant="dark" />
          </div>
        </div>
      </div>

      <div className="border-t border-shell/10">
        <div className="container-page flex flex-col items-start justify-between gap-4 py-6 text-xs text-shell/55 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Belle Afrik. A demo storefront - no real orders are placed.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link href="/" className="transition hover:text-shell">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/" className="transition hover:text-shell">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/" className="transition hover:text-shell">
                Accessibility
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
