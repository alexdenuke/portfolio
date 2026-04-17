"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  BackgroundAnchorsSnapshot,
  BackgroundPoint,
  BackgroundRangeAnchor,
  BackgroundRangeEdge,
  BackgroundSingleAnchor,
} from "./background-anchor-types";

type SingleMarkerDescriptor = {
  kind: "single";
  id: string;
};

type RangeMarkerDescriptor = {
  kind: "range";
  id: string;
  edge: BackgroundRangeEdge;
};

type MarkerDescriptor = SingleMarkerDescriptor | RangeMarkerDescriptor;

type RegisteredMarker = {
  descriptor: MarkerDescriptor;
  element: HTMLElement;
};

type BackgroundAnchorsContextValue = {
  snapshot: BackgroundAnchorsSnapshot;
  registerSingleAnchor: (id: string, element: HTMLElement | null) => void;
  registerRangeAnchor: (
    id: string,
    edge: BackgroundRangeEdge,
    element: HTMLElement | null,
  ) => void;
};

const EMPTY_SNAPSHOT: BackgroundAnchorsSnapshot = {
  singleAnchors: [],
  rangeAnchors: [],
};

const BackgroundAnchorsContext =
  createContext<BackgroundAnchorsContextValue | null>(null);

function roundCoordinate(value: number) {
  return Math.round(value * 100) / 100;
}

function createMarkerKey(descriptor: MarkerDescriptor) {
  if (descriptor.kind === "single") {
    return `single:${descriptor.id}`;
  }

  return `range:${descriptor.id}:${descriptor.edge}`;
}

function readMarkerPoint(element: HTMLElement): BackgroundPoint {
  const rect = element.getBoundingClientRect();

  return {
    x: roundCoordinate(window.scrollX + rect.left + rect.width / 2),
    y: roundCoordinate(window.scrollY + rect.top + rect.height / 2),
  };
}

function buildAnchorSnapshot(
  registry: Map<string, RegisteredMarker>,
): BackgroundAnchorsSnapshot {
  const singleAnchors: BackgroundSingleAnchor[] = [];
  const ranges = new Map<
    string,
    Partial<Record<BackgroundRangeEdge, BackgroundPoint>>
  >();

  registry.forEach(({ descriptor, element }) => {
    const point = readMarkerPoint(element);

    if (descriptor.kind === "single") {
      singleAnchors.push({ id: descriptor.id, point });
      return;
    }

    const existingRange = ranges.get(descriptor.id) ?? {};
    existingRange[descriptor.edge] = point;
    ranges.set(descriptor.id, existingRange);
  });

  const rangeAnchors: BackgroundRangeAnchor[] = [];

  ranges.forEach((range, id) => {
    if (!range.start || !range.end) {
      return;
    }

    const start = range.start;
    const end = range.end;
    const startY = Math.min(start.y, end.y);
    const endY = Math.max(start.y, end.y);
    const height = roundCoordinate(endY - startY);

    rangeAnchors.push({
      id,
      start,
      end,
      startY: roundCoordinate(startY),
      endY: roundCoordinate(endY),
      height,
      centerY: roundCoordinate(startY + height / 2),
    });
  });

  singleAnchors.sort((left, right) => left.id.localeCompare(right.id));
  rangeAnchors.sort((left, right) => left.id.localeCompare(right.id));

  return { singleAnchors, rangeAnchors };
}

function snapshotsMatch(
  left: BackgroundAnchorsSnapshot,
  right: BackgroundAnchorsSnapshot,
) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function BackgroundAnchorsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const registryRef = useRef(new Map<string, RegisteredMarker>());
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const frameRef = useRef<number | null>(null);
  const [snapshot, setSnapshot] =
    useState<BackgroundAnchorsSnapshot>(EMPTY_SNAPSHOT);

  const measureAnchors = useEffectEvent(() => {
    const nextSnapshot = buildAnchorSnapshot(registryRef.current);

    setSnapshot((currentSnapshot) =>
      snapshotsMatch(currentSnapshot, nextSnapshot)
        ? currentSnapshot
        : nextSnapshot,
    );
  });

  const scheduleMeasurement = useEffectEvent(() => {
    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      measureAnchors();
    });
  });

  const registerMarker = useCallback(
    (descriptor: MarkerDescriptor, element: HTMLElement | null) => {
      const key = createMarkerKey(descriptor);
      const existingMarker = registryRef.current.get(key);

      if (existingMarker?.element === element) {
        scheduleMeasurement();
        return;
      }

      if (existingMarker?.element) {
        resizeObserverRef.current?.unobserve(existingMarker.element);
      }

      if (!element) {
        registryRef.current.delete(key);
        scheduleMeasurement();
        return;
      }

      registryRef.current.set(key, { descriptor, element });
      resizeObserverRef.current?.observe(element);
      scheduleMeasurement();
    },
    [scheduleMeasurement],
  );

  const registerSingleAnchor = useCallback(
    (id: string, element: HTMLElement | null) => {
      registerMarker({ kind: "single", id }, element);
    },
    [registerMarker],
  );

  const registerRangeAnchor = useCallback(
    (id: string, edge: BackgroundRangeEdge, element: HTMLElement | null) => {
      registerMarker({ kind: "range", id, edge }, element);
    },
    [registerMarker],
  );

  useEffect(() => {
    if (typeof ResizeObserver === "undefined") {
      scheduleMeasurement();
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      scheduleMeasurement();
    });

    resizeObserverRef.current = resizeObserver;
    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(document.body);

    registryRef.current.forEach(({ element }) => {
      resizeObserver.observe(element);
    });

    scheduleMeasurement();

    return () => {
      resizeObserver.disconnect();
      resizeObserverRef.current = null;
    };
  }, [scheduleMeasurement]);

  useEffect(() => {
    const handleResize = () => {
      scheduleMeasurement();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [scheduleMeasurement]);

  useEffect(() => {
    const mutationObserver = new MutationObserver(() => {
      scheduleMeasurement();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, [scheduleMeasurement]);

  useEffect(() => {
    const fonts = document.fonts;

    if (!fonts) {
      return;
    }

    let cancelled = false;
    void fonts.ready.then(() => {
      if (!cancelled) {
        scheduleMeasurement();
      }
    });

    const handleFontsLoaded = () => {
      scheduleMeasurement();
    };

    fonts.addEventListener?.("loadingdone", handleFontsLoaded);

    return () => {
      cancelled = true;
      fonts.removeEventListener?.("loadingdone", handleFontsLoaded);
    };
  }, [scheduleMeasurement]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const value = useMemo<BackgroundAnchorsContextValue>(
    () => ({
      snapshot,
      registerSingleAnchor,
      registerRangeAnchor,
    }),
    [snapshot, registerRangeAnchor, registerSingleAnchor],
  );

  return (
    <BackgroundAnchorsContext.Provider value={value}>
      {children}
    </BackgroundAnchorsContext.Provider>
  );
}

function useBackgroundAnchorsContext() {
  const context = use(BackgroundAnchorsContext);

  if (!context) {
    throw new Error(
      "Background anchor components must be used inside BackgroundAnchorsProvider.",
    );
  }

  return context;
}

export function useBackgroundAnchors() {
  return useBackgroundAnchorsContext().snapshot;
}

export function useBackgroundAnchorsRegistry() {
  const { registerRangeAnchor, registerSingleAnchor } =
    useBackgroundAnchorsContext();

  return {
    registerSingleAnchor,
    registerRangeAnchor,
  };
}
