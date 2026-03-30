import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export default function OnboardingPage() {
    return (
        <div className="fixed inset-0 bg-[#050505] flex items-center justify-center overflow-hidden">
            {/* Ambient background gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/6 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-orange-900/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Subtle grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="relative z-10 w-full max-w-3xl px-6">
                <OnboardingFlow />
            </div>
        </div>
    );
}
