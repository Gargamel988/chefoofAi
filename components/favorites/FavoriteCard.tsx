import Link from "next/link";
import { LayoutGrid, Flame, Calendar, Trash2 } from "lucide-react";
import { FadeUpCard, InteractiveCard } from "@/components/motion";
import { getSafePublicUrl } from "@/lib/utils/storage";

interface FavoriteCardProps {
    id: string;
    created_at: string;
    recipe: any;
    profile: any;
    index?: number;
    handleDelete: (e: React.MouseEvent) => void
}

export default function FavoriteCard({
    id,
    created_at,
    recipe,
    profile,
    index = 0,
    handleDelete
}: FavoriteCardProps) {
    const date = new Date(created_at).toLocaleDateString("tr-TR", { month: "short", day: "numeric", year: "numeric" });

    // Handle both 'content' and 'recipe_content' names for robustness
    const content = recipe.content || recipe.recipe_content;



    return (
        <FadeUpCard index={index}>
            <InteractiveCard className="group relative flex flex-col h-full bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-colors shadow-sm">
                {/* Image Container */}
                <Link href={`/recipe/${recipe.slug}`} className="block relative aspect-4/3 w-full overflow-hidden bg-zinc-900">
                    {recipe.cover_image ? (
                        <img
                            src={getSafePublicUrl(recipe.cover_image)}
                            alt={recipe.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-800/50">
                            <LayoutGrid className="w-8 h-8 text-zinc-700 mb-2" />
                        </div>
                    )}

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />

                    {/* Delete Button */}
                    <div className="absolute top-3 right-3 z-20 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleDelete}
                            className="w-9 h-9 cursor-pointer flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/20 transition-all hover:scale-110 active:scale-95 shadow-lg"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </Link>

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-1">
                    <Link href={`/recipe/${recipe.slug}`} className="mb-1">
                        <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-orange-400 transition-colors">
                            {recipe.title}
                        </h3>
                    </Link>

                    {/* Calories/Macros */}
                    {content?.macros?.calories && (
                        <div className="flex items-center gap-1 mt-1 mb-2">
                            <Flame className="w-3.5 h-3.5 text-orange-500" />
                            <span className="text-xs font-bold text-orange-500/90">{content.macros.calories} kcal</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 mt-auto pt-3">
                        {profile?.avatar_url ? (
                            <img src={getSafePublicUrl(profile.avatar_url)} alt="author" className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                                {profile?.name?.charAt(0) || profile?.username?.charAt(0) || "U"}
                            </div>
                        )}
                        <span className="text-xs font-medium text-zinc-400 truncate max-w-[100px]">
                            {profile?.name || profile?.username || "Bilinmeyen Şef"}
                        </span>

                        <div className="w-1 h-1 rounded-full bg-zinc-700 mx-1 shrink-0" />

                        <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1 shrink-0 ml-auto">
                            <Calendar className="w-3 h-3" />
                            {date}
                        </span>
                    </div>
                </div>
            </InteractiveCard>
        </FadeUpCard>
    );
}
