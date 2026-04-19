"use client";

import { useState, useEffect } from "react";
import { AnimatedCounter } from "./github-stats";
import type { ContributionData } from "@/lib/github";

function cellColor(count: number, max: number): string {
  if (count === 0) return "#111111";
  const t = Math.min(count / Math.max(max, 1), 1);
  const v = Math.round(30 + Math.pow(t, 0.55) * 195);
  return `rgb(${v},${v},${v})`;
}

const CELL = 16;
const GAP = 3;
const STEP = CELL + GAP;
const DAYS = 7;
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function ContributionHeatmap({ data }: { data: ContributionData }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const START_DATE = "2025-08-01";
  const weeks = data.weeks.filter((w) => {
    const firstDay = w.contributionDays[0];
    if (!firstDay) return false;
    return firstDay.date >= START_DATE;
  });

  let max = 0;
  for (const w of weeks) for (const d of w.contributionDays) if (d.contributionCount > max) max = d.contributionCount;

  const monthLabels: { label: string; x: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((w, wi) => {
    const firstDay = w.contributionDays[0];
    if (!firstDay) return;
    const m = parseInt(firstDay.date.split("-")[1], 10) - 1;
    if (m !== lastMonth) {
      if (MONTHS[m]) monthLabels.push({ label: MONTHS[m]!, x: wi * STEP });
      lastMonth = m;
    }
  });

  const svgW = weeks.length * STEP;
  const svgH = DAYS * STEP + 18;

  return (
    <div className="flex flex-col gap-3 select-none" style={{ minWidth: 0 }}>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-zinc-500 text-xs tracking-widest uppercase">Contributions</span>
        <div className="font-mono text-zinc-300 text-xs tabular-nums flex gap-1 items-center">
          <AnimatedCounter value={data.totalContributions} />
          <span>total</span>
        </div>
      </div>

      <div className="relative">
        {!mounted ? (
          <div className="w-full h-[151px] bg-zinc-900/10 rounded flex items-center justify-center border border-zinc-800/30">
            <span className="font-mono text-[10px] text-zinc-800 tracking-tighter uppercase animate-pulse">[SYSTEM_INITIALIZING_GRID]</span>
          </div>
        ) : (
          <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: "block" }}>
            {monthLabels.map(({ label, x }) => (
              <text key={label + x} x={x} y={10} fill="rgba(255,255,255,0.25)" fontSize={8} fontFamily="monospace">{label}</text>
            ))}
            {weeks.map((w, wi) =>
              w.contributionDays.map((d, di) => (
                <rect key={d.date} x={wi * STEP} y={18 + di * STEP} width={CELL} height={CELL} rx={2} fill={cellColor(d.contributionCount, max)}>
                  <title>{`${d.date}: ${d.contributionCount} contribution${d.contributionCount !== 1 ? "s" : ""}`}</title>
                </rect>
              ))
            )}
          </svg>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <span className="font-mono text-zinc-700 text-xs">less</span>
        {[0, 0.15, 0.35, 0.6, 1].map((t) => {
          const v = Math.round(t === 0 ? 17 : 30 + Math.pow(t, 0.55) * 195);
          return <div key={t} style={{ width: CELL, height: CELL, borderRadius: 2, background: `rgb(${v},${v},${v})`, flexShrink: 0 }} />;
        })}
        <span className="font-mono text-zinc-700 text-xs">more</span>
      </div>
    </div>
  );
}
