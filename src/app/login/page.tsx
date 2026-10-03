import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to Belle Afrik with Google or email to check out faster and track your orders.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const mode = params.mode === "signup" ? "signup" : "signin";
  const redirectTo = typeof params.redirect === "string" ? params.redirect : "/account";

  return <LoginForm initialMode={mode} redirectTo={redirectTo} />;
}
