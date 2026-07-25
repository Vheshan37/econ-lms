"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function PwaRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only check and redirect if running inside PWA standalone mode
    const isPwa = window.matchMedia("(display-mode: standalone)").matches || window.location.search.includes("source=pwa");
    if (!isPwa) return;

    const savedRole = localStorage.getItem("user-role");
    if (!savedRole) return;

    // Check if we are on landing page or login screens
    const isAuthOrLandingPage = 
      pathname === "/" || 
      pathname === "/login" || 
      pathname === "/login/student" || 
      pathname === "/login/teacher";

    if (isAuthOrLandingPage) {
      if (savedRole === "teacher") {
        router.replace("/admin/dashboard");
      } else if (savedRole === "student") {
        router.replace("/student/dashboard");
      }
    }
  }, [pathname, router]);

  return null;
}
