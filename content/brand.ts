/* Base brand kit · Rafiul Haider (personal brand)
 * Genre: dark editorial, game-intro boot · Theme: dark.
 * Single source of truth for palette, type, voice, and mark usage.
 * Tokens ship in tokens.css; hex values below are exact sRGB equivalents
 * of those oklch tokens for non-CSS use.
 */

export const brand = {
  name: "Rafiul Haider",
  wordmark: "RAF.DEV",
  tagline: "Analysis you can act on.",
  voice: [
    "Editorial and direct: short sentences, plain words, no hype.",
    "Evidence over adjectives: numbers and outcomes, never invented claims.",
    "Warm but professional: first person, sparing humor, no slang.",
  ] as string[],
} as const;

export type BrandSwatch = {
  name: string;
  role: string;
  oklch: string;
  hex: string;
};

export const palette: BrandSwatch[] = [
  {
    name: "paper",
    role: "Page ground",
    oklch: "oklch(16% 0.02 25)",
    hex: "#150a09",
  },
  {
    name: "paper-2",
    role: "Raised panels, wells",
    oklch: "oklch(20% 0.025 28)",
    hex: "#201210",
  },
  {
    name: "paper-3",
    role: "Highest ground tint",
    oklch: "oklch(25% 0.03 30)",
    hex: "#2f1c19",
  },
  {
    name: "rule",
    role: "Hairline rules, borders",
    oklch: "oklch(32% 0.03 30)",
    hex: "#412d2a",
  },
  {
    name: "rule-2",
    role: "Strong rules",
    oklch: "oklch(68% 0.035 40)",
    hex: "#ac9288",
  },
  {
    name: "muted",
    role: "Secondary text, kickers",
    oklch: "oklch(66% 0.03 38)",
    hex: "#a38c85",
  },
  {
    name: "neutral",
    role: "Mid tone for large fills",
    oklch: "oklch(78% 0.03 42)",
    hex: "#c9b2a9",
  },
  {
    name: "ink-2",
    role: "Body-adjacent emphasis",
    oklch: "oklch(86% 0.035 48)",
    hex: "#e5cbbe",
  },
  {
    name: "ink",
    role: "Primary text",
    oklch: "oklch(92% 0.04 50)",
    hex: "#fcdecd",
  },
  {
    name: "accent",
    role: "Sparing emphasis only",
    oklch: "oklch(66% 0.14 30)",
    hex: "#da6d5d",
  },
  {
    name: "accent-ink",
    role: "Accent text on dark",
    oklch: "oklch(72% 0.12 32)",
    hex: "#e68774",
  },
  {
    name: "focus",
    role: "Focus rings, active states",
    oklch: "oklch(70% 0.16 30)",
    hex: "#f17260",
  },
];

export const type = {
  display: {
    stack: ["Playfair Display", "Crimson Pro", "ui-serif", "Georgia", "serif"],
    weight: 700,
    use: "Masthead name, marquee headline, section titles. Never body text.",
  },
  body: {
    stack: ["Crimson Pro", "Newsreader", "ui-serif", "Georgia", "serif"],
    weights: [400, 600],
    use: "Ledes, paragraphs, lists. Italic (400) for asides and notes.",
  },
  label: {
    stack: ["Inter", "ui-sans-serif", "sans-serif"],
    use: "Small UI labels only. Never headlines.",
  },
  mono: {
    stack: ["IBM Plex Mono", "ui-monospace", "monospace"],
    use: "Meta lines, dates, specs, data. Never prose.",
  },
} as const;

export const mark = {
  file: "/brand-mark.svg",
  alt: "RH monogram",
  concept:
    "Paper RH serif initials on an ink square, ringed by a hairline rule — the masthead double-rule reduced to a mark.",
  primary:
    "Text wordmark (Playfair 700) for the site header; monogram for favicon, social avatars, and small spaces.",
} as const;

export const assets = {
  photo: "/profile-cut.png",
  photoAlt: "Portrait of Rafiul Haider holding a coffee cup in an office",
} as const;

export const usage: { do: string[]; dont: string[] } = {
  do: [
    "Set headlines in Playfair 700, left-aligned, ink on paper.",
    "Use accent (burgundy) sparingly: one emphasis per viewport.",
    "Separate sections with rules (hairline double or 4px thick), not cards.",
    "Use the background-cut portrait on dark; never box it in a frame — HUD corner ticks only.",
  ],
  dont: [
    "No gradients, glows, or glassmorphism anywhere in the brand.",
    "No purple/blue accents; burgundy is the only chromatic emphasis.",
    "No centered hero stacks, pill eyebrows, or three-card feature grids.",
    "No emoji as icons; no bento grids; one radius language (sharp/newsprint).",
    "Never stretch, recolor, or add effects to the monogram.",
  ],
};
