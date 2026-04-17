"use client";

import { useRef, type ReactNode } from "react";
import { BackgroundSvgRenderer } from "./background-svg-renderer";

export function GlobalBackgroundStage({
  children,
}: {
  children: ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="app-shell flex min-h-full flex-col">
      <BackgroundSvgRenderer contentRef={contentRef} />
      <div ref={contentRef} className="app-content flex min-h-full flex-col">
        {children}
      </div>
    </div>
  );
}
