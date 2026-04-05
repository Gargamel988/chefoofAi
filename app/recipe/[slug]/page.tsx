import { GetRecipeBySlug, GetAllRecipeSlugs } from "@/services/recipes";
import TarifDetailClient from "./TarifDetailClient";
import { notFound } from "next/navigation";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import LoadingScreen from "@/app/loading";
import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { createClient, createClientForStatic } from "@/lib/supabase/server";
import { buildArticleMetadata } from "@/lib/seo";
import { formatISO, parseISO } from "date-fns";

type Props = {
    params: Promise<{ slug: string }>;
};

// Next.js 15+ generateMetadata
export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const slug = (await params).slug;
    const staticClient = await createClientForStatic();
    const { data: recipe } = await GetRecipeBySlug(slug, staticClient);

    if (!recipe) return {};

    // Format ISO dates for article metadata
    const publishedTime = formatISO(parseISO(recipe.created_at));

    return buildArticleMetadata({
        title: `${recipe.title} Tarifi`,
        description: recipe.description || `${recipe.title} nasıl yapılır? En lezzetli ve pratik ${recipe.title} tarifi CheFood AI'da.`,
        path: `/recipe/${slug}`,
        image: recipe.cover_image ? { url: recipe.cover_image, alt: recipe.title } : undefined,
        publishedTime,
        modifiedTime: publishedTime,
        authors: [recipe.profiles?.name || "CheFood AI"],
        keywords: [
            recipe.title,
            "yapay zeka yemek tarifi",
            recipe.meal_type || "yemek tarifi",
            "kolay tarifler",
        ],
    });
}

// SSG for all recipes
export async function generateStaticParams() {
    const staticClient = await createClientForStatic();
    const slugs = await GetAllRecipeSlugs(staticClient);
    return slugs.map((item: { slug: string }) => ({
        slug: item.slug,
    }));
}

function generateRecipeJsonLd(recipe: any) {
    return {
        "@context": "https://schema.org",
        "@type": "Recipe",
        headline: recipe.title,
        name: recipe.title,
        description: recipe.description,
        image: recipe.cover_image || `https://chefoodai.com/logo.webp`,
        datePublished: recipe.created_at,
        dateModified: recipe.updated_at || recipe.created_at,
        author: {
            "@type": "Person",
            name: recipe.profiles?.name || "CheFood AI",
            url: `https://chefoodai.com/users/${recipe.slug}`,
        },
        publisher: {
            "@type": "Organization",
            name: "CheFood AI",
            url: "https://chefoodai.com",
            logo: {
                "@type": "ImageObject",
                url: "https://chefoodai.com/logo.webp",
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://chefoodai.com/recipe/${recipe.slug}`,
        },
    };
}

export default async function TarifPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const queryClient = new QueryClient();

    const staticClient = await createClientForStatic();

    // Prefetch recipe
    const recipe = await queryClient.fetchQuery({
        queryKey: ["recipe", slug],
        queryFn: async () => {
            const { data, error } = await GetRecipeBySlug(slug, staticClient);
            if (error) throw error;
            return data;
        },
    }).catch(err => {
        console.error("Recipe prefetch error:", err);
        return null;
    });

    if (!recipe) {
        notFound();
    }

    let userId: string | undefined = undefined;
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id;
    } catch (e) {
        // Build time or no session
    }

    // AI tariflerinde recipe_content alanı kullanılıyor, manuel olanlarda content.
    const normalizedRecipe = {
        ...recipe,
        content: recipe.recipe_content || recipe.content || {},
    };


    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <JsonLd data={generateRecipeJsonLd(normalizedRecipe)} />
            <Suspense fallback={<LoadingScreen />}>
                <TarifDetailClient recipe={normalizedRecipe} userId={userId} />
            </Suspense>
        </HydrationBoundary>
    );
}
