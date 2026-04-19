"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap } from "gsap";

export interface LiquidOverlayRef {
  start: () => void;
}

interface Props {
  onHalfway?: () => void;
}

const LiquidOverlay = forwardRef<LiquidOverlayRef, Props>(function LiquidOverlay(
  { onHalfway },
  ref
) {
  const svgRef = useRef<SVGSVGElement>(null);
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);

  const W = 1440;
  const H = 900;

  const flat = `M 0 0 L ${W} 0 L ${W} ${H} L 0 ${H} Z`;
  const wave1 = `M 0 0 L ${W} 0 L ${W} ${H} C ${W * 0.75} ${H * 0.7} ${W * 0.25} ${H * 1.1} 0 ${H} Z`;
  const wave2 = `M 0 0 L ${W} 0 L ${W} ${H} C ${W * 0.6} ${H * 0.5} ${W * 0.4} ${H * 0.9} 0 ${H} Z`;
  const gone = `M 0 0 L ${W} 0 L ${W} 0 L 0 0 Z`;

  useImperativeHandle(ref, () => ({
    start() {
      if (!path1Ref.current || !path2Ref.current) return;

      const tl = gsap.timeline({
        onStart() {
          if (svgRef.current) svgRef.current.style.display = "block";
        },
      });

      // Fill from bottom
      tl.set(path1Ref.current, { attr: { d: flat } })
        .set(path2Ref.current, { attr: { d: flat } })
        // First wave wash — slide up & warp
        .to(path1Ref.current, {
          duration: 0.7,
          attr: { d: wave1 },
          ease: "power2.inOut",
        })
        // Second wave — slightly different shape
        .to(
          path2Ref.current,
          {
            duration: 0.6,
            attr: { d: wave2 },
            ease: "power2.inOut",
          },
          "-=0.3"
        )
        // Trigger halfway callback — content mounts here
        .call(() => onHalfway?.())
        // Wipe away upward
        .to([path1Ref.current, path2Ref.current], {
          duration: 0.8,
          attr: { d: gone },
          ease: "expo.inOut",
          stagger: 0.08,
          onComplete() {
            if (svgRef.current) svgRef.current.style.display = "none";
          },
        });
    },
  }));

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="fixed inset-0 w-full h-full pointer-events-none z-[60]"
      style={{ display: "none" }}
    >
      <path ref={path1Ref} d={flat} fill="#ffffff" opacity={0.06} />
      <path ref={path2Ref} d={flat} fill="#ffffff" opacity={0.04} />
    </svg>
  );
});

export default LiquidOverlay;
