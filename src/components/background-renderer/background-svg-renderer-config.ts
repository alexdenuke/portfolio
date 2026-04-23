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
  color: "#176f22",
  radiusX: 320,
  radiusY: 240,
  opacity: 0.12,
};

const SINGLE_VISUALS: Record<string, Partial<SingleAnchorVisual>> = {
  "page-entry": {
    color: "#5b7f61",
    radiusX: 240,
    radiusY: 180,
    opacity: 0.06,
  },
  "hero-glow": {
    color: "#2c8e39",
    radiusX: 360,
    radiusY: 260,
    opacity: 0.11,
  },
  "readability-focus": {
    color: "#6a8f70",
    radiusX: 360,
    radiusY: 260,
    opacity: 0.08,
  },
  "toolkit-tail": {
    color: "#228430",
    radiusX: 280,
    radiusY: 220,
    opacity: 0.1,
  },
  "projects-heading-glow": {
    color: "#176f22",
    radiusX: 920,
    radiusY: 220,
    opacity: 0.12,
  },
  "contact-heading-glow": {
    color: "#176f22",
    radiusX: 920,
    radiusY: 220,
    opacity: 0.12,
  },
};

const DEFAULT_RANGE_VISUAL: RangeAnchorVisual = {
  color: "#176f22",
  widthFactor: 0.52,
  minWidth: 360,
  maxWidth: 920,
  opacity: 0.08,
  bleed: 180,
  blur: 56,
};

const RANGE_VISUALS: Record<string, Partial<RangeAnchorVisual>> = {
  "hero-band": {
    color: "#2f8a39",
    widthFactor: 0.48,
    maxWidth: 980,
    opacity: 0.055,
    bleed: 130,
    blur: 52,
  },
  "about-band": {
    color: "#176f22",
    widthFactor: 1.16,
    maxWidth: 1680,
    opacity: 0.13,
    bleed: 130,
    blur: 48,
  },
  "toolkit-band": {
    color: "#257d31",
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
