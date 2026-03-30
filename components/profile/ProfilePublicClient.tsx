"use client";

import { useSocial } from "@/hooks/useSocial";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import {
    UserPlus,
    UserMinus,
    ChefHat,
    LayoutGrid,
    Share2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TapButton } from "@/components/motion";
import FavoriteCard from "@/components/favorites/FavoriteCard";
import { toast } from "sonner";
import { getSafePublicUrl } from "@/lib/utils/storage";

interface ProfilePublicClientProps {
    userId: string;
}

export default function ProfilePublicClient({ userId }: ProfilePublicClientProps) {
    const { profile, recipes } = usePublicProfile(userId);
    const { followStatus, toggleFollow, isFollowing: isTogglingFollow } = useSocial(undefined, userId);

    if (!profile) return null;

    const followerCount = profile.followers_count || 0;

    const handleFollowToggle = async () => {
        await toggleFollow(userId);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans pb-20">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-800/20 rounded-full blur-[120px]" />
            </div>

            <main className="relative max-w-5xl mx-auto px-4 pt-8 md:pt-16">
                {/* Profile Header Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative bg-zinc-900/40 border border-zinc-800/80 rounded-[2.5rem] p-6 md:p-12 backdrop-blur-3xl shadow-2xl overflow-hidden mb-12"
                >
                    {/* Interior Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />

                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                        {/* Avatar Section */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Avatar className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-zinc-800 shadow-2xl relative">
                                <AvatarImage src={getSafePublicUrl(profile.avatar_url || "")} className="object-cover" />
                                <AvatarFallback className="bg-zinc-800 text-3xl font-black text-zinc-500">
                                    {(profile.name || "S")[0]}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2">
                                        {profile.name}
                                    </h1>
                                    <p className="text-zinc-500 font-bold tracking-wide">@{profile.username || 'chef'}</p>
                                </div>

                                <TapButton onClick={handleFollowToggle} disabled={isTogglingFollow}>
                                    <div
                                        className={`rounded-2xl flex items-center justify-center px-8 h-12 font-black text-sm transition-all shadow-lg ${followStatus
                                            ? "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                                            : "bg-orange-600 hover:bg-orange-500 text-white shadow-orange-500/20"
                                            }`}
                                    >
                                        {isTogglingFollow ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : followStatus ? (
                                            <>
                                                <UserMinus className="w-4 h-4 mr-2" />
                                                Takibi Bırak
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Takip Et
                                            </>
                                        )}
                                    </div>
                                </TapButton>

                                <TapButton
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success("Profil bağlantısı panoya kopyalandı!");
                                    }}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-white transition-all shadow-lg">
                                        <Share2 className="w-5 h-5" />
                                    </div>
                                </TapButton>
                            </div>

                            <p className="mt-6 text-zinc-300 text-lg leading-relaxed max-w-2xl font-medium">
                                {profile.bio || "Lezzetli tarifler ve gastronomi tutkusu. Her tabak yeni bir hikaye."}
                            </p>

                            {/* Stats */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-8 mt-10">
                                <div className="flex flex-col items-center md:items-start group cursor-default">
                                    <span className="text-2xl font-black text-white group-hover:text-orange-500 transition-colors">{(recipes || []).length}</span>
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tarifler</span>
                                </div>
                                <div className="flex flex-col items-center md:items-start group cursor-default">
                                    <span className="text-2xl font-black text-white group-hover:text-orange-500 transition-colors">{followerCount}</span>
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Takipçi</span>
                                </div>
                                <div className="flex flex-col items-center md:items-start group cursor-default">
                                    <span className="text-2xl font-black text-white group-hover:text-orange-500 transition-colors">{profile.following_count || 0}</span>
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Takip</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/10 rounded-xl">
                                <ChefHat className="w-6 h-6 text-orange-500" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Paylaşılan Tarifler</h2>
                        </div>
                    </div>

                    {(recipes || []).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {(recipes || []).map((recipe, idx) => (
                                <FavoriteCard
                                    key={recipe.id}
                                    id={recipe.id}
                                    created_at={recipe.created_at}
                                    recipe={recipe}
                                    profile={recipe.profiles}
                                    index={idx}
                                    handleDelete={() => { }} 
                                />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-zinc-900/20 border border-zinc-800/40 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center"
                        >
                            <div className="w-20 h-20 bg-zinc-950/50 rounded-3xl flex items-center justify-center mb-6 border border-zinc-800">
                                <LayoutGrid className="w-8 h-8 text-zinc-700" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-400">Henüz tarif paylaşılmamış</h3>
                            <p className="text-zinc-600 mt-2">Bu şef henüz bir tarif yayınlamamış.</p>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}
