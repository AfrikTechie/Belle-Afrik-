/**
 * Supabase REST client for Belle Afrik (no direct Postgres needed).
 * Uses the project URL + publishable/anon key Relay-style env naming:
 *   SUPABASE_URL
 *   SUPABASE_ANON_KEY  (or SUPABASE_PUBLISHABLE_KEY)
 *   SUPABASE_SERVICE_ROLE_KEY (optional, server-only — bypasses RLS)
 *
 * Your project ref vvfoaxsfkhcdgonbhqcv resolves to:
 *   https://vvfoaxsfkhcdgonbhqcv.supabase.co
 */

function supabaseUrl(): string {
  const direct = (process.env.SUPABASE_URL ?? "").replace(/^["']|["']$/g, "").trim();
  if (direct) return direct.replace(/\/$/, "");
  // Fall back to the known project ref (public, non-secret).
  return "https://vvfoaxsfkhcdgonbhqcv.supabase.co";
}

function supabaseKey(): string {
  const candidates = [
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.SUPABASE_ANON_KEY,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  ];
  for (const candidate of candidates) {
    const cleaned = (candidate ?? "").replace(/^["']|["']$/g, "").trim();
    if (cleaned) return cleaned;
  }
  throw new Error(
    "Missing Supabase API key. Add SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) to .env.local — " +
      "find it in Supabase Dashboard > Project Settings > API > anon public key.",
  );
}

export type DbUser = {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  provider: string;
  provider_account_id: string | null;
  last_sign_in_at: string;
  created_at: string;
};

async function rest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${supabaseUrl()}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: supabaseKey(),
      Authorization: `Bearer ${supabaseKey()}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Supabase REST ${response.status}: ${body.slice(0, 300)}`);
  }
  return (await response.json()) as T;
}

/** Upsert a Google user on every sign-in; returns the stored row. */
export async function upsertGoogleUser(input: {
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  providerAccountId?: string | null;
}): Promise<DbUser> {
  const now = new Date().toISOString();
  const rows = await rest<DbUser[]>("/users?on_conflict=email", {
    method: "POST",
    body: JSON.stringify({
      email: input.email.toLowerCase(),
      name: input.name ?? null,
      avatar_url: input.avatarUrl ?? null,
      provider: "google",
      provider_account_id: input.providerAccountId ?? null,
      last_sign_in_at: now,
      updated_at: now,
    }),
  });
  const row = rows[0];
  if (!row) throw new Error("Failed to upsert user into public.users");
  return row;
}

/** Check the users table exists + is reachable (used by the health endpoint). */
export async function checkUsersTable(): Promise<{ exists: boolean; count?: number; error?: string }> {
  try {
    const rows = await rest<Array<Record<string, unknown>>>(
      "/users?select=id&limit=1",
      { method: "GET", headers: { Prefer: "count=exact" } },
    );
    return { exists: true, count: Array.isArray(rows) ? rows.length : undefined };
  } catch (error) {
    return { exists: false, error: error instanceof Error ? error.message : String(error) };
  }
}

