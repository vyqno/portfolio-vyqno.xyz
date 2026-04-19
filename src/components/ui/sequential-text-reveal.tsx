"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SequentialTextRevealProps {
  items: string[];
  className?: string;
}

export const SequentialTextReveal: React.FC<SequentialTextRevealProps> = ({ items, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const partRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3000",
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      partRefs.current.forEach((part, index) => {
        if (!part) return;
        const chars = part.querySelectorAll(".char-inner");

        tl.fromTo(
          chars,
          { yPercent: 120, opacity: 1 },
          { yPercent: 0, opacity: 1, stagger: 0.02, duration: 1, ease: "power2.out" }
        );

        tl.to({}, { duration: 0.5 });

        if (index < items.length - 1) {
          tl.to(chars, {
            yPercent: -120,
            opacity: 0,
            stagger: 0.01,
            duration: 0.8,
            ease: "power2.in",
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [items]);

  return (
    <div ref={containerRef} className="h-screen w-full flex items-center justify-center bg-[#141414] overflow-hidden">
      <div className="relative w-full max-w-4xl px-8 flex items-center justify-center h-full">
        {items.map((text, idx) => (
          <div
            key={idx}
            ref={(el) => { partRefs.current[idx] = el; }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className={`flex flex-wrap justify-center text-center ${className ?? ""}`}>
              {text.split(" ").map((word, wordIdx) => (
                <span key={wordIdx} className="char-wrapper inline-block overflow-hidden mr-[0.3em] pb-1">
                  <span
                    className="char-inner inline-block text-white text-3xl md:text-5xl lg:text-6xl font-bold tracking-[0.02em] leading-[1.05]"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
