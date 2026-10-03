"use client";

import { useState } from "react";
import { ProductArtwork } from "@/components/product/product-artwork";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/products";

const VARIANTS = ["a", "b", "c"] as const;

/** Three "shots" per product - re-rendered SVG, so there is nothing to load. */
export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState<(typeof VARIANTS)[number]>("a");

  return (
    <div className="lg:sticky lg:top-28">
      <div className="relative overflow-hidden rounded-[32px] bg-sand">
        <ProductArtwork
          shape={product.shape}
          palette={product.palette}
          slug={product.slug}
          name={product.name}
          variant={active}
          className="aspect-square"
        />

        <div className="absolute left-5 top-5 flex flex-col gap-2">
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
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        {VARIANTS.map((variant) => (
          <button
            key={variant}
            type="button"
            onClick={() => setActive(variant)}
            aria-label={`View ${product.name} image ${variant.toUpperCase()}`}
            aria-pressed={active === variant}
            className={cn(
              "h-20 w-20 overflow-hidden rounded-2xl bg-sand transition sm:h-24 sm:w-24",
              active === variant
                ? "ring-2 ring-moss ring-offset-2 ring-offset-shell"
                : "opacity-70 hover:opacity-100",
            )}
          >
            <ProductArtwork
              shape={product.shape}
              palette={product.palette}
              slug={product.slug}
              name={product.name}
              variant={variant}
              showLabel={variant === "a"}
            />
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-stone-light">
        Illustrations only. The demo build ships no product photography.
      </p>
    </div>
  );
}
