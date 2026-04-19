"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavSection {
  id: string;
  label: string;
  href?: string;
}

const ITEM_WIDTH = 260;
const TOTAL_TICKS = 81;

const RulerTicks = ({ top = true }: { top?: boolean }) => {
  const centerIndex = (TOTAL_TICKS - 1) / 2;
  const ticks = [];

  for (let i = 0; i < TOTAL_TICKS; i++) {
    if (i === centerIndex) continue;
    const isFifth = i % 5 === 0;
    ticks.push(
      <div
        key={i}
        className={`absolute w-px bg-white ${top ? "top-0" : "bottom-0"}`}
        style={{
          height: isFifth ? 6 : 3,
          left: `${(i / (TOTAL_TICKS - 1)) * 100}%`,
          opacity: isFifth ? 0.5 : 0.2,
        }}
      />
    );
  }

  return (
    <div className="relative w-full" style={{ height: 10 }}>
      {ticks}
      <div
        className={`absolute w-px ${top ? "top-0" : "bottom-0"}`}
        style={{ height: 10, left: "50%", opacity: 1, background: "#ff3333" }}
      />
    </div>
  );
};

export function RulerNav({
  sections,
  activeIndex,
}: {
  sections: NavSection[];
  activeIndex: number;
}) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.offsetWidth);
    const ro = new ResizeObserver(() => setContainerWidth(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (containerWidth > 0) {
      const t = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(t);
    }
  }, [containerWidth]);

  const translateX =
    containerWidth / 2 - activeIndex * ITEM_WIDTH - ITEM_WIDTH / 2;

  return (
    <div className="w-full flex flex-col select-none">
      <RulerTicks top />
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{ height: 30 }}
      >
        <motion.div
          className="absolute flex items-center top-0 left-0 h-full"
          initial={false}
          animate={{
            x: translateX,
            opacity: containerWidth > 0 ? 1 : 0,
          }}
          transition={
            isReady
              ? { type: "spring", stiffness: 300, damping: 30, mass: 0.8 }
              : { duration: 0 }
          }
          style={{ width: sections.length * ITEM_WIDTH }}
        >
          {sections.map((section, i) => {
            const isActive = i === activeIndex;
            const href =
              section.href ||
              (isHome ? `#${section.id}` : `/#${section.id}`);
            return (
              <div
                key={section.id}
                className="flex items-center justify-center h-full"
                style={{ width: ITEM_WIDTH }}
              >
                <Link href={href} className="flex items-center justify-center">
                  <motion.span
                    animate={{
                      opacity: isActive ? 1 : 0.2,
                      scale: isActive ? 1 : 0.55,
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    className="font-bold text-white whitespace-nowrap tracking-tight cursor-pointer"
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: 16,
                    }}
                  >
                    {section.label}
                  </motion.span>
                </Link>
              </div>
            );
          })}
        </motion.div>
      </div>
      <RulerTicks top={false} />
    </div>
  );
}
