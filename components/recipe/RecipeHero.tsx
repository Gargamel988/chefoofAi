"use client";

import { motion } from "framer-motion";
import {
    Share2, Bookmark, Clock, Flame,
    Users, ChefHat, Utensils, Loader2,
    PencilLine, Globe
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getSafePublicUrl } from "@/lib/utils/storage";

const ORANGE = "#FF6B2C";

interface Profile {
    name?: string;
    avatar_url?: string;
}

interface RecipeHeroProps {
    id?: string;
    title: string;
    slug: string;
    description?: string;
    imageUrl?: string | null;
    createdAt: string;
    profiles?: Profile | null;
    difficulty?: string;
    totalMinutes?: number;
    calories?: number;
    servings?: number;
    isLiked: boolean;
    isSaved: boolean;
    isSaving: boolean;
    likesCount: number;
    currentUserId?: string;
    onSave: () => void;
    onLike: () => void;
    isOwner?: boolean;
    isPublic?: boolean;
}

const difficultyMap: Record<string, { label: string; cls: string }> = {
    easy: { label: "Kolay", cls: "text-green-400 bg-green-500/10 border-green-500/20" },
    medium: { label: "Orta", cls: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    hard: { label: "Zor", cls: "text-red-400 bg-red-500/10 border-red-500/20" },
};

export function RecipeHero({
    id,
    title,
    slug,
    description,
    imageUrl,
    createdAt,
    profiles,
    difficulty,
    totalMinutes,
    calories,
    servings,
    isLiked,
    isSaved,
    isSaving,
    likesCount,
    currentUserId,
    onSave,
    onLike,
    isOwner,
    isPublic,
}: RecipeHeroProps) {
    const diff = difficulty ? difficultyMap[difficulty] : null;
    const router = useRouter();


    const safeImageUrl = getSafePublicUrl(imageUrl || "");
    const hasImage = safeImageUrl.trim().length > 0;

    return (
        <div className="relative h-[60vh] w-full overflow-hidden">
            {hasImage ? (
                <Image
                    src={safeImageUrl}
                    alt={title}
                    fill
                    className="object-cover scale-105"
                    style={{ filter: "brightness(0.75)" }}
                />
            ) : (
                <div
                    className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-zinc-900"
                    style={{
                        background: `radial-gradient(circle at 50% 50%, #2d1a08 0%, #09090b 100%)`
                    }}
                >
                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px]" />
                        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px]" />
                    </div>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        <div className="w-24 h-24 rounded-[32px] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(255,107,44,0.15)]">
                            <Utensils className="w-10 h-10 text-orange-500" />
                        </div>
                        <p className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase">Görsel Hazırlanıyor</p>
                    </motion.div>
                </div>
            )}

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-linear-to-t from-[#09090b] via-[#09090b]/50 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-[#09090b]/30 to-transparent" />

            {/* Floating nav */}
            <div className="absolute top-0 inset-x-0 p-5 flex justify-between items-center z-20">

                <div className="flex gap-2">
                    <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => router.push(`/publish/${id || slug}`)}
                        title="toplulukla paylaş"
                        className="w-10 h-10 cursor-pointer rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <Share2 className="w-4 h-4 text-white" />
                    </motion.button>
                    {currentUserId && (
                        <>
                            <motion.button
                                whileTap={{ scale: 0.92 }}
                                onClick={onLike}
                                title="beğen"
                                className={`w-10 h-10 cursor-pointer rounded-2xl backdrop-blur-xl border flex items-center justify-center transition-colors ${isLiked
                                    ? "bg-orange-500/20 border-orange-500/40"
                                    : "bg-black/40 border-white/10 hover:bg-white/10"
                                    }`}
                            >
                                <motion.div animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}>
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="w-4 h-4"
                                        fill={isLiked ? ORANGE : "none"}
                                        stroke={isLiked ? ORANGE : "white"}
                                        strokeWidth="2.5"
                                    >
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                </motion.div>
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.92 }}
                                onClick={onSave}
                                title="tarif favorilere ekle"
                                disabled={isSaving}
                                className={`w-10 h-10 cursor-pointer rounded-2xl backdrop-blur-xl border flex items-center justify-center transition-colors ${isSaved
                                    ? "bg-orange-500/20 border-orange-500/40"
                                    : "bg-black/40 border-white/10 hover:bg-white/10"
                                    }`}
                            >
                                {isSaving ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                                ) : (
                                    <Bookmark
                                        className="w-4 h-4"
                                        fill={isSaved ? ORANGE : "none"}
                                        style={{ color: isSaved ? ORANGE : "white" }}
                                    />
                                )}
                            </motion.button>
                        </>
                    )}
                    {isOwner && (
                        <Link href={`/publish/${id || slug}`}>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                disabled={isPublic}
                                className={`h-10 px-5 flex items-center gap-2.5 rounded-2xl font-bold text-[11px] uppercase tracking-wider transition-all border backdrop-blur-md shadow-lg ${isPublic
                                    ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20 shadow-green-500/5 cursor-not-allowed "
                                    : "bg-orange-500 border-orange-400/20 text-white hover:bg-orange-600 shadow-orange-500/20 cursor-pointer"
                                    }`}
                            >
                                {isPublic ? (
                                    <Globe className="w-4 h-4 animate-pulse" />
                                ) : (
                                    <Share2 className="w-4 h-4" />
                                )}
                                <span>{isPublic ? "Yayında" : "Toplulukla Paylaş"}</span>
                            </motion.button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Hero content */}
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-0 inset-x-0 p-6 z-20"
            >
                <div className="max-w-5xl mx-auto space-y-3">
                    {/* Stat pills */}
                    <div className="flex flex-wrap gap-2">
                        {diff && (
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border backdrop-blur-md ${diff.cls}`}>
                                <ChefHat className="w-3 h-3" /> {diff.label}
                            </span>
                        )}
                        {totalMinutes && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-white/15 bg-black/30 backdrop-blur-md text-zinc-200">
                                <Clock className="w-3 h-3" /> {totalMinutes} dk
                            </span>
                        )}
                        {calories && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 backdrop-blur-md text-orange-300">
                                <Flame className="w-3 h-3" /> {calories} kcal
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 backdrop-blur-md text-red-400">
                            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            {likesCount} beğenme
                        </span>
                        {servings && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-white/15 bg-black/30 backdrop-blur-md text-zinc-200">
                                <Users className="w-3 h-3" /> {servings} Kişilik
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-2xl">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                            {description}
                        </p>
                    )}

                    {/* Author row */}
                    {profiles && (
                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-2.5">
                                <Avatar className="w-8 h-8 ring-2 ring-orange-500/30">
                                    <AvatarImage src={profiles.avatar_url || ""} />
                                    <AvatarFallback className="bg-zinc-800 text-white text-xs">
                                        {(profiles.name || "A")[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-xs font-bold text-white">{profiles.name}</p>
                                    <p className="text-[10px] text-zinc-400">
                                        {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: tr })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
