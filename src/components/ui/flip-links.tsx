"use client";

import React from "react";
import { motion } from "framer-motion";

const LINKS = [
  { label: "Twitter",  href: "https://x.com/vyqno" },
  { label: "Github",   href: "https://github.com/vyqno" },
  { label: "Discord",  href: "https://discord.com/users/vyqno" },
  { label: "LinkedIn", href: "https://linkedin.com/in/0xhitesh" },
  { label: "ENS",      href: "https://app.ens.domains/vyqno.eth" },
];

const FlipLink = ({ children, href }: { children: string; href: string }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden whitespace-nowrap text-white"
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(2rem, 7vw, 6rem)",
        lineHeight: 0.85,
        letterSpacing: "0.02em",
      }}
    >
      <div className="flex">
        {children.split("").map((letter, i) => (
          <span
            key={i}
            className="inline-block transition-transform duration-300 ease-in-out group-hover:-translate-y-[110%]"
            style={{ transitionDelay: `${i * 22}ms` }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>
      <div className="absolute inset-0 flex" style={{ opacity: 0.45 }}>
        {children.split("").map((letter, i) => (
          <span
            key={i}
            className="inline-block translate-y-[110%] transition-transform duration-300 ease-in-out group-hover:translate-y-0"
            style={{ transitionDelay: `${i * 22}ms` }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>
    </a>
  );
};

export const FlipLinks = () => {
  return (
    <div className="flex flex-col items-start gap-1">
      {LINKS.map((link, i) => (
        <motion.div
          key={link.label}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <FlipLink href={link.href}>{link.label}</FlipLink>
        </motion.div>
      ))}
    </div>
  );
};
