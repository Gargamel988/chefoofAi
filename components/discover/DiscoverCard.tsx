"use client";

import Link from "next/link";
import {
    Heart, MessageCircle, Share2, Bookmark,
    Flame, Clock, Send
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FadeUpCard, TapButton } from "@/components/motion";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSocial } from "@/hooks/useSocial";
import { toast } from "sonner";
import { getSafePublicUrl } from "@/lib/utils/storage";

interface DiscoverCardProps {
    post: any; // Direct recipe object
    index: number;
    userId?: string;
}

export function DiscoverCard({ post: recipe, index, userId }: DiscoverCardProps) {
    const recipeContent = recipe.recipe_content || {};
    const nutrition = recipeContent.nutrition || {};


    const fallbackImage = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop";
    const displayImage = getSafePublicUrl(recipe.cover_image || fallbackImage);


    const username = recipe.profiles?.username || recipe.profiles?.name || "Şef";
    const prepTime = recipeContent.times?.totalMinutes || null;

    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");

    const { handleSocialAction, comments, isLoadingComments, addComment, isCommenting, isInteractionActive } = useSocial(recipe.id);

    const timeAgo = recipe.created_at
        ? formatDistanceToNow(new Date(recipe.created_at), { addSuffix: true, locale: tr })
        : "yeni";

    const handleInteract = async (type: "like" | "save") => {
        await handleSocialAction(recipe.id, type);
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        await addComment({ id: recipe.id, content: newComment });
        setNewComment("");
    };

    return (
        <FadeUpCard index={index}>
            <article className="group flex flex-col bg-transparent mb-2 sm:mb-6 w-full">
                {/* Header: User Info & Options */}
                <header className="flex items-center justify-between py-3 px-4 sm:px-1">
                    <Link href={`/users/${recipe.profiles?.id}`} className="cursor-pointer flex items-center gap-3">
                        <Avatar className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-zinc-800">
                            <AvatarImage src={getSafePublicUrl(recipe.profiles?.avatar_url || "")} className="rounded-full object-cover" />
                            <AvatarFallback className="bg-zinc-900 font-bold text-zinc-400">
                                {(recipe.profiles?.name || "C")[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-[14px] sm:text-[15px] font-semibold text-white tracking-tight leading-none">{recipe.profiles?.name || username}</span>
                            <span className="text-xs font-medium text-zinc-500 mt-1">{timeAgo}</span>
                        </div>
                    </Link>
                </header>

                {/* Content: Image with optimized aspect ratio */}
                <div className="relative aspect-auto sm:rounded-xl overflow-hidden bg-zinc-900 sm:border border-zinc-800/60 cursor-pointer group/img">
                    <Link href={`/recipe/${recipe.slug}`}>
                        <div className="relative w-full aspect-4/3 sm:aspect-video lg:aspect-16/10 max-h-[450px]">
                            <img
                                src={displayImage}
                                alt={recipe.title}
                                className="absolute inset-0 w-full h-full object-cover sm:group-hover/img:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/5 pointer-events-none">
                                <Flame className="w-3.5 h-3.5 text-orange-500" />
                                <span className="text-[12px] sm:text-xs font-bold text-white tracking-wide">{nutrition.calories || '0'} kcal</span>
                            </div>
                            {prepTime && (
                                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/5 pointer-events-none">
                                    <Clock className="w-3.5 h-3.5 text-zinc-200" />
                                    <span className="text-[12px] sm:text-xs font-bold text-white tracking-wide">{prepTime} dk</span>
                                </div>
                            )}
                        </div>
                    </Link>
                </div>

                {/* Footer: Actions & Text */}
                <footer className="flex flex-col pt-3 px-4 sm:px-1 gap-2 border-b border-zinc-800/30 last:border-0 pb-6">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                            <TapButton onClick={() => handleInteract("like")} className="cursor-pointer group/btn p-1 -ml-1">
                                <Heart className={`w-7 h-7 transition-colors ${isInteractionActive("like") ? "text-orange-500 fill-orange-500" : "text-white group-hover/btn:text-orange-500"}`} />
                            </TapButton>

                            <TapButton onClick={() => setShowComments(!showComments)} className="cursor-pointer group/btn p-1">
                                <MessageCircle className={`w-7 h-7 transition-colors ${showComments ? "text-zinc-400" : "text-white group-hover/btn:text-zinc-400"}`} />
                            </TapButton>


                            <TapButton onClick={() => handleInteract("save")} className="cursor-pointer p-1">
                                <Bookmark className={`w-[26px] h-[26px] transition-colors ${isInteractionActive("save") ? "text-orange-500 fill-orange-500" : "text-white hover:text-zinc-400"}`} />
                            </TapButton>

                            <TapButton
                                onClick={() => {
                                    if (recipe?.slug) {
                                        navigator.clipboard.writeText(`${window.location.origin}/recipe/${recipe.slug}`);
                                        toast.success("Paylaşım bağlantısı panoya kopyalandı!");
                                    }
                                }}
                                className="cursor-pointer group/btn p-1 -mr-1"
                            >
                                <Share2 className="w-[26px] h-[26px] text-white transition-colors group-hover/btn:text-zinc-400" />
                            </TapButton>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-[14px] font-black text-white mt-1">
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            {recipe.likes_count || 0} beğeni
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-400 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                            {recipe.comments_count || 0} yorum
                        </div>
                    </div>

                    <div className="w-full mt-2 space-y-1.5">
                        <p className="text-[15px] font-bold text-white tracking-tight leading-tight">{recipe.title}</p>
                        <p className="text-[14px] text-zinc-300 leading-relaxed font-medium">
                            {recipe.description || "Bu lezzetli tarifi mutlaka denemelisiniz!"}
                        </p>
                    </div>

                    <AnimatePresence>
                        {showComments && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-4 space-y-4 border-t border-zinc-900 mt-4">
                                    {isLoadingComments ? (
                                        <div className="flex justify-center py-4">
                                            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    ) : !comments || comments.length === 0 ? (
                                        <p className="text-xs text-zinc-600 text-center py-2">Henüz yorum yok. İlk yorumu sen yap!</p>
                                    ) : (
                                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
                                            {comments.map((comment: any) => (
                                                <div key={comment.id} className="flex gap-3">
                                                    <Avatar className="w-7 h-7 rounded-lg border border-zinc-800 shrink-0">
                                                        <AvatarImage src={comment.profiles?.avatar_url || ""} />
                                                        <AvatarFallback className="bg-zinc-900 text-zinc-600 text-[10px]">
                                                            {(comment.profiles?.name || "U")[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col gap-0.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[13px] font-bold text-white">{comment.profiles?.name || "Şef"}</span>
                                                            <span className="text-[10px] text-zinc-600">
                                                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: tr })}
                                                            </span>
                                                        </div>
                                                        <p className="text-[13px] text-zinc-400 leading-snug">{comment.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <form onSubmit={handleAddComment} className="flex gap-3 pt-4 items-center border-t border-zinc-900/50">
                                        <Avatar className="w-8 h-8 rounded-xl border border-zinc-800 shrink-0">
                                            <AvatarFallback className="bg-zinc-900 text-zinc-500 font-bold text-xs">P</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 relative group/input">
                                            <input
                                                type="text"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Yorum ekle..."
                                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-[13px] text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!newComment.trim() || isCommenting}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-orange-500 disabled:text-zinc-700 transition-colors"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </footer>
            </article>
        </FadeUpCard>
    );
}
