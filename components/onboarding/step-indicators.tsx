const STEP_META = [
    { emoji: "🥩", label: "Beslenme" },
    { emoji: "🌾", label: "Alerjiler" },
    { emoji: "🌍", label: "Mutfaklar" },
    { emoji: "🎯", label: "Hedefin" },
];

export const StepIndicators = ({
    step,
    setStep,
    setDirection,
    totalSteps
}: {
    step: number;
    setStep: (step: number) => void;
    setDirection: (dir: 1 | -1) => void;
    totalSteps: number;
}) => {
    return (
        <div className="flex items-center justify-center gap-2 mb-5 pt-2">
            {STEP_META.map((meta, i) => {
                const isActive = i + 1 === step;
                const isDone = i + 1 < step;
                return (
                    <div key={i} className="flex items-center gap-2">
                        <button
                            onClick={() => isDone ? (setDirection(i + 1 < step ? -1 : 1), setStep(i + 1)) : undefined}
                            className={`
                                flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-wide transition-all duration-500
                                ${isActive
                                    ? "bg-orange-500/15 border-orange-500/50 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.25)] scale-105"
                                    : isDone
                                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-pointer hover:scale-105"
                                        : "bg-white/3 border-white/8 text-gray-600 cursor-default"
                                }
                            `}
                        >
                            <span className={isActive || isDone ? "" : "opacity-40"}>{meta.emoji}</span>
                            <span className={isActive ? "" : isDone ? "" : "opacity-30"}>{meta.label}</span>
                            {isDone && <span className="text-[10px] opacity-80">✓</span>}
                        </button>
                        {i < totalSteps - 1 && (
                            <div className={`h-px w-5 transition-all duration-700 ${isDone ? "bg-emerald-500/40" : "bg-white/10"}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
