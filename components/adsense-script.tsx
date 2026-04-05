"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

const AD_BLOCKLIST = [
  "/auth",
  "/onboarding",
  "/checkout",
  "/profile",
  "/publish",
  "/favorites",
  "/weekly-plan",
  "/api",
  "/privacy-policy",
  "/terms-of-service",
  "/error",
  "/not-found",
];

export default function AdSenseScript() {
  const pathname = usePathname();

  // Check if current path matches any blocklist items
  // This covers both exact matches and sub-paths (e.g., /auth/login)
  const isBlocked = AD_BLOCKLIST.some((path) => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isBlocked) {
    return null;
  }

  return (
    <Script
      id="adsense-init"
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1444133443338193"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
