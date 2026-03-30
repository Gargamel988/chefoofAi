"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed, Users } from "lucide-react";

interface Ingredient {
    name: string;
    amount: string | number;
    unit: string;
    notes?: string;
}

interface RecipeIngredientsProps {
    ingredients: Ingredient[];
    servings?: number;
}

export function RecipeIngredients({ ingredients, servings }: RecipeIngredientsProps) {
    if (!ingredients.length) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-zinc-900 border border-zinc-800/60 rounded-3xl overflow-hidden shadow-xl"
        >
            <div className="flex items-center justify-between p-6 border-b border-zinc-800/60">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-orange-400" />
                    Malzemeler
                </h2>
                {servings && (
                    <span className="flex items-center gap-1.5 text-xs font-bold bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-full border border-zinc-700">
                        <Users className="w-3 h-3" /> {servings} Kişilik
                    </span>
                )}
            </div>
            <ul className="divide-y divide-zinc-800/40">
                {ingredients.map((ing, i) => (
                    <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                        className="flex items-center justify-between px-6 py-3.5 hover:bg-zinc-800/40 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 group-hover:shadow-[0_0_6px_rgba(255,107,44,0.9)] transition-shadow" />
                            <span className="text-zinc-300 text-sm font-medium group-hover:text-white transition-colors">
                                {ing.name}
                            </span>
                            {ing.notes && <span className="text-[10px] text-zinc-600">({ing.notes})</span>}
                        </div>
                        <span className="text-white font-bold text-sm tabular-nums">
                            {ing.amount} <span className="text-zinc-500 font-medium">{ing.unit}</span>
                        </span>
                    </motion.li>
                ))}
            </ul>
        </motion.section>
    );
}
