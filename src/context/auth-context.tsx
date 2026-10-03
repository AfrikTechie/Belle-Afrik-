"use client";

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession } from "next-auth/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { initialsOf } from "@/lib/format";

const STORAGE_KEY = "belle-afrik.session.v1";

export type AuthMethod = "google" | "email";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  method: AuthMethod;
  initials: string;
  memberSince: string;
  rewardsPoints: number;
  avatar?: string | null;
}

export interface GoogleAccount {
  id: string;
  name: string;
  email: string;
  /** Avatar colour used by the mock account chooser. */
  avatarColor: string;
}

/**
 * Kept for backwards compatibility while the UI migrates to real OAuth.
 * @deprecated Use real Google sign-in via `startGoogleSignIn` instead.
 */
export const DEMO_GOOGLE_ACCOUNTS: GoogleAccount[] = [
  {
    id: "g-amina",
    name: "Amina Diallo",
    email: "amina.diallo@gmail.com",
    avatarColor: "#5d6b4f",
  },
  {
    id: "g-belle-demo",
    name: "Belle Afrik Demo",
    email: "demo@belleafrik.com",
    avatarColor: "#b98a55",
  },
];

export interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  hydrated: boolean;
  /** True while a sign-in request is "in flight" (mock email or OAuth redirect setup). */
  pending: boolean;
  /** Always false now — the mock dialog is retired. Kept so old callers don't break. */
  isGoogleDialogOpen: boolean;
  startGoogleSignIn: (redirectTo?: string) => void;
  cancelGoogleSignIn: () => void;
  completeGoogleSignIn: (account: GoogleAccount) => Promise<AuthResult>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<AuthResult>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function displayNameFromEmail(email: string): string {
  const handle = email.split("@")[0] ?? "friend";
  return handle
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function slugFromEmail(email: string): string {
  return email.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function buildUser(name: string, email: string, method: AuthMethod, avatar?: string | null): AuthUser {
  return {
    id: `u-${slugFromEmail(email)}`,
    name,
    email,
    method,
    initials: initialsOf(name) || "BA",
    memberSince: "Sep 2026",
    rewardsPoints: 240,
    avatar: avatar ?? null,
  };
}

function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<AuthUser>;
  return typeof candidate.email === "string" && typeof candidate.name === "string";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [mockUser, setMockUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [pending, setPending] = useState(false);

  // Restore a previous MOCK (email) session. Real Google sessions come from next-auth.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isAuthUser(parsed) && parsed.method === "email") setMockUser(parsed);
      }
    } catch {
      // Ignore unreadable storage - treat the visitor as signed out.
    }
    setHydrated(true);
  }, []);

  // Keep the stored mock session in step with state.
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (mockUser) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Non-fatal: the session still lives in memory for this tab.
    }
  }, [mockUser, hydrated]);

  const googleUser: AuthUser | null = useMemo(() => {
    const profile = session?.user;
    if (!profile?.email) return null;
    return buildUser(
      profile.name ?? displayNameFromEmail(profile.email),
      profile.email,
      "google",
      profile.image ?? null,
    );
  }, [session]);

  // Real Google session wins; otherwise fall back to the mock email session.
  const user = googleUser ?? mockUser;
  const sessionReady = status !== "loading";

  const startGoogleSignIn = useCallback((redirectTo = "/account") => {
    setPending(true);
    void nextAuthSignIn("google", { callbackUrl: redirectTo }).finally(() => setPending(false));
  }, []);

  const cancelGoogleSignIn = useCallback(() => {
    setPending(false);
  }, []);

  const completeGoogleSignIn = useCallback(async (): Promise<AuthResult> => {
    return { ok: false, error: "Mock Google sign-in is retired. Using real Google OAuth now." };
  }, []);

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!EMAIL_PATTERN.test(email)) return { ok: false, error: "Enter a valid email address." };
      if (password.length < 6) {
        return { ok: false, error: "Password must be at least 6 characters." };
      }

      setPending(true);
      await wait(800); // Simulated request (demo email auth stays mock).
      setMockUser(buildUser(displayNameFromEmail(email), email, "email"));
      setPending(false);
      return { ok: true };
    },
    [],
  );

  const signUpWithEmail = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      if (name.trim().length < 2) return { ok: false, error: "Please tell us your name." };
      if (!EMAIL_PATTERN.test(email)) return { ok: false, error: "Enter a valid email address." };
      if (password.length < 6) {
        return { ok: false, error: "Password must be at least 6 characters." };
      }

      setPending(true);
      await wait(900);
      setMockUser(buildUser(name.trim(), email, "email"));
      setPending(false);
      return { ok: true };
    },
    [],
  );

  const signOut = useCallback(() => {
    setMockUser(null);
    if (googleUser) void nextAuthSignOut({ callbackUrl: "/" });
  }, [googleUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      hydrated: hydrated && sessionReady,
      pending,
      isGoogleDialogOpen: false,
      startGoogleSignIn,
      cancelGoogleSignIn,
      completeGoogleSignIn,
      signInWithEmail,
      signUpWithEmail,
      signOut,
    }),
    [
      user,
      hydrated,
      sessionReady,
      pending,
      startGoogleSignIn,
      cancelGoogleSignIn,
      completeGoogleSignIn,
      signInWithEmail,
      signUpWithEmail,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
