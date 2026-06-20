"use client";

import { useEffect, useState } from "react";
import { EliteBetLogo } from "@/components/ui/elitebet-logo";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#111111] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <EliteBetLogo size={80} />
        <div className="flex gap-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-[#00a651]" style={{ animationDelay: "0ms" }} />
          <div className="h-2 w-2 animate-bounce rounded-full bg-[#00a651]" style={{ animationDelay: "150ms" }} />
          <div className="h-2 w-2 animate-bounce rounded-full bg-[#00a651]" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
