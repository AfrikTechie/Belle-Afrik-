import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { getBestSellers } from "@/lib/queries";

export function BestSellers() {
  const products = getBestSellers(4);

  return (
    <section className="bg-sand/50 py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-light">
              Loved by 38,000+ routines
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">Bestsellers</h2>
          </div>
          <Link
            href="/shop?sort=rating"
            className="group inline-flex items-center gap-2 text-sm text-moss transition hover:text-moss-dark"
          >
            Shop all bestsellers
            <ArrowRight size={15} className="transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
