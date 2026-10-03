import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { upsertGoogleUser } from "@/lib/db";

/**
 * Real Google OAuth for Belle Afrik (Auth.js v5).
 * Credentials come from `.env.local`:
 *   AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET / AUTH_SECRET
 *
 * Every successful Google sign-in upserts the user into
 * `public.users` in Supabase via the REST API (SUPABASE_ANON_KEY).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          await upsertGoogleUser({
            email: user.email,
            name: user.name,
            avatarUrl: user.image,
            providerAccountId: account.providerAccountId,
          });
        } catch (error) {
          // Never block login if Supabase is unreachable — log and continue.
          console.error("[auth] failed to save user to Supabase:", error);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
});
