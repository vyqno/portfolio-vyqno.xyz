"use client";

import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform, useInView } from "framer-motion";

export function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, spring, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

export function GithubStats({
  totalStars,
  followers,
  following,
}: {
  totalStars: number;
  followers: number;
  following: number;
}) {
  return (
    <div className="flex flex-col gap-8 mt-10">
      <div className="flex items-center gap-3">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      <div className="flex flex-wrap gap-12 items-baseline justify-start px-2">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest pl-1">Total Stars</span>
          <div className="text-5xl md:text-6xl font-mono font-bold text-zinc-100 tracking-tighter tabular-nums leading-none">
            <AnimatedCounter value={totalStars} />
          </div>
        </div>
        <a href="https://github.com/vyqno?tab=followers" target="_blank" rel="noreferrer" className="flex flex-col gap-1 group cursor-pointer">
          <span className="font-mono text-[11px] text-zinc-500 group-hover:text-zinc-400 transition-colors uppercase tracking-widest pl-1">Followers</span>
          <span className="text-5xl md:text-6xl font-mono font-bold text-zinc-300 group-hover:text-white transition-colors tracking-tighter tabular-nums leading-none">
            <AnimatedCounter value={followers} />
          </span>
        </a>
        <a href="https://github.com/vyqno?tab=following" target="_blank" rel="noreferrer" className="flex flex-col gap-1 group cursor-pointer">
          <span className="font-mono text-[11px] text-zinc-500 group-hover:text-zinc-400 transition-colors uppercase tracking-widest pl-1">Following</span>
          <span className="text-5xl md:text-6xl font-mono font-bold text-zinc-300 group-hover:text-white transition-colors tracking-tighter tabular-nums leading-none">
            <AnimatedCounter value={following} />
          </span>
        </a>
      </div>
    </div>
  );
}
