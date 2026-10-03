import { checkUsersTable } from "@/lib/db";

export async function GET() {
  const tables = { users: await checkUsersTable() };
  return Response.json({
    ok: tables.users.exists,
    tables,
    hint: tables.users.exists
      ? "users table reachable — Google sign-ins will be saved."
      : "users table NOT reachable. Run supabase/migrations/001_create_users.sql in Supabase SQL Editor, and add SUPABASE_ANON_KEY to .env.local.",
  });
}
