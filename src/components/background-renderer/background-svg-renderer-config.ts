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
  color: "#31bc3f",
  radiusX: 380,
  radiusY: 280,
  opacity: 0.22,
};

const SINGLE_VISUALS: Record<string, Partial<SingleAnchorVisual>> = {
  "page-entry": {
    color: "#31bc3f",
    radiusX: 280,
    radiusY: 210,
    opacity: 0.14,
  },
  "hero-glow": {
    color: "#31bc3f",
    radiusX: 440,
    radiusY: 320,
    opacity: 0.24,
  },
  "readability-focus": {
    color: "#31bc3f",
    radiusX: 400,
    radiusY: 290,
    opacity: 0.18,
  },
  "toolkit-tail": {
    color: "#31bc3f",
    radiusX: 340,
    radiusY: 250,
    opacity: 0.18,
  },
  "projects-heading-glow": {
    color: "#31bc3f",
    radiusX: 1040,
    radiusY: 280,
    opacity: 0.22,
  },
  "about-heading-glow": {
    color: "#31bc3f",
    radiusX: 1040,
    radiusY: 280,
    opacity: 0.22,
  },
  "contact-heading-glow": {
    color: "#31bc3f",
    radiusX: 1040,
    radiusY: 280,
    opacity: 0.22,
  },
};

const DEFAULT_RANGE_VISUAL: RangeAnchorVisual = {
  color: "#31bc3f",
  widthFactor: 0.58,
  minWidth: 360,
  maxWidth: 1100,
  opacity: 0.16,
  bleed: 220,
  blur: 72,
};

const RANGE_VISUALS: Record<string, Partial<RangeAnchorVisual>> = {
  "hero-band": {
    color: "#31bc3f",
    widthFactor: 0.54,
    maxWidth: 1120,
    opacity: 0.14,
    bleed: 180,
    blur: 68,
  },
  "about-band": {
    color: "#31bc3f",
    widthFactor: 1.16,
    maxWidth: 1760,
    opacity: 0.22,
    bleed: 180,
    blur: 64,
  },
  "toolkit-band": {
    color: "#31bc3f",
    widthFactor: 0.52,
    maxWidth: 940,
    opacity: 0.15,
    bleed: 180,
    blur: 60,
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
