import { Sparkles } from "lucide-react";
import Link from "next/link";
import { ProductArtwork } from "@/components/product/product-artwork";
import { LinkButton } from "@/components/ui/button";
import { Stars } from "@/components/ui/stars";
import { HERO_STATS } from "@/lib/content";
import { getProductBySlug } from "@/lib/queries";

export function Hero() {
  const heroProduct = getProductBySlug("marula-glow-face-oil");

  return (
    <section className="relative overflow-hidden bg-shell">
      {/* soft background washes */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-moss-soft blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-rose-soft blur-3xl" />

      <div className="container-page relative grid items-center gap-14 py-16 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-clay bg-white/70 px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-moss">
            <Sparkles size={13} /> New: Kalahari Melon Mist
          </span>

          <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] sm:text-6xl">
            Skin rituals grown from the earth.
          </h1>

          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-stone">
            Belle Afrik blends cold-pressed African botanicals into short, honest formulas. Marula,
            baobab, rooibos and shea - nothing you cannot pronounce, nothing your skin does not
            need.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <LinkButton href="/shop" variant="moss" size="lg">
              Shop the collection
            </LinkButton>
            <LinkButton href="/shop?concern=hydration" variant="outline" size="lg">
              Shop by concern
            </LinkButton>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-clay/70 pt-6">
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-2xl text-bark">{stat.value}</dt>
                <dd className="mt-1 text-[11px] uppercase tracking-wider text-stone-light">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-[36px] bg-sand shadow-[0_40px_80px_-50px_rgba(43,38,33,0.55)]">
            {heroProduct ? (
              <ProductArtwork
                shape={heroProduct.shape}
                palette={heroProduct.palette}
                slug={heroProduct.slug}
                name={heroProduct.name}
                variant="b"
              />
            ) : null}
          </div>

          {heroProduct ? (
            <Link
              href={`/products/${heroProduct.slug}`}
              className="absolute -bottom-4 left-0 w-64 rounded-3xl border border-clay/70 bg-shell/95 p-4 shadow-xl shadow-bark/10 backdrop-blur sm:left-4"
            >
              <p className="text-[10px] uppercase tracking-[0.22em] text-stone-light">
                Best seller
              </p>
              <p className="mt-1 font-display text-lg leading-tight">{heroProduct.name}</p>
              <div className="mt-2 flex items-center gap-2">
                <Stars rating={heroProduct.rating} />
                <span className="text-xs text-stone">
                  {heroProduct.rating.toFixed(1)} · {heroProduct.reviewCount} reviews
                </span>
              </div>
            </Link>
          ) : null}

          <div className="absolute -right-2 top-6 hidden w-44 rounded-3xl border border-clay/70 bg-shell/95 p-4 text-xs shadow-xl shadow-bark/10 backdrop-blur sm:block">
            <p className="font-medium text-bark">Vegan · Small batch</p>
            <p className="mt-1 text-stone">Made weekly in Cape Town, never warehoused.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
