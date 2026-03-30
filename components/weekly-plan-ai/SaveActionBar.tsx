import { Loader2, Save, Trash2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

type SaveActionBarProps = {
    isUnsaved: boolean;
    isGenerationDone: boolean;
    isGenerating: boolean;
    saving: boolean;
    onCancel: () => void;
    handleSavePlan: () => void;
};

export function SaveActionBar({
    isUnsaved, isGenerationDone, isGenerating, saving,
    onCancel, handleSavePlan
}: SaveActionBarProps) {
    return (
        <>
            {isUnsaved && (isGenerationDone || isGenerating) && (
                <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Gradient shade at bottom */}
                    <div className="absolute inset-0 bg-linear-to-t pointer-events-none from-[#09090b] via-[#09090b]/80 to-transparent" />

                    <div className="max-w-2xl mx-auto pointer-events-auto relative mt-4">
                        <Card className="backdrop-blur-2xl border shadow-2xl rounded-4xl bg-zinc-900/95 border-zinc-800 shadow-black/50">
                            <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex-1 text-center sm:text-left">
                                    <h4 className="font-black text-base mb-0.5">
                                        {isGenerating ? "Menü Hazırlanıyor..." : "Menün Hazır!"}
                                    </h4>
                                    <p className="text-[11px] font-medium text-zinc-400">
                                        {isGenerating ? "Son rötüşler yapılıyor, lütfen bekle." : "Planı beğendiysen kaydederek kullanmaya başlayabilirsin."}
                                    </p>
                                </div>
                                <div className="flex w-full sm:w-auto items-center gap-2">
                                    {!isGenerating && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={onCancel}
                                            className="h-12 w-12 sm:w-14 rounded-2xl flex items-center justify-center border transition-all hover:text-red-500 hover:border-red-500 hover:bg-red-500/10 bg-zinc-800 border-zinc-700 text-zinc-400 cursor-pointer"
                                            title="İptal Et"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleSavePlan}
                                        disabled={isGenerating || saving}
                                        className="h-12 flex-1 sm:flex-none px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        {saving ? "Kaydediliyor..." : "Planı Kaydet"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </>
    );
}
