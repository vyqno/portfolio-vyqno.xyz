"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const W = 75;

function verts() {
  return {
    A: [W / 2, 0],
    B: [W, W / 4],
    C: [W / 2, W / 2],
    D: [0, W / 4],
    E: [W, (3 * W) / 4],
    F: [W / 2, W],
    G: [0, (3 * W) / 4],
  };
}

function poly(pts: number[][]) {
  return pts.map((p) => p.join(",")).join(" ");
}

export interface CommitEntry {
  hash: string;
  message: string;
  url: string;
}

export interface BlockData {
  blockNum: number;
  repo: string;
  repoUrl: string;
  branch: string;
  commits: CommitEntry[];
  pushedAt: string;
  isLatest?: boolean;
}

function CubeSVG({ dark }: { dark: boolean }) {
  const v = verts();
  return (
    <svg width={W} height={W} viewBox={`0 0 ${W} ${W}`} style={{ display: "block", overflow: "visible" }}>
      <polygon points={poly([v.D, v.C, v.F, v.G])} fill="#4a4a4a" stroke="rgba(255,255,255,0.12)" strokeWidth={0.75} strokeLinejoin="round" />
      <polygon points={poly([v.B, v.E, v.F, v.C])} fill="#999" stroke="rgba(255,255,255,0.12)" strokeWidth={0.75} strokeLinejoin="round" />
      <polygon points={poly([v.A, v.B, v.C, v.D])} fill={dark ? "#ffffff" : "#efefef"} stroke="rgba(255,255,255,0.2)" strokeWidth={0.75} strokeLinejoin="round" />
    </svg>
  );
}

const cx = W / 2;

function ChainLine() {
  return (
    <div style={{ position: "relative", height: 36 }}>
      <div style={{ position: "absolute", left: cx - 3, top: 1, width: 6, height: 6, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.05)" }} />
      <div style={{ position: "absolute", left: cx - 0.5, top: 7, height: 22, width: 1, background: "linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0.04))" }} />
      <div style={{ position: "absolute", left: cx - 3, bottom: 1, width: 6, height: 6, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)" }} />
    </div>
  );
}

export function IsometricBlock({ data, isLast = false }: { data: BlockData; isLast?: boolean }) {
  const inner = (
    <div className="flex items-center gap-3 sm:gap-5">
      <a href={data.repoUrl} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, display: "block" }}>
        <CubeSVG dark={!!data.isLatest} />
      </a>
      <div className="flex items-center gap-2 sm:gap-3">
        <div style={{ width: 12, height: 1, flexShrink: 0, background: "rgba(255,255,255,0.15)" }} />
        <div className="flex flex-col gap-0.5 min-w-0" style={{ maxWidth: "min(280px, 55vw)" }}>
          <div className="flex items-baseline gap-1 sm:gap-2 mb-1 flex-wrap">
            <span className="font-mono text-zinc-500 hidden sm:inline" style={{ fontSize: 10, letterSpacing: "0.1em" }}>
              BLOCK #{String(data.blockNum).padStart(3, "0")}
            </span>
            <span className="font-mono text-zinc-100 truncate font-bold" style={{ fontSize: 12 }}>{data.repo}</span>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 4 }} />
          {data.commits.slice(0, 3).map((c, i) => (
            <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 font-mono group/c" style={{ fontSize: 11 }}>
              <span className="flex-shrink-0 tabular-nums transition-colors" style={{ color: "#ff3333" }}>{c.hash.slice(0, 7)}</span>
              <span className="text-zinc-300 truncate group-hover/c:text-white transition-colors" style={{ maxWidth: "100%" }} title={c.message}>{c.message}</span>
            </a>
          ))}
          <div className="font-mono text-zinc-500" style={{ fontSize: 10, marginTop: 4, letterSpacing: "0.08em" }}>
            {data.commits.length} commit{data.commits.length !== 1 ? "s" : ""}&nbsp;·&nbsp;{data.pushedAt}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {inner}
    </div>
  );
}

const SHOW = 4;
const INTERVAL = 5000;
const SLOT_H = 111;
const SPRING = { type: "spring" as const, stiffness: 70, damping: 18 };

export function CyclingBlockStack({ blocks }: { blocks: BlockData[] }) {
  const n = blocks.length;
  const [visibleKeys, setVisibleKeys] = useState<number[]>(() =>
    Array.from({ length: Math.min(SHOW, n) }, (_, i) => i)
  );
  const nextInRef = useRef(Math.min(SHOW, n));

  useEffect(() => {
    if (n <= SHOW) return;
    const id = setInterval(() => {
      const incoming = nextInRef.current % n;
      setVisibleKeys((prev) => [incoming, ...prev.slice(0, SHOW - 1)]);
      nextInRef.current = (nextInRef.current + 1) % n;
    }, INTERVAL);
    return () => clearInterval(id);
  }, [n]);

  const containerH = Math.min(SHOW, n) * SLOT_H;

  return (
    <div style={{ position: "relative", height: containerH, overflow: "hidden" }}>
      <AnimatePresence initial={false}>
        {visibleKeys.map((blockIdx, i) => {
          const b = blocks[blockIdx];
          if (!b) return null;
          return (
            <motion.div
              key={blockIdx}
              style={{ position: "absolute", left: 0, right: 0, top: 0, zIndex: SHOW - i }}
              initial={i === 0 ? { opacity: 0 } : false}
              animate={{ y: i * SLOT_H, opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }}
              transition={{
                y: SPRING,
                opacity: i === 0
                  ? { delay: 0.35, duration: 0.4, ease: "easeIn" }
                  : { duration: 0 },
              }}
            >
              <IsometricBlock data={{ ...b, isLatest: i === 0 }} isLast={i === Math.min(SHOW, n) - 1} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export function BlockStack({ blocks }: { blocks: BlockData[] }) {
  const visible = blocks.slice(0, 3);
  return (
    <div className="flex flex-col">
      {visible.map((b, i) => (
        <IsometricBlock
          key={b.repo + b.blockNum}
          data={{ ...b, isLatest: i === 0 }}
          isLast={i === visible.length - 1}
        />
      ))}
    </div>
  );
}
