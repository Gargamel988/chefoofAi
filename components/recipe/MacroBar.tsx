"use client";

import { motion } from "framer-motion";

interface MacroBarProps {
    label: string;
    value: number;
    color: string;
    max: number;
}

export function MacroBar({ label, value, color, max }: MacroBarProps) {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-400">{label}</span>
                <span className="text-white font-bold">{value}g</span>
            </div>
            <div className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                />
            </div>
        </div>
    );
}
