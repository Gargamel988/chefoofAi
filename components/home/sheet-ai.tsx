import React from 'react'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Flame, UtensilsCrossed, ChefHat, Sparkles } from "lucide-react";

export default function SheetAi({ sheetOpen, setSheetOpen, object, isLoading, error }: any) {
    return (
        <>{/* AI RECIPE SHEET (DRAWER) */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side="right" className="w-full sm:max-w-xl bg-zinc-950 border-zinc-800 text-white p-0 rounded-l-3xl overflow-y-auto">
                    {/* Header Effect */}
                    <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 px-6 py-5">
                        <SheetTitle className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-orange-400" />
                            </div>
                            Tarif Asistanı
                        </SheetTitle>
                        <SheetDescription className="text-zinc-400 text-sm mt-1">
                            Seçtiğin malzemelerle sana özel bir formül üretiyoruz.
                        </SheetDescription>
                    </div>

                    <div className="p-6">
                        {error ? (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                                <p className="text-red-400 text-sm font-semibold">{error.message}</p>
                            </div>
                        ) : object ? (
                            <div className="space-y-6">
                                {/* Title and Badges */}
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">
                                        {object.title || (isLoading && <span className="animate-pulse text-zinc-600">Sihir Gerçekleşiyor...</span>)}
                                    </h2>
                                    {object.title && (
                                        <div className="flex flex-wrap gap-2 text-xs font-semibold">
                                            {object.servings && <Badge variant="outline" className="border-orange-500/30 text-orange-300 bg-orange-500/10"><Users className="w-3 h-3 mr-1" />{object.servings} porsiyon</Badge>}
                                            {object.times?.totalMinutes && <Badge variant="outline" className="border-blue-500/30 text-blue-300 bg-blue-500/10"><Clock className="w-3 h-3 mr-1" />{object.times.totalMinutes} dk</Badge>}
                                            {object.nutrition?.calories && <Badge variant="outline" className="border-rose-500/30 text-rose-300 bg-rose-500/10"><Flame className="w-3 h-3 mr-1" />{object.nutrition.calories} kcal</Badge>}
                                        </div>
                                    )}
                                </div>

                                {/* Ingredients preview */}
                                {object.ingredients && object.ingredients.length > 0 && (
                                    <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-4">
                                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                            <UtensilsCrossed className="w-4 h-4 text-orange-400" />
                                            Malzemeler
                                        </h3>
                                        <ul className="space-y-2">
                                            {object.ingredients.map((ing: any, i: number) => (
                                                <li key={i} className="flex items-center gap-2 text-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                                    <span className="text-zinc-300">
                                                        {ing.amount && ing.unit ? `${ing.amount} ${ing.unit} ` : ""}
                                                        <span className="text-white font-medium">{ing.name}</span>
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Instructions */}
                                {object.steps && object.steps.length > 0 && (
                                    <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-4">
                                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                            <ChefHat className="w-4 h-4 text-orange-400" />
                                            Yapım Aşaması
                                        </h3>
                                        <div className="space-y-4">
                                            {object.steps.map((stepInfo: any, i: number) => (
                                                <div key={i} className="flex gap-3 text-sm">
                                                    <div className="w-6 h-6 rounded-full bg-orange-500/10 text-orange-400 font-black text-xs flex items-center justify-center shrink-0 border border-orange-500/20">
                                                        {stepInfo.step || i + 1}
                                                    </div>
                                                    <p className="text-zinc-300 flex-1 leading-relaxed pt-0.5">
                                                        {stepInfo.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tips */}
                                {object.tips && object.tips.length > 0 && (
                                    <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 pt-4 mt-2">
                                        <h3 className="text-sm font-bold text-orange-400 mb-2 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4" />
                                            Şefin Önerileri
                                        </h3>
                                        <ul className="list-disc pl-4 space-y-1">
                                            {object.tips.map((tip: string | undefined, i: number) => (
                                                <li key={i} className="text-sm text-orange-200/80 leading-relaxed italic">
                                                    {tip || ""}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-4 border border-orange-500/20">
                                    <ChefHat className="w-8 h-8 text-orange-400 animate-bounce" />
                                </div>
                                <p className="text-zinc-400 font-semibold mb-1">Mutfakta hazırlık yapılıyor...</p>
                                <p className="text-xs text-zinc-500">Seçtiğin tüm malzemeler en iyi tarif için analiz ediliyor.</p>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet></>
    )
}
