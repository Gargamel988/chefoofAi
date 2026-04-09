import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { translateSupabaseError } from "@/lib/errorTranslator";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { mealSchema } from "@/schema/meal-schema";

import {
  GetRecommendations,
  UpdateRecommendationStatus,
} from "@/services/recommendations";

export function useRecommendations(date?: string) {
  const queryClient = useQueryClient();

  // useObject for streaming generation
  const {
    object,
    submit,
    isLoading: isGenerating,
    error: generationError,
  } = useObject({
    api: "/api/recommendations",
    schema: mealSchema,
    onFinish: () => {
      console.log("Streaming finished, invalidating queries...");
      queryClient.invalidateQueries({ queryKey: ["daily_recommendations"] });
      queryClient.invalidateQueries({
        queryKey: ["daily_recommendations_nutrition"],
      });
    },
  });

  const recommendationsQuery = useQuery({
    queryKey: ["daily_recommendations", date],
    queryFn: () => GetRecommendations(date).then((res) => res.data),
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
    onError: (err: any, _, context) => {
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
    generate: {
      mutateAsync: (body: any) => submit(body),
      isLoading: isGenerating,
      error: generationError,
    },
    streamingObject: object, // Provide the streaming object to the UI
    updateConsumption: updateConsumptionMutation,
  };
}
