type SingleAnchorVisual = {
  color: string;
  radiusX: number;
  radiusY: number;
  opacity: number;
};

type RangeAnchorVisual = {
  color: string;
  widthFactor: number;
  minWidth: number;
  maxWidth: number;
  opacity: number;
  bleed: number;
  blur: number;
};

type ResolvedRangeAnchorVisual = RangeAnchorVisual & {
  width: number;
};

const DEFAULT_SINGLE_VISUAL: SingleAnchorVisual = {
  color: "#6ee7a2",
  radiusX: 320,
  radiusY: 240,
  opacity: 0.12,
};

const SINGLE_VISUALS: Record<string, Partial<SingleAnchorVisual>> = {
  "page-entry": {
    color: "#98a6b7",
    radiusX: 240,
    radiusY: 180,
    opacity: 0.06,
  },
  "hero-glow": {
    color: "#6ee7a2",
    radiusX: 420,
    radiusY: 320,
    opacity: 0.18,
  },
  "readability-focus": {
    color: "#94a3b8",
    radiusX: 360,
    radiusY: 260,
    opacity: 0.08,
  },
  "toolkit-tail": {
    color: "#60d394",
    radiusX: 280,
    radiusY: 220,
    opacity: 0.1,
  },
};

const DEFAULT_RANGE_VISUAL: RangeAnchorVisual = {
  color: "#6ee7a2",
  widthFactor: 0.52,
  minWidth: 360,
  maxWidth: 920,
  opacity: 0.08,
  bleed: 180,
  blur: 56,
};

const RANGE_VISUALS: Record<string, Partial<RangeAnchorVisual>> = {
  "hero-band": {
    color: "#7dd3a7",
    widthFactor: 0.56,
    maxWidth: 980,
    opacity: 0.09,
    bleed: 160,
    blur: 44,
  },
  "about-band": {
    color: "#6ee7a2",
    widthFactor: 1.16,
    maxWidth: 1680,
    opacity: 0.13,
    bleed: 130,
    blur: 48,
  },
  "projects-contact-flow": {
    color: "#6ee7a2",
    widthFactor: 0.72,
    maxWidth: 1180,
    opacity: 0.12,
    bleed: 220,
    blur: 56,
  },
  "toolkit-band": {
    color: "#67e8b0",
    widthFactor: 0.46,
    maxWidth: 820,
    opacity: 0.07,
    bleed: 150,
    blur: 48,
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function resolveSingleAnchorVisual(id: string): SingleAnchorVisual {
  return {
    ...DEFAULT_SINGLE_VISUAL,
    ...SINGLE_VISUALS[id],
  };
}

export function resolveRangeAnchorVisual(
  id: string,
  canvasWidth: number,
): ResolvedRangeAnchorVisual {
  const visual = {
    ...DEFAULT_RANGE_VISUAL,
    ...RANGE_VISUALS[id],
  };

  return {
    ...visual,
    width: clamp(
      canvasWidth * visual.widthFactor,
      visual.minWidth,
      visual.maxWidth,
    ),
  };
}
