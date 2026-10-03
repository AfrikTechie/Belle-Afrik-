import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Belle Afrik order. Demo checkout - no payment is processed.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
