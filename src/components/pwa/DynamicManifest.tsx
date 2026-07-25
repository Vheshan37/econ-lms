"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function DynamicManifest() {
  const pathname = usePathname();

  useEffect(() => {
    // Find or create manifest link element
    let link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement("link");
      link.rel = "manifest";
      document.head.appendChild(link);
    }

    // Determine the manifest URL based on the current path
    if (pathname.startsWith("/student") || pathname === "/login/student") {
      link.href = "/manifest-student.json";
    } else if (pathname.startsWith("/admin") || pathname === "/login/teacher") {
      link.href = "/manifest-teacher.json";
    } else {
      link.href = "/manifest.json";
    }
  }, [pathname]);

  return null;
}
