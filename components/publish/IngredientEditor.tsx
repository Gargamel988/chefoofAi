"use client";

import { Plus, Trash2, GripVertical, Soup } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface IngredientEditorProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}

export default function IngredientEditor({ ingredients, onChange }: IngredientEditorProps) {
  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    onChange(newIngredients);
  };

  const addIngredient = () => {
    onChange([...ingredients, { name: "", amount: "", unit: "" }]);
  };

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
           İçerik Listesi <span className="text-orange-500/80 font-black tracking-widest ml-2">({ingredients.length})</span>
        </Label>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addIngredient}
          className="h-10 px-4 rounded-xl bg-orange-500/10 border-orange-500/20 text-orange-400 hover:text-white hover:bg-orange-500 hover:border-orange-500 transition-all font-bold group"
        >
          <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> Ekle
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {ingredients.map((ing, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="flex items-center gap-3 p-3 bg-zinc-900/20 border border-white/5 rounded-2xl group/item hover:bg-zinc-900/40 hover:border-white/10 transition-all backdrop-blur-md overflow-hidden relative"
            >
              {/* Index Glow */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500/0 group-hover/item:bg-orange-500/40 transition-all" />
              
              <div className="flex items-center justify-center text-zinc-700 group-hover/item:text-zinc-400 cursor-grab active:cursor-grabbing px-1 transition-colors">
                 <GripVertical className="w-4 h-4" />
              </div>
              
              <div className="grid grid-cols-12 gap-3 flex-1">
                <div className="col-span-3 sm:col-span-2">
                    <Input
                      placeholder="Miktar"
                      value={ing.amount}
                      onChange={(e) => handleIngredientChange(idx, "amount", e.target.value)}
                      className="h-11 bg-zinc-950/50 border-white/5 text-white placeholder:text-zinc-700 font-bold focus:border-orange-500/40 text-center"
                    />
                </div>
                <div className="col-span-3 sm:col-span-3">
                    <Input
                      placeholder="Birim"
                      value={ing.unit}
                      onChange={(e) => handleIngredientChange(idx, "unit", e.target.value)}
                      className="h-11 bg-zinc-950/50 border-white/5 text-white placeholder:text-zinc-700 font-bold focus:border-orange-500/40"
                    />
                </div>
                <div className="col-span-6 sm:col-span-7 relative">
                    <Input
                      placeholder="Malzeme adı..."
                      value={ing.name}
                      onChange={(e) => handleIngredientChange(idx, "name", e.target.value)}
                      className="h-11 bg-zinc-950/50 border-white/5 text-white placeholder:text-zinc-700 font-bold focus:border-orange-500/40 pl-4"
                    />
                </div>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeIngredient(idx)}
                className="w-10 h-10 rounded-xl text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        {ingredients.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-zinc-900/5 text-zinc-600 space-y-4"
          >
             <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center border border-white/5">
                <Soup className="w-8 h-8 opacity-20" />
             </div>
             <div className="text-center">
                <p className="text-sm font-bold text-zinc-500">Henüz malzeme eklenmedi.</p>
                <p className="text-[11px] font-medium text-zinc-600 mt-1 uppercase tracking-widest">Başlamak için "Ekle" butonuna basın.</p>
             </div>
             <Button 
                variant="link" 
                onClick={addIngredient}
                className="text-orange-500/60 font-black uppercase text-[10px] tracking-widest hover:text-orange-500"
             >
               + Hızlı Ekle
             </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
