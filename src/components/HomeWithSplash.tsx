"use client";

import { useState } from "react";
import SplashScreen from "./SplashScreen";

export default function HomeWithSplash({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        children
      )}
    </>
  );
}
