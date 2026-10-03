import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
  label?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  size = "md",
  className,
  label = "Quantity",
}: QuantityStepperProps) {
  const buttonSize = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-bark/15 bg-shell",
        className,
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(
          "grid place-items-center rounded-full text-bark transition hover:bg-sand disabled:opacity-40",
          buttonSize,
        )}
      >
        <Minus size={14} />
      </button>
      <span
        className={cn("min-w-8 text-center font-medium tabular-nums", textSize)}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(
          "grid place-items-center rounded-full text-bark transition hover:bg-sand disabled:opacity-40",
          buttonSize,
        )}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
