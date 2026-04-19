"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RulerNav, type NavSection } from "@/components/ui/ruler-carousel";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";
import { FlipLinks } from "@/components/ui/flip-links";
import { BlockStack, type BlockData } from "@/components/ui/isometric-block";
import { ContributionHeatmap } from "@/components/ui/contribution-heatmap";
import { SkillsSection } from "@/components/ui/skills-section";
import { GithubStats } from "@/components/ui/github-stats";
import { ContactForm } from "@/components/ui/contact-form";
import { ProjectsList } from "@/components/ui/projects-list";

import type { ContributionData } from "@/lib/github";



const SECTIONS: NavSection[] = [
  { id: "projects", label: "PROJECTS" },
  { id: "skills",   label: "SKILLS"   },
  { id: "github",   label: "GITHUB"   },
  { id: "contact",  label: "CONTACT"  },
];

const GH = "https://github.com/vyqno";
const PLACEHOLDER_BLOCKS: BlockData[] = [
  {
    blockNum: 7, repo: "vyqno/protocol-v2", repoUrl: `${GH}/protocol-v2`,
    branch: "main", pushedAt: "2m ago", isLatest: true,
    commits: [
      { hash: "a3f2b1c", message: "fix: resolve reentrancy in vault",  url: `${GH}/protocol-v2/commit/a3f2b1c` },
      { hash: "9cd4e72", message: "add: flash loan guard",              url: `${GH}/protocol-v2/commit/9cd4e72` },
      { hash: "2f1a3d8", message: "refactor: split pool logic",         url: `${GH}/protocol-v2/commit/2f1a3d8` },
    ],
  },
  {
    blockNum: 6, repo: "vyqno/frontend", repoUrl: `${GH}/frontend`,
    branch: "main", pushedAt: "1h ago",
    commits: [
      { hash: "b7e3a12", message: "feat: isometric block component",    url: `${GH}/frontend/commit/b7e3a12` },
      { hash: "c5d9f04", message: "style: ruler nav alignment fix",     url: `${GH}/frontend/commit/c5d9f04` },
    ],
  },
  {
    blockNum: 5, repo: "vyqno/contracts", repoUrl: `${GH}/contracts`,
    branch: "dev", pushedAt: "4h ago",
    commits: [
      { hash: "e1f8c23", message: "add: ERC-4626 vault interface",      url: `${GH}/contracts/commit/e1f8c23` },
      { hash: "d4a7b56", message: "test: coverage for staking",         url: `${GH}/contracts/commit/d4a7b56` },
      { hash: "f2c9e01", message: "docs: natspec on core fns",          url: `${GH}/contracts/commit/f2c9e01` },
    ],
  },
  {
    blockNum: 4, repo: "vyqno/indexer", repoUrl: `${GH}/indexer`,
    branch: "main", pushedAt: "1d ago",
    commits: [
      { hash: "78b3d9a", message: "init: subgraph scaffold",            url: `${GH}/indexer/commit/78b3d9a` },
    ],
  },
];

export default function SectionsPage({
  githubBlocks,
  contributionData,
}: {
  githubBlocks?: BlockData[];
  contributionData?: ContributionData | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const blocks = githubBlocks && githubBlocks.length > 0 ? githubBlocks : PLACEHOLDER_BLOCKS;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach((section, index) => {
      const el = document.getElementById(section.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (window.scrollY < 50) {
              setActiveIndex(0);
            } else {
              setActiveIndex(index);
            }
          }
        },
        { threshold: 0, rootMargin: "-48% 0px -48% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    const handleGlobalScroll = () => {
      if (window.scrollY < 100) setActiveIndex(0);
    };

    window.addEventListener("scroll", handleGlobalScroll, { passive: true });

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", handleGlobalScroll);
    };
  }, [isReady]);

  return (
    <div className="w-full bg-[#141414]">
      {/* Fixed ruler nav */}
      <div className="fixed top-0 left-0 z-50 w-full bg-[#141414]/80 backdrop-blur-md border-b border-zinc-800/60 py-2 px-4">
        <RulerNav sections={SECTIONS} activeIndex={activeIndex} />
      </div>



      {/* Projects */}
      <section
        id="projects"
        className="relative min-h-screen w-full flex flex-col justify-center px-6 md:px-12 lg:px-24 bg-[#141414] py-32 scroll-mt-20"
      >
        <ProjectsList />
      </section>

      {/* Skills */}
      <SkillsSection />

      {/* GitHub */}
      <section
        id="github"
        className="min-h-screen w-full flex flex-col justify-center overflow-hidden relative px-4 py-24 md:px-12 lg:px-24 bg-[#141414] scroll-mt-20 border-t border-zinc-900/10"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col justify-center"
        >
          <div className="mb-6 md:mb-8 flex items-center gap-2">
            <span className="relative flex items-center justify-center" style={{ width: 18, height: 18 }}>
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(255,255,255,0.08)", animationDuration: "2s" }} />
              <svg width={10} height={16} viewBox="0 0 10 16" fill="none">
                <polygon points="5,0 10,8 5,6 0,8" fill="white" opacity={0.9} />
                <polygon points="5,16 10,8 5,10 0,8" fill="white" opacity={0.5} />
              </svg>
            </span>
            <span className="text-zinc-500 text-xs font-mono tracking-widest uppercase">Github Activity</span>
            <span className="relative flex" style={{ width: 6, height: 6 }}>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-20" />
              <span className="relative inline-flex rounded-full bg-white opacity-40" style={{ width: 6, height: 6 }} />
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12 lg:gap-16 min-w-0">
            <div className="flex-shrink-0">
              <BlockStack blocks={blocks} />
            </div>
            <div className="hidden md:block" style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
            <div className="flex-1 min-w-0 flex flex-col justify-start overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {contributionData ? (
                <>
                  <ContributionHeatmap data={contributionData} />
                  <GithubStats
                    totalStars={contributionData.totalStars || 0}
                    followers={contributionData.followers || 0}
                    following={contributionData.following || 0}
                  />
                </>
              ) : (
                <span className="font-mono text-zinc-800 text-xs tracking-widest">no contribution data</span>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="min-h-screen w-full flex flex-col justify-center relative overflow-hidden bg-[#141414] scroll-mt-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full relative z-10 px-4 md:px-8 lg:px-16 pt-12 md:pt-24"
        >
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div className="flex flex-col items-start w-full">
              <p className="mb-8 text-zinc-600 text-xs font-mono tracking-[0.2em] uppercase text-left">/ FIND_ME_AT</p>
              <FlipLinks />
            </div>
            <div className="flex flex-col items-start w-full">
              <p className="mb-8 text-zinc-600 text-xs font-mono tracking-[0.2em] uppercase text-left">/ DROP_A_MESSAGE</p>
              <ContactForm />
            </div>
          </div>
        </motion.div>
      </section>

      <ScrollIndicator
        activeIndex={activeIndex}
        sectionIds={SECTIONS.map((s) => s.id)}
      />
    </div>
  );
}
