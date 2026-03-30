import Link from "next/link";
import { Flame, Heart, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FadeUpCard } from "@/components/motion";
import { getSafePublicUrl } from "@/lib/utils/storage";

interface FeaturedHeroProps {
    recipe: any;
}

export function FeaturedHero({ recipe }: FeaturedHeroProps) {
    if (!recipe) return null;

    return (
        <section>
            <FadeUpCard>
                <Link href={`/recipe/${recipe.slug}`}>
                    <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden group cursor-pointer border border-zinc-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                        <img
                            src={getSafePublicUrl(recipe.cover_image || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop")}
                            alt={recipe.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#0A0A0A] via-black/40 to-transparent" />

                        {/* Top Badge */}
                        <div className="absolute top-4 left-4 bg-orange-500/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-orange-400/50 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(255,107,44,0.3)]">
                            <Flame className="w-4 h-4 text-white" />
                            <span className="text-xs font-black text-white uppercase tracking-wider">Haftanın En Beğenileni</span>
                        </div>

                        {/* Bottom Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                            <h2 className="text-3xl font-black text-white leading-tight mb-4 drop-shadow-xl group-hover:text-orange-400 transition-colors">
                                {recipe.title}
                            </h2>

                            <div className="flex items-center justify-between">
                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10 ring-2 ring-zinc-800 rounded-2xl">
                                        <AvatarImage src={recipe.profiles?.avatar_url || ""} className="rounded-2xl" />
                                        <AvatarFallback className="rounded-2xl bg-zinc-800 text-zinc-400 font-bold">
                                            {(recipe.profiles?.name || "C")[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-bold text-white">{recipe.profiles?.name || "Bilinmeyen Şef"}</p>
                                        <p className="text-[11px] font-medium text-zinc-400">@{recipe.profiles?.username || "şef"}</p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-4 text-zinc-300 bg-zinc-950/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-zinc-800">
                                    <div className="flex items-center gap-1.5">
                                        <Heart className="w-4 h-4 text-orange-500 fill-orange-500" />
                                        <span className="text-xs font-bold">{recipe.likes_count || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 opacity-80">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-xs font-bold">{recipe.recipe_content?.times?.totalMinutes || 0}dk</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </FadeUpCard>
        </section>
    );
}
