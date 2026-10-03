import type { ReactElement } from "react";
import { cn } from "@/lib/cn";
import type { BottleShape, ProductPalette } from "@/lib/products";

/**
 * <ProductArtwork /> draws a stylised bottle as pure SVG.
 *
 * The demo build ships no photography - every product visual is generated from
 * its `shape` + `palette`, so the storefront looks finished without borrowing
 * imagery from anywhere else. All ids are namespaced by slug + variant so the
 * same product can be rendered several times on one page.
 */

interface ShapePaint {
  bottle: string;
  cap: string;
  accent: string;
  uid: string;
}

interface LabelGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}

const LABEL_GEOMETRY: Record<BottleShape, LabelGeometry> = {
  dropper: { x: 163, y: 208, width: 74, height: 96, radius: 8 },
  pump: { x: 160, y: 208, width: 80, height: 94, radius: 8 },
  jar: { x: 150, y: 214, width: 100, height: 84, radius: 12 },
  tube: { x: 168, y: 196, width: 64, height: 80, radius: 8 },
  bar: { x: 132, y: 190, width: 136, height: 62, radius: 18 },
  flask: { x: 165, y: 236, width: 70, height: 74, radius: 10 },
};

function glassGradient(uid: string, bottle: string) {
  return (
    <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
      <stop offset="45%" stopColor="#ffffff" stopOpacity="0.05" />
      <stop offset="100%" stopColor={bottle} stopOpacity="0.35" />
    </linearGradient>
  );
}

const SILHOUETTES: Record<BottleShape, (paint: ShapePaint) => ReactElement> = {
  dropper: ({ bottle, cap, accent, uid }) => (
    <g>
      <rect x="179" y="74" width="42" height="52" rx="10" fill={cap} />
      <rect x="186" y="122" width="28" height="30" fill={cap} opacity="0.85" />
      <rect x="154" y="148" width="92" height="180" rx="18" fill={bottle} />
      <rect x="154" y="148" width="92" height="180" rx="18" fill={`url(#${uid}-glass)`} />
      <rect x="196" y="152" width="5" height="172" rx="2.5" fill="#ffffff" opacity="0.25" />
      <ellipse cx="200" cy="150" rx="30" ry="6" fill="#000000" opacity="0.08" />
      <rect x="176" y="132" width="48" height="10" rx="4" fill={accent} opacity="0.6" />
    </g>
  ),
  pump: ({ bottle, cap, accent, uid }) => (
    <g>
      <rect x="214" y="120" width="30" height="11" rx="5" fill={cap} />
      <rect x="184" y="110" width="34" height="34" rx="8" fill={cap} />
      <rect x="190" y="142" width="22" height="26" fill={cap} opacity="0.85" />
      <rect x="150" y="166" width="100" height="162" rx="16" fill={bottle} />
      <rect x="150" y="166" width="100" height="162" rx="16" fill={`url(#${uid}-glass)`} />
      <rect x="192" y="170" width="5" height="154" rx="2.5" fill="#ffffff" opacity="0.25" />
      <ellipse cx="200" cy="168" rx="34" ry="6" fill="#000000" opacity="0.08" />
      <rect x="150" y="272" width="100" height="56" rx="16" fill={accent} opacity="0.45" />
    </g>
  ),
  jar: ({ bottle, cap, accent, uid }) => (
    <g>
      <rect x="132" y="158" width="136" height="38" rx="14" fill={cap} />
      <rect x="140" y="186" width="120" height="126" rx="24" fill={bottle} />
      <rect x="140" y="186" width="120" height="126" rx="24" fill={`url(#${uid}-glass)`} />
      <rect x="152" y="196" width="6" height="106" rx="3" fill="#ffffff" opacity="0.28" />
      <rect x="132" y="164" width="136" height="8" rx="4" fill={accent} opacity="0.5" />
      <ellipse cx="200" cy="188" rx="52" ry="8" fill="#000000" opacity="0.08" />
    </g>
  ),
  tube: ({ bottle, cap, accent, uid }) => (
    <g>
      <rect x="178" y="86" width="44" height="42" rx="10" fill={cap} />
      <path
        d="M170 130h60c10 0 16 8 15 18l-12 132c-1 10-9 18-19 18h-28c-10 0-18-8-19-18l-12-132c-1-10 5-18 15-18Z"
        fill={bottle}
      />
      <path
        d="M170 130h60c10 0 16 8 15 18l-12 132c-1 10-9 18-19 18h-28c-10 0-18-8-19-18l-12-132c-1-10 5-18 15-18Z"
        fill={`url(#${uid}-glass)`}
      />
      <rect x="158" y="288" width="84" height="14" rx="6" fill={cap} opacity="0.75" />
      <rect x="182" y="286" width="5" height="14" rx="2.5" fill={accent} opacity="0.6" />
    </g>
  ),
  bar: ({ bottle, cap, accent, uid }) => (
    <g>
      <rect x="118" y="168" width="164" height="106" rx="30" fill={bottle} />
      <rect x="118" y="168" width="164" height="106" rx="30" fill={`url(#${uid}-glass)`} />
      <rect x="132" y="180" width="136" height="82" rx="24" fill={accent} opacity="0.45" />
      <ellipse cx="200" cy="254" rx="70" ry="10" fill="#000000" opacity="0.08" />
      <circle cx="200" cy="221" r="13" fill={cap} opacity="0.5" />
    </g>
  ),
  flask: ({ bottle, cap, accent, uid }) => (
    <g>
      <rect x="188" y="122" width="26" height="40" rx="6" fill={cap} />
      <rect x="176" y="104" width="50" height="24" rx="7" fill={cap} />
      <path
        d="M182 158h36l14 30v112a16 16 0 0 1-16 16h-32a16 16 0 0 1-16-16V188Z"
        fill={bottle}
      />
      <path
        d="M182 158h36l14 30v112a16 16 0 0 1-16 16h-32a16 16 0 0 1-16-16V188Z"
        fill={`url(#${uid}-glass)`}
      />
      <rect x="196" y="196" width="5" height="108" rx="2.5" fill="#ffffff" opacity="0.25" />
      <rect x="160" y="286" width="80" height="48" rx="14" fill={accent} opacity="0.45" />
    </g>
  ),
};

