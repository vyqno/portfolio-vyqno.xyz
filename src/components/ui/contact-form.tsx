"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import gsap from "gsap";

const HANDLES = {
  whatsapp: "7483701113",
  telegram: "vyqno",
  x: "vyqno",
};

export const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSelecting, setIsSelecting] = useState(false);
  const platformContainerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (platformContainerRef.current && !platformContainerRef.current.contains(event.target as Node)) {
        setIsSelecting(false);
      }
    }
    if (isSelecting) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSelecting]);

  useEffect(() => {
    if (isSelecting && platformContainerRef.current) {
      gsap.fromTo(
        platformContainerRef.current.querySelector(".z-10")?.children || [],
        { opacity: 0, y: 10, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, stagger: 0.1, ease: "power2.out", delay: 0.2 }
      );
    }
  }, [isSelecting]);

  const getEncodedMessage = () => {
    const body = `Hi Hitesh, I'm ${formData.name || "someone"} (${formData.email || "no email provided"}).\n\n${formData.message}`;
    return encodeURIComponent(body);
  };

  const handleRedirect = (platform: "whatsapp" | "telegram" | "x") => {
    const message = getEncodedMessage();
    let url = "";
    switch (platform) {
      case "whatsapp": url = `https://wa.me/${HANDLES.whatsapp}?text=${message}`; break;
      case "telegram": url = `https://t.me/${HANDLES.telegram}?text=${message}`; break;
      case "x": url = `https://twitter.com/messages/compose?recipient_id=&text=${message}`; break;
    }
    if (url) window.open(url, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-8 w-full max-w-lg mt-8 lg:mt-0"
    >
      <form className="space-y-8 w-full">
        <div className="group space-y-3">
          <label htmlFor="name" className="block text-[9px] font-medium tracking-[0.3em] text-zinc-600 transition-colors group-focus-within:text-zinc-400 uppercase">01 // FULL NAME</label>
          <div className="relative border-b border-zinc-800 transition-colors group-focus-within:border-zinc-400">
            <input id="name" type="text" placeholder="ENTER_NAME" value={formData.name} onChange={handleInputChange} className="w-full bg-transparent px-4 pt-1 pb-4 text-base font-medium tracking-[0.05em] text-zinc-200 focus:outline-none placeholder:text-zinc-800 transition-all" autoComplete="name" />
          </div>
        </div>

        <div className="group space-y-3">
          <label htmlFor="email" className="block text-[9px] font-medium tracking-[0.3em] text-zinc-600 transition-colors group-focus-within:text-zinc-400 uppercase">02 // EMAIL ADDRESS</label>
          <div className="relative border-b border-zinc-800 transition-colors group-focus-within:border-zinc-400">
            <input id="email" type="email" placeholder="ENTER_EMAIL" value={formData.email} onChange={handleInputChange} className="w-full bg-transparent px-4 pt-1 pb-4 text-base font-medium tracking-[0.05em] text-zinc-200 focus:outline-none placeholder:text-zinc-800 transition-all" autoComplete="email" />
          </div>
        </div>

        <div className="group space-y-3">
          <label htmlFor="message" className="block text-[9px] font-medium tracking-[0.3em] text-zinc-600 transition-colors group-focus-within:text-zinc-400 uppercase">03 // MESSAGE</label>
          <div className="relative border-b border-zinc-800 transition-colors group-focus-within:border-zinc-400">
            <textarea id="message" placeholder="TYPE_YOUR_MESSAGE..." rows={4} value={formData.message} onChange={handleInputChange} className="w-full bg-transparent px-4 pt-1 pb-4 text-base font-medium tracking-[0.05em] text-zinc-200 focus:outline-none placeholder:text-zinc-800 transition-all resize-none" required />
          </div>
        </div>

        <div ref={platformContainerRef} className="relative h-14 w-full [perspective:1000px]">
          <motion.div
            initial={false}
            animate={{ rotateX: isSelecting ? 180 : 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformStyle: "preserve-3d" }}
            className="w-full h-full relative"
          >
            <motion.button
              type="button"
              onClick={() => { if (formData.message.trim()) setIsSelecting(true); }}
              disabled={!formData.message.trim()}
              style={{ backfaceVisibility: "hidden", fontFamily: "var(--font-outfit), sans-serif" }}
              className="absolute inset-0 w-full h-full border border-zinc-800 bg-white text-black font-bold text-[9px] tracking-[0.4em] uppercase hover:bg-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-20"
            >
              SEND_TRANSMISSION
            </motion.button>
            <div style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }} className="absolute inset-0 w-full h-full border border-zinc-800 bg-black flex overflow-hidden z-10">
              <PlatformButton onClick={() => handleRedirect("whatsapp")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.05c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </PlatformButton>
              <PlatformButton onClick={() => handleRedirect("telegram")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
              </PlatformButton>
              <PlatformButton onClick={() => handleRedirect("x")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239H4.293L17.607 20.65z"/></svg>
              </PlatformButton>
            </div>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
};

const PlatformButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => {
  const iconRef = useRef<HTMLDivElement>(null);

  const onMouseEnter = () => {
    if (iconRef.current) gsap.to(iconRef.current, { scale: 1.15, y: -2, duration: 0.3, ease: "power2.out", color: "#ffffff" });
  };
  const onMouseLeave = () => {
    if (iconRef.current) gsap.to(iconRef.current, { scale: 1, y: 0, duration: 0.3, ease: "power2.inOut", color: "#52525b" });
  };

  return (
    <button type="button" onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className="flex items-center justify-center h-full flex-1 hover:bg-zinc-900 transition-colors">
      <div ref={iconRef} className="p-2 text-zinc-500 transition-colors">{children}</div>
    </button>
  );
};
