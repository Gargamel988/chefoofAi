"use client";

import { motion } from "framer-motion";
import { Sparkles, Info } from "lucide-react";

export function RecipeTips({ tips }: { tips: string[] }) {
    if (!tips.length) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="bg-zinc-900 border border-zinc-800/60 rounded-3xl p-6 shadow-xl"
        >
            <h3 className="text-white font-black text-base flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Şefin İpuçları
            </h3>
            <ul className="space-y-3">
                {tips.map((tip, idx) => (
                    <motion.li
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + idx * 0.08 }}
                        className="flex gap-3 text-sm text-zinc-300 leading-relaxed"
                    >
                        <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <Info className="w-3 h-3 text-amber-400" />
                        </span>
                        {tip}
                    </motion.li>
                ))}
            </ul>
        </motion.section>
    );
}
