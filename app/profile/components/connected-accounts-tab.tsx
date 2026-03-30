"use client";

import { useState } from "react";
import { Link2, Unlink } from "lucide-react";

export function ConnectedAccountsTab({ profile }: { profile: any }) {
    // Normally you'd check auth providers from Supabase session
    const [googleConnected, setGoogleConnected] = useState(true); // Example default

    const [isConnecting, setIsConnecting] = useState(false);

    const toggleGoogle = async () => {
        setIsConnecting(true);
        // Simulate API call to OAuth provider
        setTimeout(() => {
            setGoogleConnected(!googleConnected);
            setIsConnecting(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-white mb-1 tracking-tight">Bağlı Hesaplar</h3>
                <p className="text-sm font-medium text-zinc-400">Hızlı giriş yapmak ve hesaplarınızı eşitlemek için sosyal medya hesaplarınızı bağlayın.</p>
            </div>

            <div className="grid gap-4 mt-6">
                {/* Google */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-3xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors shadow-sm gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0">
                            {/* Google G Logo SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-0.5">Google</h4>
                            <p className="text-sm font-medium text-zinc-400">
                                {googleConnected ? "Hesabınız Google ile bağlı." : "Google hesabınızla hızlı giriş yapın."}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={toggleGoogle}
                        disabled={isConnecting}
                        className={`
              inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-all
              ${googleConnected
                                ? 'bg-zinc-800 text-zinc-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent'
                                : 'bg-white text-black hover:bg-zinc-200 shadow-sm'
                            }
            `}
                    >
                        {isConnecting ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                İşleniyor
                            </span>
                        ) : googleConnected ? (
                            <>
                                <Unlink className="w-4 h-4" /> Bağlantıyı Kes
                            </>
                        ) : (
                            <>
                                <Link2 className="w-4 h-4" /> Bağlan
                            </>
                        )}
                    </button>
                </div>

                {/* Apple (Placeholder) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-3xl border border-zinc-800/50 bg-zinc-900/20 opacity-60 pointer-events-none gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center shrink-0">
                            {/* Apple Logo placeholder */}
                            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" opacity="0" />
                                <path d="M17.05 16.57a7.29 7.29 0 0 1-1.63 2.1c-.81.82-1.63 1.62-2.58 1.62s-1.42-.51-2.61-.51-1.68.51-2.6.51-1.79-.8-2.6-1.62c-.93-.95-2.18-2.78-2.18-4.94 0-2.31 1.48-3.54 2.87-4.21.64-.31 1.34-.51 2.05-.51.78 0 1.54.21 2.21.57.54.29 1.05.67 1.6 1.13.56-.47 1.09-.85 1.65-1.15.68-.36 1.45-.58 2.25-.58.11 0 .22.01.32.02v.01a6.38 6.38 0 0 1-1.19 3.01 5.92 5.92 0 0 1-2.81 2.15 6.07 6.07 0 0 0 1.25 4.31v.01c.71 1.04 1.76 1.83 2.97 2.09zM12.03 7.25c-.15 0-.32-.01-.48-.02-.13-.01-.27-.03-.41-.05a4.2 4.2 0 0 1-1.61-.69c-.58-.45-1.04-1.03-1.34-1.69a4.84 4.84 0 0 1-.41-1.87 4.1 4.1 0 0 1 .63-2.1c.41-.67.97-1.22 1.63-1.6a4.29 4.29 0 0 1 2.01-.52 4.28 4.28 0 0 1 1.83.47 3.86 3.86 0 0 1 1.41 1.07 4.54 4.54 0 0 1 1 1.8 5.16 5.16 0 0 1 .19 1.46v.02c0 .1-.01.2-.02.3-.01.12-.02.24-.04.36a3.86 3.86 0 0 1-.74 1.76c-.46.61-1.07 1.08-1.77 1.34a4.13 4.13 0 0 1-1.88.16z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-0.5 flex items-center gap-2">Apple <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400 uppercase tracking-wider">Yakında</span></h4>
                            <p className="text-sm font-medium text-zinc-400">
                                Yakında eklenecek.
                            </p>
                        </div>
                    </div>
                    <button
                        disabled
                        className="inline-flex h-10 w-full sm:w-auto items-center justify-center rounded-xl bg-zinc-800 text-zinc-500 px-4 text-sm font-bold"
                    >
                        Bağlan
                    </button>
                </div>

            </div>
        </div>
    );
}
