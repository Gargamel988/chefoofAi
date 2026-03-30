"use client"
import { cn } from "@/lib/utils";
import { Check, Edit2 } from "lucide-react";
import { StepProps } from "./types";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const DIETS = [
    { id: "hepsi", icon: "🥩", label: "Her Şeyi Yerim", sub: "Sınır yok" },
    { id: "vejetaryen", icon: "🌿", label: "Vejetaryen", sub: "Etsiz dünya" },
    { id: "vegan", icon: "🌱", label: "Vegan", sub: "Saf bitki" },
    { id: "pesketaryen", icon: "🐟", label: "Pesketaryen", sub: "Deniz sevgisi" },
    { id: "protein", icon: "💪", label: "Sporcu Dengesi", sub: "Güç & form" },
    { id: "ketojenik", icon: "🥑", label: "Ketojenik", sub: "Düşük karb" },
    { id: "akdeniz", icon: "🍅", label: "Akdeniz", sub: "Zeytinyağlı" },
    { id: "glutensiz", icon: "🌾", label: "Glutensiz", sub: "Hafif & rahat" },
];

export const Step1Diet = ({ data, updateData }: StepProps) => {
    const [isCustom, setIsCustom] = useState(false);
    const [customDiet, setCustomDiet] = useState("");

    const toggle = (id: string) => {
        setIsCustom(false);
        setCustomDiet("");
        updateData({ diets: data.diets === id ? "" : id });
    };

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customDiet.trim()) {
            updateData({ diets: customDiet.trim() });
        }
    };

    return (
        <section className="flex flex-col h-full">
            <header className="mb-6">
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-500/60 mb-1">Adım 1 / 4</p>
                <h2 className="text-2xl font-black text-white tracking-tight">Nasıl besleniyorsun?</h2>
            </header>

            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-4 gap-4">
                    {DIETS.map((d) => {
                        const sel = data.diets === d.id && !isCustom;
                        return (
                            <Card
                                key={d.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => toggle(d.id)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        toggle(d.id);
                                    }
                                }}
                                className={cn(
                                    "group relative h-32  flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.04] active:scale-95 cursor-pointer aspect-square outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                                    sel
                                        ? "bg-orange-500/12 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.18)]"
                                        : "bg-white/3 border-white/7 hover:border-white/20 hover:bg-white/6"
                                )}
                            >
                                {sel && (
                                    <span className="absolute top-2 right-2 flex items-center justify-center w-4 h-4 rounded-full bg-orange-500 text-white z-10">
                                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                                    </span>
                                )}
                                <CardContent className="p-0 flex flex-col items-center justify-center gap-1 h-full w-full">
                                    <span className={cn("text-3xl transition-transform duration-300 drop-shadow-lg", sel ? "scale-110" : "group-hover:scale-105")}>{d.icon}</span>
                                    <span className={cn("text-[12px] font-bold leading-tight text-center px-1", sel ? "text-orange-200" : "text-gray-300")}>{d.label}</span>
                                    <span className="text-[10px] text-gray-600 line-clamp-1">{d.sub}</span>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="mt-auto">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">veya kendin yaz</span>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>

                    <form onSubmit={handleCustomSubmit} className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Edit2 className="w-4 h-4 is text-orange-500/70" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Örn: Sadece tavuk yiyorum"
                            value={customDiet}
                            onFocus={() => {
                                setIsCustom(true);
                                updateData({ diets: customDiet });
                            }}
                            onChange={(e) => {
                                setCustomDiet(e.target.value);
                                updateData({ diets: e.target.value });
                            }}
                            className={cn(
                                "w-full h-14 bg-black/50 border-white/10 rounded-xl text-white text-sm focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all pl-12",
                                isCustom && customDiet.trim() ? "border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]" : ""
                            )}
                        />
                        {isCustom && customDiet.trim() && (
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
