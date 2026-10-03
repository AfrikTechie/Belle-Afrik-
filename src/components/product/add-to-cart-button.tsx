"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/cn";

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  /** Button text; the success label is derived from it. */
  children?: React.ReactNode;
  variant?: "primary" | "moss" | "outline" | "soft" | "ghost" | "inverse";
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Close/open the mini cart after adding (default: open). */
  openDrawer?: boolean;
  showIcon?: boolean;
}

export function AddToCartButton({
  productId,
  quantity = 1,
  children = "Add to bag",
  variant = "moss",
  size = "md",
  className,
  openDrawer = true,
  showIcon = true,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [justAdded]);

  return (
    <Button
      type="button"
      variant={justAdded ? "primary" : variant}
      size={size}
      className={cn(className)}
      aria-live="polite"
      onClick={() => {
        addItem(productId, quantity, { openDrawer });
        setJustAdded(true);
      }}
    >
      {justAdded ? <Check size={16} /> : showIcon ? <ShoppingBag size={16} /> : null}
      {justAdded ? "Added to bag" : children}
    </Button>
  );
}
