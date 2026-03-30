import { useSuspenseQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/services/profiles";
import { Profile } from "@/services/profiles";

export const useGetProfile = (): Profile => {
  // Queries
  const { data: myProfile } = useSuspenseQuery<Profile>({
    queryKey: ["profile", "me"],
    queryFn: async () => {
      const profile = await getMyProfile();
      if (!profile) throw new Error("Profile not found");
      return profile;
    },
  });

  return myProfile;
};
