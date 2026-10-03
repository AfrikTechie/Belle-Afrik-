import Link from "next/link";
import { cn } from "@/lib/cn";

/** Belle Afrik brand mark: a stylised seed pod / leaf. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("h-8 w-8", className)}
      fill="none"
    >
      <circle cx="16" cy="16" r="16" fill="currentColor" opacity="0.1" />
      <path
        d="M16 6c4.2 3.6 6.6 7.8 6.6 12.2A6.6 6.6 0 0 1 16 25a6.6 6.6 0 0 1-6.6-6.8C9.4 13.8 11.8 9.6 16 6Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path d="M16 11.5V25" stroke="#fdfbf7" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({
  href = "/",
  className,
  onClick,
}: {
  href?: React.ComponentProps<typeof Link>["href"];
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label="Belle Afrik home"
      className={cn("group inline-flex items-center gap-2.5 text-moss", className)}
    >
      <BrandMark className="h-7 w-7 transition-transform duration-500 group-hover:rotate-6" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[19px] tracking-[0.22em] text-bark">BELLE AFRIK</span>
        <span className="mt-1 text-[9px] uppercase tracking-[0.34em] text-stone-light">
          Natural skincare
        </span>
      </span>
    </Link>
  );
}
