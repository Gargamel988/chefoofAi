"use client";

import { Clock, Users, Zap, Globe, Lock, UtensilsCrossed, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

interface RecipeSettingsProps {
  settings: {
    prepTime: string;
    cookTime: string;
    servings: string;
    difficulty: string;
    cuisine: string;
    mealType: string;
    isPublic: boolean;
  };
  onChange: (settings: any) => void;
}

export default function RecipeSettings({ settings, onChange }: RecipeSettingsProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
            <Clock className="w-3.5 h-3.5" /> Hazırlık (Dk)
          </Label>
          <Input
            type="number"
            value={settings.prepTime}
            onChange={(e) => handleChange("prepTime", e.target.value)}
            className="h-12 bg-zinc-900/30 border-white/5 focus:ring-orange-500/20 rounded-xl font-bold backdrop-blur-md"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
            <Clock className="w-3.5 h-3.5 text-orange-500" /> Pişirme (Dk)
          </Label>
          <Input
            type="number"
            value={settings.cookTime}
            onChange={(e) => handleChange("cookTime", e.target.value)}
            className="h-12 bg-zinc-900/30 border-orange-500/10 focus:ring-orange-500/20 rounded-xl font-bold backdrop-blur-md"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
            <Users className="w-3.5 h-3.5" /> Porsiyon
          </Label>
          <Input
            type="number"
            value={settings.servings}
            onChange={(e) => handleChange("servings", e.target.value)}
            className="h-12  bg-zinc-900/30 border-white/5 focus:ring-orange-500/20 rounded-xl font-bold backdrop-blur-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
            <Zap className="w-3.5 h-3.5" /> Zorluk Düzeyi
          </Label>
          <Select value={settings.difficulty} onValueChange={(v: string) => handleChange("difficulty", v)}>
            <SelectTrigger className="h-12 bg-zinc-900/30 border-white/5 rounded-xl font-bold backdrop-blur-md focus:ring-orange-500/20">
              <SelectValue placeholder="Seçiniz" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900/90 border-white/10 text-white backdrop-blur-3xl rounded-xl">
              <SelectItem value="easy" className="font-medium focus:bg-orange-500/10 focus:text-orange-500 transition-colors">Kolay</SelectItem>
              <SelectItem value="medium" className="font-medium focus:bg-orange-500/10 focus:text-orange-500 transition-colors">Orta</SelectItem>
              <SelectItem value="hard" className="font-medium focus:bg-orange-500/10 focus:text-orange-500 transition-colors">Zor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
            <UtensilsCrossed className="w-3.5 h-3.5" /> Mutfak Tarzı
          </Label>
          <Input
            placeholder="Türk, İtalyan..."
            value={settings.cuisine}
            onChange={(e) => handleChange("cuisine", e.target.value)}
            className="h-12 bg-zinc-900/30 border-white/5 focus:ring-orange-500/20 rounded-xl font-bold backdrop-blur-md"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
            <LayoutGrid className="w-3.5 h-3.5" /> Yemek Öğünü
          </Label>
          <Input
            placeholder="Kahvaltı, Akşam..."
            value={settings.mealType}
            onChange={(e) => handleChange("mealType", e.target.value)}
            className="h-12 bg-zinc-900/30 border-white/5 focus:ring-orange-500/20 rounded-xl font-bold backdrop-blur-md"
          />
        </div>
      </div>


    </div>
  );
}
