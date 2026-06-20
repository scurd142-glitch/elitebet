"use client";

import { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import { EliteBetLogo } from "@/components/ui/elitebet-logo";

const slides = [
  {
    title: "Welcome to EliteBet",
    description: "Kenya's ultimate simulation betting experience. Deposit via M-Pesa, play crash games, and bet on sports.",
    icon: "🎮",
  },
  {
    title: "Play & Win",
    description: "Try your luck with Aviator crash game, bet on live sports, or enjoy casino games. All balances are for gameplay only.",
    icon: "🚀",
  },
  {
    title: "Get Started",
    description: "Make your first deposit and get a 100% boost bonus. Remember, this is a simulation platform — play responsibly!",
    icon: "💰",
  },
];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem("elitebet_onboarding_complete", "true");
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#111111] px-4">
      <button
        onClick={handleSkip}
        className="absolute right-4 top-4 rounded-full p-2 text-[#888888] hover:text-[#ffffff] hover:bg-[#222222] transition-colors"
        aria-label="Skip"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="max-w-md w-full">
        <div className="mb-8 flex justify-center">
          <EliteBetLogo size={60} />
        </div>

        <div className="text-center">
          <div className="mb-6 text-6xl">{slides[currentSlide].icon}</div>
          <h2 className="mb-4 text-2xl font-bold text-[#ffffff]">{slides[currentSlide].title}</h2>
          <p className="text-[#888888]">{slides[currentSlide].description}</p>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentSlide ? "w-6 bg-[#00a651]" : "bg-[#333333]"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleNext}
            className="flex items-center gap-2 rounded-full bg-[#00a651] px-8 py-3 font-semibold text-[#ffffff] hover:bg-[#008c45] transition-colors"
          >
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
