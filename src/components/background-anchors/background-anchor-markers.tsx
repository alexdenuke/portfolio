"use client";

import { useCallback } from "react";
import type { BackgroundRangeEdge } from "./background-anchor-types";
import { useBackgroundAnchorsRegistry } from "./background-anchors-provider";

const hiddenMarkerClassName =
  "pointer-events-none block h-0 w-0 overflow-hidden opacity-0";

export function BackgroundSingleAnchorMarker({
  id,
  className = hiddenMarkerClassName,
}: {
  id: string;
  className?: string;
}) {
  const { registerSingleAnchor } = useBackgroundAnchorsRegistry();

  const ref = useCallback(
    (element: HTMLSpanElement | null) => {
      registerSingleAnchor(id, element);
    },
    [id, registerSingleAnchor],
  );

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-bg-anchor-id={id}
      data-bg-anchor-kind="single"
      className={className}
    />
  );
}

export function BackgroundRangeAnchorMarker({
  id,
  edge,
  className = hiddenMarkerClassName,
}: {
  id: string;
  edge: BackgroundRangeEdge;
  className?: string;
}) {
  const { registerRangeAnchor } = useBackgroundAnchorsRegistry();

  const ref = useCallback(
    (element: HTMLSpanElement | null) => {
      registerRangeAnchor(id, edge, element);
    },
    [edge, id, registerRangeAnchor],
  );

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-bg-anchor-edge={edge}
      data-bg-anchor-id={id}
      data-bg-anchor-kind="range"
      className={className}
    />
  );
}
