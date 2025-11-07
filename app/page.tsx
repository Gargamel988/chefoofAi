import RecipePage from "@/components/recıpepage";
import { Suspense } from "react";
import Loading from "./loading";

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <RecipePage />
    </Suspense>
  );
}
