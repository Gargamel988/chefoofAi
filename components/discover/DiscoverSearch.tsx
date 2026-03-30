"use client";

import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DiscoverSearchProps {
    search: string;
    setSearch: (val: string) => void;
    activeTab: string;
    setActiveTab: (val: string) => void;
    tabs: string[];
}

export function DiscoverSearch({ search, setSearch, activeTab, setActiveTab, tabs }: DiscoverSearchProps) {
    return (
        <div className="sticky top-[64px] sm:top-[80px] z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 py-4 transition-all duration-300">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
                    <Input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Tarif, malzeme veya mutfak ara..."
                        className="w-full bg-zinc-900 border-zinc-800 text-white pl-10 h-12 rounded-2xl focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500/50 shadow-sm transition-all placeholder:text-zinc-600"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-3xl mx-auto mt-4 flex items-center gap-6 px-1">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative pb-3 text-sm font-black transition-colors ${activeTab === tab ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div layoutId="activeKesfetTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
