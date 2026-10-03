"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { MOCK_ORDERS } from "@/lib/content";

/**
 * Retired mock Google chooser.
 * Real Google OAuth now happens on accounts.google.com via next-auth,
 * so this renders nothing. Kept so the old import in git history doesn't break.
 */
export function GoogleSignInDialog() {
  return null;
}

export function GoogleAccountHint() {
  const { user } = useAuth();
  if (!user || user.method !== "google") return null;
  return (
    <p className="mt-1 text-xs text-moss">
      Signed in with Google ·{" "}
      <Link href="/account" className="underline underline-offset-2">
        {MOCK_ORDERS.length} demo orders
      </Link>
    </p>
  );
}
