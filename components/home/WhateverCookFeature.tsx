import Link from "next/link";
import { ChefHat, ArrowRight } from "lucide-react";
import { InteractiveCard } from "@/components/motion";

export default function WhateverCookFeature() {
    return (
        <section className="max-w-7xl mx-auto px-4 py-2 mb-6">
            <Link href="/whatever-cook">
                <InteractiveCard
                    withTap
                    className="relative overflow-hidden rounded-2xl border border-pink-500/20 bg-linear-to-r from-zinc-900 via-zinc-900 to-pink-950/10 p-5 text-left hover:border-pink-500/40 hover:bg-zinc-800/80 transition-all group shadow-sm cursor-pointer"
                >

                    <div className="flex items-center gap-4 relative z-10">
                        {/* Icon Container */}
                        <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex flex-shrink-0 items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <ChefHat className="w-6 h-6 text-pink-400" />
                        </div>

                        {/* Text Content */}
                        <div className="flex-1">
                            <h3 className="text-white font-black text-lg flex items-center gap-2">
                                Evde Ne Varsa?
                                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-[10px] uppercase font-bold tracking-wider border border-pink-500/30">
                                    YENİ
                                </span>
                            </h3>
                            <p className="text-zinc-400 text-sm mt-0.5">
                                Canın ne çektiyse söyle, CheFood AI senin için o mükemmel tarifi hazırlasın.
                            </p>
                        </div>

                        {/* CTA Arrow — clearly signals interactivity */}
                        <div className="flex-shrink-0 flex items-center gap-1.5 pl-2">
                            <span className="text-xs text-pink-400/70 font-semibold tracking-wide hidden sm:block group-hover:text-pink-400 transition-colors">
                                Dene
                            </span>
                            <div className="w-8 h-8 rounded-full border border-pink-500/30 bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500/20 group-hover:border-pink-500/50 group-hover:translate-x-0.5 transition-all duration-300">
                                <ArrowRight className="w-4 h-4 text-pink-400" />
                            </div>
                        </div>
                    </div>
                </InteractiveCard>
            </Link>
        </section>
    );
}