import { armyListData } from "../assets/data.ts";
import { useProfiles } from "./useProfiles.ts";
import { useRosterInformation } from "./useRosterInformation.ts";

export const useUsedSpecialRules = () => {
  const { roster } = useRosterInformation();
  try {
    const profiles = useProfiles();

    return [
      ...armyListData[roster.armyList].rule_highlights,
      ...profiles.profiles
        .flatMap((profile) => profile.special_rules)
        .map((keyword) => keyword.replace(/\(.*?\)/g, "(X)")),
    ];
  } catch {
    return [];
  }
};
