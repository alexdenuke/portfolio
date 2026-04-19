"use client";

import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useBackgroundAnchors } from "@/components/background-anchors";
import { resolveRangeAnchorVisual, resolveSingleAnchorVisual } from "./background-svg-renderer-config";

type CanvasSize = {
  width: number;
  height: number;
};

const EMPTY_CANVAS: CanvasSize = {
  width: 0,
  height: 0,
};

function roundCanvasValue(value: number) {
  return Math.round(value);
}

function measureContentCanvas(contentElement: HTMLElement): CanvasSize {
  const { ownerDocument } = contentElement;
  const { documentElement } = ownerDocument;
  const rect = contentElement.getBoundingClientRect();

  return {
    width: roundCanvasValue(
      Math.max(documentElement.clientWidth, window.innerWidth || 0),
    ),
    height: roundCanvasValue(
      Math.max(
        contentElement.scrollHeight,
        contentElement.offsetHeight,
        contentElement.clientHeight,
        rect.height,
      ),
    ),
  };
}

function canvasMatches(left: CanvasSize, right: CanvasSize) {
  return left.width === right.width && left.height === right.height;
}

function safeSvgId(prefix: string, rawId: string) {
  return `${prefix}-${rawId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function createRangeAnchorShape({
  anchorId,
  filterId,
  gradientId,
  zoneHeight,
  zoneWidth,
  zoneX,
  zoneY,
}: {
  anchorId: string;
  filterId: string;
  gradientId: string;
  zoneHeight: number;
  zoneWidth: number;
  zoneX: number;
  zoneY: number;
}) {
  return (
    <rect
      key={anchorId}
      x={zoneX}
      y={zoneY}
      width={zoneWidth}
      height={zoneHeight}
      rx={zoneWidth / 2}
      fill={`url(#${gradientId})`}
      filter={`url(#${filterId})`}
    />
  );
}

export function BackgroundSvgRenderer({
  contentRef,
}: {
  contentRef: RefObject<HTMLElement | null>;
}) {
  const anchors = useBackgroundAnchors();
  const [canvas, setCanvas] = useState<CanvasSize>(EMPTY_CANVAS);
  const frameRef = useRef<number | null>(null);

  const measureCanvas = useEffectEvent(() => {
    const contentElement = contentRef.current;

    if (!contentElement) {
      return;
    }

    const nextCanvas = measureContentCanvas(contentElement);

    setCanvas((currentCanvas) =>
      canvasMatches(currentCanvas, nextCanvas) ? currentCanvas : nextCanvas,
    );
  });

  const scheduleMeasurement = useEffectEvent(() => {
    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      measureCanvas();
    });
  });

  useEffect(() => {
    const contentElement = contentRef.current;

    if (!contentElement) {
      return;
    }

    if (typeof ResizeObserver === "undefined") {
      scheduleMeasurement();
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      scheduleMeasurement();
    });

    resizeObserver.observe(contentElement);
    resizeObserver.observe(document.documentElement);
    scheduleMeasurement();

    return () => {
      resizeObserver.disconnect();
    };
  }, [contentRef, scheduleMeasurement]);

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

    return () => {
      cancelled = true;
    };
  }, [scheduleMeasurement]);

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }

    scheduleMeasurement();
  }, [anchors, contentRef, scheduleMeasurement]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const singleAnchorNodes = useMemo(() => {
    return anchors.singleAnchors.map((anchor) => {
      const visual = resolveSingleAnchorVisual(anchor.id);
      const gradientId = safeSvgId("single-anchor", anchor.id);

      return {
        gradientId,
        shape: (
          <ellipse
            key={anchor.id}
            cx={anchor.point.x}
            cy={anchor.point.y}
            rx={visual.radiusX}
            ry={visual.radiusY}
            fill={`url(#${gradientId})`}
          />
        ),
        gradient: (
          <radialGradient id={gradientId} key={gradientId}>
            <stop
              offset="0%"
              stopColor={visual.color}
              stopOpacity={visual.opacity}
            />
            <stop
              offset="58%"
              stopColor={visual.color}
              stopOpacity={visual.opacity * 0.42}
            />
            <stop offset="100%" stopColor={visual.color} stopOpacity="0" />
          </radialGradient>
        ),
      };
    });
  }, [anchors.singleAnchors]);

  const rangeAnchorNodes = useMemo(() => {
    return anchors.rangeAnchors.map((anchor) => {
      const visual = resolveRangeAnchorVisual(anchor.id, canvas.width || 1440);
      const gradientId = safeSvgId("range-anchor", anchor.id);
      const filterId = safeSvgId("range-filter", anchor.id);
      const zoneWidth = visual.width;
      const zoneX = anchor.start.x + (anchor.end.x - anchor.start.x) / 2 - zoneWidth / 2;
      const zoneY = anchor.startY - visual.bleed;
      const zoneHeight = anchor.height + visual.bleed * 2;

      return {
        gradientId,
        filterId,
        shape: createRangeAnchorShape({
          anchorId: anchor.id,
          filterId,
          gradientId,
          zoneHeight,
          zoneWidth,
          zoneX,
          zoneY,
        }),
        gradient: (
          <linearGradient
            id={gradientId}
            key={gradientId}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={visual.color} stopOpacity="0" />
            <stop
              offset="22%"
              stopColor={visual.color}
              stopOpacity={visual.opacity * 0.5}
            />
            <stop
              offset="50%"
              stopColor={visual.color}
              stopOpacity={visual.opacity}
            />
            <stop
              offset="78%"
              stopColor={visual.color}
              stopOpacity={visual.opacity * 0.5}
            />
            <stop offset="100%" stopColor={visual.color} stopOpacity="0" />
          </linearGradient>
        ),
        filter: (
          <filter
            id={filterId}
            key={filterId}
            x="-30%"
            y="-12%"
            width="160%"
            height="124%"
          >
            <feGaussianBlur stdDeviation={visual.blur} />
          </filter>
        ),
      };
    });
  }, [anchors.rangeAnchors, canvas.width]);

  if (!canvas.width || !canvas.height) {
    return null;
  }

  return (
    <div aria-hidden="true" className="background-svg-layer">
      <svg
        className="background-svg-canvas"
        width={canvas.width}
        height={canvas.height}
        viewBox={`0 0 ${canvas.width} ${canvas.height}`}
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          {singleAnchorNodes.map((node) => node.gradient)}
          {rangeAnchorNodes.map((node) => node.gradient)}
          {rangeAnchorNodes.map((node) => node.filter)}
        </defs>
        {rangeAnchorNodes.map((node) => node.shape)}
        {singleAnchorNodes.map((node) => node.shape)}
      </svg>
    </div>
  );
}
