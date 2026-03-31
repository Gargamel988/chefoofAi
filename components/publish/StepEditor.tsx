"use client";

import { Plus, Trash2, GripVertical, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

interface Step {
  step: number;
  description: string;
}

interface StepEditorProps {
  steps: Step[];
  onChange: (steps: Step[]) => void;
}

export default function StepEditor({ steps, onChange }: StepEditorProps) {
  const handleStepChange = (index: number, description: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], description };
    onChange(newSteps);
  };

  const addStep = () => {
    const nextNum = (steps.length || 0) + 1;
    onChange([...steps, { step: nextNum, description: "" }]);
  };

  const removeStep = (index: number) => {
    const newSteps = steps
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, step: i + 1 }));
    onChange(newSteps);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
          Uygulama Adımları <span className="text-orange-500/80 font-black tracking-widest ml-2">({steps.length})</span>
        </Label>
        <Button
          variant="outline"
          size="sm"
          onClick={addStep}
          className="h-10 px-4 rounded-xl bg-orange-500/10 border-orange-500/20 text-orange-400 hover:text-white hover:bg-orange-500 hover:border-orange-500 transition-all font-bold group"
        >
          <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> Adım Ekle
        </Button>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="flex gap-6 group/step relative"
            >
              {/* Connector Line */}
              {idx !== steps.length - 1 && (
                <div className="absolute left-6 top-12 -bottom-6 w-px bg-white/5 group-hover/step:bg-orange-500/20 transition-colors" />
              )}

              <div className="flex flex-col items-center gap-3 pt-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center shrink-0 text-white font-black text-lg shadow-xl relative overflow-hidden group/num">
                  <div className="absolute inset-0 bg-orange-500 opacity-0 group-hover/num:opacity-10 transition-opacity" />
                  <span className="relative z-10">{step.step}</span>
                </div>
                <div className="text-zinc-700 group-hover/step:text-zinc-500 cursor-grab px-2">
                  <GripVertical className="w-4 h-4" />
                </div>
              </div>

              <div className="flex-1 relative ">
                <div className="absolute -left-3 top-8 w-6 h-px bg-white/5" />
                <textarea
                  value={step.description}
                  onChange={(e) => handleStepChange(idx, e.target.value)}
                  placeholder={`${step.step}. adımda ne yapılmalı? Detaylıca anlatın...`}
                  className="w-full min-h-[140px] p-6 bg-zinc-900/20 border border-white/5 rounded-4xl text-zinc-200 placeholder:text-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/40 transition-all font-medium leading-relaxed backdrop-blur-md resize-none shadow-lg scrollbar-hide overflow-y-auto"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStep(idx)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-xl text-zinc-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover/step:opacity-100 transition-all"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {steps.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[3rem] bg-zinc-900/5 text-zinc-600 space-y-4"
          >
            <div className="w-20 h-20 rounded-3xl bg-zinc-900 flex items-center justify-center border border-white/5">
              <ListOrdered className="w-10 h-10 opacity-20" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-zinc-500">Hazırlık adımı eklemediniz.</p>
              <p className="text-[11px] font-medium text-zinc-600 mt-1 uppercase tracking-widest">Tarifinizin sırlarını paylaşmaya başlayın.</p>
            </div>
            <Button
              variant="outline"
              onClick={addStep}
              className="mt-4 rounded-xl border-white/5 bg-zinc-900 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              İlk Adımı Oluştur
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
