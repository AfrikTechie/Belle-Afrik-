import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/cart-page";

export const metadata: Metadata = {
  title: "Your bag",
  description: "Review the products in your Belle Afrik bag before checkout.",
};

export default function CartPage() {
  return <CartPageClient />;
}
