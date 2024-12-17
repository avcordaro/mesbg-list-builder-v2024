import { useProfiles } from "./useProfiles.ts";

export const useUsedSpecialRules = () => {
  try {
    const profiles = useProfiles();
    return profiles.profiles.flatMap((profile) => profile.special_rules);
  } catch {
    return [];
  }
};
