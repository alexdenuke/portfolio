"use client";

import { useTranslations } from "next-intl";
import { useBackgroundAnchors } from "./background-anchors-provider";

function formatCoordinate(value: number) {
  return `${Math.round(value)}px`;
}

export function BackgroundAnchorsDebugPanel() {
  const snapshot = useBackgroundAnchors();
  const t = useTranslations("DebugPanel");

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex flex-col gap-3 border-b border-white/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.3em] text-accent/75">
            {t("eyebrow")}
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
            {t("title")}
          </h3>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.24em] text-zinc-400">
          {t("summary", {
            singleCount: snapshot.singleAnchors.length,
            rangeCount: snapshot.rangeAnchors.length,
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-zinc-500">
            {t("singleSectionTitle")}
          </p>
          {snapshot.singleAnchors.map((anchor) => (
            <article
              key={anchor.id}
              className="rounded-2xl border border-white/8 px-4 py-4"
            >
              <p className="font-mono text-sm text-accent-strong">{anchor.id}</p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                {t("single.x", { value: formatCoordinate(anchor.point.x) })}
                <br />
                {t("single.y", { value: formatCoordinate(anchor.point.y) })}
              </p>
            </article>
          ))}
        </div>

        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-zinc-500">
            {t("rangeSectionTitle")}
          </p>
          {snapshot.rangeAnchors.map((anchor) => (
            <article
              key={anchor.id}
              className="rounded-2xl border border-white/8 px-4 py-4"
            >
              <p className="font-mono text-sm text-accent-strong">{anchor.id}</p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                {t("range.startY", { value: formatCoordinate(anchor.startY) })}
                <br />
                {t("range.endY", { value: formatCoordinate(anchor.endY) })}
                <br />
                {t("range.height", { value: formatCoordinate(anchor.height) })}
                <br />
                {t("range.centerY", {
                  value: formatCoordinate(anchor.centerY),
                })}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
