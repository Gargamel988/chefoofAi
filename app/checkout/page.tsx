"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ShieldCheck, X } from "lucide-react";
import Script from "next/script";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push("/pricing");
    }
  }, [token, router]);

  if (!token) return null;

  return (
    <div className="h-screen bg-zinc-950 flex flex-col pt-20 overflow-hidden">
      {/* Absolute Close Button (Optional but good for UX) - Adjusted for Nav */}
      <button
        onClick={() => router.push("/pricing")}
        className="fixed top-24 right-4 z-9999 w-10 h-10 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all border border-white/10"
        title="Kapat ve Geri Dön"
      >
        <X className="w-5 h-5" />
      </button>

      {loading && (
        <div className="absolute inset-x-0 bottom-0 top-20 bg-zinc-950 z-10000 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-2 border-orange-500/10 border-t-orange-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 text-orange-500" />
            </div>
          </div>
          <h2 className="mt-8 text-2xl font-black text-white tracking-tight">Güvenli Bağlantı</h2>
          <p className="mt-2 text-zinc-500 font-medium">Ödeme sistemi yükleniyor...</p>
        </div>
      )}

      <div className="flex-1 w-full h-[calc(100vh-80px)] relative">
        <iframe
          src={`https://www.paytr.com/odeme/guvenli/${token}`}
          id="paytriframe"
          className="w-full h-full border-none m-0 p-0"
          onLoad={() => setLoading(false)}
          title="PayTR Secure Payment"
          scrolling="auto"
        />
      </div>

      <Script
        src="https://www.paytr.com/js/iframeResizer.min.js"
        onLoad={() => {
          // @ts-ignore
          if (window.iFrameResize) {
            // @ts-ignore
            window.iFrameResize({ log: false, checkOrigin: false }, "#paytriframe");
          }
        }}
      />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
