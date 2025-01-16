import { useRosterInformation } from "../calculations-and-displays/useRosterInformation.ts";
import { convertRosterToProfiles } from "./profile-utils/profiles.ts";

export const useProfiles = () => {
  const { roster } = useRosterInformation();
  const profileData = convertRosterToProfiles(roster);

  console.log(profileData);

  return {
    profiles: profileData.profiles,
    missingProfiles: profileData.missing,
  };
};
