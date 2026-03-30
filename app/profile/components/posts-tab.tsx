"use client";

import { useMyRecipes, useRecipeMutations } from "@/hooks/useRecipes";
import {
    Heart, Bookmark, Clock, Trash2,
    MessageSquare, Eye, LayoutGrid,
    Search, AlertCircle
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getSafePublicUrl } from "@/lib/utils/storage";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function PostsTab() {
    const { data: recipes, isLoading } = useMyRecipes();
    const { deleteRecipe, isDeleting } = useRecipeMutations();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredRecipes = recipes?.filter((r: any) =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                <p className="text-zinc-500 font-bold animate-pulse">Tariflerin yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-base font-bold text-white">Tarif Paylaşımlarım</h3>
                    <p className="text-sm text-zinc-400 mt-0.5">Toplulukla paylaştığın tüm lezzetler burada.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Tariflerinde ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-11 pl-11 pr-4 bg-zinc-950 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-orange-500/50 transition-colors w-full md:w-64"
                    />
                </div>
            </div>

            {filteredRecipes && filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredRecipes.map((recipe: any) => (
                        <motion.div
                            key={recipe.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative bg-zinc-950/50 border border-zinc-800/50 rounded-2xl overflow-hidden hover:border-zinc-700/50 transition-all duration-300"
                        >
                            <div className="aspect-video relative overflow-hidden">
                                {recipe.cover_image ? (
                                    <Image
                                        src={getSafePublicUrl(recipe.cover_image)}
                                        alt={recipe.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                                        <LayoutGrid className="w-10 h-10 text-zinc-800" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

                                <div className="absolute top-3 left-3">
                                    <div className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">
                                        {recipe.meal_type || "Tarif"}
                                    </div>
                                </div>

                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 text-white">
                                            <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                                            <span className="text-xs font-bold">{recipe.likes_count || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-white">
                                            <Bookmark className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                                            <span className="text-xs font-bold">{recipe.saves_count || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5">
                                <h4 className="font-bold text-white line-clamp-1 group-hover:text-orange-400 transition-colors">
                                    {recipe.title}
                                </h4>
                                <div className="flex items-center gap-3 mt-3">
                                    <Link
                                        href={`/recipe/${recipe.slug}`}
                                        className="flex-1 flex items-center justify-center h-10 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors"
                                    >
                                        Görüntüle
                                    </Link>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-10 h-10 p-0 border-zinc-800 bg-transparent hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white rounded-3xl">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="text-xl font-black">Tarifi Sil?</AlertDialogTitle>
                                                <AlertDialogDescription className="text-zinc-400">
                                                    "{recipe.title}" tarifini kalıcı olarak silmek istediğinden emin misin? Bu işlem geri alınamaz.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 rounded-xl font-bold">Vazgeç</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => deleteRecipe(recipe.id)}
                                                    className="bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/20 rounded-xl font-bold"
                                                >
                                                    Evet, Sil
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 px-10 border-2 border-dashed border-zinc-800 rounded-[3rem] bg-zinc-900/20">
                    <div className="w-16 h-16 rounded-3xl bg-zinc-900/40 flex items-center justify-center border border-zinc-800 shadow-xl">
                        <AlertCircle className="w-8 h-8 text-zinc-700" />
                    </div>
                    <div>
                        <p className="font-black text-lg text-zinc-400">Henüz paylaşılan bir tarif yok</p>
                        <p className="text-zinc-600 text-sm mt-1">Harika bir tarifini paylaşarak topluluğa ilham ver!</p>
                    </div>
                    <Link
                        href="/publish"
                        className="mt-2 h-11 px-8 bg-orange-500 text-white rounded-2xl font-black shadow-xl shadow-orange-500/20 hover:scale-105 transition-transform flex items-center justify-center"
                    >
                        İlk Tarifini Yaz
                    </Link>
                </div>
            )}
        </div>
    );
}
