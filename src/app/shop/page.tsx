import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/shop-client";
import type { PriceBandId, ProductCategory, SkinConcern, SortId } from "@/lib/products";
import { CATEGORIES, CONCERNS, PRICE_BANDS, SORT_OPTIONS } from "@/lib/products";
import { getProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Shop all",
  description:
    "Browse the full Belle Afrik collection: cleansers, mists, serums, moisturizers, masks and body rituals.",
};

type SearchParams = Record<string, string | string[] | undefined>;

function asArray(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(",").filter(Boolean);
  return [];
}

function parseCategory(value: string | string[] | undefined): ProductCategory | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return CATEGORIES.find((entry) => entry.id === raw)?.id;
}

function parseConcerns(value: string | string[] | undefined): SkinConcern[] {
  return asArray(value).filter((entry): entry is SkinConcern =>
    CONCERNS.some((concern) => concern.id === entry),
  );
}

function parseBands(value: string | string[] | undefined): PriceBandId[] {
  return asArray(value).filter((entry): entry is PriceBandId =>
    PRICE_BANDS.some((band) => band.id === entry),
  );
}

function parseSort(value: string | string[] | undefined): SortId {
  const raw = Array.isArray(value) ? value[0] : value;
  return SORT_OPTIONS.find((option) => option.id === raw)?.id ?? "featured";
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const filters = {
    category: parseCategory(params.category),
    concerns: parseConcerns(params.concern),
    bands: parseBands(params.band),
    query: typeof params.q === "string" ? params.q : "",
    sort: parseSort(params.sort),
  };

  return (
    <div className="pb-24">
      <section className="border-b border-clay/60 bg-sand/50">
        <div className="container-page py-14">
          <nav aria-label="Breadcrumb" className="text-xs text-stone">
            <span>Home</span>
            <span className="mx-2 text-stone-light">/</span>
            <span className="text-bark">Shop</span>
          </nav>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl">The full collection</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone">
            Fourteen small-batch formulas, organised the way skin actually works: cleanse, treat,
            seal. Filter by concern to find your starting point.
          </p>
        </div>
      </section>

      <ShopClient key={JSON.stringify(filters)} initialFilters={filters} products={getProducts()} />
    </div>
  );
}
