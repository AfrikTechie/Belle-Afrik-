"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { PriceBandId, Product, ProductCategory, SkinConcern, SortId } from "@/lib/products";
import { CATEGORIES, CONCERNS, PRICE_BANDS, SORT_OPTIONS, concernLabel } from "@/lib/products";
import { filterProducts } from "@/lib/queries";

interface ShopFilters {
  category?: ProductCategory;
  concerns: SkinConcern[];
  bands: PriceBandId[];
  query: string;
  sort: SortId;
}

interface ShopClientProps {
  products: Product[];
  initialFilters: ShopFilters;
}

export function ShopClient({ products, initialFilters }: ShopClientProps) {
  const [category, setCategory] = useState<ProductCategory | undefined>(initialFilters.category);
  const [concerns, setConcerns] = useState<SkinConcern[]>(initialFilters.concerns);
  const [bands, setBands] = useState<PriceBandId[]>(initialFilters.bands);
  const [sort, setSort] = useState<SortId>(initialFilters.sort);
  const [query, setQuery] = useState(initialFilters.query);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileFiltersOpen]);

  const results = useMemo(
    () => filterProducts({ category, concerns, bands, sort, query }),
    [category, concerns, bands, sort, query],
  );

  const activeCount =
    (category ? 1 : 0) + concerns.length + bands.length + (query.trim() ? 1 : 0);

  function toggleConcern(concern: SkinConcern) {
    setConcerns((current) =>
      current.includes(concern)
        ? current.filter((entry) => entry !== concern)
        : [...current, concern],
    );
  }

  function toggleBand(band: PriceBandId) {
    setBands((current) =>
      current.includes(band) ? current.filter((entry) => entry !== band) : [...current, band],
    );
  }

  function clearAll() {
    setCategory(undefined);
    setConcerns([]);
    setBands([]);
    setQuery("");
    setSort("featured");
  }

  const filterPanel = (
    <FilterPanel
      category={category}
      concerns={concerns}
      bands={bands}
      onSelectCategory={(value) => setCategory(value === category ? undefined : value)}
      onToggleConcern={toggleConcern}
      onToggleBand={toggleBand}
      onClear={clearAll}
      resultCounts={countByCategory(products)}
    />
  );

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-clay/60 pb-5">
        <p className="text-sm text-stone">
          <span className="font-medium text-bark">{results.length}</span>{" "}
          {results.length === 1 ? "product" : "products"}
          {activeCount > 0 ? " · filtered" : ""}
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-bark/15 px-4 py-2.5 text-xs font-medium lg:hidden"
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeCount > 0 ? (
              <span className="grid h-5 w-5 place-items-center rounded-full bg-moss text-[10px] text-shell">
                {activeCount}
              </span>
            ) : null}
          </button>

          <label className="flex items-center gap-2 text-xs text-stone">
            Sort
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortId)}
              className="rounded-full border border-bark/15 bg-shell px-3 py-2 text-xs text-bark outline-none transition focus:border-moss"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {activeCount > 0 ? (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {category ? (
            <FilterChip
              label={CATEGORIES.find((entry) => entry.id === category)?.label ?? category}
              onRemove={() => setCategory(undefined)}
            />
          ) : null}
          {concerns.map((concern) => (
            <FilterChip
              key={concern}
              label={concernLabel(concern)}
              onRemove={() => toggleConcern(concern)}
            />
          ))}
          {bands.map((band) => (
            <FilterChip
              key={band}
              label={PRICE_BANDS.find((entry) => entry.id === band)?.label ?? band}
              onRemove={() => toggleBand(band)}
            />
          ))}
          {query.trim() ? (
            <FilterChip label={`“${query.trim()}”`} onRemove={() => setQuery("")} />
          ) : null}
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-stone underline decoration-clay underline-offset-4 transition hover:text-bark"
          >
            Clear all
          </button>
        </div>
      ) : null}
      <div className="mt-8 grid gap-10 lg:grid-cols-[248px_1fr]">
        <aside className="hidden lg:block">{filterPanel}</aside>
        <section>
          {results.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-clay bg-sand/40 px-8 py-20 text-center">
              <p className="font-display text-2xl">No products match those filters</p>
              <p className="mt-3 text-sm text-stone">
                Try removing a concern or widening the price range.
              </p>
              <div className="mt-6 flex justify-center">
                <Button type="button" variant="moss" onClick={clearAll}>
                  Clear filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-[65] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-bark/40 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm animate-fade-in flex-col bg-shell p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="font-display text-xl">Filters</p>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="grid h-9 w-9 place-items-center rounded-full text-stone transition hover:bg-sand"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 flex-1 overflow-y-auto">{filterPanel}</div>
            <Button
              type="button"
              variant="moss"
              className="mt-6 w-full"
              onClick={() => setMobileFiltersOpen(false)}
            >
              Show {results.length} {results.length === 1 ? "product" : "products"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function countByCategory(products: Product[]): Record<string, number> {
  return products.reduce<Record<string, number>>((counts, product) => {
    counts[product.category] = (counts[product.category] ?? 0) + 1;
    return counts;
  }, {});
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-sand px-3 py-1.5 text-xs text-bark">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remove ${label} filter`}>
        <X size={12} className="text-stone transition hover:text-bark" />
      </button>
    </span>
  );
}

interface FilterPanelProps {
  category?: ProductCategory;
  concerns: SkinConcern[];
  bands: PriceBandId[];
  onSelectCategory: (value: ProductCategory) => void;
  onToggleConcern: (value: SkinConcern) => void;
  onToggleBand: (value: PriceBandId) => void;
  onClear: () => void;
  resultCounts: Record<string, number>;
}

function FilterPanel({
  category,
  concerns,
  bands,
  onSelectCategory,
  onToggleConcern,
  onToggleBand,
  onClear,
  resultCounts,
}: FilterPanelProps) {
  return (
    <div className="space-y-9">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-stone-light">Category</p>
        <ul className="mt-4 space-y-1.5">
          {CATEGORIES.map((entry) => (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => onSelectCategory(entry.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition",
                  category === entry.id
                    ? "bg-moss text-shell"
                    : "text-bark-soft hover:bg-sand hover:text-bark",
                )}
              >
                {entry.label}
                <span
                  className={cn(
                    "text-xs",
                    category === entry.id ? "text-shell/70" : "text-stone-light",
                  )}
                >
                  {resultCounts[entry.id] ?? 0}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-stone-light">Skin concern</p>
        <ul className="mt-4 space-y-3">
          {CONCERNS.map((concern) => (
            <li key={concern.id}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-bark-soft">
                <input
                  type="checkbox"
                  checked={concerns.includes(concern.id)}
                  onChange={() => onToggleConcern(concern.id)}
                  className="h-4 w-4 rounded border-clay accent-moss"
                />
                {concern.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-stone-light">Price</p>
        <ul className="mt-4 space-y-3">
          {PRICE_BANDS.map((band) => (
            <li key={band.id}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-bark-soft">
                <input
                  type="checkbox"
                  checked={bands.includes(band.id)}
                  onChange={() => onToggleBand(band.id)}
                  className="h-4 w-4 rounded border-clay accent-moss"
                />
                {band.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="w-full rounded-full border border-bark/15 px-4 py-2.5 text-xs font-medium text-bark transition hover:border-bark"
      >
        Clear all filters
      </button>
    </div>
  );
}
