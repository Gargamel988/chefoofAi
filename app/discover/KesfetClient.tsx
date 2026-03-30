"use client";

import { useState } from "react";
import { DiscoverSearch } from "@/components/discover/DiscoverSearch";
import { CategoryPills } from "@/components/discover/CategoryPills";
import { FeaturedHero } from "@/components/discover/FeaturedHero";
import { CreatorsSection } from "@/components/discover/CreatorsSection";
import { DiscoverCard } from "@/components/discover/DiscoverCard";
import { FadeUpCard } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import { useRecipes } from "@/hooks/useRecipes";
import { useCreators } from "@/hooks/useCreators";

type UserInfo = { id: string; avatarUrl: string | null; displayName: string };

const CATEGORIES = ["Tümü", "Kahvaltı", "Vegan", "Hızlı", "Türk", "İtalyan", "Tatlı", "Yüksek Protein"];
const FEED_TABS = ["Trending", "En Yeni", "Sana Özel"];

export default function KesfetClient({ user }: { user: UserInfo | null }) {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("Trending");
    const [selectedCategories, setSelectedCategories] = useState<string[]>(["Tümü"]);

    // TanStack Query Hooks with Suspense
    const { data: recipesData } = useRecipes(20);
    const { data: creatorsData } = useCreators(10); // Check if useCreators exists or useProfiles

    console.log(recipesData)
    const toggleCategory = (category: string) => {
        if (category === "Tümü") {
            setSelectedCategories(["Tümü"]);
            return;
        }

        setSelectedCategories(prev => {
            const next = prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev.filter(c => c !== "Tümü"), category];
            return next.length === 0 ? ["Tümü"] : next;
        });
    };

    const isFiltered = search !== "" || !selectedCategories.includes("Tümü");

    const filteredRecipes = (recipesData || []).filter((p: any) => {
        const title = p.title || "";
        const matchesSearch = search === "" || title.toLowerCase().includes(search.toLowerCase());
        const tags = p.recipe_content?.tags || [];
        const matchesCategory = selectedCategories.includes("Tümü") || (tags && tags.some((tag: string) => selectedCategories.includes(tag)));
        return matchesSearch && matchesCategory;
    });

    const featuredRecipe = [...filteredRecipes].sort((a: any, b: any) => (b.likes_count || 0) - (a.likes_count || 0))[0];

    // Format creators for the UI
    const creators = (creatorsData || []).map((c: any) => ({
        id: c.id,
        name: c.name || "İsimsiz Şef",
        username: c.username || "chef",
        img: c.avatar_url
    }));

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white pb-32 pt-2 sm:pt-4">
            <DiscoverSearch
                search={search}
                setSearch={setSearch}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={FEED_TABS}
            />

            <CategoryPills
                categories={CATEGORIES}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
            />

            <main className="max-w-3xl mx-auto py-6 space-y-10">
                {/* Hero Featured Card */}
                {!isFiltered && featuredRecipe && activeTab === "Trending" && (
                    <FeaturedHero recipe={featuredRecipe} />
                )}

                {/* Creator Spotlight */}
                {!isFiltered && activeTab === "Trending" && creators.length > 0 && (
                    <CreatorsSection creators={creators} />
                )}

                {/* Recipe Feed */}
                <section>
                    {/* Premium Upsell Card */}
                    <FadeUpCard>
                        <div className="mx-4 sm:px-0 mb-8 p-6 rounded-3xl bg-linear-to-br from-zinc-900 via-zinc-900 to-orange-950/20 border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/20 transition-all duration-700" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0">
                                    <Sparkles className="w-8 h-8 text-orange-500 fill-orange-500/20" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h4 className="text-lg font-black text-white">Yapay Zeka ile Haftalık Planla</h4>
                                    <p className="text-zinc-400 text-sm mt-1">Diyetine ve damak tadına özel haftalık yemek planlarını AI ile saniyeler içinde oluştur.</p>
                                </div>
                                <Button
                                    asChild
                                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl h-11 px-8 shadow-lg shadow-orange-600/20 shrink-0"
                                >
                                    <a href="/pricing">Hemen Yükselt</a>
                                </Button>
                            </div>
                        </div>
                    </FadeUpCard>

                    <div className="flex items-center justify-between mb-4 px-4 sm:px-0">
                        <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> {isFiltered ? "Sonuçlar" : "Sizin İçin Seçtiklerimiz"}
                        </h3>
                        <span className="text-xs font-bold text-zinc-600">{filteredRecipes.length} Tarif</span>
                    </div>

                    {filteredRecipes.length === 0 ? (
                        <FadeUpCard>
                            <div className="bg-zinc-900/50 border border-zinc-800/50 border-dashed rounded-3xl p-12 mx-4 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-500">
                                    <Search className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-black text-white mb-2">Henüz tarif bulunamadı</h3>
                                <p className="text-zinc-500 text-sm max-w-sm mb-6">Arama kriterlerinize uygun bir tarif bulamadık. Lütfen farklı kelimelerle veya filtrelerle tekrar deneyin.</p>
                                <Button
                                    onClick={() => { setSearch(""); setSelectedCategories(["Tümü"]); }}
                                    className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl h-11 px-6 border border-zinc-700"
                                >
                                    Filtreleri Temizle
                                </Button>
                            </div>
                        </FadeUpCard>
                    ) : (
                        <div className="flex flex-col gap-2 sm:gap-8 max-w-2xl mx-auto">
                            {filteredRecipes.map((recipe, i) => (

                                <DiscoverCard
                                    key={recipe.id}
                                    post={recipe}
                                    index={i}
                                    userId={user?.id}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <div className="h-20 md:hidden" />
        </div>
    );
}
