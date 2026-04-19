"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import opentype from "opentype.js";

interface GlyphPath {
  d: string;
  length: number;
}

export default function SplashScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [paths, setPaths] = useState<GlyphPath[]>([]);
  const [phase, setPhase] = useState<"drawing" | "holding">("drawing");
  const svgRef = useRef<SVGSVGElement>(null);

  const loadFont = useCallback(async () => {
    const font = await opentype.load("/AlphaMaleModern.ttf");
    const text = "vyqno";
    const fontSize = 120;

    const fullPath = font.getPath(text, 0, 0, fontSize);
    const fullBB = fullPath.getBoundingBox();
    const totalWidth = fullBB.x2 - fullBB.x1;

    const glyphs: GlyphPath[] = [];
    let xOffset = 0;

    for (const char of text) {
      const glyph = font.charToGlyph(char);
      const path = glyph.getPath(xOffset, 0, fontSize);
      const pathData = path.toPathData(2);

      const tempSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      const tempPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      tempPath.setAttribute("d", pathData);
      tempSvg.appendChild(tempPath);
      document.body.appendChild(tempSvg);
      const length = tempPath.getTotalLength();
      document.body.removeChild(tempSvg);

      if (pathData && length > 0) {
        glyphs.push({ d: pathData, length });
      }

      const advance = (glyph.advanceWidth ?? 0) * (fontSize / font.unitsPerEm);
      xOffset += advance;
    }

    setPaths(glyphs);

    if (svgRef.current) {
      const padding = 20;
      svgRef.current.setAttribute(
        "viewBox",
        `${fullBB.x1 - padding} ${fullBB.y1 - padding} ${totalWidth + padding * 2} ${fullBB.y2 - fullBB.y1 + padding * 2}`
      );
    }
  }, []);

  useEffect(() => {
    loadFont();
  }, [loadFont]);

  useEffect(() => {
    if (paths.length === 0) return;

    const drawTimer = setTimeout(() => setPhase("holding"), 2000);
    const completeTimer = setTimeout(() => onComplete(), 2800);

    return () => {
      clearTimeout(drawTimer);
      clearTimeout(completeTimer);
    };
  }, [paths, onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      {/* Subtle noise grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      <svg
        ref={svgRef}
        viewBox="0 0 600 150"
        className="w-[80vw] max-w-[600px]"
      >
        {paths.map((glyph, i) => (
          <g key={i}>
            {/* Stroke draw-on layer */}
            <path
              d={glyph.d}
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: glyph.length,
                strokeDashoffset: glyph.length,
                animation: `drawStroke 2s ease-in-out ${i * 0.15}s forwards`,
              }}
            />
            {/* Fill layer — fades in after stroke completes */}
            <path
              d={glyph.d}
              fill="white"
              stroke="none"
              style={{
                opacity: 0,
                animation: `fillIn 0.6s ease-out ${1.4 + i * 0.1}s forwards`,
              }}
            />
          </g>
        ))}
      </svg>

      <style>{`
        @keyframes drawStroke {
          0% { stroke-dashoffset: var(--path-length, 1000); }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes fillIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
