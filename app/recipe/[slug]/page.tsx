import { GetRecipeBySlug } from "@/services/recipes";
import TarifDetailClient from "./TarifDetailClient";
import { notFound } from "next/navigation";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import LoadingScreen from "@/app/loading";
import { Metadata, ResolvingMetadata } from "next";
import JsonLd from "@/components/JsonLd";
import { createClient } from "@/lib/supabase/server";

type Props = {
    params: Promise<{ slug: string }>;
};

// Dinamik Metadata üretimi - Kural 1
export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = (await params).slug;
    const { data: recipe } = await GetRecipeBySlug(slug);

    if (!recipe) {
        return {
            title: "Tarif Bulunamadı",
        };
    }

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `${recipe.title} Tarifi`,
        description: recipe.description || `${recipe.title} nasıl yapılır? En lezzetli ve pratik ${recipe.title} tarifi CheFood AI'da.`,
        alternates: {
            canonical: `/recipe/${slug}`,
        },
        openGraph: {
            title: `${recipe.title} Tarifi - CheFood AI`,
            description: recipe.description,
            images: [
                {
                    url: `/og?title=${encodeURIComponent(recipe.title)}&description=${encodeURIComponent(recipe.description || "")}`,
                    width: 1200,
                    height: 630,
                    alt: recipe.title,
                },
                ...previousImages,
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${recipe.title} Tarifi`,
            description: recipe.description,
            images: [`/og?title=${encodeURIComponent(recipe.title)}&description=${encodeURIComponent(recipe.description || "")}`],
        },
    };
}

// Statik Parametre üretimi - Kural 3
export async function generateStaticParams() {
    // Burada tüm slugları çekip dönebiliriz. Şimdilik boş bırakıyorum veya popüler olanları ekleyebiliriz.
    // Gerçek bir uygulamada veritabanından slug listesi çekilir.
    return [];
}

export default async function TarifPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const queryClient = new QueryClient();

    // Prefetch recipe
    const recipe = await queryClient.fetchQuery({
        queryKey: ["recipe", slug],
        queryFn: async () => {
            const { data, error } = await GetRecipeBySlug(slug);
            if (error) throw error;
            return data;
        },
    }).catch(err => {
        console.error("Recipe skip prefetch error:", err);
        return null;
    });


    if (!recipe) {
        console.error("Tarif bulunamadı:", slug);
        notFound();
    }

    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();
    const userId = user?.user?.id;

    // AI tariflerinde recipe_content alanı kullanılıyor, manuel olanlarda content.
    // TarifDetailClient 'content' prop'unu beklediği için normalize ediyoruz.
    const normalizedRecipe = {
        ...recipe,
        content: recipe.recipe_content || recipe.content || {},
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Recipe",
        name: recipe.title,
        description: recipe.description,
        author: {
            "@type": "Person",
            name: "CheFood AI",
        },
        image: `https://chefoodai.vercel.app/og?title=${encodeURIComponent(recipe.title)}`,
        recipeYield: "1 porsiyon",
    };

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <JsonLd data={jsonLd} />
            <Suspense fallback={<LoadingScreen />}>
                <TarifDetailClient recipe={normalizedRecipe} userId={userId} />
            </Suspense>
        </HydrationBoundary>
    );
}
