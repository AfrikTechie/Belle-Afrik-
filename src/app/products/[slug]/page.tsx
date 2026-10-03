import { ChevronDown, Droplet, Leaf, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { RatingLine, Stars } from "@/components/ui/stars";
import { MOCK_REVIEWS } from "@/lib/content";
import { formatPrice } from "@/lib/format";
import { categoryLabel, concernLabel } from "@/lib/products";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/queries";

export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.tagline,
  };
}

/** Mock (but plausible) review spread used by the ratings summary. */
const RATING_DISTRIBUTION = [
  { stars: 5, share: 0.78 },
  { stars: 4, share: 0.15 },
  { stars: 3, share: 0.05 },
  { stars: 2, share: 0.015 },
  { stars: 1, share: 0.005 },
];

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const related = getRelatedProducts(slug, 3);

  const saving = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="pb-24">
      <div className="container-page pt-10">
        <nav aria-label="Breadcrumb" className="text-xs text-stone">
          <Link href="/" className="transition hover:text-bark">
            Home
          </Link>
          <span className="mx-2 text-stone-light">/</span>
          <Link href="/shop" className="transition hover:text-bark">
            Shop
          </Link>
          <span className="mx-2 text-stone-light">/</span>
          <span className="text-bark">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery product={product} />

          <div>
            <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.22em]">
              <span className="text-moss">{categoryLabel(product.category)}</span>
              {product.badges.map((badge) => (
                <span key={badge} className="rounded-full border border-clay px-2.5 py-1 text-stone">
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">{product.name}</h1>
            <p className="mt-3 text-[15px] text-stone">{product.tagline}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <RatingLine rating={product.rating} reviewCount={product.reviewCount} />
              <a href="#reviews" className="text-xs text-moss underline underline-offset-4">
                Read the reviews
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="font-display text-3xl">{formatPrice(product.price)}</span>
              {product.compareAtPrice ? (
                <>
                  <span className="text-sm text-stone-light line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span className="rounded-full bg-rose-soft px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-gold">
                    Save {saving}%
                  </span>
                </>
              ) : null}
              <span className="text-xs text-stone">/ {product.size}</span>
            </div>

            <p className="mt-6 text-[15px] leading-relaxed text-bark-soft">{product.description}</p>

            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-stone-light">Good for</dt>
                <dd className="mt-1 text-bark-soft">
                  {product.concerns.map((concern) => concernLabel(concern)).join(" · ")}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-stone-light">Skin types</dt>
                <dd className="mt-1 text-bark-soft">{product.skinTypes.join(" · ")}</dd>
              </div>
            </dl>

            <ProductPurchasePanel product={product} />

            <div className="mt-10 divide-y divide-clay/70 border-y border-clay/70">
              <details className="ba-accordion group" open>
                <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-sm font-medium">
                  <span className="inline-flex items-center gap-2">
                    <Droplet size={15} className="text-moss" /> How to use
                  </span>
                  <ChevronDown size={16} className="ba-chevron text-stone transition-transform" />
                </summary>
                <ol className="space-y-2 pb-5 pl-5 text-sm leading-relaxed text-stone">
                  {product.howToUse.map((step) => (
                    <li key={step} className="list-decimal">
                      {step}
                    </li>
                  ))}
                </ol>
              </details>

              <details className="ba-accordion group">
                <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-sm font-medium">
                  <span className="inline-flex items-center gap-2">
                    <Leaf size={15} className="text-moss" /> Key ingredients
                  </span>
                  <ChevronDown size={16} className="ba-chevron text-stone transition-transform" />
                </summary>
                <ul className="space-y-3 pb-5 text-sm">
                  {product.keyIngredients.map((ingredient) => (
                    <li key={ingredient.name} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                      <span className="w-40 shrink-0 font-medium text-bark">{ingredient.name}</span>
                      <span className="text-stone">{ingredient.benefit}</span>
                    </li>
                  ))}
                </ul>
              </details>

              <details className="ba-accordion group">
                <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-sm font-medium">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck size={15} className="text-moss" /> Shipping &amp; returns
                  </span>
                  <ChevronDown size={16} className="ba-chevron text-stone transition-transform" />
                </summary>
                <div className="space-y-2 pb-5 text-sm leading-relaxed text-stone">
                  <p>{product.stockNote}. Orders placed before 1pm ship the same working day.</p>
                  <p>
                    Free carbon-neutral shipping over {formatPrice(50)}. Returns and refunds within
                    60 days, opened or unopened.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      <section id="reviews" className="container-page mt-24">
        <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-light">Reviews</p>
            <h2 className="mt-3 font-display text-3xl">What people notice</h2>

            <div className="mt-6 rounded-[28px] border border-clay/70 bg-sand/40 p-6">
              <div className="flex items-end gap-3">
                <span className="font-display text-4xl">{product.rating.toFixed(1)}</span>
                <span className="pb-1 text-xs text-stone">
                  from {product.reviewCount} verified reviews
                </span>
              </div>
              <Stars rating={product.rating} size={16} className="mt-3" />
              <ul className="mt-5 space-y-2">
                {RATING_DISTRIBUTION.map((entry) => (
                  <li key={entry.stars} className="flex items-center gap-3 text-xs text-stone">
                    <span className="w-8">{entry.stars}★</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-shell">
                      <span
                        className="block h-full rounded-full bg-gold"
                        style={{ width: `${entry.share * 100}%` }}
                      />
                    </span>
                    <span className="w-10 text-right">
                      {Math.round(entry.share * product.reviewCount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ul className="divide-y divide-clay/70">
            {MOCK_REVIEWS.map((review) => (
              <li key={review.author} className="py-6 first:pt-0">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-moss-soft text-xs font-medium text-moss-dark">
                      {review.author.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{review.author}</p>
                      <p className="text-[11px] text-stone-light">
                        Verified purchase · {review.date}
                      </p>
                    </div>
                  </div>
                  <Stars rating={review.rating} />
                </div>
                <p className="mt-4 text-sm font-medium">{review.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-stone">{review.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl">Pairs well with</h2>
          <Link href="/shop" className="text-sm text-moss transition hover:text-moss-dark">
            Shop all
          </Link>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
