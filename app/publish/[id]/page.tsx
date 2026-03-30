import { GetRecipeById } from "@/services/recipes";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

import Publisher from "@/components/publish/Publisher";

export default async function PublishPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth");
    }

    const { data: recipe, error } = await GetRecipeById(id);

    if (error || !recipe) {
        console.error("Tarif bulunamadı:", id, error);
        notFound();
    }

    // Security check: Only the owner can edit/publish
    if (recipe.user_id !== user.id) {
        redirect("/");
    }

    // Normalize content
    const normalizedRecipe = {
        ...recipe,
        content: recipe.recipe_content || recipe.content || {},
    };

    // Fetch profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return (
        <Publisher
            initialRecipe={normalizedRecipe}
            userId={user.id}
            user={profile}
            mode="edit"
        />
    );
}
