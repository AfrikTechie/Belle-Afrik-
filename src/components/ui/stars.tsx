import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

interface StarsProps {
  rating: number;
  /** Paints empty stars when true (used on sand-coloured panels). */
  className?: string;
  size?: number;
}

export function Stars({ rating, className, size = 14 }: StarsProps) {
  const rounded = Math.round(rating);

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          width={size}
          height={size}
          strokeWidth={1.5}
          className={
            index <= rounded ? "fill-gold text-gold" : "fill-transparent text-stone-light"
          }
        />
      ))}
    </span>
  );
}

export function RatingLine({
  rating,
  reviewCount,
  className,
}: {
  rating: number;
  reviewCount: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-xs text-stone", className)}>
      <Stars rating={rating} />
      <span>
        {rating.toFixed(1)}
        <span className="text-stone-light"> ({reviewCount})</span>
      </span>
    </span>
  );
}
