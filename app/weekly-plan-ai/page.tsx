import { WeeklyPlanClient } from "@/components/weekly-plan-ai/WeeklyPlanClient";

export const metadata = {
    title: "Haftalık Beslenme Planı | Cheefood AI",
    description: "Yapay zeka ile kişiselleştirilmiş haftalık yemek planı oluşturun.",
};

export default function HaftalikMenuAIPage() {
    return <WeeklyPlanClient />;
}
