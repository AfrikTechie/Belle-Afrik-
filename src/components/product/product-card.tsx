"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductArtwork } from "@/components/product/product-artwork";
import { RatingLine } from "@/components/ui/stars";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/products";
import { categoryLabel } from "@/lib/products";

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const [saved, setSaved] = useState(false);

  const saving = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <article className={cn("group flex flex-col", className)}>
      <div className="relative overflow-hidden rounded-[26px] bg-sand">
        <Link href={`/products/${product.slug}`} className="block aspect-square">
          <ProductArtwork
            shape={product.shape}
            palette={product.palette}
            slug={product.slug}
            name={product.name}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.isBestSeller ? (
            <span className="rounded-full bg-bark px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-shell">
              Best seller
            </span>
          ) : null}
          {product.isNew ? (
            <span className="rounded-full bg-shell/90 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-moss">
              New
            </span>
          ) : null}
          {saving > 0 ? (
            <span className="rounded-full bg-rose-soft px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-gold">
              Save {saving}%
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setSaved((current) => !current)}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={saved}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-shell/85 text-bark backdrop-blur transition hover:bg-shell"
        >
          <Heart size={16} className={saved ? "fill-rose text-rose" : "text-bark"} />
        </button>

        <div className="absolute inset-x-3 bottom-3 opacity-100 transition duration-300 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <AddToCartButton
            productId={product.id}
            size="sm"
            variant="primary"
            className="w-full shadow-lg shadow-bark/10"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-[17px] leading-snug">
              <Link href={`/products/${product.slug}`} className="hover:text-moss">
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-xs uppercase tracking-wider text-stone-light">
              {categoryLabel(product.category)} · {product.size}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-medium">{formatPrice(product.price)}</p>
            {product.compareAtPrice ? (
              <p className="text-xs text-stone-light line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            ) : null}
          </div>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-stone">{product.tagline}</p>
        <RatingLine
          rating={product.rating}
          reviewCount={product.reviewCount}
          className="mt-3"
        />
      </div>
    </article>
  );
}
