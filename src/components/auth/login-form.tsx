"use client";

import { Check, LoaderCircle, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleIcon } from "@/components/brand/google-icon";
import { BrandMark } from "@/components/brand/logo";
import { Button, LinkButton } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/cn";

interface LoginFormProps {
  initialMode: "signin" | "signup";
  redirectTo: string;
}

const BENEFITS = [
  "Track orders and reorder in one tap",
  "Your bag saved across every device",
  "10% off your first order as a member",
  "Early access to harvest launches",
];

const INPUT_CLASS =
  "mt-2 w-full rounded-xl border border-clay bg-white px-4 py-3 text-sm text-bark outline-none transition focus:border-moss";

export function LoginForm({ initialMode, redirectTo }: LoginFormProps) {
  const router = useRouter();
  const {
    user,
    pending,
    startGoogleSignIn,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    hydrated,
  } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const result =
      mode === "signin"
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(name, email, password);

    if (!result.ok) {
      setError(result.error ?? "Something went wrong. Try again.");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  if (hydrated && user) {
    return (
      <div className="container-page flex min-h-[70vh] items-center justify-center py-20">
        <div className="w-full max-w-md rounded-[32px] border border-clay/70 bg-sand/40 p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-moss text-lg font-medium text-shell">
            {user.initials}
          </span>
          <h1 className="mt-5 font-display text-3xl">You are signed in</h1>
          <p className="mt-2 text-sm text-stone">
            {user.name} · {user.email}
          </p>
          <p className="mt-1 text-xs text-moss">
            {user.method === "google" ? "Signed in with Google" : "Signed in with email"}
          </p>
          <div className="mt-8 space-y-2">
            <LinkButton href="/account" variant="moss" className="w-full">
              Go to your account
            </LinkButton>
            <Button type="button" variant="outline" className="w-full" onClick={signOut}>
              Sign out
            </Button>
          </div>
          <p className="mt-6 text-[11px] text-stone-light">
            This is a demo session stored in your browser only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-[calc(100vh-110px)] lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-moss p-12 text-shell lg:flex">
        <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-shell/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-bark/20 blur-3xl" />

        <div className="relative">
          <BrandMark className="h-10 w-10 text-shell" />
          <h2 className="mt-8 max-w-sm font-display text-4xl leading-tight">
            An account keeps your ritual in one place.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-shell/75">
            Save your routine, follow orders and get first look at seasonal harvests from our
            growers.
          </p>
        </div>

        <ul className="relative mt-12 space-y-3 text-sm text-shell/85">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-center gap-3">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-shell/15">
                <Check size={13} />
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        <blockquote className="relative mt-12 max-w-sm text-sm leading-relaxed text-shell/80">
          “Three months of the Marula oil and my skin looks like it did in my twenties.”
          <footer className="mt-3 text-xs uppercase tracking-[0.2em] text-shell/55">
            Amara O. · Lagos
          </footer>
        </blockquote>
      </aside>

      <section className="flex items-center justify-center px-5 py-14 sm:px-10">
        <div className="w-full max-w-md">
          <p className="text-[11px] uppercase tracking-[0.28em] text-stone-light">
            {mode === "signin" ? "Welcome back" : "Join Belle Afrik"}
          </p>
          <h1 className="mt-3 font-display text-4xl">
            {mode === "signin" ? "Sign in" : "Create your account"}
          </h1>
          <p className="mt-3 text-sm text-stone">
            {mode === "signin"
              ? "Use Google or your email address - whichever is quicker."
              : "One account for orders, refills and rewards points."}
          </p>

          <div className="mt-6 grid grid-cols-2 rounded-full bg-sand p-1 text-sm">
            {(["signin", "signup"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setMode(option);
                  setError(null);
                }}
                className={cn(
                  "rounded-full py-2.5 font-medium transition",
                  mode === option ? "bg-shell text-bark shadow-sm" : "text-stone",
                )}
              >
                {option === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="mt-6 w-full border-bark/20 bg-white"
            onClick={() => startGoogleSignIn(redirectTo)}
            disabled={pending}
          >
            {pending ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Redirecting to Google…
              </>
            ) : (
              <>
                <GoogleIcon size={18} />
                Continue with Google
              </>
            )}
          </Button>

          <div className="my-7 flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-stone-light">
            <span className="h-px flex-1 bg-clay" />
            or continue with email
            <span className="h-px flex-1 bg-clay" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" ? (
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-stone-light">Full name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={INPUT_CLASS}
                  placeholder="Amina Diallo"
                  autoComplete="name"
                  required
                />
              </label>
            ) : null}

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-stone-light">
                Email address
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={INPUT_CLASS}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-stone-light">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={INPUT_CLASS}
                placeholder="At least 6 characters"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <label className="inline-flex items-center gap-2 text-stone">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-clay accent-moss"
                />
                Keep me signed in
              </label>
              <Link href="/login" className="text-moss underline underline-offset-4">
                Forgot password?
              </Link>
            </div>

            {error ? (
              <p className="rounded-xl bg-rose-soft px-4 py-3 text-xs text-bark">{error}</p>
            ) : null}

            <Button type="submit" variant="moss" size="lg" className="w-full" disabled={pending}>
              {pending ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  {mode === "signin" ? "Signing in…" : "Creating account…"}
                </>
              ) : (
                <>{mode === "signin" ? "Sign in" : "Create account"}</>
              )}
            </Button>
          </form>

          <p className="mt-5 flex items-center gap-2 text-xs text-stone-light">
            <Lock size={12} /> Google sign-in is live. Email sign-in is still a demo.
          </p>
          <p className="mt-3 text-xs text-stone-light">
            By continuing you agree to our{" "}
            <Link href="/" className="underline underline-offset-2">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/" className="underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
