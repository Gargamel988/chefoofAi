"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Step1Diet, Step2Allergies, Step3Cuisines, Step4Goal } from "@/components/onboarding/steps";
import { useProfiles } from "@/hooks/useProfiles";
import { OnboardingData } from "./types";
import { SlidePane } from "./slide-pane";
import { ProcessingScreen } from "./processing-screen";
import { StepIndicators } from "./step-indicators";
import { NavigationButtons } from "./navigation-buttons";
import { useRouter } from "next/navigation";

const TOTAL_STEPS = 4;

export const OnboardingFlow = () => {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState<1 | -1>(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [data, setData] = useState<OnboardingData>({
        diets: "",
        allergies: [],
        cuisines: [],
        goal: "",
    });
    const router = useRouter();
    const { insertProfile, isUpdating } = useProfiles()

    const updateData = (fields: Partial<OnboardingData>) => {
        setData((prev) => ({ ...prev, ...fields }));
    };

    const nextStep = () => {
        if (step < TOTAL_STEPS) {
            setDirection(1);
            setStep((prev) => prev + 1);
        } else {
            handleComplete();
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setDirection(-1);
            setStep((prev) => prev - 1);
        }
    };

    const handleComplete = async () => {
        setIsProcessing(true);
        try {
            // Give a little time for the processing animation to feel premium
            await new Promise(r => setTimeout(r, 2000));

            const result = await insertProfile.mutateAsync({
                diet_type: data.diets,
                allergies: data.allergies,
                cuisines: data.cuisines,
                goal: data.goal,
                is_public: false
            });

            if (result && !result.error) {
                router.push("/");
                router.refresh();
            } else {
                setIsProcessing(false);
            }
        } catch (error) {
            console.error("Onboarding completion error:", error);
            setIsProcessing(false);
        }
    };

    const canProceed = () => {
        switch (step) {
            case 1: return data.diets.length > 0;
            case 2: return data.allergies.length > 0;
            case 3: return data.cuisines.length > 0;
            case 4: return data.goal !== "";
            default: return false;
        }
    };

    if (isProcessing) {
        return <ProcessingScreen />;
    }

    return (
        <div className="w-full h-[calc(100vh-88px)] max-h-[820px] min-h-[560px] flex flex-col relative">

            {/* ─── Top: Step Indicators ─── */}
            <StepIndicators
                step={step}
                setStep={setStep}
                setDirection={setDirection}
                totalSteps={TOTAL_STEPS}
            />

            {/* ─── Glowing progress bar ─── */}
            <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden mb-6">
                <motion.div
                    className="h-full bg-linear-to-r from-orange-500 via-orange-400 to-amber-400"
                    style={{ boxShadow: "0 0 12px rgba(249,115,22,0.9)" }}
                    animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                    transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                />
            </div>

            {/* ─── Center: Step Content ─── */}
            <div className="flex-1 relative overflow-hidden rounded-3xl border border-white/5 bg-black/30 backdrop-blur-2xl shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
                {/* Ambient glow accent */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-32 bg-orange-500/8 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute -bottom-16 right-1/4 w-48 h-32 bg-amber-500/6 blur-3xl rounded-full pointer-events-none" />

                <AnimatePresence mode="popLayout" custom={direction}>
                    {step === 1 && (
                        <SlidePane key="d" direction={direction}>
                            <Step1Diet data={data} updateData={updateData} />
                        </SlidePane>
                    )}
                    {step === 2 && (
                        <SlidePane key="a" direction={direction}>
                            <Step2Allergies data={data} updateData={updateData} />
                        </SlidePane>
                    )}
                    {step === 3 && (
                        <SlidePane key="c" direction={direction}>
                            <Step3Cuisines data={data} updateData={updateData} />
                        </SlidePane>
                    )}
                    {step === 4 && (
                        <SlidePane key="g" direction={direction}>
                            <Step4Goal data={data} updateData={updateData} />
                        </SlidePane>
                    )}
                </AnimatePresence>
            </div>

            {/* ─── Bottom: Navigation ─── */}
            <NavigationButtons
                step={step}
                totalSteps={TOTAL_STEPS}
                prevStep={prevStep}
                nextStep={nextStep}
                canProceed={canProceed()}
                isProcessing={isUpdating}
            />
        </div>
    );
};
