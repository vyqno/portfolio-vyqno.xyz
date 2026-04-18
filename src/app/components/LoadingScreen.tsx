"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TegakiRenderer } from "tegaki/react";
import caveat from "../../lib/tegaki-caveat";
import { motion as m } from "vyqno/lib/tokens";

gsap.registerPlugin(useGSAP);

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleAnimationComplete = contextSafe(() => {
    const tl = gsap.timeline({
      onComplete,
    });

    tl.to(textRef.current, {
      y: -12,
      duration: m.duration.lg,
      ease: m.easing.emphasized,
      delay: 0.5,
    }).to(
      containerRef.current,
      {
        autoAlpha: 0,
        duration: m.duration.xl,
        ease: m.easing.standard,
      },
      "<0.15"
    );
  });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "var(--color-canvas)" }}
    >
      <div ref={textRef}>
        <TegakiRenderer
          font={caveat}
          style={{
            fontSize: "72px",
            color: "var(--color-ink)",
          }}
          onComplete={handleAnimationComplete}
        >
          Hitesh
        </TegakiRenderer>
      </div>
    </div>
  );
}
