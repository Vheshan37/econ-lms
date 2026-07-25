export interface DeviceInfo {
  type: "pwa" | "mobile_browser" | "desktop_browser";
  isMobile: boolean;
  isPWA: boolean;
  os: "ios" | "android" | "desktop" | "unknown";
}

/**
 * Checks the device type, OS, and PWA status.
 * Works on both Client-side and Server-side.
 * 
 * @param options Server-side inputs (userAgent and standalone status)
 */
export function checkDevice(options?: { userAgent?: string; isStandalone?: boolean }): DeviceInfo {
  let ua = "";
  let isPWA = false;

  if (typeof window !== "undefined") {
    // Client-side detection
    ua = window.navigator.userAgent;
    isPWA =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://") ||
      window.location.search.includes("source=pwa");
  } else {
    // Server-side fallback detection using parameters passed from headers/cookies/queries
    ua = options?.userAgent || "";
    isPWA = options?.isStandalone || false;
  }

  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isMobile = isAndroid || isIOS || /Mobi/i.test(ua);

  let type: "pwa" | "mobile_browser" | "desktop_browser" = "desktop_browser";
  if (isPWA) {
    type = "pwa";
  } else if (isMobile) {
    type = "mobile_browser";
  }

  let os: "ios" | "android" | "desktop" | "unknown" = "desktop";
  if (isAndroid) os = "android";
  else if (isIOS) os = "ios";

  return {
    type,
    isMobile,
    isPWA,
    os,
  };
}
