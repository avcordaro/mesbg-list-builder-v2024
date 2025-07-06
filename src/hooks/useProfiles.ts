import { convertRosterToProfiles } from "./profile-utils/profiles.ts";
import { useRosterInformation } from "./useRosterInformation.ts";

export const useProfiles = () => {
  const { roster } = useRosterInformation();
  const profileData = convertRosterToProfiles(roster);

  console.log(profileData);

  return {
    profiles: profileData.profiles,
    missingProfiles: profileData.missing,
  };
};
