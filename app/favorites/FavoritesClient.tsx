"use client";

import { useState, useMemo } from "react";
import { useFavorite } from "@/hooks/useFavorite";
import FavoriteHeader from "@/components/favorites/FavoriteHeader";
import FavoriteGrid from "@/components/favorites/FavoriteGrid";
import FavoriteEmpty from "@/components/favorites/FavoriteEmpty";

export default function FavoritesClient() {
    const { favorites, removeFavorite } = useFavorite();

    // State
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"newest_saved" | "oldest_saved" | "alfabetik" | "alfabetik_ters">("newest_saved");

    // Filter & Sort Logic
    const filteredAndSortedRecipes = useMemo(() => {
        if (!favorites) return [];
        let result = [...(favorites as any[])];

        // Filter by Search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(r => r.recipe?.title?.toLowerCase().includes(lowerQuery));
        }

        // Sort
        result.sort((a, b) => {
            const titleA = a.recipe?.title || "";
            const titleB = b.recipe?.title || "";

            if (sortBy === "newest_saved") {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            } else if (sortBy === "oldest_saved") {
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            } else if (sortBy === "alfabetik") {
                return titleA.localeCompare(titleB);
            } else if (sortBy === "alfabetik_ters") {
                return titleB.localeCompare(titleA);
            }
            return 0;
        });

        return result;
    }, [favorites, searchQuery, sortBy]);

    const handleDelete = async (recipeId: any, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await removeFavorite.mutateAsync(recipeId);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col pt-24 pb-20">
            <div className="flex-1 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col min-w-0">

                <FavoriteHeader
                    totalCount={filteredAndSortedRecipes.length}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />

                {filteredAndSortedRecipes.length > 0 ? (
                    <FavoriteGrid
                        recipes={filteredAndSortedRecipes}
                        handleDelete={handleDelete}
                    />
                ) : (
                    <FavoriteEmpty
                        isSearching={!!searchQuery}
                        onClearSearch={() => setSearchQuery("")}
                    />
                )}

            </div>
        </div>
    );
}
