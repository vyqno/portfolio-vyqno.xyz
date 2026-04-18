"use client";

import { useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import SmoothScroll from "vyqno/components/SmoothScroll";

export default function Home() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <SmoothScroll>
      <div className="flex flex-col flex-1 items-center justify-center font-sans">
        <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-32 px-16">
          <h1
            className="font-serif italic"
            style={{ fontSize: "var(--text-2xl)", color: "var(--color-ink)" }}
          >
            Hitesh
          </h1>
          <p
            className="mt-4 font-mono"
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-muted)",
              letterSpacing: "0.1em",
            }}
          >
            BUILDER / TRADER / SECURITY
          </p>
        </main>
      </div>
    </SmoothScroll>
  );
}
