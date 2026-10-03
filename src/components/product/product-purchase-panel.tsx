"use client";

import { Check, Heart, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { Button } from "@/components/ui/button";
import { FREE_SHIPPING_THRESHOLD, useCart } from "@/context/cart-context";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/products";

/** Quantity + add-to-bag controls for the product detail page. */
export function ProductPurchasePanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [subscribe, setSubscribe] = useState(false);

  const subscriptionPrice = Math.round(product.price * 0.85 * 100) / 100;
  const unitPrice = subscribe ? subscriptionPrice : product.price;

  function handleAdd() {
    addItem(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-4">
        <QuantityStepper value={quantity} onChange={setQuantity} label={`Quantity of ${product.name}`} />
        <Button
          type="button"
          variant={added ? "primary" : "moss"}
          size="lg"
          className="min-w-[220px] flex-1"
          onClick={handleAdd}
        >
          {added ? <Check size={17} /> : <ShoppingBag size={17} />}
          {added ? "Added to bag" : `Add to bag - ${formatPrice(unitPrice * quantity)}`}
        </Button>
        <button
          type="button"
          onClick={() => setSaved((current) => !current)}
          aria-pressed={saved}
          aria-label={saved ? "Remove from wishlist" : "Save for later"}
          className={cn(
            "grid h-12 w-12 place-items-center rounded-full border transition",
            saved ? "border-rose bg-rose-soft text-rose" : "border-bark/15 text-bark hover:border-bark",
          )}
        >
          <Heart size={18} className={saved ? "fill-rose" : ""} />
        </button>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-clay/70 bg-sand/40 p-4">
        <input
          type="checkbox"
          checked={subscribe}
          onChange={(event) => setSubscribe(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-clay accent-moss"
        />
        <span className="text-sm">
          <span className="font-medium">Subscribe &amp; save 15%</span>
          <span className="mt-0.5 block text-xs text-stone">
            Delivered every 6 weeks · {formatPrice(subscriptionPrice)} per delivery · pause or cancel
            any time.
          </span>
        </span>
      </label>

      <p className="mt-5 flex items-center gap-2 text-xs text-stone">
        <Truck size={14} className="text-moss" />
        Free carbon-neutral shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)} · {product.stockNote}
      </p>

      <div className="mt-4 rounded-2xl bg-moss-soft/70 p-4 text-xs leading-relaxed text-bark-soft">
        <p className="font-medium text-moss-dark">60-day skin promise</p>
        <p className="mt-1">
          If your skin does not agree with it, we refund the full bottle - even if it is half used.{" "}
          <Link href="/" className="underline underline-offset-2">
            Read the policy
          </Link>
        </p>
      </div>
    </div>
  );
}
