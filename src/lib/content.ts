import type { LinkProps } from "next/link";
import type { ProductCategory, SkinConcern } from "./products";

/** Static marketing content for the storefront (all mock copy). */

/**
 * Reuse the href type from next/link so every link below is checked against
 * the routes that actually exist (Next 16 typed routes).
 */
type Href = LinkProps["href"];

export interface NavLink {
  label: string;
  href: Href;
  /** Optional catalog filters applied when the link is followed. */
  category?: ProductCategory;
  concern?: SkinConcern;
}

export const PRIMARY_NAV: NavLink[] = [
  { label: "Shop all", href: "/shop" },
  { label: "Face", href: "/shop?category=cleansers", category: "cleansers" },
  { label: "Serums & oils", href: "/shop?category=serums", category: "serums" },
  { label: "Body", href: "/shop?category=body", category: "body" },
  { label: "Shop by concern", href: "/shop?concern=hydration", concern: "hydration" },
];

export const ANNOUNCEMENTS = [
  "Free carbon-neutral shipping over $50",
  "New: Kalahari Melon Mist",
  "Refill pouches now available on 6 bestsellers",
];

export const COLLECTIONS: {
  title: string;
  copy: string;
  href: Href;
  category: ProductCategory | "all";
}[] = [
  {
    title: "Cleanse",
    copy: "Milk, gel and bar cleansers that respect your barrier.",
    href: "/shop?category=cleansers",
    category: "cleansers",
  },
  {
    title: "Treat",
    copy: "Serums and oils built on cold-pressed African botanicals.",
    href: "/shop?category=serums",
    category: "serums",
  },
  {
    title: "Seal",
    copy: "Creams, butters and balms for a soft, cushioned finish.",
    href: "/shop?category=moisturizers",
    category: "moisturizers",
  },
  {
    title: "Body",
    copy: "Head-to-toe glow, from the shower to the last drop.",
    href: "/shop?category=body",
    category: "body",
  },
];

export const HERO_STATS = [
  { value: "38k+", label: "Rituals shipped" },
  { value: "4.8/5", label: "Average rating" },
  { value: "100%", label: "Vegan formulas" },
];

export const INGREDIENTS_STORY = [
  {
    name: "Marula",
    origin: "Namibia & Botswana",
    copy: "Cold-pressed from hand-harvested kernels, rich in oleic acid and antioxidants.",
  },
  {
    name: "Baobab",
    origin: "Limpopo Valley",
    copy: "The tree of life - its seed oil restores suppleness and holds water in the skin.",
  },
  {
    name: "Rooibos",
    origin: "Cederberg, South Africa",
    copy: "Fermented for potency, a gentle antioxidant that brightens without irritation.",
  },
  {
    name: "Shea",
    origin: "Northern Ghana",
    copy: "Women-led cooperatives, unrefined and whipped into every cream we make.",
  },
];

export const RITUAL_STEPS = [
  {
    step: "01",
    title: "Cleanse",
    copy: "Start with a milk or gel cleanser to lift the day without stripping.",
  },
  {
    step: "02",
    title: "Treat",
    copy: "Layer a mist or serum onto damp skin so actives travel deeper.",
  },
  {
    step: "03",
    title: "Seal",
    copy: "Press in an oil or cream to lock hydration where it belongs.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "The Marula Glow Oil replaced three products on my shelf. Two weeks in and my skin looks rested.",
    name: "Amara O.",
    location: "Lagos, NG",
    rating: 5,
    product: "Marula Glow Face Oil",
  },
  {
    quote:
      "I have rosacea and the Shea Cloud Moisturizer is the first cream that did not sting. It is a forever repurchase.",
    name: "Claire D.",
    location: "Lyon, FR",
    rating: 5,
    product: "Shea Cloud Moisturizer",
  },
  {
    quote:
      "The black soap cleanser cleared my chin congestion in a month. My barrier feels stronger, not stripped.",
    name: "Josh M.",
    location: "London, UK",
    rating: 4,
    product: "African Black Soap Gel Cleanser",
  },
];

export const JOURNAL_POSTS = [
  {
    title: "How to layer oils and serums without pilling",
    excerpt: "A five-step order of operations for a routine that actually absorbs.",
    category: "Rituals",
    readTime: "4 min read",
  },
  {
    title: "Marula, baobab, shea: what each oil actually does",
    excerpt: "Our three hero botanicals, decoded by the chemists who formulate with them.",
    category: "Ingredients",
    readTime: "6 min read",
  },
  {
    title: "Building a routine for reactive skin",
    excerpt: "Fewer steps, gentler acids and the two ingredients worth keeping in rotation.",
    category: "Skin school",
    readTime: "5 min read",
  },
];

export const VALUE_PROPS = [
  { title: "Vegan & cruelty-free", copy: "Leaping Bunny certified, never tested on animals." },
  { title: "Botanical actives", copy: "Ethically sourced, cold-pressed, traceable to the farm." },
  { title: "Small batch", copy: "Made weekly in Cape Town so nothing sits on a shelf." },
  { title: "Refill & recycle", copy: "Return five empties for a free full-size product." },
];

export const FOOTER_COLUMNS: { title: string; links: { label: string; href: Href }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/shop" },
      { label: "Best sellers", href: "/shop?sort=rating" },
      { label: "New arrivals", href: "/shop?sort=newest" },
      { label: "Body rituals", href: "/shop?category=body" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our story", href: "/" },
      { label: "Ingredient index", href: "/" },
      { label: "Sustainability", href: "/" },
      { label: "Journal", href: "/" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact us", href: "/" },
      { label: "Shipping & returns", href: "/" },
      { label: "Track your order", href: "/account" },
      { label: "FAQ", href: "/" },
    ],
  },
];

export const MOCK_REVIEWS = [
  {
    author: "Fatima B.",
    rating: 5,
    title: "My skin drinks it",
    body: "Absorbs in seconds and I wake up with a soft, even tone. The glass bottle feels lovely too.",
    date: "2 weeks ago",
  },
  {
    author: "Elena R.",
    rating: 5,
    title: "Worth the price",
    body: "I use it three nights a week and a little goes far. No irritation at all on my sensitive skin.",
    date: "1 month ago",
  },
  {
    author: "Thabo N.",
    rating: 4,
    title: "Great, wish it was bigger",
    body: "Texture and scent are beautiful. I just wish the 30 ml lasted a little longer.",
    date: "1 month ago",
  },
];

export const MOCK_ORDERS = [
  {
    id: "BA-10482",
    date: "12 Sep 2026",
    status: "Delivered",
    total: 118,
    items: ["Marula Glow Face Oil", "Kalahari Melon Mist"],
  },
  {
    id: "BA-10219",
    date: "28 Jul 2026",
    status: "Delivered",
    total: 86,
    items: ["Shea Cloud Moisturizer", "Turmeric Bar"],
  },
  {
    id: "BA-10054",
    date: "03 Jun 2026",
    status: "Refunded",
    total: 38,
    items: ["Moringa Detox Clay Mask"],
  },
];
