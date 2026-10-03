import { ArrowRight, Leaf, Recycle, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { ProductArtwork } from "@/components/product/product-artwork";
import { LinkButton } from "@/components/ui/button";
import { COLLECTIONS, VALUE_PROPS } from "@/lib/content";
import { getProductsByCategory } from "@/lib/queries";

const VALUE_ICONS = [Leaf, Sparkles, Recycle, ShieldCheck];

/** Value prop strip shown under the hero. */
export function ValueStrip() {
  return (
    <section className="border-y border-clay/60 bg-sand/60">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {VALUE_PROPS.map((value, index) => {
          const Icon = VALUE_ICONS[index % VALUE_ICONS.length];
          return (
            <div key={value.title} className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-shell text-moss">
                <Icon size={18} />
              </span>
              <div>
                <p className="text-sm font-medium">{value.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-stone">{value.copy}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** "Shop by step" collection cards. */
export function CollectionGrid() {
  return (
    <section className="container-page py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-stone-light">Shop by step</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Build your ritual</h2>
        </div>
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 text-sm text-moss transition hover:text-moss-dark"
        >
          View all products
          <ArrowRight size={15} className="transition group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {COLLECTIONS.map((collection) => {
          const preview =
            collection.category === "all"
              ? []
              : getProductsByCategory(collection.category, 1);

          return (
            <Link
              key={collection.title}
              href={collection.href}
              className="group overflow-hidden rounded-[28px] border border-clay/70 bg-sand/50 transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(43,38,33,0.6)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {preview[0] ? (
                  <ProductArtwork
                    shape={preview[0].shape}
                    palette={preview[0].palette}
                    slug={preview[0].slug}
                    name={preview[0].name}
                    variant="c"
                    showLabel={false}
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                ) : null}
              </div>
              <div className="p-5">
                <p className="font-display text-xl">{collection.title}</p>
                <p className="mt-1.5 text-sm text-stone">{collection.copy}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-moss">
                  Explore
                  <ArrowRight size={13} className="transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <LinkButton href="/shop?sort=newest" variant="soft">
          See what is new <ArrowRight size={15} />
        </LinkButton>
      </div>
    </section>
  );
}
