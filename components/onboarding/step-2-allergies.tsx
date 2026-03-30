"use client"
import React, { useState } from "react";
import { StepProps } from "./types";
import { cn } from "@/lib/utils";
import { Check, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const ALLERGIES = [
    { id: "gluten", label: "Gluten" },
    { id: "laktoz", label: "Laktoz" },
    { id: "fistik", label: "Fıstık" },
    { id: "yumurta", label: "Yumurta" },
    { id: "deniz_urunleri", label: "Deniz Ürünleri" },
    { id: "kuruyemis", label: "Kuruyemiş" },
    { id: "soya", label: "Soya" },
];

export const Step2Allergies = ({ data, updateData }: StepProps) => {
    const [customVal, setCustomVal] = useState("");

    const toggle = (id: string) => {
        let next = [...data.allergies];
        if (id === "yok") { next = next.includes("yok") ? [] : ["yok"]; }
        else {
            next = next.filter(a => a !== "yok");
            next = next.includes(id) ? next.filter(a => a !== id) : [...next, id];
        }
        updateData({ allergies: next });
    };

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const val = customVal.trim().toLowerCase();
        if (val && val !== "yok" && !data.allergies.includes(val)) {
            const next = data.allergies.filter(a => a !== "yok");
            updateData({ allergies: [...next, val] });
            setCustomVal("");
        }
    };

    const noneSelected = data.allergies.includes("yok");
    const customAllergens = data.allergies.filter(a => a !== "yok" && !ALLERGIES.find(all => all.id === a));

    return (
        <section className="flex flex-col  h-full">
            <header className="mb-6">
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-500/60 mb-1">Adım 2 / 4</p>
                <h2 className="text-2xl font-black text-white tracking-tight">Alerjen var mı?</h2>
                <p className="text-gray-500 text-sm mt-1">Sağlığın birinci önceliğimiz.</p>
            </header>

            <div className="flex flex-col gap-3 flex-1 overflow-y-auto scrollbar-hide pr-2 pb-4">
                <Card
                    key="yok"
                    role="button"
                    tabIndex={0}
                    onClick={() => toggle("yok")}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault(); toggle("yok");
                        }
                    }}
                    className={cn(
                        "w-full rounded-2xl border transition-all duration-300 hover:scale-[1.01] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 p-3",
                        noneSelected
                            ? "bg-emerald-500/12 border-emerald-500/50 shadow-[0_0_24px_rgba(16,185,129,0.15)]"
                            : "bg-white/3 border-white/7 hover:border-white/20"
                    )}
                >
                    <CardContent className=" flex items-center justify-center gap-2">
                        {noneSelected && <Check className="w-4 h-4 text-emerald-300" />}
                        <span className={cn("text-sm font-bold", noneSelected ? "text-emerald-300" : "text-gray-400")}>
                            ✓ Yok — Her şeyi yerim
                        </span>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-[10px] text-gray-600 uppercase tracking-widest">veya seç</span>
                    <div className="flex-1 h-px bg-white/5" />
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {[...ALLERGIES, ...customAllergens.map(id => ({ id, label: id.charAt(0).toUpperCase() + id.slice(1), isCustom: true }))].map((a) => {
                        const sel = data.allergies.includes(a.id);
                        return (
                            <Card
                                key={a.id}
                                role="button"
                                tabIndex={noneSelected ? -1 : 0}
                                onClick={() => !noneSelected && toggle(a.id)}
                                onKeyDown={(e) => {
                                    if (!noneSelected && (e.key === "Enter" || e.key === " ")) {
                                        e.preventDefault(); toggle(a.id);
                                    }
                                }}
                                className={cn(
                                    "flex flex-col justify-center rounded-xl border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-red-500 p-3",
                                    !noneSelected && "hover:scale-[1.04] active:scale-95 cursor-pointer",
                                    noneSelected && "opacity-50 cursor-default",
                                    sel
                                        ? "bg-red-500/10 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.15)]"
                                        : noneSelected
                                            ? "bg-white/2 border-white/4"
                                            : "bg-white/3 border-white/7 hover:border-white/20"
                                )}
                            >
                                <CardContent className="flex items-center justify-center gap-1.5 h-full w-full relative">
                                    {sel && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse shrink-0" />}
                                    <span className={cn("text-xs font-semibold text-center line-clamp-1 break-all", sel ? "text-red-300" : "text-gray-400")}>
                                        {a.label}
                                    </span>
                                    {/* For custom items, allow removing directly via X when selected (or it just toggles) */}
                                    {('isCustom' in a) && sel && (
                                        <X className="w-3 h-3 text-red-400/70 absolute top-1 right-1 opacity-50" />
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="mt-4">
                    <form onSubmit={handleCustomSubmit} className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Plus className="w-4 h-4 text-emerald-500/70" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Örn: Çilek, Domates..."
                            disabled={noneSelected}
                            value={customVal}
                            onChange={(e) => setCustomVal(e.target.value)}
                            className={cn(
                                "w-full h-12 bg-black/50 border-white/10 rounded-xl text-white text-sm focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all pl-11",
                                noneSelected ? "opacity-30 cursor-not-allowed" : ""
                            )}
                        />
                        <button
                            type="submit"
                            disabled={noneSelected || !customVal.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center px-3 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/40 transition-colors disabled:opacity-0"
                        >
                            Ekle
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};
