"use client";

import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { useProfiles } from "@/hooks/useProfiles";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

/* ─── Onboarding ile aynı değerler ─── */
const DIETS = [
    { id: "hepsi",       icon: "🥩", label: "Her Şeyi Yerim" },
    { id: "vejetaryen",  icon: "🌿", label: "Vejetaryen" },
    { id: "vegan",       icon: "🌱", label: "Vegan" },
    { id: "pesketaryen", icon: "🐟", label: "Pesketaryen" },
    { id: "protein",     icon: "💪", label: "Sporcu Dengesi" },
    { id: "ketojenik",   icon: "🥑", label: "Ketojenik" },
    { id: "akdeniz",     icon: "🍅", label: "Akdeniz" },
    { id: "glutensiz",   icon: "🌾", label: "Glutensiz" },
];

const GOALS = [
    { id: "kesif",  icon: "🗺️", label: "Yeni Tatlar Keşfet",  desc: "Sınırları zorlayan tarifler" },
    { id: "saglik", icon: "🥗", label: "Sağlıklı Beslenmek",  desc: "Dengeli makrolar" },
    { id: "butce",  icon: "💎", label: "Bütçemi Korumak",     desc: "Sıfır israfla değerlendirmek" },
    { id: "hiz",    icon: "⚡", label: "Hızlı ve Pratik",     desc: "30 dakikada nefis tabak" },
];

type Profile = {
    id: string;
    diet_type?: string;
    allergies?: string[];
    cuisines?: string[];
    goal?: string;
};

export function FoodPreferencesTab({ profile }: { profile: Profile | null }) {
    const { updateProfile } = useProfiles();

    const [diet, setDiet] = useState(profile?.diet_type ?? "");
    const [goal, setGoal] = useState(profile?.goal ?? "");
    const [allergies, setAllergies] = useState(
        Array.isArray(profile?.allergies) ? profile!.allergies.join(", ") : ""
    );
    const [cuisines, setCuisines] = useState(
        Array.isArray(profile?.cuisines) ? profile!.cuisines.join(", ") : ""
    );
    const handleSave = async () => {
        if (!profile?.id) return;
        try {
            await updateProfile.mutateAsync({
                id: profile.id,
                diet_type: diet,
                goal,
                allergies: allergies.split(",").map(s => s.trim()).filter(Boolean),
                cuisines: cuisines.split(",").map(s => s.trim()).filter(Boolean),
            });
            toast.success("Yemek tercihleri kaydedildi!");
        } catch {
            // Error handled by hook
        }
    };

    const isSaving = updateProfile.isPending;

    return (
        <div className="space-y-8">
            {/* Diyet */}
            <div className="space-y-3">
                <Label className="text-zinc-300 font-semibold text-sm">Nasıl besleniyorsun?</Label>
                <div className="grid grid-cols-4 gap-2.5">
                    {DIETS.map(d => {
                        const sel = diet === d.id;
                        return (
                            <button
                                key={d.id}
                                type="button"
                                onClick={() => setDiet(d.id)}
                                className={cn(
                                    "relative flex flex-col items-center justify-center gap-1.5 h-20 rounded-2xl border text-center transition-all duration-200",
                                    sel
                                        ? "bg-orange-500/10 border-orange-500/50 shadow-[0_0_16px_rgba(249,115,22,0.15)]"
                                        : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/60"
                                )}
                            >
                                {sel && (
                                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                    </span>
                                )}
                                <span className="text-xl">{d.icon}</span>
                                <span className={cn("text-[11px] font-bold leading-tight px-1", sel ? "text-orange-200" : "text-zinc-300")}>
                                    {d.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <Separator className="bg-zinc-800" />

            {/* Alerjiler */}
            <div className="space-y-2">
                <Label className="text-zinc-300 font-semibold text-sm">Alerjiler ve Kaçınılan Malzemeler</Label>
                <Input
                    value={allergies}
                    onChange={e => setAllergies(e.target.value)}
                    placeholder="Gluten, laktoz, yer fıstığı... (Virgülle ayırın)"
                    className="bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-orange-500 h-11 rounded-xl"
                />
            </div>

            {/* Mutfaklar */}
            <div className="space-y-2">
                <Label className="text-zinc-300 font-semibold text-sm">Sevdiğiniz Mutfaklar</Label>
                <Input
                    value={cuisines}
                    onChange={e => setCuisines(e.target.value)}
                    placeholder="Türk, İtalyan, Meksika... (Virgülle ayırın)"
                    className="bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-orange-500 h-11 rounded-xl"
                />
            </div>

            <Separator className="bg-zinc-800" />

            {/* Hedef */}
            <div className="space-y-3">
                <Label className="text-zinc-300 font-semibold text-sm">Tek bir şey isteyebilseydin?</Label>
                <div className="grid grid-cols-2 gap-3">
                    {GOALS.map(g => {
                        const sel = goal === g.id;
                        return (
                            <button
                                key={g.id}
                                type="button"
                                onClick={() => setGoal(g.id)}
                                className={cn(
                                    "relative flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-200",
                                    sel
                                        ? "bg-orange-500/10 border-orange-500/40 shadow-[0_0_16px_rgba(249,115,22,0.12)]"
                                        : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/60"
                                )}
                            >
                                {sel && (
                                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                    </span>
                                )}
                                <span className="text-2xl shrink-0">{g.icon}</span>
                                <div>
                                    <p className={cn("text-sm font-bold", sel ? "text-orange-200" : "text-zinc-200")}>{g.label}</p>
                                    <p className="text-xs text-zinc-500 mt-0.5">{g.desc}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-7 h-11 font-bold shadow-[0_4px_12px_rgba(255,107,44,0.3)]"
                >
                    {isSaving
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Kaydediliyor...</>
                        : <><Check className="w-4 h-4" /> Tercihleri Kaydet</>}
                </Button>
            </div>
        </div>
    );
}
