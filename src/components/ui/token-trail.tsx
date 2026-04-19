"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const TOKEN_LOGOS = [
  "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/white/eth.png",
  "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/white/btc.png",
  "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/white/sol.png",
  "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/white/bnb.png",
  "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/white/usdc.png",
  "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/white/link.png",
  "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/white/matic.png",
  "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/white/arb.png",
  "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/white/xrp.png",
  "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/white/doge.png",
  "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/white/ada.png",
  "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/white/dot.png",
  "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/white/avax.png",
];

const POOL_SIZE = 30;

const TokenTrail: React.FC<{ isActive?: boolean }> = ({ isActive = true }) => {
  const flairRef = useRef<(HTMLDivElement | null)[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const index = useRef(0);
  const lastLogoIndex = useRef(-1);
  const gap = 80;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive) return;
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    const playAnimation = (shape: HTMLElement) => {
      const tl = gsap.timeline();
      tl.from(shape, { opacity: 0, scale: 0, ease: "elastic.out(1,0.3)", duration: 0.8 })
        .to(shape, { rotation: "random([-360, 360])" }, "<")
        .to(shape, { y: "120vh", ease: "back.in(.4)", duration: 1.8 }, 0);
    };

    const animateImage = () => {
      if (!isActive) return;
      const wrappedIndex = index.current % POOL_SIZE;
      const imgContainer = flairRef.current[wrappedIndex];
      if (!imgContainer) return;

      const img = imgContainer.querySelector("img");
      if (img) {
        let logoIdx: number;
        do {
          logoIdx = Math.floor(Math.random() * TOKEN_LOGOS.length);
        } while (logoIdx === lastLogoIndex.current);
        img.src = TOKEN_LOGOS[logoIdx];
        lastLogoIndex.current = logoIdx;
      }

      gsap.killTweensOf(imgContainer);
      gsap.set(imgContainer, { clearProps: "all" });
      gsap.set(imgContainer, {
        display: "block",
        opacity: 0,
        left: mousePos.current.x,
        top: mousePos.current.y,
        xPercent: -50,
        yPercent: -50,
        position: "fixed",
        pointerEvents: "none",
        zIndex: 15,
      });

      if (img && img.complete) {
        gsap.to(imgContainer, { opacity: 1, duration: 0.1 });
        playAnimation(imgContainer);
      } else if (img) {
        img.onload = () => {
          gsap.to(imgContainer, { opacity: 1, duration: 0.1 });
          playAnimation(imgContainer);
        };
      }
      index.current++;
    };

    const tickerUpdate = () => {
      if (!isActive) return;
      const travelDistance = Math.hypot(
        lastMousePos.current.x - mousePos.current.x,
        lastMousePos.current.y - mousePos.current.y
      );
      if (travelDistance > gap) {
        animateImage();
        lastMousePos.current = { ...mousePos.current };
      }
    };

    gsap.ticker.add(tickerUpdate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(tickerUpdate);
    };
  }, [isActive]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[15] overflow-hidden">
      {Array.from({ length: POOL_SIZE }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { flairRef.current[i] = el; }}
          className="hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            alt=""
            width="40"
            height="40"
            className="filter grayscale brightness-200 contrast-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] opacity-60"
          />
        </div>
      ))}
    </div>
  );
};

export default TokenTrail;
