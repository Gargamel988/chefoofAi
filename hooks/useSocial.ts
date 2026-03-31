import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GetFeed,
  GetRecipeComments,
  CheckIfFollowing,
  ToggleRecipeInteraction,
  ToggleFollowUser,
  AddRecipeComment,
  CreatePost,
  GetRecipeInteractions,
} from "@/services/social";
import { toast } from "sonner";
import { translateSupabaseError } from "@/lib/errorTranslator";

export function useSocial(recipeId?: string, targetUserId?: string) {
  const queryClient = useQueryClient();

  // Queries
  const { data: feed } = useQuery({
    queryKey: ["feed"],
    queryFn: () => GetFeed(20),
  });

  const { data: comments } = useQuery({
    queryKey: ["comments", recipeId],
    queryFn: () => GetRecipeComments(recipeId!),
    enabled: !!recipeId,
  });

  const { data: interactions = [] } = useQuery({
    queryKey: ["interactions", recipeId],
    queryFn: () => GetRecipeInteractions(recipeId!),
    enabled: !!recipeId,
  });

  const { data: followStatus } = useQuery({
    queryKey: ["follow_status", targetUserId],
    queryFn: () =>
      targetUserId
        ? CheckIfFollowing(targetUserId)
        : Promise.resolve({ isFollowing: false }),
    enabled: !!targetUserId,
  });

  // Mutations
  const interactionMutation = useMutation({
    mutationFn: ({
      id,
      type,
    }: {
      id: string;
      type: "like" | "save";
    }) => ToggleRecipeInteraction(id, type),
    onMutate: async (vars) => {
      // Standardize the query key for both cancel and set
      const interactionKey = ["interactions", vars.id];
      const recipeKey = ["recipes", vars.id];

      await queryClient.cancelQueries({ queryKey: interactionKey });
      const prevInteractions = queryClient.getQueryData<string[]>(interactionKey);

      queryClient.setQueryData<string[]>(interactionKey, (old = []) => {
        if (old.includes(vars.type)) {
          return old.filter(t => t !== vars.type);
        }
        return [...old, vars.type];
      });

      // Recipe likes count update if type is like
      let prevRecipe = null;
      if (vars.type === "like") {
        await queryClient.cancelQueries({ queryKey: recipeKey });
        prevRecipe = queryClient.getQueryData<any>(recipeKey);
        
        if (prevRecipe) {
          queryClient.setQueryData(recipeKey, (old: any) => {
            const isLiked = prevInteractions?.includes("like");
            const newCount = isLiked 
              ? Math.max(0, (old.likes_count || 0) - 1)
              : (old.likes_count || 0) + 1;
            return { ...old, likes_count: newCount };
          });
        }
      }

      // Universal cache update (Aggressive optimistic update)
      const feedKeys = [
        ["recipes", "public", 20],
        ["recipes", "me"],
        ["feed"]
      ];

      for (const queryKey of feedKeys) {
        queryClient.setQueryData(queryKey, (old: any) => {
          // If it's a simple array (like in useRecipes)
          if (Array.isArray(old)) {
            return old.map((r: any) => {
              if (r.id !== vars.id || vars.type !== "like") return r;
              const isLiked = prevInteractions?.includes("like");
              const newCount = isLiked 
                ? Math.max(0, (r.likes_count || 0) - 1)
                : (r.likes_count || 0) + 1;
              return { ...r, likes_count: newCount };
            });
          }
          
          // If it's a paginated/wrapped response (like in GetFeed)
          if (old?.data && Array.isArray(old.data)) {
            return {
              ...old,
              data: old.data.map((r: any) => {
                if (r.id !== vars.id || vars.type !== "like") return r;
                const isLiked = prevInteractions?.includes("like");
                const newCount = isLiked 
                  ? Math.max(0, (r.likes_count || 0) - 1)
                  : (r.likes_count || 0) + 1;
                return { ...r, likes_count: newCount };
              })
            };
          }
          return old;
        });
      }

      return { prevInteractions, prevRecipe };
    },
    onSuccess: (data, vars) => {
      // Minimal invalidation
      queryClient.invalidateQueries({ queryKey: ["recipes", vars.id] });
      queryClient.invalidateQueries({ queryKey: ["interactions", vars.id] });
    },
    onError: (err: any, vars, context) => {
      if (context?.prevInteractions) {
        queryClient.setQueryData(["interactions", vars.id], context.prevInteractions);
      }
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      toast.error(translateSupabaseError(err.message));
    },
  });

  const followMutation = useMutation({
    mutationFn: (userId: string) => ToggleFollowUser(userId),
    onMutate: async (targetId: string) => {
      const followKey = ["follow_status", targetId];
      await queryClient.cancelQueries({ queryKey: followKey });
      const prevStatus = queryClient.getQueryData<{ isFollowing: boolean }>(followKey);

      queryClient.setQueryData(followKey, (old: any) => ({
        ...old,
        isFollowing: !old?.isFollowing
      }));

      return { prevStatus };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creators"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["public_profile"] });
    },
    onError: (err: any, targetId, context) => {
      if (context?.prevStatus) {
        queryClient.setQueryData(["follow_status", targetId], context.prevStatus);
      }
      toast.error(translateSupabaseError(err.message));
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      AddRecipeComment(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", recipeId] });
      queryClient.invalidateQueries({ queryKey: ["recipes", recipeId] });
    },
    onError: (err: any) => {
      toast.error(translateSupabaseError(err.message));
    },
  });

  const createPostMutation = useMutation({
    mutationFn: CreatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      toast.success("Paylaşım yapıldı!");
    },
    onError: (err: any) => {
      toast.error(translateSupabaseError(err.message));
    },
  });

  const handleAction = async (id: string, type: "like" | "save") => {
    try {
      await interactionMutation.mutateAsync({ id, type });
    } catch (err: any) {
      toast.error(translateSupabaseError(err.message));
    }
  };

  const isFollowing = followStatus?.isFollowing || false;

  return {
    feed,
    comments: comments || [],
    isLoadingComments:
      queryClient.isFetching({ queryKey: ["comments", recipeId] }) > 0,
    followStatus: isFollowing,
    handleSocialAction: handleAction,
    toggleFollow: followMutation.mutateAsync,
    addComment: commentMutation.mutateAsync,
    createPost: createPostMutation.mutateAsync,
    isFollowing: followMutation.isPending,
    isCommenting: commentMutation.isPending,
    isInteractionActive: (type: "like" | "save" | "follow") => {
      if (type === "follow") return isFollowing;
      return interactions.includes(type);
    },
  };
}
