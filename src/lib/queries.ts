import { PRODUCTS } from "./catalog";
import type { Product, ProductCategory, SkinConcern, SortId } from "./products";
import { PRICE_BANDS, type PriceBandId } from "./products";

/** Read helpers. In a real build these would fetch from a CMS or commerce API. */

export function getProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function getBestSellers(limit = 4): Product[] {
  return PRODUCTS.filter((product) => product.isBestSeller).slice(0, limit);
}

export function getNewArrivals(limit = 3): Product[] {
  return PRODUCTS.filter((product) => product.isNew).slice(0, limit);
}

export function getProductsByCategory(category: ProductCategory, limit = 4): Product[] {
  return PRODUCTS.filter((product) => product.category === category).slice(0, limit);
}

export function getRelatedProducts(slug: string, limit = 3): Product[] {
  const current = getProductBySlug(slug);
  if (!current) return PRODUCTS.slice(0, limit);

  const scored = PRODUCTS.filter((product) => product.slug !== slug).map((product) => {
    const sharedConcerns = product.concerns.filter((concern) =>
      current.concerns.includes(concern),
    ).length;
    const sameCategory = product.category === current.category ? 2 : 0;
    return { product, score: sharedConcerns + sameCategory };
  });

  return scored
    .sort((a, b) => b.score - a.score || b.product.rating - a.product.rating)
    .slice(0, limit)
    .map((entry) => entry.product);
}

export interface CatalogFilters {
  category?: ProductCategory;
  concerns?: SkinConcern[];
  bands?: PriceBandId[];
  query?: string;
  sort?: SortId;
}

export function filterProducts(filters: CatalogFilters): Product[] {
  const { category, concerns = [], bands = [], query = "", sort = "featured" } = filters;

  const search = query.trim().toLowerCase();

  const results = PRODUCTS.filter((product) => {
    if (category && product.category !== category) return false;

    if (concerns.length > 0 && !product.concerns.some((c) => concerns.includes(c))) {
      return false;
    }

    if (bands.length > 0) {
      const active = PRICE_BANDS.filter((band) => bands.includes(band.id));
      const inBand = active.some((band) => product.price >= band.min && product.price <= band.max);
      if (!inBand) return false;
    }

    if (search) {
      const haystack = [
        product.name,
        product.tagline,
        product.description,
        product.category,
        product.keyIngredients.map((i) => i.name).join(" "),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    return true;
  });

  return sortProducts(results, sort);
}

export function sortProducts(products: Product[], sort: SortId): Product[] {
  const copy = [...products];

  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "newest":
      return copy.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
    default:
      return copy.sort(
        (a, b) =>
          Number(Boolean(b.isBestSeller)) - Number(Boolean(a.isBestSeller)) ||
          b.reviewCount - a.reviewCount,
      );
  }
}
