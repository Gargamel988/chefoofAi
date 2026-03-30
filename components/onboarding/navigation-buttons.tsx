import { ArrowRight, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NavigationButtons = ({
    step,
    totalSteps,
    prevStep,
    nextStep,
    canProceed,
    isProcessing
}: {
    step: number;
    totalSteps: number;
    prevStep: () => void;
    nextStep: () => void;
    canProceed: boolean;
    isProcessing: boolean;
}) => {
    return (
        <div className="flex justify-between items-center mt-5">
            <Button
                variant="ghost"
                size="sm"
                onClick={prevStep}
                disabled={step === 1}
                className={`rounded-full h-9 px-4 text-sm text-gray-500 hover:text-white hover:bg-white/8 transition-all ${step === 1 ? "opacity-0 pointer-events-none" : ""}`}
            >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Geri
            </Button>

            <div className="flex gap-1.5 items-center">
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                        key={i}
                        className={`rounded-full transition-all duration-500 ${i + 1 === step ? "w-6 h-2 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" :
                            i + 1 < step ? "w-2 h-2 bg-emerald-400/60" :
                                "w-2 h-2 bg-white/12"
                            }`}
                    />
                ))}
            </div>

            <Button
                size="sm"
                onClick={nextStep}
                disabled={!canProceed || isProcessing}
                className={`rounded-full h-9 px-5 text-sm font-semibold transition-all duration-300 ${canProceed && !isProcessing
                    ? "bg-orange-500 hover:bg-orange-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.6)]"
                    : "bg-zinc-800 text-gray-600 cursor-not-allowed hover:bg-zinc-800"
                    }`}
            >
                {step === totalSteps ? (
                    isProcessing
                        ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Kaydediliyor...</>
                        : <><Sparkles className="w-3.5 h-3.5 mr-1.5" /> Tamamla</>
                ) : (
                    <>Devam <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></>
                )}
            </Button>
        </div>
    );
};
