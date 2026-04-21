"use client";

import { motion } from "framer-motion";
import { ChefHat, Clock } from "lucide-react";

interface Step {
    description: string;
    durationMinutes?: number;
}

export function RecipeSteps({ steps, startOffset = 0, showHeader = true }: { steps: Step[], startOffset?: number, showHeader?: boolean }) {
    if (!steps.length) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-zinc-900 border border-zinc-800/60 rounded-3xl p-6 sm:p-8 shadow-xl"
        >
            {showHeader && (
                <h2 className="text-lg font-black text-white flex items-center gap-2 mb-8">
                    <ChefHat className="w-5 h-5 text-orange-400" />
                    Hazırlanış Adımları
                    <span className="ml-auto text-xs font-semibold text-zinc-500">{steps.length} adım</span>
                </h2>
            )}

            <div className="space-y-5">
                {steps.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="flex gap-4 group"
                    >
                        {/* Step number */}
                        <div className="flex flex-col items-center shrink-0">
                            <div className="w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm border border-zinc-700 bg-zinc-800 group-hover:border-orange-500/50 group-hover:bg-orange-500/10 group-hover:text-orange-400 text-zinc-400 transition-all duration-300">
                                {i + 1 + startOffset}
                            </div>
                            {i < steps.length - 1 && (
                                <div className="w-px flex-1 mt-2 bg-linear-to-b from-zinc-700/60 to-transparent min-h-6" />
                            )}
                        </div>

                        {/* Card */}
                        <div className="flex-1 pb-1">
                            <div className="bg-zinc-800/40 border border-zinc-800 rounded-2xl px-5 py-4 group-hover:border-zinc-700 group-hover:bg-zinc-800/70 transition-all duration-300">
                                <p className="text-sm text-zinc-200 leading-relaxed">{step.description}</p>
                                {step.durationMinutes && (
                                    <span className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400">
                                        <Clock className="w-3 h-3" />
                                        {step.durationMinutes} dk
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
