"use client";

import { Check, Mail } from "lucide-react";
import { useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Newsletter capture - validates locally and stores nothing. */
export function NewsletterForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("done");
    setEmail("");
  }

  const dark = variant === "dark";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div
        className={
          dark
            ? "flex items-center gap-2 rounded-full border border-shell/25 bg-shell/10 px-4 py-2"
            : "flex items-center gap-2 rounded-full border border-clay bg-white px-4 py-2"
        }
      >
        <Mail size={16} className={dark ? "text-shell/70" : "text-stone"} />
        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="Email address"
          aria-label="Email address"
          className={
            dark
              ? "min-w-0 flex-1 bg-transparent text-sm text-shell outline-none placeholder:text-shell/60"
              : "min-w-0 flex-1 bg-transparent text-sm text-bark outline-none placeholder:text-stone-light"
          }
        />
        <button
          type="submit"
          className={
            dark
              ? "rounded-full bg-shell px-4 py-2 text-xs font-medium text-bark transition hover:bg-sand"
              : "rounded-full bg-moss px-4 py-2 text-xs font-medium text-shell transition hover:bg-moss-dark"
          }
        >
          Join
        </button>
      </div>

      <p
        className={
          dark
            ? "mt-2 min-h-4 text-xs text-shell/70"
            : "mt-2 min-h-4 text-xs text-stone"
        }
        aria-live="polite"
      >
        {status === "error" ? (
          <span className="text-rose">Please enter a valid email address.</span>
        ) : status === "done" ? (
          <span className="inline-flex items-center gap-1.5 text-moss">
            <Check size={13} /> You are on the list - welcome to Belle Afrik.
          </span>
        ) : (
          "10% off your first order. Unsubscribe any time."
        )}
      </p>
    </form>
  );
}
