import { WeeklyPlanClient } from "@/components/weekly-plan-ai/WeeklyPlanClient";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
    title: "Haftalık Beslenme Planı | Cheefood AI",
    description: "Yapay zeka ile kişiselleştirilmiş haftalık yemek planı oluşturun.",
    path: "/weekly-plan-ai",
    noIndex: true,
});

export default function HaftalikMenuAIPage() {
    return <WeeklyPlanClient />;
}
