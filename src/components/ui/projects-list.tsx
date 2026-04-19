"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PROJECTS = [
  {
    name: "web3ads.wtf",
    stack: "Web3 · Solidity · Ads",
    desc: "Decentralized advertising protocol. Won 2nd Place at ETHMumbai26.",
    github: "https://github.com/kunalshah017/web3ads",
    live: "https://web3ads.wtf",
    highlight: "won 2nd Place * HeyElsa Sponsor Track at ETHMumbai 2026",
  },
  {
    name: "AgentNet",
    stack: "Groq AI · Base · thirdweb · Alchemy · Next.js",
    desc: "Autonomous AI marketplace. Deploy knowledge as 24/7 AI agents and earn USDC per query via x402 payments.",
    github: "https://www.npmjs.com/package/agentnet-mcp",
    live: "https://agentnet-three.vercel.app",
    highlight: "Autonomous Intelligence",
  },
  {
    name: "CredPass",
    stack: "Next.js · Solidity · Identity",
    desc: "On-chain credential passport. Issue, verify, and revoke tamper-proof identity attestations on Ethereum.",
    github: "https://github.com/vyqno/CredPass",
    live: "https://credpass-sigma.vercel.app/",
    highlight: "Digital Identity Protocol",
  },
  {
    name: "Uniswap v4 Reputation Hook",
    stack: "Solidity · Uniswap v4 · Hooks",
    desc: "Custom v4 hook that adjusts swap fees dynamically based on trader on-chain reputation score.",
    github: "https://github.com/vyqno/uniswap-v4-reputation-hook",
    live: null,
    highlight: "Gas Optimized Hooks",
  },
  {
    name: "AI Automation System",
    stack: "OpenAI · n8n · Supabase · Next.js",
    desc: "Full-stack end-to-end student management platform with an AI layer for automated workflows. Custom-built for an active institutional client managing 300+ students.",
    github: null,
    live: null,
    highlight: "Enterprise AI Workflows",
  },
];

type Project = (typeof PROJECTS)[number];

function ProjectRow({ project: p, index }: { project: Project; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-36 md:h-32 mb-4 cursor-pointer group"
      style={{ perspective: "1500px" }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <AnimatePresence>
        {isFlipped && (
          <>
            <motion.div initial={{ opacity: 0, scale: 0.5, x: 8, y: 8 }} animate={{ opacity: 1, scale: 1, x: -6, y: -6 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }} className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500 z-20 pointer-events-none" />
            <motion.div initial={{ opacity: 0, scale: 0.5, x: -8, y: 8 }} animate={{ opacity: 1, scale: 1, x: 6, y: -6 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }} className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500 z-20 pointer-events-none" />
            <motion.div initial={{ opacity: 0, scale: 0.5, x: -8, y: -8 }} animate={{ opacity: 1, scale: 1, x: 6, y: 6 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }} className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500 z-20 pointer-events-none" />
            <motion.div initial={{ opacity: 0, scale: 0.5, x: 8, y: -8 }} animate={{ opacity: 1, scale: 1, x: -6, y: 6 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }} className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500 z-20 pointer-events-none" />
          </>
        )}
      </AnimatePresence>

      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateX: isFlipped ? -180 : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        {/* FRONT */}
        <div className="absolute inset-0 bg-black border border-white/5 flex flex-col md:flex-row justify-center md:justify-between items-start md:items-center px-6 md:px-12" style={{ backfaceVisibility: "hidden" }}>
          <div className="flex flex-col">
            <h2 className="text-2xl md:text-3xl text-white font-sans font-medium tracking-tight mb-1">{p.name}</h2>
            <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">{p.highlight}</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-zinc-600 font-mono text-xs hidden lg:block">{p.stack}</span>
            <span className="text-zinc-400 font-mono text-xl">→</span>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 bg-zinc-950 border border-red-500/30 flex flex-col justify-center px-6 md:px-12" style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}>
          <p className="text-zinc-300 font-mono text-xs md:text-sm max-w-4xl leading-relaxed mb-4">{p.desc}</p>
          <div className="flex items-center gap-6">
            {p.live && (
              <a href={p.live} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/link text-red-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2 hover:text-red-400 transition-colors">
                [ Live UI ]
                <span className="inline-block transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1">↗</span>
              </a>
            )}
            {p.github && (
              <a href={p.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/link text-zinc-400 font-mono text-xs uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
                [ Source ]
                <span className="inline-block transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1">↗</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProjectsList() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-0">
      <div className="mb-12">
        <h3 className="text-sm tracking-widest uppercase font-mono text-white/50 border-b border-white/10 pb-4 mb-4">
          Engineering Logs &amp; Active Protocols
        </h3>
      </div>
      <div className="w-full flex flex-col gap-2">
        {PROJECTS.map((p, i) => (
          <ProjectRow key={p.name} project={p} index={i} />
        ))}
      </div>
    </div>
  );
}
