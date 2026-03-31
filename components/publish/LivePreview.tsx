"use client";

import {
    Heart, MessageCircle, Share2, Bookmark,
    Flame, Clock, MoreHorizontal, User, Sparkles,
    Eye
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

interface LivePreviewProps {
    recipe: {
        title: string;
        coverImage: string;
        nutrition: {
            calories: number;
        };
        prepTime: string;
        cookTime: string;
        description: string;
        caption: string;
        mealType: string;
        difficulty: string;
    };
    user: any;
}

export default function LivePreview({ recipe, user }: LivePreviewProps) {
    const fallbackImage = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop";
    const displayImage = recipe.coverImage || fallbackImage;
    const username = user?.name || "Şef";
    const totalTime = (Number(recipe.prepTime) || 0) + (Number(recipe.cookTime) || 0);

    return (
        <div className="space-y-8">
            {/* Indicator */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2.5">
                    <div className="relative">
                        <div className="absolute inset-0 bg-orange-500 blur-md opacity-20 animate-pulse" />
                        <Eye className="w-5 h-5 text-orange-500 relative" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">Canlı Önizleme</h3>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 bg-zinc-900 px-3 py-1 rounded-full border border-white/5">
                    Besleme Görünümü
                </div>
            </div>

            {/* The "Discover Card" Mirror */}
            <motion.div
                layout
                className="relative group/preview"
            >
                {/* Shadow Glow */}
                <div className="absolute -inset-4 bg-orange-500/5 blur-3xl opacity-0 group-hover/preview:opacity-100 transition-opacity duration-700 rounded-[3rem]" />

                <div className="relative bg-zinc-950/40 border border-white/5 rounded-[2.8rem] p-5 backdrop-blur-3xl shadow-2xl overflow-hidden ring-1 ring-white/10">
                    <article className="flex flex-col w-full">
                        {/* Card Header (User Part) */}
                        <header className="flex items-center justify-between py-3 mb-1">
                            <div className="flex items-center gap-3.5">
                                <Avatar className="w-11 h-11  border border-white/10 ring-4 ring-white/5">
                                    <AvatarImage src={user?.avatar_url || ""} />
                                    <AvatarFallback className="bg-orange-500/10 text-orange-500 font-black text-xs">
                                        {(username || "C")[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-[16px] font-bold text-white tracking-tight leading-none">{username}</span>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">şimdi paylaştı</span>
                                        <div className="w-0.5 h-0.5 rounded-full bg-zinc-700" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-500/80">{recipe.mealType || "Mutfak"}</span>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Main Media Section */}
                        <div className="relative group/media mt-2">
                            <div className="relative aspect-4/3 rounded-4xl overflow-hidden bg-zinc-900 ring-1 ring-white/5 shadow-inner">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={displayImage}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.6, ease: "circOut" }}
                                        src={displayImage}
                                        alt="Preview"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </AnimatePresence>

                                {/* Overlay Badges */}
                                <div className="absolute top-4 right-4 flex flex-col gap-2 scale-90 sm:scale-100 origin-top-right">
                                    <div className="bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10 shadow-2xl">
                                        <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" />
                                        <span className="text-xs font-black text-white tracking-wide">{recipe.nutrition?.calories || '0'}</span>
                                        <span className="text-[9px] font-bold text-zinc-400 uppercase">kcal</span>
                                    </div>
                                </div>

                                {(totalTime > 0 || recipe.difficulty) && (
                                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                        {totalTime > 0 && (
                                            <div className="bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10 shadow-2xl">
                                                <Clock className="w-4 h-4 text-orange-400" />
                                                <span className="text-xs font-black text-white tracking-wide">{totalTime}</span>
                                                <span className="text-[9px] font-bold text-zinc-400 uppercase">dk</span>
                                            </div>
                                        )}

                                        {recipe.difficulty && (
                                            <div className="bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10 shadow-2xl">
                                                <div className={`w-1.5 h-1.5 rounded-full ${recipe.difficulty === 'easy' ? 'bg-green-500' :
                                                        recipe.difficulty === 'hard' ? 'bg-red-500' : 'bg-orange-500'
                                                    } animate-pulse`} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                                    {recipe.difficulty === 'easy' ? 'Kolay' :
                                                        recipe.difficulty === 'hard' ? 'Zor' : 'Orta'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Footer */}
                        <footer className="flex flex-col pt-6 gap-4">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-5">
                                    <Heart className="w-8 h-8 text-white stroke-[1.5px] hover:text-orange-500 transition-colors" />
                                    <MessageCircle className="w-8 h-8 text-white stroke-[1.5px] hover:text-orange-400 transition-colors" />
                                    <Share2 className="w-7 h-7 text-white stroke-[1.5px] hover:text-zinc-400 transition-colors" />
                                </div>
                                <Bookmark className="w-7 h-7 text-white stroke-[1.5px] hover:text-orange-400 transition-colors" />
                            </div>

                            <div className="flex items-center gap-4 text-[14px] font-black text-white mt-1">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                    0 Beğeni
                                </div>
                                <div className="flex items-center gap-1.5 text-zinc-400 font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                    0 yorum
                                </div>
                            </div>

                            <div className="w-full space-y-2">
                                <h4 className="text-lg font-black text-white tracking-tighter leading-tight drop-shadow-sm">
                                    {recipe.title || "Tarif Başlığı"}
                                </h4>

                                <p className="text-[14px] text-zinc-300 leading-relaxed font-medium line-clamp-2">
                                    {recipe.caption || recipe.description || "Harika bir açıklama ekleyerek takipçilerinizin iştahını kabartın..."}
                                </p>
                            </div>
                        </footer>
                    </article>
                </div>
            </motion.div>

            {/* Studio Tip Card */}
            <div className="relative group/tip mt-12 overflow-hidden">
                <div className="absolute inset-0 bg-orange-500/5 blur-xl group-hover/tip:bg-orange-500/10 transition-colors" />
                <div className="relative p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-2xl space-y-4 ring-1 ring-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-orange-500" />
                        </div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500/80">Stüdyo İpucu</h4>
                    </div>
                    <p className="text-[14px] text-zinc-400 leading-relaxed font-medium">
                        Önizleme anlıktır. Değişiklikleriniz akışta nasıl görüneceğini gerçek zamanlı gösterir.
                        <span className="text-zinc-200 ml-1 font-bold italic">En iyi sonuç için 4:3 oranında fotoğraflar tercih edin.</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
