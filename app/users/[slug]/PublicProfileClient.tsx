"use client";

import { useState } from "react";
import { ToggleFollowUser } from "@/services/social";
import { Heart, CookingPot, ExternalLink, Settings, LayoutGrid, Info, MessageSquare } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { translateSupabaseError } from "@/lib/errorTranslator";

// Use same image domain/format as else
export default function PublicProfileClient({
    profile,
    initialIsFollowing,
    recipes,
    isOwnProfile,
    isAuthenticated
}: {
    profile: any;
    initialIsFollowing: boolean;
    recipes: any[];
    isOwnProfile: boolean;
    isAuthenticated: boolean;
}) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [followersCount, setFollowersCount] = useState(profile.followers_count || 0);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"recipes" | "about">("recipes");

    const handleFollowToggle = async () => {
        if (!isAuthenticated) {
            toast.error("Takip etmek için önce giriş yapmalısınız.");
            return;
        }

        setIsFollowLoading(true);
        const result = await ToggleFollowUser(profile.id);
        setIsFollowLoading(false);

        if (result.error) {
            toast.error(translateSupabaseError(result.error));
        } else {
            if (result.action === "followed") {
                setIsFollowing(true);
                setFollowersCount(prev => prev + 1);
                toast.success(`${profile.name || profile.username} takip ediliyor`);
            } else {
                setIsFollowing(false);
                setFollowersCount(prev => Math.max(0, prev - 1));
                toast.info("Takipten çıkıldı");
            }
        }
    };

    // Privacy Checks
    const isProfilePublic = isOwnProfile || profile.privacy_profile_public !== false;
    const canSeeFollowers = isOwnProfile || profile.privacy_followers_public !== false;

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 pb-20">
            {/* Cover Photo */}
            <div className="h-48 md:h-64 w-full bg-zinc-900 relative">
                {profile.cover_url ? (
                    <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-linear-to-b from-orange-500/20 to-zinc-900"></div>
                )}
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-8">
                {/* Profile Header Info */}
                <div className="relative -mt-16 sm:-mt-24 mb-6 flex flex-col sm:flex-row gap-6 sm:items-end sm:justify-between">

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-end z-10">
                        {/* Avatar */}
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#0A0A0A] bg-zinc-800 shadow-xl overflow-hidden shrink-0 flex items-center justify-center">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl sm:text-6xl font-black text-zinc-500">
                                    {profile.name?.charAt(0) || profile.username?.charAt(0) || "U"}
                                </span>
                            )}
                        </div>

                        <div className="mb-2">
                            <h1 className="text-2xl sm:text-3xl font-black text-white">{profile.name || profile.username}</h1>
                            <p className="text-zinc-400 font-medium">@{profile.username}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 z-10 mb-2 sm:mb-4">
                        {isOwnProfile ? (
                            <Link
                                href="/profile"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-zinc-800 text-white px-6 text-sm font-bold hover:bg-zinc-700 transition-colors border border-zinc-700 shadow-sm"
                            >
                                <Settings className="w-4 h-4" />
                                Profili Düzenle
                            </Link>
                        ) : (
                            <>
                                <button
                                    onClick={handleFollowToggle}
                                    disabled={isFollowLoading}
                                    className={`
                    inline-flex h-10 items-center justify-center rounded-xl px-6 text-sm font-bold transition-all shadow-sm min-w-[120px]
                    ${isFollowing
                                            ? 'bg-zinc-800 text-white hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-zinc-700'
                                            : 'bg-orange-500 text-white hover:bg-orange-600 shadow-[0_4px_12px_rgba(255,107,44,0.3)] border border-transparent'
                                        }
                  `}
                                >
                                    {isFollowLoading ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : isFollowing ? (
                                        "Takip Ediliyor"
                                    ) : (
                                        "Takip Et"
                                    )}
                                </button>
                                <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 transition-colors border border-zinc-700 shadow-sm">
                                    <MessageSquare className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="max-w-3xl mb-8">
                    {profile.bio && (
                        <p className="text-zinc-300 font-medium leading-relaxed max-w-2xl mb-6">
                            {profile.bio}
                        </p>
                    )}

                    {/* Stats Bar */}
                    <div className="flex gap-6 md:gap-10">
                        <div className={`flex flex-col ${canSeeFollowers ? 'cursor-pointer hover:opacity-80' : 'opacity-80'}`}>
                            <span className="text-xl font-black text-white">{recipes.length}</span>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tarif</span>
                        </div>
                        <div className={`flex flex-col ${canSeeFollowers ? 'cursor-pointer hover:opacity-80' : 'opacity-80'}`}>
                            <span className="text-xl font-black text-white">{followersCount}</span>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Takipçi</span>
                        </div>
                        <div className={`flex flex-col ${canSeeFollowers ? 'cursor-pointer hover:opacity-80' : 'opacity-80'}`}>
                            <span className="text-xl font-black text-white">{profile.following_count || 0}</span>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Takip</span>
                        </div>
                    </div>
                </div>

                {/* Private Profile State */}
                {!isProfilePublic ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/40 rounded-3xl border border-zinc-800 mt-8">
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                            <Lock className="w-8 h-8 text-zinc-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Bu Profil Gizli</h3>
                        <p className="text-zinc-400 font-medium text-center max-w-sm">
                            Sadece onaylı takipçiler {profile.username} kullanıcısının tariflerini ve detaylarını görebilir.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Tabs Navigation */}
                        <div className="flex gap-8 border-b border-zinc-800 mb-8 overflow-x-auto scrollbar-none">
                            <button
                                onClick={() => setActiveTab("recipes")}
                                className={`py-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === "recipes" ? "text-orange-500" : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <LayoutGrid className="w-4 h-4" />
                                    Tarifler ({recipes.length})
                                </div>
                                {activeTab === "recipes" && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full shadow-[0_-2px_8px_rgba(255,107,44,0.5)]" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("about")}
                                className={`py-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === "about" ? "text-orange-500" : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    Hakkında
                                </div>
                                {activeTab === "about" && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full shadow-[0_-2px_8px_rgba(255,107,44,0.5)]" />
                                )}
                            </button>
                        </div>

                        {/* Tabs Content */}
                        {activeTab === "recipes" && (
                            <div className="grid grid-cols-3 gap-1 sm:gap-4 lg:gap-6">
                                {recipes.length > 0 ? (
                                    recipes.map((recipe) => (
                                        <Link
                                            href={`/recipe/${recipe.slug}`}
                                            key={recipe.id}
                                            className="aspect-square relative bg-zinc-900 overflow-hidden group rounded-xl bg-orange-500/5 sm:rounded-2xl"
                                        >
                                            {recipe.content?.image ? (
                                                <img
                                                    src={recipe.content.image}
                                                    alt={recipe.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <CookingPot className="w-8 h-8 text-orange-500/20" />
                                                </div>
                                            )}

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                                                <h4 className="text-white font-bold text-sm sm:text-base line-clamp-2 mb-2 sm:mb-3">{recipe.title}</h4>
                                                <div className="flex items-center gap-1.5 text-white font-black bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                                    <Heart className="w-4 h-4 fill-white shrink-0" />
                                                    <span>{recipe.likes_count || 0}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="col-span-3 py-20 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
                                        <CookingPot className="w-12 h-12 text-zinc-700 mb-4" />
                                        <p className="text-zinc-400 font-medium">Henüz bir tarif paylaşılmadı.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "about" && (
                            <div className="max-w-2xl bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-sm">
                                <h3 className="text-xl font-bold text-white mb-6">Beslenme Tercihleri</h3>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Diyet Tipi</h4>
                                        <p className="text-white font-medium bg-zinc-800/50 inline-block px-4 py-2 rounded-xl border border-zinc-700/50">
                                            {profile.diet_type === "normal" ? "Her Şeyi Yerim (Normal)" :
                                                profile.diet_type === "vegetarian" ? "Vejetaryen" :
                                                    profile.diet_type === "vegan" ? "Vegan" :
                                                        profile.diet_type === "pescatarian" ? "Pesketaryen" :
                                                            profile.diet_type === "keto" ? "Ketojenik" :
                                                                profile.diet_type === "paleo" ? "Paleo" :
                                                                    profile.diet_type || "Belirtilmemiş"}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Sevdiği Mutfaklar</h4>
                                        {profile.cuisines && profile.cuisines.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {profile.cuisines.map((c: string, i: number) => (
                                                    <span key={i} className="text-sm font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-xl">
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-zinc-500 font-medium">Belirtilmemiş</p>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Hedef</h4>
                                        <p className="text-white font-medium bg-zinc-800/50 inline-block px-4 py-2 rounded-xl border border-zinc-700/50">
                                            {profile.goal === "lose_weight" ? "Kilo Vermek" :
                                                profile.goal === "gain_muscle" ? "Kas Kazanmak" :
                                                    profile.goal === "maintain" ? "Kilomu Korumak" :
                                                        profile.goal === "healthy" ? "Sağlıklı Beslenmek" :
                                                            profile.goal || "Belirtilmemiş"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function Lock(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}
