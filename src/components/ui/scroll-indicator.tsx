"use client";

import { motion } from "framer-motion";
import useSound from "use-sound";

const SIZE = 82;
const C = SIZE / 2;
const R = 36;
const TICK_N = 36;

function buildTicks() {
  return Array.from({ length: TICK_N }, (_, i) => {
    const isMain = i % 9 === 0;
    const outerR = R;
    const innerR = R - (isMain ? 7 : 3);
    const rad = ((i / TICK_N) * 360 - 90) * (Math.PI / 180);
    const round = (val: number) => Math.round(val * 1000) / 1000;
    return {
      x1: round(C + innerR * Math.cos(rad)),
      y1: round(C + innerR * Math.sin(rad)),
      x2: round(C + outerR * Math.cos(rad)),
      y2: round(C + outerR * Math.sin(rad)),
      opacity: isMain ? 1 : 0.35,
      strokeWidth: isMain ? 1.5 : 1,
    };
  });
}

interface Props {
  activeIndex: number;
  sectionIds: string[];
}

export function ScrollIndicator({ activeIndex, sectionIds }: Props) {
  const isLast = activeIndex === sectionIds.length - 1;
  const ticks = buildTicks();

  const [play] = useSound("/vault.mp3", {
    volume: 1.0,
    sprite: { click: [10000, 500] },
    preload: true,
  });

  const handleClick = () => {
    play({ id: "click" });
    if (isLast) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const id = sectionIds[activeIndex + 1];
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="fixed bottom-8 right-8 z-40 cursor-pointer select-none"
      onClick={handleClick}
      aria-label={isLast ? "Back to top" : "Scroll down"}
    >
      <svg
        className="absolute inset-0"
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ pointerEvents: "none" }}
      >
        <circle cx={C} cy={C} r={R + 3} fill="white" opacity={0.06} />
      </svg>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ width: SIZE, height: SIZE }}
      >
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1} y1={t.y1}
              x2={t.x2} y2={t.y2}
              stroke="white"
              strokeWidth={t.strokeWidth}
              opacity={t.opacity}
            />
          ))}
        </svg>
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: isLast ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        <svg width={12} height={20} viewBox="0 0 12 20" fill="none">
          <line x1={6} y1={0} x2={6} y2={15} stroke="#ff3333" strokeWidth={1.5} strokeLinecap="round" />
          <polyline points="1,10 6,17 11,10" stroke="#ff3333" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </div>
  );
}
