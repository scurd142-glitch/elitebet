"use client";

import { useEffect, useState } from "react";
import { X, Smartphone, Share2 } from "lucide-react";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check if already dismissed
    const dismissed = localStorage.getItem("nitebet_pwa_dismissed");
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    
    if (Date.now() - dismissedTime < threeDays) {
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after 3 seconds
      setTimeout(() => setShowPrompt(true), 3000);
    };

    // For iOS, show prompt after 3 seconds if not dismissed
    if (isIOSDevice && !dismissed) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("nitebet_pwa_dismissed", Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center">
      {/* Dark overlay */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={handleDismiss}
      />
      
      {/* Popup */}
      <div className="relative w-full max-w-md rounded-t-2xl bg-[#1a1f2e] p-5 sm:rounded-2xl">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 text-[#6b7280] hover:text-[#ffffff]"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-[#00C853]">
            <Smartphone className="h-8 w-8 text-[#ffffff]" />
          </div>

          {/* Text */}
          <div className="flex-1">
            <h3 className="text-[18px] font-bold text-[#ffffff]">
              Install NiteBet App
            </h3>
            <p className="mt-1 text-[13px] text-[#9aa0a6]">
              Add to your home screen for the best experience — faster, fullscreen, works offline
            </p>
          </div>
        </div>

        {/* iOS instructions */}
        {isIOS ? (
          <div className="mt-4 rounded-xl bg-[#2d3448] p-4">
            <div className="flex items-center gap-3">
              <Share2 className="h-6 w-6 text-[#00C853]" />
              <p className="text-sm text-[#ffffff]">
                Tap the <span className="font-bold">Share</span> button → then <span className="font-bold">"Add to Home Screen"</span>
              </p>
            </div>
          </div>
        ) : (
          /* Install button */
          <button
            onClick={handleInstall}
            className="mt-4 w-full rounded-xl bg-[#00C853] py-3 text-[15px] font-bold text-[#ffffff] transition-opacity hover:opacity-90"
          >
            Add to Home Screen
          </button>
        )}

        {/* Maybe later */}
        <button
          onClick={handleDismiss}
          className="mt-3 w-full text-center text-sm text-[#6b7280] hover:text-[#ffffff]"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}
