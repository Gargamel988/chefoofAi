import { ChefHat } from "lucide-react";
import { FadeInSlide, JiggleRotate } from "../motion";

type LoadingStateProps = {
    isGenerating: boolean;
    hasPlan: boolean;
    showPromptInput: boolean;
    loadingStepIdx: number;
    loadingSteps: string[];
};

export function LoadingState({
    isGenerating, hasPlan, showPromptInput,
    loadingStepIdx, loadingSteps
}: LoadingStateProps) {

    if (!isGenerating || (hasPlan && !showPromptInput)) return null;

    return (
        <FadeInSlide direction="up" duration={0.3} className="py-16 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 mb-6">
                <JiggleRotate duration={4} degrees={360} className={`absolute inset-0 rounded-full border-4 border-t-orange-500 border-zinc-800`}>
                    <div className="w-full h-full" />
                </JiggleRotate>
                <div className="absolute inset-0 flex items-center justify-center bg-orange-500/10 rounded-full">
                    <ChefHat className="w-10 h-10 text-orange-500" />
                </div>
            </div>

            <h3
                key={loadingStepIdx}
                className="text-xl font-black text-orange-500 text-center animate-in fade-in zoom-in duration-300"
            >
                {loadingSteps[loadingStepIdx]}
            </h3>

            {/* Skeleton Cards below */}
            <div className="w-full mt-12 space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-24 rounded-3xl animate-pulse w-full max-w-2xl mx-auto bg-zinc-800/50`} />
                ))}
            </div>
        </FadeInSlide>
    );
}
