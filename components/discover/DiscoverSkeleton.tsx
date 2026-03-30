"use client";

import { motion } from "framer-motion";

export function DiscoverSkeleton() {
    return (
        <div className="space-y-10 animate-pulse">
            {/* Hero Skeleton */}
            <div className="w-full h-80 sm:h-96 rounded-3xl bg-zinc-900 border border-zinc-800/80 overflow-hidden relative">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-zinc-800/20 to-transparent" />
                <div className="absolute top-4 left-4 w-32 h-6 bg-zinc-800 rounded-lg" />
                <div className="absolute bottom-6 left-6 right-6 space-y-4">
                    <div className="w-2/3 h-8 bg-zinc-800 rounded-lg" />
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-800 rounded-2xl" />
                            <div className="space-y-2">
                                <div className="w-20 h-3 bg-zinc-800 rounded-md" />
                                <div className="w-12 h-2 bg-zinc-800 rounded-md" />
                            </div>
                        </div>
                        <div className="w-24 h-8 bg-zinc-800 rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Creators Skeleton */}
            <div>
                <div className="w-32 h-4 bg-zinc-900 rounded-md mb-4" />
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-36 h-40 bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex flex-col items-center">
                            <div className="w-16 h-16 bg-zinc-800 rounded-full mb-3" />
                            <div className="w-20 h-3 bg-zinc-800 rounded-md mb-2" />
                            <div className="w-12 h-2 bg-zinc-800 rounded-md mb-4" />
                            <div className="w-full h-8 bg-zinc-800 rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid Skeleton */}
            <div>
                <div className="flex justify-between mb-4">
                    <div className="w-40 h-4 bg-zinc-900 rounded-md" />
                    <div className="w-16 h-3 bg-zinc-900 rounded-md" />
                </div>
                <div className="flex flex-col gap-8 max-w-2xl mx-auto">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-full aspect-video bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden relative">
                            {/* Header Skeleton */}
                            <div className="flex items-center gap-3 p-4 border-b border-zinc-800/50">
                                <div className="w-10 h-10 bg-zinc-800 rounded-full" />
                                <div className="space-y-2">
                                    <div className="w-24 h-3 bg-zinc-800 rounded-md" />
                                    <div className="w-16 h-2 bg-zinc-800 rounded-md" />
                                </div>
                            </div>
                            <div className="aspect-video bg-zinc-800/50" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
