export type BackgroundRangeEdge = "start" | "end";

export type BackgroundPoint = {
  x: number;
  y: number;
};

export type BackgroundSingleAnchor = {
  id: string;
  point: BackgroundPoint;
};

export type BackgroundRangeAnchor = {
  id: string;
  start: BackgroundPoint;
  end: BackgroundPoint;
  startY: number;
  endY: number;
  height: number;
  centerY: number;
};

export type BackgroundAnchorsSnapshot = {
  singleAnchors: BackgroundSingleAnchor[];
  rangeAnchors: BackgroundRangeAnchor[];
};
