import FavoriteCard from "./FavoriteCard";

interface FavoriteGridProps {
    recipes: any[];
    handleDelete: (id: string, e: React.MouseEvent) => void;
}

export default function FavoriteGrid({ recipes, handleDelete }: FavoriteGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((favorite, index) => (
                <FavoriteCard
                    key={favorite.id}
                    id={favorite.id}
                    created_at={favorite.created_at}
                    recipe={favorite.recipe}
                    profile={favorite.profile}
                    index={index}
                    handleDelete={(e: React.MouseEvent) => handleDelete(favorite.recipe.id, e)}
                />
            ))}
        </div>
    );
}
