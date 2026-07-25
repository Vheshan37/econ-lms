"use client";

import { useState, useEffect } from "react";
import { usePwaInstall } from "./PwaInstallProvider";
import { Download, X, Smartphone, MoreVertical, Share } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallBanner() {
  const { isInstallable, installApp } = usePwaInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // Show banner after 3 seconds to let PWA register/settle
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem("pwa-banner-dismissed");
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await installApp();
      if (success) {
        setIsVisible(false);
      } else {
        setShowInstructions(true);
      }
    } else {
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("pwa-banner-dismissed", "true");
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[60] bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 overflow-hidden"
          >
            {/* Subtle gold accent border */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#D4AF37] to-[#AA7C11]" />

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl flex-shrink-0">
                <Smartphone className="w-6 h-6 animate-pulse" />
              </div>

              <div className="flex-grow min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
                  Install Quality Econ App
                </h4>
                <p className="text-xs text-gray-500 mt-1 leading-normal">
                  Access your Economics LMS instantly from your home screen with offline capability.
                </p>
                
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleInstallClick}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-semibold rounded-lg shadow-md shadow-[#D4AF37]/20 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Install App
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-3 py-2 text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Later
                  </button>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Installation Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInstructions(false)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full relative z-10 shadow-2xl border border-gray-100 text-center"
            >
              <button
                onClick={() => setShowInstructions(false)}
                className="absolute top-4 right-4 p-1 hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mx-auto w-12 h-12 bg-[#D4AF37]/10 text-[#D4AF37] rounded-2xl flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-gray-900">How to Install App</h3>
              <p className="text-sm text-gray-500 mt-2">
                Follow these simple steps to add <span className="font-semibold text-gray-900">Quality Econ</span> to your home screen:
              </p>

              <div className="mt-6 text-left space-y-4">
                {isIOS ? (
                  // iOS Safari instructions
                  <>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-gray-100 text-xs font-bold flex items-center justify-center text-gray-700 mt-0.5">1</span>
                      <div className="text-sm text-gray-600">
                        Tap the <span className="inline-flex items-center p-1 bg-gray-50 rounded border border-gray-200 text-[#007AFF] font-bold"><Share className="w-4 h-4" /> Share</span> button in Safari.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-gray-100 text-xs font-bold flex items-center justify-center text-gray-700 mt-0.5">2</span>
                      <div className="text-sm text-gray-600">
                        Scroll down and select <span className="font-semibold text-gray-900">"Add to Home Screen"</span>.
                      </div>
                    </div>
                  </>
                ) : (
                  // Android Chrome instructions
                  <>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-gray-100 text-xs font-bold flex items-center justify-center text-gray-700 mt-0.5">1</span>
                      <div className="text-sm text-gray-600">
                        Tap the browser menu <span className="inline-flex items-center p-1 bg-gray-50 rounded border border-gray-200 text-gray-700"><MoreVertical className="w-4 h-4" /></span> in the top right corner.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-gray-100 text-xs font-bold flex items-center justify-center text-gray-700 mt-0.5">2</span>
                      <div className="text-sm text-gray-600">
                        Select <span className="font-semibold text-gray-900">"Install app"</span> or <span className="font-semibold text-gray-900">"Add to Home screen"</span>.
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setShowInstructions(false)}
                className="mt-8 w-full py-3 bg-[#1a1a1a] hover:bg-black text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
