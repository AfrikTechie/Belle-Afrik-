/**
 * Catalog domain: types, taxonomy and lookup helpers.
 *
 * All product data is MOCK data (see ./catalog.ts) - nothing here talks to a
 * backend. Swapping in a real API means replacing the helpers at the bottom of
 * this file with fetches; the component layer never reads the raw array.
 */

export type ProductCategory =
  | "cleansers"
  | "toners"
  | "serums"
  | "moisturizers"
  | "masks"
  | "body";

export type SkinConcern =
  | "hydration"
  | "brightening"
  | "firming"
  | "clarity"
  | "soothing"
  | "texture";

/** Silhouette used by <ProductArtwork /> to draw the bottle. */
export type BottleShape = "dropper" | "pump" | "jar" | "tube" | "bar" | "flask";

export interface Ingredient {
  name: string;
  benefit: string;
}

export interface ProductPalette {
  /** Page/background wash behind the bottle. */
  backdrop: string;
  /** Main bottle body colour. */
  bottle: string;
  /** Cap / pump / lid colour. */
  cap: string;
  /** Label + highlight colour. */
  accent: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: ProductCategory;
  concerns: SkinConcern[];
  size: string;
  shape: BottleShape;
  palette: ProductPalette;
  keyIngredients: Ingredient[];
  howToUse: string[];
  rating: number;
  reviewCount: number;
  badges: string[];
  skinTypes: string[];
  /** Short "in stock" style note shown on the PDP. */
  stockNote: string;
  isBestSeller?: boolean;
  isNew?: boolean;
}

export const CATEGORIES: { id: ProductCategory; label: string; blurb: string }[] = [
  { id: "cleansers", label: "Cleansers", blurb: "Gentle washes for mornings and nights" },
  { id: "toners", label: "Toners & Mists", blurb: "Hydrating layers between every step" },
  { id: "serums", label: "Serums & Oils", blurb: "Concentrated botanical actives" },
  { id: "moisturizers", label: "Moisturizers", blurb: "Barrier-loving creams and butters" },
  { id: "masks", label: "Masks & Peels", blurb: "Weekly resets for tired skin" },
  { id: "body", label: "Body", blurb: "Head-to-toe glow rituals" },
];

export const CONCERNS: { id: SkinConcern; label: string }[] = [
  { id: "hydration", label: "Dryness & hydration" },
  { id: "brightening", label: "Dullness & brightening" },
  { id: "firming", label: "Fine lines & firming" },
  { id: "clarity", label: "Blemishes & clarity" },
  { id: "soothing", label: "Redness & sensitivity" },
  { id: "texture", label: "Texture & pores" },
];

export const PRICE_BANDS = [
  { id: "under-30", label: "Under $30", min: 0, max: 29.99 },
  { id: "30-50", label: "$30 - $50", min: 30, max: 50 },
  { id: "over-50", label: "$50 and up", min: 50.01, max: Number.MAX_SAFE_INTEGER },
] as const;

export type PriceBandId = (typeof PRICE_BANDS)[number]["id"];

export const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
  { id: "newest", label: "Newest" },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]["id"];

export function categoryLabel(category: ProductCategory): string {
  return CATEGORIES.find((entry) => entry.id === category)?.label ?? "Shop";
}

export function concernLabel(concern: SkinConcern): string {
  return CONCERNS.find((entry) => entry.id === concern)?.label ?? concern;
}
