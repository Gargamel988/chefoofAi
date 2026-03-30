"use client"
import React, { useState } from "react";
import { StepProps } from "./types";
import { cn } from "@/lib/utils";
import { Check, Plus, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const CUISINES = [
    { id: "turk", flag: "🇹🇷", label: "Türk" },
    { id: "italyan", flag: "🇮🇹", label: "İtalyan" },
    { id: "japon", flag: "🇯🇵", label: "Japon" },
    { id: "meksika", flag: "🇲🇽", label: "Meksika" },
    { id: "hint", flag: "🇮🇳", label: "Hint" },
    { id: "fransiz", flag: "🇫🇷", label: "Fransız" },
    { id: "yunan", flag: "🇬🇷", label: "Yunan" },
    { id: "ispanyol", flag: "🇪🇸", label: "İspanyol" },
    { id: "cin", flag: "🇨🇳", label: "Çin" },
    { id: "amerikan", flag: "🇺🇸", label: "Amerikan" },
];

export const Step3Cuisines = ({ data, updateData }: StepProps) => {
    const [customVal, setCustomVal] = useState("");

    const toggle = (id: string) => {
        const next = data.cuisines.includes(id) ? data.cuisines.filter(c => c !== id) : [...data.cuisines, id];
        updateData({ cuisines: next });
    };

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const val = customVal.trim().toLowerCase();
        if (val && !data.cuisines.includes(val)) {
            updateData({ cuisines: [...data.cuisines, val] });
            setCustomVal("");
        }
    };

    const customCuisines = data.cuisines.filter(c => !CUISINES.find(cuisine => cuisine.id === c));

    return (
        <section className="flex flex-col h-full">
            <header className="mb-6">
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-500/60 mb-1">Adım 3 / 4</p>
                <h2 className="text-2xl font-black text-white tracking-tight">Hangi mutfakları seviyorsun?</h2>
                <p className="text-gray-500 text-sm mt-1">Birden fazla seçebilirsin.</p>
            </header>

            <div className="flex flex-col gap-4 flex-1 overflow-y-auto scrollbar-hide pr-2 pb-4">
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {[...CUISINES, ...customCuisines.map(id => ({ id, label: id.charAt(0).toUpperCase() + id.slice(1), isCustom: true, flag: "🌍" }))].map(c => {
                        const sel = data.cuisines.includes(c.id);
                        return (
                            <Card
                                key={c.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => toggle(c.id)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        toggle(c.id);
                                    }
                                }}
                                className={cn(
                                    "group relative flex flex-col items-center justify-center p-0 rounded-2xl border transition-all duration-300 hover:scale-[1.06] active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-orange-500 aspect-square",
                                    sel
                                        ? "bg-orange-500/12 border-orange-500/50 shadow-[0_0_16px_rgba(249,115,22,0.2)]"
                                        : "bg-white/3 border-white/7 hover:border-white/20 hover:bg-white/6 saturate-0 hover:saturate-100"
                                )}
                            >
                                {sel && (
                                    <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-orange-500 text-white z-10">
                                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                                    </span>
                                )}
                                <CardContent className="p-2 flex flex-col items-center justify-center gap-1.5 h-full w-full relative">
                                    <span className={cn("text-3xl transition-transform duration-300 drop-shadow-lg", sel ? "scale-110" : "group-hover:scale-105 group-hover:-translate-y-0.5")}>{c.flag}</span>
                                    <span className={cn("text-[10px] sm:text-[11px] font-bold text-center line-clamp-1 break-all w-full px-1", sel ? "text-orange-200" : "text-gray-500 group-hover:text-gray-300")}>{c.label}</span>
                                    {('isCustom' in c) && sel && (
                                        <X className="w-3 h-3 text-orange-400/80 absolute top-1.5 left-1.5 opacity-60" />
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="mt-auto pt-2">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">farklı bir mutfak yaz</span>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>

                    <form onSubmit={handleCustomSubmit} className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Plus className="w-4 h-4 text-orange-500/70" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Örn: Kore, Lübnan..."
                            value={customVal}
                            onChange={(e) => setCustomVal(e.target.value)}
                            className={cn(
                                "w-full h-12 bg-black/50 border-white/10 rounded-xl text-white text-sm focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all pl-11"
                            )}
                        />
                        <button
                            type="submit"
                            disabled={!customVal.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center px-4 h-8 rounded-lg bg-orange-500/20 text-orange-400 text-xs font-bold hover:bg-orange-500/40 transition-colors disabled:opacity-0"
                        >
                            Ekle
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};
