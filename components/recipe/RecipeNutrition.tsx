"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { MacroBar } from "./MacroBar";

const ORANGE = "#FF6B2C";

const MACRO_BARS = [
    { label: "Protein",       key: "proteinGrams", color: "#3B82F6", max: 100 },
    { label: "Karbonhidrat",  key: "carbsGrams",   color: "#F59E0B", max: 300 },
    { label: "Yağ",           key: "fatGrams",      color: ORANGE,   max: 80  },
];

interface Nutrition {
    calories?: number;
    proteinGrams?: number;
    carbsGrams?: number;
    fatGrams?: number;
}

export function RecipeNutrition({ nutrition }: { nutrition: Nutrition }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative overflow-hidden bg-zinc-900 border border-zinc-800/60 rounded-3xl p-6 shadow-xl"
        >
            {/* Decorative glows */}
            <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(255,107,44,0.12)" }} />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full blur-2xl pointer-events-none" style={{ background: "rgba(59,130,246,0.08)" }} />

            <h3 className="text-white font-black text-base flex items-center gap-2 mb-5 relative">
                <Flame className="w-4 h-4 text-orange-400" />
                Besin Değerleri
            </h3>

            {/* Calorie big number */}
            <div className="relative flex items-end gap-2 mb-6 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                <span className="text-5xl font-black leading-none" style={{ color: ORANGE }}>
                    {nutrition.calories || "—"}
                </span>
                <div className="pb-1">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Kalori</p>
                    <p className="text-[10px] text-zinc-600">/ porsiyon</p>
                </div>
            </div>

            <div className="space-y-4 relative">
                {MACRO_BARS.map(({ label, key, color, max }) => (
                    <MacroBar
                        key={key}
                        label={label}
                        value={(nutrition as any)[key] || 0}
                        color={color}
                        max={max}
                    />
                ))}
            </div>
        </motion.section>
    );
}
