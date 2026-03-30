import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { translateSupabaseError } from "@/lib/errorTranslator";

import {
  GetRecommendations,
  GenerateDailyRecommendations,
  UpdateRecommendationStatus,
} from "@/services/recommendations";

export function useRecommendations(date?: string) {
  const queryClient = useQueryClient();

  const recommendationsQuery = useQuery({
    queryKey: ["daily_recommendations", date],
    queryFn: () => GetRecommendations(date).then((res) => res.data),
  });

  const generateMutation = useMutation({
    mutationFn: (body: any) => GenerateDailyRecommendations(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_recommendations"] });
      queryClient.invalidateQueries({
        queryKey: ["daily_recommendations_nutrition"],
      });
    },
    onError: (err: any) => {
      toast.error(translateSupabaseError(err.message));
    },
  });

  const updateConsumptionMutation = useMutation({
    mutationFn: ({
      id,
      is_consumed,
    }: {
      id: string | number;
      is_consumed: boolean;
    }) => UpdateRecommendationStatus(id, is_consumed),
    onMutate: async ({ id, is_consumed }) => {
      await queryClient.cancelQueries({ queryKey: ["daily_recommendations"] });
      const previous = queryClient.getQueryData(["daily_recommendations"]);

      queryClient.setQueryData(
        ["daily_recommendations"],
        (old: any[] | undefined) => {
          return old?.map((m: any) =>
            m.id === id ? { ...m, is_consumed } : m,
          );
        },
      );

      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["daily_recommendations"], context.previous);
      }
      toast.error("Güncelleme başarısız");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_recommendations"] });
      queryClient.invalidateQueries({
        queryKey: ["daily_recommendations_nutrition"],
      });
    },
  });

  return {
    recommendations: recommendationsQuery.data,
    generate: generateMutation,
    updateConsumption: updateConsumptionMutation,
  };
}
