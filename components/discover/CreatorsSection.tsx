"use client";

import { ChefHat, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUpCard } from "@/components/motion";

interface Creator {
    id: string | number;
    name: string;
    username: string;
    img: string;
}

interface CreatorsSectionProps {
    creators: Creator[];
}

export function CreatorsSection({ creators }: CreatorsSectionProps) {
    return (
        <section>
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2 px-4 sm:px-0">
                <ChefHat className="w-4 h-4" /> Popüler Şefler
            </h3>
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-none pb-4 snap-x px-4 sm:px-0">
                {creators.map((creator, i) => (
                    <FadeUpCard key={creator.id} index={i} className="snap-start shrink-0 w-36">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex flex-col items-center text-center hover:border-orange-500/30 transition-colors">
                            <div className="relative mb-3">
                                <div className="w-16 h-16 rounded-full p-0.5 bg-linear-to-br from-orange-500 to-amber-500">
                                    <div className="w-full h-full rounded-full border-2 border-zinc-900 overflow-hidden">
                                        {creator.img ? (
                                            <img src={creator.img} alt={creator.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                                <span className="text-zinc-500 font-bold text-lg">{creator.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm font-black text-white leading-tight mb-0.5 truncate w-full">{creator.name}</p>
                            <p className="text-[10px] text-zinc-500 font-medium mb-4 truncate w-full">@{creator.username}</p>

                            <Button variant="outline" className="w-full h-8 text-xs font-bold rounded-xl bg-zinc-950 border-zinc-800 hover:bg-orange-500 hover:text-white hover:border-orange-500 group">
                                <UserPlus className="w-3.5 h-3.5 mr-1" />
                                Takip Et
                            </Button>
                        </div>
                    </FadeUpCard>
                ))}
            </div>
        </section>
    );
}
