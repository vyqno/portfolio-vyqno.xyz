import { Geist, Space_Mono, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { SmoothScroll } from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Hitesh | vyqno",
  description: "Portfolio of Hitesh — UI/UX · AI Automations · Web3 · On-chain builder. vyqno.eth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${spaceMono.variable} ${outfit.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;700&family=Barlow+Condensed:wght@400;700&family=Rajdhani:wght@400;700&family=Exo+2:wght@400;700&family=Chakra+Petch:wght@400;700&family=Share+Tech+Mono&family=DM+Mono:wght@400;500&family=IBM+Plex+Mono:wght@400;500&family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col relative">
        <div className="grid-container">
          <div className="tech-grid pointer-events-none" />
        </div>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
