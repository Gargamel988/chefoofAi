"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  /**
   * data-ad-slot — Google AdSense'ten aldığın reklam birimi ID'si
   */
  slot: string;
  /**
   * Reklam formatı. "auto" çoğu durum için uygundur.
   * Diğer seçenekler: "fluid", "rectangle", "vertical", "horizontal"
   */
  format?: string;
  /**
   * Responsive boyutlandırma. true bırakılması önerilir.
   */
  responsive?: boolean;
  /**
   * Opsiyonel ekstra CSS class
   */
  className?: string;
}

/**
 * Google AdSense reklam birimi bileşeni.
 *
 * Kullanım:
 * ```tsx
 * <AdBanner slot="1234567890" />
 * <AdBanner slot="1234567890" format="fluid" />
 * ```
 */
export default function AdBanner({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isAdPushed = useRef(false);

  useEffect(() => {
    if (isAdPushed.current) return;

    try {
      const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] })
        .adsbygoogle;
      if (adsbygoogle) {
        adsbygoogle.push({});
        isAdPushed.current = true;
      }
    } catch (err) {
      console.error("AdSense push error:", err);
    }
  }, []);

  return (
    <div
      ref={adRef}
      className={`ad-container ${className}`}
      style={{ textAlign: "center", overflow: "hidden" }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client="ca-pub-1444133443338193"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
