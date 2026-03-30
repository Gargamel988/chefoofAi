"use client";

import { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { streamObjectSchema } from "@/schema/stream-object-schemes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Camera, Sparkles } from "lucide-react";
import SheetAi from "./sheet-ai";

export default function FridgeFeature() {
    const [fridgeInput, setFridgeInput] = useState("");
    const [sheetOpen, setSheetOpen] = useState(false);

    const { submit, object, isLoading, error } = useObject({
        schema: streamObjectSchema,
        api: "/api/chat",
    });

    const submitDish = () => {
        if (!fridgeInput.trim()) return;

        const query = `Elimdekiler: ${fridgeInput.trim()}. Bana nefis bir tarif ver.`;
        submit({ dish: query, type: "fridge" });
        setSheetOpen(true);
    };

    return (
        <>
            <section className="max-w-7xl mx-auto px-4 py-6">
                <Card className="border border-orange-500/20 bg-linear-to-br from-zinc-900 via-zinc-900 to-orange-950/20 rounded-2xl shadow-[0_8px_32px_rgba(255,107,44,0.06)] overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                    <CardHeader className="px-5 pt-5 pb-0 relative z-10">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-orange-500/30 bg-orange-500/10">
                                <span className="text-xl">🧊</span>
                            </div>
                            <div>
                                <p className="text-base font-black text-white">Buzdolabında Ne Var?</p>
                                <p className="text-xs text-zinc-400">Malzemeleri gir, saniyeler içinde sana özel tarif üretelim.</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5 pt-4 space-y-4 relative z-10">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    value={fridgeInput}
                                    onChange={e => setFridgeInput(e.target.value)}
                                    placeholder="Örn: Tavuk, domates, makarna..."
                                    className="text-sm bg-zinc-950/50 border-zinc-700/50 text-white placeholder:text-zinc-500 focus-visible:ring-orange-500/50 rounded-xl py-6 pl-4 shadow-inner"

                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-dashed border-zinc-700 text-xs font-semibold text-zinc-400 hover:border-orange-500/40 hover:text-orange-300 hover:bg-orange-500/5 transition-all">
                                <Camera className="w-4 h-4" />
                                <span>Fotoğrafla Tara (Yakında)</span>
                            </button>
                            <Button
                                onClick={submitDish}
                                disabled={isLoading || (!fridgeInput)}
                                className="flex-1 h-full font-bold gap-2 rounded-xl border-0 text-white shadow-[0_4px_16px_rgba(255,107,44,0.3)] hover:scale-[1.02] transition-transform disabled:opacity-50 bg-orange-500 hover:bg-orange-600">
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Üretiliyor...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Tarif Üret ({fridgeInput.length + (fridgeInput ? 1 : 0)})
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <SheetAi sheetOpen={sheetOpen} setSheetOpen={setSheetOpen} object={object} isLoading={isLoading} error={error} />
        </>
    );
}
