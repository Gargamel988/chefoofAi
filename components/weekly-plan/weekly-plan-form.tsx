"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Info,
    Zap,
    Utensils,
    Trophy,
    ChefHat,
    Save,
    CheckCircle2,
    Search,
    ArrowRight,
    ArrowLeft,
    Trash2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { mealTypesData, WeeklyPlanFormData } from "./types"
import { weeklyPlanFormSchema } from "./schema"
import { Input } from "../ui/input"

type FormStep = "basic" | "ingredients" | "steps" | "nutrition"

const stepsList: { id: FormStep; label: string; icon: any }[] = [
    { id: "basic", label: "Temel Bilgi", icon: Info },
    { id: "ingredients", label: "Malzemeler", icon: Zap },
    { id: "steps", label: "Hazırlanış", icon: Utensils },
    { id: "nutrition", label: "Besin Değerleri", icon: Trophy }
]

interface WeeklyPlanFormProps {
    selectedDay: string
    initialMealType: string
    onCancel: () => void
    onSave: (data: WeeklyPlanFormData) => void
    onOpenSearch: () => void
}

export function WeeklyPlanForm({ selectedDay, initialMealType, onCancel, onSave, onOpenSearch }: WeeklyPlanFormProps) {
    const [activeFormStep, setActiveFormStep] = useState<FormStep>("basic")

    const form = useForm<WeeklyPlanFormData>({
        resolver: zodResolver(weeklyPlanFormSchema) as any,
        defaultValues: {
            recipeTitle: "",
            selectedMealType: initialMealType,
            description: "",
            difficulty: "easy",
            ingredients: [{ name: "", amount: "", unit: "" }],
            steps: [{ description: "" }],
            nutrition: { cal: 0, protein: 0, carbs: 0, fat: 0 },
            times: { prep: 0, cook: 0 }
        }
    })

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = form;

    const recipeTitle = watch("recipeTitle");
    const selectedMealType = watch("selectedMealType");
    const difficulty = watch("difficulty");
    const times = watch("times");
    const nutrition = watch("nutrition");

    const { fields: ingFields, append: appendIng, remove: removeIng } = useFieldArray({ control, name: "ingredients" });
    const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({ control, name: "steps" });

    const onSubmit = (data: WeeklyPlanFormData) => {
        onSave(data);
    }

    // Nav helpers
    const goNext = (step: FormStep) => setActiveFormStep(step);
    const goPrev = (step: FormStep) => setActiveFormStep(step);

    return (
        <motion.div
            key="form"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="max-w-3xl mx-auto"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Stepped Form Header */}
                <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 mb-8 sticky top-6 z-50 shadow-3xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/20 flex items-center justify-center">
                                <ChefHat className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">{recipeTitle || "Yeni Özel Öğün"}</h2>
                                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                    <span>{selectedDay}</span>
                                    <div className="w-1 h-1 rounded-full bg-zinc-700" />
                                    <span className="text-orange-400">{selectedMealType}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onCancel}
                                className="px-6 rounded-xl hover:bg-white/5 text-zinc-500 font-bold"
                            >
                                İptal
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSubmit(onSubmit)}
                                className="px-8 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black shadow-lg shadow-orange-500/20"
                            >
                                <Save className="w-4 h-4 mr-2" /> Kaydet
                            </Button>
                        </div>
                    </div>

                    {/* Step Navigation Ribbon */}
                    <div className="mt-8 flex items-center justify-between px-2">
                        {stepsList.map((step, idx) => {
                            const isCurrent = activeFormStep === step.id
                            const isCompleted = stepsList.findIndex(s => s.id === activeFormStep) > idx
                            return (
                                <div key={step.id} className="flex items-center flex-1 last:flex-initial">
                                    <button
                                        type="button"
                                        onClick={() => setActiveFormStep(step.id)}
                                        className="group relative flex flex-col items-center gap-2 outline-none"
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCurrent ? "bg-orange-500 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]" :
                                            isCompleted ? "bg-orange-500/20 border-orange-500/40 text-orange-400" :
                                                "bg-zinc-800 border-zinc-700 text-zinc-500 group-hover:border-zinc-500"
                                            }`}>
                                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest hidden md:block transition-colors ${isCurrent ? "text-white" : "text-zinc-500"}`}>{step.label}</span>
                                    </button>
                                    {idx < stepsList.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-4 transition-colors duration-500 ${idx < stepsList.findIndex(s => s.id === activeFormStep) ? "bg-orange-500/40" : "bg-zinc-800"}`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Form Body with Smooth Transition */}
                <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 backdrop-blur-md min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {activeFormStep === "basic" && (
                            <motion.div
                                key="step-basic"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-glow" /> Tarif Detayları
                                    </label>
                                    <div className="relative group">
                                        <Controller
                                            name="recipeTitle"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Örn: Trüf Yağlı Yabani Mantarlı Risotto"
                                                    className="w-full bg-black/50 border border-white/5 rounded-2xl h-16 px-6 text-lg font-bold focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none placeholder:text-zinc-700 text-white"
                                                />
                                            )}
                                        />
                                        {errors.recipeTitle && <span className="text-rose-500 text-xs mt-1 block">{errors.recipeTitle.message}</span>}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={onOpenSearch}
                                            className="absolute right-3 top-3 bottom-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 font-black text-[10px] uppercase hover:bg-orange-500 hover:text-white transition-all"
                                        >
                                            <Search className="w-4 h-4 mr-2" /> Kayıtlı Tarifler
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Seçilen Öğün</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {mealTypesData.map(m => (
                                                <button
                                                    type="button"
                                                    key={m.type}
                                                    onClick={() => setValue("selectedMealType", m.type)}
                                                    className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${selectedMealType === m.type
                                                        ? "bg-orange-500/10 border-orange-500/50 text-orange-400"
                                                        : "bg-black/20 border-white/5 text-zinc-500 hover:border-zinc-700"
                                                        }`}
                                                >
                                                    <span className="text-[10px] font-bold uppercase">{m.type}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Zorluk Seviyesi</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['easy', 'medium', 'hard'].map(level => (
                                                <button
                                                    type="button"
                                                    key={level}
                                                    onClick={() => setValue("difficulty", level as any)}
                                                    className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${difficulty === level
                                                        ? "bg-orange-500/10 border-orange-500/50 text-orange-400"
                                                        : "bg-black/20 border-white/5 text-zinc-500 hover:border-zinc-700"
                                                        }`}
                                                >
                                                    <div className={`w-2 h-2 rounded-full ${level === 'easy' ? 'bg-emerald-500' : level === 'medium' ? 'bg-orange-500' : 'bg-rose-500'}`} />
                                                    <span className="text-[10px] font-bold uppercase">{level === 'easy' ? 'Kolay' : level === 'medium' ? 'Orta' : 'Zor'}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Açıklama & Notlar</label>
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                rows={4}
                                                placeholder="Tarif hakkında kısa notlar..."
                                                className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-sm font-medium focus:outline-none focus:border-orange-500/50 transition-all resize-none text-zinc-300 placeholder:text-zinc-800"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button
                                        type="button"
                                        onClick={() => goNext("ingredients")}
                                        className="h-14 px-10 rounded-2xl bg-white text-black font-black hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 group"
                                    >
                                        İlerle <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {activeFormStep === "ingredients" && (
                            <motion.div
                                key="step-ingredients"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-glow" /> Malzeme Listesi
                                    </label>
                                    <Button type="button" onClick={() => appendIng({ name: "", amount: "", unit: "" })} variant="outline" size="sm" className="rounded-xl border-white/5 bg-white/5 text-[10px] font-black uppercase hover:bg-orange-500/10 hover:border-orange-500/40 text-orange-400">
                                        + Malzeme Ekle
                                    </Button>
                                </div>

                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {ingFields.map((field, idx) => (
                                        <motion.div
                                            layout
                                            key={field.id}
                                            className="flex gap-3 group items-center bg-black/20 p-2 pl-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
                                        >
                                            <Controller
                                                name={`ingredients.${idx}.name`}
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        placeholder="Malzeme adı"
                                                        className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:text-zinc-800 text-white"
                                                    />
                                                )}
                                            />
                                            <div className="w-px h-8 bg-white/5" />
                                            <Controller
                                                name={`ingredients.${idx}.amount`}
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        placeholder="Mikt."
                                                        className="w-16 bg-transparent border-none outline-none text-sm font-bold text-center placeholder:text-zinc-800 text-orange-400"
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name={`ingredients.${idx}.unit`}
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        placeholder="Birim"
                                                        className="w-20 bg-transparent border-none outline-none text-[10px] font-black uppercase text-center placeholder:text-zinc-800 text-zinc-500"
                                                    />
                                                )}
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => removeIng(idx)}
                                                variant="ghost" size="icon" className="text-zinc-800 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </motion.div>
                                    ))}
                                    {errors.ingredients && <span className="text-rose-500 text-xs block">{errors.ingredients.message}</span>}
                                </div>

                                <div className="pt-8 flex justify-between">
                                    <Button type="button" onClick={() => goPrev("basic")} variant="ghost" className="h-14 px-8 rounded-2xl border border-white/5 text-zinc-500 font-bold hover:bg-white/5">
                                        <ArrowLeft className="w-5 h-5 mr-2" /> Geri
                                    </Button>
                                    <Button type="button" onClick={() => goNext("steps")} className="h-14 px-10 rounded-2xl bg-white text-black font-black hover:bg-zinc-200 shadow-xl shadow-white/5">
                                        İlerle <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {activeFormStep === "steps" && (
                            <motion.div
                                key="step-steps"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-glow" /> Hazırlanış Adımları
                                    </label>
                                    <Button type="button" onClick={() => appendStep({ description: "" })} variant="outline" size="sm" className="rounded-xl border-white/5 bg-white/5 text-[10px] font-black uppercase hover:bg-orange-500/10 hover:border-orange-500/40 text-orange-400">
                                        + Adım Ekle
                                    </Button>
                                </div>

                                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {stepFields.map((field, idx) => (
                                        <motion.div layout key={field.id} className="flex gap-6 group">
                                            <div className="space-y-2 flex flex-col items-center">
                                                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center font-black text-xs shrink-0">
                                                    {idx + 1}
                                                </div>
                                                {idx < stepFields.length - 1 && <div className="w-px flex-1 bg-linear-to-b from-orange-500/20 to-transparent" />}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-black tracking-widest uppercase text-zinc-700">ADIM {idx + 1}</span>
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeStep(idx)}
                                                        variant="ghost" className="h-6 px-2 text-zinc-800 hover:text-rose-500 text-[9px] uppercase font-black"
                                                    >
                                                        Kaldır
                                                    </Button>
                                                </div>
                                                <Controller
                                                    name={`steps.${idx}.description`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <textarea
                                                            {...field}
                                                            placeholder="Örnek: Tavayı orta ateşte ısıtıp zeytinyağını ekleyin..."
                                                            className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-orange-500/50 transition-all resize-none placeholder:text-zinc-800 text-zinc-300 h-24"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                    {errors.steps && <span className="text-rose-500 text-xs block">{errors.steps.message}</span>}
                                </div>

                                <div className="pt-8 flex justify-between">
                                    <button type="button" onClick={() => goPrev("ingredients")} className="text-zinc-600 hover:text-white transition-colors flex items-center gap-2 font-bold text-sm">
                                        <ArrowLeft className="w-4 h-4" /> Geri Dön
                                    </button>
                                    <Button type="button" onClick={() => goNext("nutrition")} className="h-14 px-10 rounded-2xl bg-white text-black font-black hover:bg-zinc-200">
                                        Son Adım <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {activeFormStep === "nutrition" && (
                            <motion.div
                                key="step-nutrition"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-glow" /> Besin Analizi
                                        </label>
                                        <div className="grid grid-cols-2 gap-6">
                                            {[
                                                { label: "Kalori", key: "cal", unit: "kcal", color: "text-orange-500" },
                                                { label: "Protein", key: "protein", unit: "g", color: "text-blue-400" },
                                                { label: "Karb.", key: "carbs", unit: "g", color: "text-emerald-400" },
                                                { label: "Yağ", key: "fat", unit: "g", color: "text-rose-400" }
                                            ].map(item => (
                                                <div key={item.key} className="space-y-3 bg-black/20 p-5 rounded-3xl border border-white/5">
                                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                                        <span>{item.label}</span>
                                                        <span>{item.unit}</span>
                                                    </div>
                                                    <Controller
                                                        name={`nutrition.${item.key as "cal" | "protein" | "carbs" | "fat"}`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                value={field.value as number}
                                                                type="number"
                                                                className={`w-full bg-transparent border-none outline-none text-2xl font-black ${item.color} placeholder:text-zinc-800`}
                                                                placeholder="0"
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-glow" /> Hazırlık Süresi
                                        </label>
                                        <div className="space-y-6">
                                            <div className="bg-black/20 p-6 rounded-3xl border border-white/5 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-zinc-500">Hazırlık</span>
                                                    <div className="flex items-center gap-2">
                                                        <Controller
                                                            name="times.prep"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <input
                                                                    {...field}
                                                                    type="number"
                                                                    className="w-16 bg-zinc-950 border border-white/5 rounded-xl h-10 text-center text-sm font-black focus:border-orange-500/50 outline-none"
                                                                />
                                                            )}
                                                        />
                                                        <span className="text-[10px] font-black text-zinc-700 uppercase">Dakika</span>
                                                    </div>
                                                </div>
                                                <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(100, (Number(times.prep) || 0) * 2)}%` }}
                                                        className="h-full bg-orange-500/50"
                                                    />
                                                </div>
                                            </div>
                                            <div className="bg-black/20 p-6 rounded-3xl border border-white/5 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-zinc-500">Pişirme</span>
                                                    <div className="flex items-center gap-2">
                                                        <Controller
                                                            name="times.cook"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <input
                                                                    {...field}
                                                                    type="number"
                                                                    className="w-16 bg-zinc-950 border border-white/5 rounded-xl h-10 text-center text-sm font-black focus:border-orange-500/50 outline-none"
                                                                />
                                                            )}
                                                        />
                                                        <span className="text-[10px] font-black text-zinc-700 uppercase">Dakika</span>
                                                    </div>
                                                </div>
                                                <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(100, (Number(times.cook) || 0) * 2)}%` }}
                                                        className="h-full bg-emerald-500/50"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-between gap-4">
                                    <button type="button" onClick={() => goPrev("steps")} className="text-zinc-600 hover:text-white transition-colors font-bold text-sm">Geri</button>
                                    <div className="flex gap-4 flex-1 justify-end">
                                        <Button type="submit" className="h-16 px-12 rounded-2xl bg-linear-to-br from-orange-400 to-orange-600 text-white font-black text-lg shadow-xl shadow-orange-500/20 group overflow-hidden relative">
                                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                            <span className="relative flex items-center gap-2">
                                                <Save className="w-5 h-5" /> Tarif oluştur
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </form>
        </motion.div>
    )
}
