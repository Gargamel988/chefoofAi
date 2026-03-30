import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  GetProfileById,
  UpdateProfile,
  UploadAvatar,
  UpdateEmail,
  UpdatePassword,
  InsertProfile,
  Profile,
  getMyProfile,
} from "@/services/profiles";
import { toast } from "sonner";
import { translateSupabaseError } from "@/lib/errorTranslator";

export function useProfiles(userId?: string) {
  const queryClient = useQueryClient();

  // Queries
  const { data: myProfile, isLoading: isMyProfileLoading } =
    useQuery<Profile | null>({
      queryKey: ["profile", "me"],
      queryFn: getMyProfile,
    });

  const { data: publicProfile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => GetProfileById(userId!).then((r) => r.data),
    enabled: !!userId,
  });

  // Mutations
  const updateMutation = useMutation({
    mutationFn: UpdateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profil güncellendi!");
    },
    onError: (err: any) => {
      toast.error(translateSupabaseError(err.message));
    },
  });

  const avatarMutation = useMutation({
    mutationFn: UploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Fotoğraf güncellendi!");
    },
    onError: (err: any) => {
      toast.error(translateSupabaseError(err.message));
    },
  });

  const emailMutation = useMutation({
    mutationFn: UpdateEmail,
    onSuccess: () => toast.success("E-posta güncellendi! Lütfen onaylayın."),
    onError: (err: any) => toast.error(err.message),
  });

  const passwordMutation = useMutation({
    mutationFn: UpdatePassword,
    onSuccess: () => toast.success("Şifre güncellendi!"),
    onError: (err: any) => toast.error(err.message),
  });

  const insertProfileMutation = useMutation({
    mutationFn: InsertProfile,
    onSuccess: () => toast.success("Profil güncellendi!"),
    onError: (err: any) => toast.error(err.message),
  });

  return {
    myProfile,
    publicProfile,
    updateProfile: updateMutation,
    uploadAvatar: avatarMutation,
    updateEmail: emailMutation,
    updatePassword: passwordMutation,
    insertProfile: insertProfileMutation,
    isUpdating:
      updateMutation.isPending ||
      avatarMutation.isPending ||
      insertProfileMutation.isPending,
  };
}
