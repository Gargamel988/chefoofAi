import RecipePage from "@/components/recıpepage";
import { Suspense } from "react";
import Loading from "@/app/loading";

export default async function WhateverCookPage() {

    return (
        <Suspense fallback={<Loading />}>
            <RecipePage mode="fridge" />
        </Suspense>
    );
}
