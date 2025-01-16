import { useProfiles } from "../profiles/useProfiles.ts";

export const useUsedMagicalPowers = () => {
  try {
    const profiles = useProfiles();
    return profiles.profiles
      .flatMap((profile) => profile.magic_powers)
      .map((mp) => mp.name)
      .map((keyword) => keyword.replace(/\(.*?\)/g, "(X)"));
  } catch {
    return [];
  }
};
