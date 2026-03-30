"use client"
import React, { useState } from "react";
import { StepProps } from "./types";
import { cn } from "@/lib/utils";
import { Check, Edit2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const GOALS = [
    {
        id: "kesif",
        icon: "🗺️",
        label: "Yeni Tatlar Keşfet",
        desc: "Sınırları zorlayan tarifler",
        accent: { bg: "from-violet-500/15", border: "border-violet-500/40", glow: "shadow-[0_0_32px_rgba(139,92,246,0.2)]", check: "bg-violet-500", ring: "focus-visible:ring-violet-500" },
    },
    {
        id: "saglik",
        icon: "🥗",
        label: "Sağlıklı Beslenmek",
        desc: "Temiz içerik, dengeli makrolar",
        accent: { bg: "from-emerald-500/15", border: "border-emerald-500/40", glow: "shadow-[0_0_32px_rgba(16,185,129,0.2)]", check: "bg-emerald-500", ring: "focus-visible:ring-emerald-500" },
    },
    {
        id: "butce",
        icon: "💎",
        label: "Bütçemi Korumak",
        desc: "Sıfır israfla değerlendirmek",
        accent: { bg: "from-sky-500/15", border: "border-sky-500/40", glow: "shadow-[0_0_32px_rgba(14,165,233,0.2)]", check: "bg-sky-500", ring: "focus-visible:ring-sky-500" },
    },
    {
        id: "hiz",
        icon: "⚡",
        label: "Hızlı ve Pratik",
        desc: "30 dakikada nefis bir tabak",
        accent: { bg: "from-orange-500/15", border: "border-orange-500/40", glow: "shadow-[0_0_32px_rgba(249,115,22,0.2)]", check: "bg-orange-500", ring: "focus-visible:ring-orange-500" },
    },
];

export const Step4Goal = ({ data, updateData }: StepProps) => {
    const [isCustom, setIsCustom] = useState(false);
    const [customGoal, setCustomGoal] = useState("");

    const handlePredefinedClick = (id: string) => {
        setIsCustom(false);
        setCustomGoal("");
        updateData({ goal: id });
    };

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customGoal.trim()) {
            updateData({ goal: customGoal.trim() });
        }
    };

    return (
        <section className="flex flex-col h-full">
            <header className="mb-6">
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-500/60 mb-1">Adım 4 / 4</p>
                <h2 className="text-2xl font-black text-white tracking-tight">Tek bir şey isteyebilseydin?</h2>
                <p className="text-gray-500 text-sm mt-1">Algoritmamızı buna göre ayarlayacağız.</p>
            </header>

            <div className="flex flex-col gap-4 flex-1">
                <div className="grid grid-cols-2 gap-3">
                    {GOALS.map((g) => {
                        const sel = data.goal === g.id && !isCustom;
                        return (
                            <Card
                                key={g.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => handlePredefinedClick(g.id)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handlePredefinedClick(g.id);
                                    }
                                }}
                                className={cn(
                                    "group relative h-32 flex flex-col justify-center rounded-2xl border transition-all duration-400 text-left overflow-hidden cursor-pointer outline-none focus-visible:ring-2 p-0",
                                    g.accent.ring,
                                    !sel && "hover:scale-[1.02] active:scale-[0.98]",
                                    sel
                                        ? `bg-linear-to-br ${g.accent.bg} to-transparent ${g.accent.border} ${g.accent.glow}`
                                        : "bg-white/3 border-white/7 hover:border-white/20"
                                )}
                            >
                                {/* glow orb */}
                                {sel && <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/5 rounded-full blur-2xl" />}

                                {sel && (
                                    <span className={cn("absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center z-10", g.accent.check)}>
                                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                    </span>
                                )}

                                <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10 h-full w-full">
                                    <span className={cn(
                                        "text-3xl transition-transform duration-400 drop-shadow-2xl shrink-0 mt-1 sm:mt-0",
                                        sel ? "scale-110" : "group-hover:scale-105 sm:group-hover:-translate-y-1"
                                    )}>
                                        {g.icon}
                                    </span>
                                    <div>
                                        <div className={cn("font-black text-xs sm:text-sm tracking-tight mb-1", sel ? "text-white" : "text-gray-300")}>
                                            {g.label}
                                        </div>
                                        <div className={cn("text-[10px] sm:text-xs leading-relaxed", sel ? "text-gray-300" : "text-gray-500")}>
                                            {g.desc}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="mt-auto pt-2">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">veya kendi hedefini yaz</span>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>

                    <form onSubmit={handleCustomSubmit} className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Edit2 className="w-4 h-4 text-orange-500/70" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Örn: Kas yapmak istiyorum..."
                            value={customGoal}
                            onFocus={() => {
                                setIsCustom(true);
                                updateData({ goal: customGoal });
                            }}
                            onChange={(e) => {
                                setCustomGoal(e.target.value);
                                updateData({ goal: e.target.value });
                            }}
                            className={cn(
                                "w-full h-14 bg-black/50 border-white/10 rounded-xl text-white text-sm focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all pl-11",
                                isCustom && customGoal.trim() ? "border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]" : ""
                            )}
                        />
                        {isCustom && customGoal.trim() && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white animate-in zoom-in">
                                <Check className="w-3 h-3" strokeWidth={3} />
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};