/** Small botanical sprigs layered behind the bottle for depth. */
function Botanicals({ color }: { color: string }) {
  return (
    <g stroke={color} strokeWidth="2" fill="none" opacity="0.32">
      <path d="M46 356C58 316 60 268 44 228" />
      <path d="M44 262c-22-6-32-24-30-44 20 2 34 18 30 44Z" fill={color} fillOpacity="0.18" />
      <path d="M52 300c22-8 30-28 26-48-20 4-32 22-26 48Z" fill={color} fillOpacity="0.18" />
      <path d="M352 372c-10-38-8-84 10-122" />
      <path d="M356 288c22-4 34-20 34-40-20 0-36 14-34 40Z" fill={color} fillOpacity="0.18" />
      <path d="M348 336c-22-6-32-24-30-44 20 2 34 18 30 44Z" fill={color} fillOpacity="0.18" />
    </g>
  );
}

export interface ProductArtworkProps {
  shape: BottleShape;
  palette: ProductPalette;
  /** Keeps gradient ids unique when a product is drawn more than once. */
  slug: string;
  name: string;
  /** Optional variant suffix for thumbnails and galleries. */
  variant?: "a" | "b" | "c";
  /** Show the printed label. */
  showLabel?: boolean;
  className?: string;
}

function initialsFromName(name: string): string {
  return name
    .replace(/[^A-Za-z\s&]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function ProductArtwork({
  shape,
  palette,
  slug,
  name,
  variant = "a",
  showLabel = true,
  className,
}: ProductArtworkProps) {
  const uid = `${slug}-${variant}`;
  const label = LABEL_GEOMETRY[shape];
  const initials = initialsFromName(name) || "BA";

  return (
    <svg
      viewBox="0 0 400 400"
      role="img"
      aria-label={`${name} illustration`}
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.backdrop} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id={`${uid}-halo`} cx="50%" cy="48%" r="52%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        {glassGradient(uid, palette.bottle)}
      </defs>

      <rect width="400" height="400" fill={`url(#${uid}-bg)`} />
      <Botanicals color={palette.cap} />
      <circle cx="200" cy="196" r="150" fill={`url(#${uid}-halo)`} />
      <ellipse cx="200" cy="342" rx="94" ry="12" fill={palette.cap} opacity="0.14" />

      {SILHOUETTES[shape]({
        bottle: palette.bottle,
        cap: palette.cap,
        accent: palette.accent,
        uid,
      })}

      {showLabel ? (
        <g>
          <rect
            x={label.x}
            y={label.y}
            width={label.width}
            height={label.height}
            rx={label.radius}
            fill={palette.accent}
            opacity="0.95"
          />
          <text
            x={label.x + label.width / 2}
            y={label.y + 18}
            textAnchor="middle"
            fontSize="6.5"
            letterSpacing="1.8"
            fill={palette.cap}
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            BELLE AFRIK
          </text>
          <text
            x={label.x + label.width / 2}
            y={label.y + label.height / 2 + 12}
            textAnchor="middle"
            fontSize={Math.min(34, label.height * 0.42)}
            fill={palette.cap}
            fontFamily="Georgia, 'Times New Roman', serif"
          >
            {initials}
          </text>
          <line
            x1={label.x + label.width * 0.24}
            y1={label.y + label.height - 20}
            x2={label.x + label.width * 0.76}
            y2={label.y + label.height - 20}
            stroke={palette.cap}
            strokeWidth="0.8"
            opacity="0.45"
          />
          <text
            x={label.x + label.width / 2}
            y={label.y + label.height - 9}
            textAnchor="middle"
            fontSize="6"
            letterSpacing="1.2"
            fill={palette.cap}
            opacity="0.75"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            NATURAL SKINCARE
          </text>
        </g>
      ) : null}
    </svg>
  );
}
