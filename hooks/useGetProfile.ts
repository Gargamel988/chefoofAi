import { useSuspenseQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/services/profiles";
import { Profile } from "@/services/profiles";

export const useGetProfile = () => {
  // Queries
  const { data: myProfile } = useSuspenseQuery<Profile>({
    queryKey: ["profile", "me"],
    queryFn: getMyProfile,
  });

  return myProfile;
};
