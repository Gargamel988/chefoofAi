"use client";

import { ChefHat, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUpCard } from "@/components/motion";
import { useSocial } from "@/hooks/useSocial";
import Link from "next/link";
import { getSafePublicUrl } from "@/lib/utils/storage";

interface Creator {
    id: string;
    name: string;
    username: string;
    img: string;
}

interface CreatorsSectionProps {
    creators: Creator[];
    userId?: string;
}

function CreatorCard({ creator, index, userId }: { creator: Creator, index: number, userId?: string }) {
    const { toggleFollow, isInteractionActive, isFollowing } = useSocial(undefined, creator.id);
    const following = isInteractionActive("follow");

    return (
        <FadeUpCard index={index} className="snap-start shrink-0 w-36">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex flex-col items-center text-center hover:border-orange-500/30 transition-colors">
                <Link href={`/users/${creator.id}`} className="relative mb-3 group/avatar">
                    <div className="w-16 h-16 rounded-full p-0.5 bg-linear-to-br from-orange-500 to-amber-500 group-hover/avatar:scale-105 transition-transform">
                        <div className="w-full h-full rounded-full border-2 border-zinc-900 overflow-hidden bg-zinc-800">
                            {creator.img ? (
                                <img src={getSafePublicUrl(creator.img)} alt={creator.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-zinc-500 font-bold text-lg">{creator.name.charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
                <p className="text-sm font-black text-white leading-tight mb-0.5 truncate w-full">{creator.name}</p>
                <p className="text-[10px] text-zinc-500 font-medium mb-4 truncate w-full">@{creator.username}</p>

                <Button 
                    variant={following ? "secondary" : "outline"}
                    disabled={isFollowing || userId === creator.id}
                    onClick={() => toggleFollow(creator.id)}
                    className={`w-full h-8 text-xs font-bold rounded-xl transition-all ${
                        following 
                        ? "bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700" 
                        : "bg-zinc-950 border-zinc-800 hover:bg-orange-500 hover:text-white hover:border-orange-500"
                    }`}
                >
                    {following ? (
                        <>
                            <Check className="w-3 h-3 mr-1" />
                            Takipte
                        </>
                    ) : (
                        <>
                            <UserPlus className="w-3.5 h-3.5 mr-1" />
                            Takip Et
                        </>
                    )}
                </Button>
            </div>
        </FadeUpCard>
    );
}

export function CreatorsSection({ creators, userId }: CreatorsSectionProps) {
    return (
        <section>
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2 px-4 sm:px-0">
                <ChefHat className="w-4 h-4" /> Popüler Şefler
            </h3>
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-none pb-4 snap-x px-4 sm:px-0">
                {creators.map((creator, i) => (
                    <CreatorCard key={creator.id} creator={creator} index={i} userId={userId} />
                ))}
            </div>
        </section>
    );
}
