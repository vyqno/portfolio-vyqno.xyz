"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import TreeNodeTooltip, { TreeNode } from "./tree-node-tooltip";

// All ScrollTrigger logic removed for SkillsSection to ensure true automatic motion

const defiLogos = [
  { name: "Uniswap",   url: "https://icon.horse/icon/uniswap.org" },
  { name: "Curve",     url: "https://icon.horse/icon/curve.fi" },
  { name: "Compound",  url: "https://icon.horse/icon/compound.finance" },
  { name: "Aave",      url: "https://icon.horse/icon/aave.com" },
  { name: "MakerDAO",  url: "https://icon.horse/icon/makerdao.com" },
  { name: "GMX",       url: "https://icon.horse/icon/gmx.io" },
  { name: "Lido",      url: "https://icon.horse/icon/lido.fi" },
  { name: "Chainlink", url: "https://cdn.simpleicons.org/chainlink" },
  { name: "Convex",    url: "https://icon.horse/icon/convexfinance.com" },
];

const defaultLogos = [
  { name: "Solidity",   url: "https://cdn.simpleicons.org/solidity" },
  { name: "Web3.js",    url: "https://cdn.simpleicons.org/web3dotjs" },
  { name: "IPFS",       url: "https://cdn.simpleicons.org/ipfs" },
  { name: "Thirdweb",   url: "https://icon.horse/icon/thirdweb.com" },
  { name: "Alchemy",    url: "https://icon.horse/icon/alchemy.com" },
  { name: "RainbowKit", url: "https://icon.horse/icon/rainbow.me" },
  { name: "Figma",      url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA2MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTUgMEM2LjcxNTczIDAgMCA2LjcxNTczIDAgMTVDMCAyMy4yODQzIDYuNzE1NzMgMzAgMTUgMzBIMzBWM0gxNVoiIGZpbGw9IiNGMjRFMUUiLz48cGF0aCBkPSJNMzAgMEg0NUM1My4yODQzIDAgNjAgNi43MTU3MyA2MCAxNUM2MCAyMy4yODQzIDUzLjI4NDMgMzAgNDUgMzBIMzBWMFoiIGZpbGw9IiNGRjcyNjIiLz48cGF0aCBkPSJNMCA0NUMwIDM2LjcxNTcgNi43MTU3MyAzMCAxNSAzMEgzMFY2MEgxNUM2LjcxNTczIDYwIDAgNTMuMjg0MyAwIDQ1WiIgZmlsbD0iI0EyNTlGRiIvPjxwYXRoIGQ9Ik0zMCAzMEg0NUM1My4yODQzIDMwIDYwIDM2LjcxNTcgNjAgNDVDNjAgNTMuMjg0MyA1My4yODQzIDYwIDQ1IDYwSDMwVjMwWiIgZmlsbD0iIzFBQkNGRSIvPjxwYXRoIGQ9Ik0wIDc1QzAgNjYuNzE1NyA2LjcxNTczIDYwIDE1IDYwSDMwVjc1QzMwIDgzLjI4NDMgMjMuMjg0MyA5MCAxNSA5MEM2LjcxNTczIDkwIDAgODMuMjg0MyAwIDc1WiIgZmlsbD0iIzBBQ0Y4MyIvPjwvc3ZnPg==" },
  { name: "Framer",     url: "https://cdn.simpleicons.org/framer" },
  { name: "React",      url: "https://cdn.simpleicons.org/react" },
  { name: "Next.js",    url: "https://cdn.simpleicons.org/nextdotjs/white" },
  { name: "TypeScript", url: "https://cdn.simpleicons.org/typescript" },
  { name: "Tailwind",   url: "https://cdn.simpleicons.org/tailwindcss" },
  { name: "Node.js",    url: "https://cdn.simpleicons.org/nodedotjs" },
  { name: "GitHub",     url: "https://cdn.simpleicons.org/github/white" },
  { name: "Docker",     url: "https://cdn.simpleicons.org/docker" },
  { name: "Foundry",    url: "https://icon.horse/icon/book.getfoundry.sh" },
  { name: "Viem",       url: "https://icon.horse/icon/viem.sh" },
  { name: "Notion",     url: "https://cdn.simpleicons.org/notion" },
];

function SlideRevealButton({ onOpen }: { onOpen: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const opacitySlide = useTransform(x, [0, 80], [1, 0]);
  const revealWidth = useTransform(x, (val) => val + 56);
  const textX = useTransform(x, [0, 150], [-30, 0]);

  const handleDragEnd = () => {
    if (!containerRef.current || !thumbRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const thumbWidth = thumbRef.current.offsetWidth;
    if (x.get() > (containerWidth - thumbWidth) * 0.65) onOpen();
  };

  return (
    <div
      ref={containerRef}
      className="group relative w-full sm:w-[60%] lg:w-[50%] max-w-[340px] flex items-stretch mb-6 h-14 bg-black border border-zinc-800 overflow-hidden shrink-0"
    >
      {[["top-0 left-0 -translate-x-1/2 -translate-y-1/2", "0 0 11 11"], ["bottom-0 left-0 -translate-x-1/2 translate-y-1/2", "0 0 11 11"], ["top-0 right-0 translate-x-1/2 -translate-y-1/2", "0 0 11 11"], ["bottom-0 right-0 translate-x-1/2 translate-y-1/2", "0 0 11 11"]].map(([pos], idx) => (
        <svg key={idx} width="7" height="7" viewBox="0 0 11 11" fill="none" className={`absolute ${pos} text-red-500/50 pointer-events-none transition-colors group-hover:text-red-500 z-30`}>
          <path d="M5.5 0V11M0 5.5H11" stroke="currentColor" strokeWidth="1" />
        </svg>
      ))}

      <motion.div style={{ opacity: opacitySlide }} className="absolute inset-0 flex items-center justify-center pl-14 pointer-events-none z-0">
        <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          Slide Me
          <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>→</motion.span>
        </span>
      </motion.div>

      <motion.div style={{ width: revealWidth }} className="absolute top-0 left-0 bottom-0 overflow-hidden pointer-events-none z-10 bg-black border-r border-[#ff3333]/20">
        <motion.div style={{ x: textX }} className="absolute inset-y-0 left-0 min-w-[300px] flex items-center">
          <span className="font-mono text-[11px] text-white uppercase tracking-widest pl-20">my agents secret</span>
        </motion.div>
      </motion.div>

      <motion.div
        ref={thumbRef}
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0.02}
        dragMomentum={false}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
        dragSnapToOrigin={true}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative w-14 h-[54px] z-20 shrink-0 bg-white border border-zinc-800 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-zinc-100 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
          <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
        </svg>
      </motion.div>
    </div>
  );
}

const demoData: TreeNode[] = [
  {
    id: "agent", name: ".agent", tooltip: "Agent configuration", type: "folder",
    children: [
      {
        id: "skills", name: "skills", tooltip: "Available AI skills", type: "folder",
        children: [
          { id: "superpowers", name: "superpowers", tooltip: "Extending agent capabilities", type: "folder" },
          { id: "uniswap-skills", name: "uniswap-skills", tooltip: "DeFi integration skills", type: "folder" },
          { id: "eth-skills", name: "eth-skills", tooltip: "Ethereum utility tools", type: "folder" },
          { id: "pashov-skills", name: "pashov-skills", tooltip: "Smart contract security", type: "folder" },
          { id: "trail-of-bits", name: "trail-of-bits", tooltip: "Advanced security analysis", type: "folder" },
        ],
      },
      {
        id: "mcp", name: "mcp", tooltip: "Model Context Protocol servers", type: "folder",
        children: [
          { id: "supabase", name: "supabase", tooltip: "Postgres database workflows & Auth", type: "folder" },
          { id: "stitch", name: "stitch", tooltip: "Figma design token injection", type: "folder" },
          { id: "openzepplin", name: "openzepplin", tooltip: "Secure smart contract templating", type: "folder" },
          { id: "thirdweb", name: "thirdweb", tooltip: "Web3 SDKs & account abstraction", type: "folder" },
          { id: "the-graph", name: "the-graph", tooltip: "On-chain subgraph indexing", type: "folder" },
        ],
      },
    ],
  },
  {
    id: "readme", name: "README.md", tooltip: "System initialization info", type: "file",
    content: (
      <div className="space-y-4 font-mono text-xs">
        <p className="text-zinc-100 font-bold text-sm mb-4"># INITIALIZATION_SEQUENCE</p>
        <p>Welcome to the neural link.</p>
        <p>This repository indexes my technical capabilities as modular &quot;skills&quot;. By structuring my expertise like a codebase, you can inspect the exact tools and protocols I execute.</p>
        <ul className="list-disc pl-4 space-y-2 mt-4 text-zinc-500">
          <li>System Architecture</li>
          <li>Smart Contract Deployment</li>
          <li>Advanced Protocol Integrations</li>
          <li>High-Fidelity Interaction Design</li>
        </ul>
        <div className="mt-8 border-t border-zinc-800 pt-4 text-zinc-600">// Inspect directories for detailed logs.</div>
      </div>
    ),
  },
];

export function SkillsSection() {
  const [selectedFile, setSelectedFile] = useState<TreeNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!row1Ref.current || !row2Ref.current) return;

      const duration = 25; // Balanced speed

      // Row 1: Left to Right
      const animateRow1 = gsap.fromTo(
        row1Ref.current,
        { xPercent: -33.3333 },
        {
          xPercent: 0,
          ease: "none",
          duration: duration,
          repeat: -1,
          force3D: true,
          paused: false
        }
      );

      // Row 2: Right to Left
      const animateRow2 = gsap.fromTo(
        row2Ref.current,
        { xPercent: 0 },
        {
          xPercent: -33.3333,
          ease: "none",
          duration: duration,
          repeat: -1,
          force3D: true,
          paused: false
        }
      );

      // Hover to pause functionality
      const rows = [row1Ref.current, row2Ref.current];
      const anims = [animateRow1, animateRow2];

      rows.forEach((row, i) => {
        row.addEventListener("mouseenter", () => anims[i].pause());
        row.addEventListener("mouseleave", () => anims[i].play());
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const row1 = [...defiLogos, ...defiLogos, ...defiLogos];
  const row2 = [...defaultLogos, ...defaultLogos, ...defaultLogos];

  return (
    <section id="skills" ref={containerRef} className="py-24 md:py-32 w-full flex flex-col justify-center relative bg-[#141414] scroll-mt-20 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute bottom-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center relative z-20 mb-20 pointer-events-auto pt-16">
        <div className="w-full lg:max-w-5xl flex flex-col items-center px-4">
          <SlideRevealButton onOpen={() => setIsModalOpen(true)} />
        </div>
      </div>

      <div className="w-full flex flex-col gap-12 md:gap-20 relative z-10 py-10">
        <div className="max-w-6xl mx-auto w-full overflow-hidden mask-fade-edges">
          <div ref={row1Ref} className="flex gap-2 md:gap-4 px-12" style={{ width: "max-content" }}>
            {row1.map((logo, i) => (
              <div key={i} className="flex flex-col items-center gap-4 w-[85px] md:w-[130px] shrink-0">
                <div className="relative flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo.url} alt={logo.name} className="w-10 h-10 md:w-[60px] md:h-[60px] object-contain opacity-100" />
                </div>
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-zinc-400 uppercase">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto w-full overflow-hidden mask-fade-edges">
          <div ref={row2Ref} className="flex gap-2 md:gap-4 px-12" style={{ width: "max-content" }}>
            {row2.map((logo, i) => (
              <div key={i} className="flex flex-col items-center gap-4 w-[85px] md:w-[130px] shrink-0">
                <div className="relative flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo.url} alt={logo.name} className="w-10 h-10 md:w-[60px] md:h-[60px] object-contain opacity-100" />
                </div>
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-zinc-400 uppercase">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[450px] bg-[#141414] border border-zinc-800 p-6 shadow-2xl h-fit max-h-[85vh] overflow-hidden"
            >
              {["-translate-x-1/2 -translate-y-1/2 top-0 left-0", "translate-x-1/2 -translate-y-1/2 top-0 right-0", "-translate-x-1/2 translate-y-1/2 bottom-0 left-0", "translate-x-1/2 translate-y-1/2 bottom-0 right-0"].map((pos, i) => (
                <svg key={i} width="11" height="11" viewBox="0 0 11 11" fill="none" className={`absolute ${pos} text-red-500 pointer-events-none`}>
                  <path d="M5.5 0V11M0 5.5H11" stroke="currentColor" strokeWidth="1" />
                </svg>
              ))}

              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-red-500/60 hover:text-red-500 transition-colors z-10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="text-zinc-300 font-mono text-xs mb-4 uppercase tracking-widest pb-3 h-auto flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-center border-b border-zinc-900 pb-3 pr-10 relative">
                  {selectedFile && (
                    <button onClick={() => setSelectedFile(null)} className="absolute left-0 text-red-500/60 hover:text-red-500 transition-colors cursor-pointer shrink-0 font-mono text-[10px] border border-red-500/20 px-1.5 py-0.5">
                      &lt; RETURN
                    </button>
                  )}
                  <span className="truncate">{selectedFile ? selectedFile.name : "SYSTEM_DIRECTORY"}</span>
                </div>

                <div className="mt-4 overflow-y-auto pr-2 text-zinc-300 font-sans normal-case tracking-normal transition-all duration-300" style={{ maxHeight: "calc(85vh - 100px)" }}>
                  <AnimatePresence mode="wait">
                    {selectedFile ? (
                      <motion.div key="file-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="text-zinc-400 text-sm leading-relaxed">
                        {selectedFile.content}
                      </motion.div>
                    ) : (
                      <motion.div key="tree" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                        {demoData.map((node) => (
                          <TreeNodeTooltip key={node.id} node={node} onSelect={setSelectedFile} />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
