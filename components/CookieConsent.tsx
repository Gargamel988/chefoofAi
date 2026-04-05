"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Cookie, X } from "lucide-react";

const GA_TRACKING_ID = "G-PP8ZMGR061";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);

  // Consent Mode Update Helper
  const updateGoogleConsent = (granted: boolean) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': granted ? 'granted' : 'denied',
        'ad_storage': granted ? 'granted' : 'denied',
        'ad_user_data': granted ? 'granted' : 'denied',
        'ad_personalization': granted ? 'granted' : 'denied'
      });
    }
  };

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (consent === null) {
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      const isGranted = consent === "true";
      setHasConsented(isGranted);
      if (isGranted) updateGoogleConsent(true);
    }
  }, []);

  const handleConsent = (agreed: boolean) => {
    localStorage.setItem("cookie-consent", agreed.toString());
    setHasConsented(agreed);
    updateGoogleConsent(agreed);
    setShowBanner(false);
  };

  return (
    <>
      {/* Google Analytics orjinal kodu artık layout.tsx içinde her zaman yüklü (Consent Mode v2) */}

      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[400px] z-50"
          >
            <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-2xl shadow-orange-500/10">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-orange-500/10 rounded-2xl">
                  <Cookie className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1">
                    Çerez Tercihleri
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Size en iyi deneyimi sunmak ve sitemizi geliştirmek için çerezleri kullanıyoruz. Kabul ederek bize bu konuda yardımcı olabilirsiniz.
                  </p>
                </div>
                <button 
                  onClick={() => setShowBanner(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleConsent(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 text-sm font-medium hover:bg-zinc-900 transition-colors"
                >
                  Reddet
                </button>
                <button
                  onClick={() => handleConsent(true)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 text-black text-sm font-bold hover:bg-orange-400 transition-colors shadow-lg shadow-orange-500/20"
                >
                  Kabul Et
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
