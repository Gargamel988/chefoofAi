"use client";

import { motion } from "framer-motion";
import { Clock, Flame, Timer, Zap } from "lucide-react";

interface Times {
    prepMinutes?: number;
    cookMinutes?: number;
    totalMinutes?: number;
}

export function RecipeQuickStats({ times }: { times: Times }) {
    if (!times.prepMinutes && !times.cookMinutes) return null;

    return (
        <div className="border-b border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto px-4 py-3 flex gap-6 overflow-x-auto">
                {times.prepMinutes && (
                    <div className="flex items-center gap-2 text-xs text-zinc-400 shrink-0">
                        <Timer className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Hazırlık: <strong className="text-white">{times.prepMinutes} dk</strong></span>
                    </div>
                )}
                {times.cookMinutes && (
                    <div className="flex items-center gap-2 text-xs text-zinc-400 shrink-0">
                        <Flame className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Pişirme: <strong className="text-white">{times.cookMinutes} dk</strong></span>
                    </div>
                )}
                {times.totalMinutes && (
                    <div className="flex items-center gap-2 text-xs text-zinc-400 shrink-0">
                        <Zap className="w-3.5 h-3.5 text-orange-400" />
                        <span>Toplam: <strong className="text-orange-400">{times.totalMinutes} dk</strong></span>
                    </div>
                )}
            </div>
        </div>
    );
}
