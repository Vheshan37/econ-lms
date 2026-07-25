"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface PwaInstallContextType {
  deferredPrompt: any;
  isInstallable: boolean;
  installApp: () => Promise<boolean>;
}

const PwaInstallContext = createContext<PwaInstallContextType>({
  deferredPrompt: null,
  isInstallable: false,
  installApp: async () => false,
});

export const usePwaInstall = () => useContext(PwaInstallContext);

export default function PwaInstallProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      console.log("PWA was installed successfully");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check if app is already running in standalone mode (installed)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, discard it
    setDeferredPrompt(null);
    setIsInstallable(false);

    return outcome === "accepted";
  };

  return (
    <PwaInstallContext.Provider
      value={{
        deferredPrompt,
        isInstallable,
        installApp,
      }}
    >
      {children}
    </PwaInstallContext.Provider>
  );
}
