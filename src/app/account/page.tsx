import type { Metadata } from "next";
import { AccountClient } from "@/components/account/account-client";

export const metadata: Metadata = {
  title: "Your account",
  description: "Orders, rewards and saved details for your Belle Afrik account.",
};

export default function AccountPage() {
  return <AccountClient />;
}
