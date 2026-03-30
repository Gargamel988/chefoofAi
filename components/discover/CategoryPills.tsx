"use client";

import { TapButton } from "@/components/motion";

interface CategoryPillsProps {
    categories: string[];
    selectedCategories: string[];
    toggleCategory: (category: string) => void;
}

export function CategoryPills({ categories, selectedCategories, toggleCategory }: CategoryPillsProps) {
    return (
        <div className="max-w-3xl mx-auto pt-4 flex items-center gap-2 overflow-x-auto scrollbar-none px-4 pb-1 snap-x">
            {categories.map(cat => {
                const isActive = selectedCategories.includes(cat);
                return (
                    <TapButton
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`snap-start shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isActive
                            ? "bg-orange-500 text-white border-orange-500 shadow-[0_4px_12px_rgba(255,107,44,0.3)]"
                            : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800"
                            }`}
                    >
                        {cat}
                    </TapButton>
                )
            })}
        </div>
    );
}
