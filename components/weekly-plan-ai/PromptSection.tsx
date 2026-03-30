import { FadeInSlide } from "@/components/motion";
import { Sparkles } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

type PromptSectionProps = {
    hasPlan: boolean;

    setShowPromptInput: Dispatch<SetStateAction<boolean>>;
    customPrompt: string;
    setCustomPrompt: Dispatch<SetStateAction<string>>;
    targetCal: number;
    setTargetCal: Dispatch<SetStateAction<number>>;
    mealCount: number;
    setMealCount: Dispatch<SetStateAction<number>>;
    prepPref: string;
    setPrepPref: Dispatch<SetStateAction<string>>;
    handleGenerate: () => void;
};

export function PromptSection({
    hasPlan, setShowPromptInput,
    customPrompt, setCustomPrompt,
    targetCal, setTargetCal,
    mealCount, setMealCount,
    prepPref, setPrepPref,
    handleGenerate
}: PromptSectionProps) {




    return (
        <FadeInSlide direction="up" distance={10} duration={0.3}>
            <Card className="shadow-xl bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-black">Bu hafta nasıl beslenmek istiyorsun?</CardTitle>
                    <CardDescription className="text-zinc-400">Hedeflerine ve yaşam tarzına en uygun menüyü CheFood AI hazırlasın.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <textarea
                        value={customPrompt}
                        onChange={e => setCustomPrompt(e.target.value)}
                        placeholder="Örn: Hafta içi akşamları çok hafif geçireyim, hafta sonu Türk mutfağı ağırlıklı olsun..."
                        className="w-full h-32 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none transition-all bg-black/40 border-zinc-800 text-white placeholder-zinc-600"
                    />

                    {/* Chips */}
                    <div className="flex flex-wrap gap-2">
                        {["Hafif & Detox", "Bol Protein", "Deniz Ürünleri", "Ekonomik", "Vegan"].map(chip => (
                            <Badge
                                key={chip}
                                variant="outline"
                                onClick={() => setCustomPrompt(prev => prev + (prev ? ", " : "") + chip)}
                                className="cursor-pointer px-3 py-1.5 text-xs font-semibold hover:border-orange-500/50 hover:bg-zinc-800"
                            >
                                + {chip}"
                            </Badge>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-800/50">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-zinc-400">Günlük Kalori Hedefi</Label>
                            <select value={targetCal} onChange={e => setTargetCal(Number(e.target.value))} className="w-full p-2.5 rounded-md text-sm font-semibold border bg-black/40 border-zinc-800 text-white placeholder-zinc-600">
                                <option value={1500}>1500 kkal</option>
                                <option value={1800}>1800 kkal</option>
                                <option value={2000}>2000 kkal</option>
                                <option value={2500}>2500 kkal</option>
                                <option value={3000}>3000 kkal</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-zinc-400">Günlük Öğün Sayısı</Label>
                            <select value={mealCount} onChange={e => setMealCount(Number(e.target.value))} className="w-full p-2.5 rounded-md text-sm font-semibold border bg-black/40 border-zinc-800 text-white placeholder-zinc-600">
                                <option value={2}>2 Öğün (Öğle - Akşam)</option>
                                <option value={3}>3 Öğün</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-zinc-400">Hazırlık Süresi</Label>
                            <select value={prepPref} onChange={e => setPrepPref(e.target.value)} className="w-full p-2.5 rounded-md text-sm font-semibold border bg-black/40 border-zinc-800 text-white placeholder-zinc-600">
                                <option value="Pratik (15-20dk)">Pratik (15-20dk)</option>
                                <option value="Dengeli (40dk)">Dengeli Dağılım</option>
                                <option value="Uzun, Gurme">Gurme Şef</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        {hasPlan && (
                            <Button variant="ghost" className="order-2 sm:order-1 px-5 py-6 rounded-xl" onClick={() => setShowPromptInput(false)}>
                                İptal
                            </Button>
                        )}
                        <Button
                            onClick={handleGenerate}
                            className="order-1 sm:order-2 flex-1 px-8 py-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-95"
                        >
                            <Sparkles className="w-5 h-5 fill-white/20" /> Haftalık Menümü Oluştur
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </FadeInSlide>
    );
}
