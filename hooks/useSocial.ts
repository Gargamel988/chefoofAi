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
    queryKey: ["interactions", recipeId, targetUserId],
    queryFn: () => GetRecipeInteractions(recipeId!, targetUserId!),
    enabled: !!recipeId && !!targetUserId,
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
      // Interactions update
      await queryClient.cancelQueries({ queryKey: ["interactions", vars.id] });
      const prevInteractions = queryClient.getQueryData<string[]>(["interactions", vars.id]);

      queryClient.setQueryData<string[]>(["interactions", vars.id], (old = []) => {
        if (old.includes(vars.type)) {
          return old.filter(t => t !== vars.type);
        }
        return [...old, vars.type];
      });

      // Recipe likes count update if type is like
      let prevRecipe = null;
      if (vars.type === "like") {
        await queryClient.cancelQueries({ queryKey: ["recipes", vars.id] });
        prevRecipe = queryClient.getQueryData<any>(["recipes", vars.id]);
        
        if (prevRecipe) {
          queryClient.setQueryData(["recipes", vars.id], (old: any) => {
            const isLiked = prevInteractions?.includes("like");
            const newCount = isLiked 
              ? Math.max(0, (old.likes_count || 0) - 1)
              : (old.likes_count || 0) + 1;
            return { ...old, likes_count: newCount };
          });
        }
      }

      return { prevInteractions, prevRecipe };
    },
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["recipes", vars.id] });
      queryClient.invalidateQueries({ queryKey: ["interactions", vars.id] });
    },
    onError: (err: any, vars, context) => {
      if (context?.prevInteractions) {
        queryClient.setQueryData(["interactions", vars.id], context.prevInteractions);
      }
      if (context?.prevRecipe && vars.type === "like") {
        queryClient.setQueryData(["recipes", vars.id], context.prevRecipe);
      }
      toast.error(translateSupabaseError(err.message));
    },
  });

  const followMutation = useMutation({
    mutationFn: (userId: string) => ToggleFollowUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follow_status"] });
      queryClient.invalidateQueries({ queryKey: ["creators"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["public_profile"] });
    },
    onError: (err: any) => {
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

  const handleAction = async (
    id: string,
    type: "like" | "save",
  ) => {
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
