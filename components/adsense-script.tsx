"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

const AD_BLOCKLIST = [
  "/auth",
  "/onboarding",
  "/checkout",
  "/profile",
  "/users",
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

  // 1. Path-based blocking
  const isPathBlocked = AD_BLOCKLIST.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // 2. Extra safety for utility endpoints
  const isApiAuth = pathname.includes("/api/auth");

  if (isPathBlocked || isApiAuth) {
    return null;
  }

  return (
    <>
      <Script
        id="adsense-init"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1444133443338193"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {/* Script to check for manual disable flag set by NotFound or Error pages, providing immediate protection */}
      <Script id="adsense-guard" strategy="afterInteractive">
        {`
          (function() {
            if (document.body.dataset.adsDisabled === 'true') {
              var ads = document.querySelectorAll('.adsbygoogle');
              for (var i = 0; i < ads.length; i++) {
                ads[i].style.display = 'none';
              }
            }
          })();
        `}
      </Script>
    </>
  );
}
