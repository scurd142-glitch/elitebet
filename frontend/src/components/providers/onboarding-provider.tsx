"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SplashScreen } from "@/components/splash-screen";
import { Onboarding } from "@/components/onboarding";
import { useAuth } from "./auth-provider";

type OnboardingContextValue = {
  showOnboarding: boolean;
  completeOnboarding: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingWrapper({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return <OnboardingProvider user={user}>{children}</OnboardingProvider>;
}

export function OnboardingProvider({ children, user }: { children: ReactNode; user: any }) {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if onboarding was completed
    const onboardingComplete = localStorage.getItem("nitebet_onboarding_complete");
    if (!onboardingComplete && user) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <OnboardingContext.Provider value={{ showOnboarding, completeOnboarding: handleOnboardingComplete }}>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return ctx;
}
