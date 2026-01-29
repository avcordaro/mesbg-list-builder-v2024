import Stack from "@mui/material/Stack";
import { Fragment, FunctionComponent } from "react";
import data from "../../../../../../assets/data/profile_data_new.json";
import { UnitProfilePicture } from "../../../UnitProfilePicture.tsx";
import { ProfileCard } from "../../profile-card";
import { ProfileCardProps } from "../../profile-card/ProfileCard.tsx";

export const ThranduilProfileCard: FunctionComponent<ProfileCardProps> = ({
  profile,
}) => {
  const [elk] = profile.additional_stats;
  const elkProfile = data[elk];
  return (
    <Fragment>
      <ProfileCard profile={profile}>
        <Stack direction="row" gap={4}>
          <ProfileCard.Body>
            <ProfileCard.Header includeAvatar={false} />
            <ProfileCard.AdditionalRules />
            <Stack direction="row" gap={4} justifyContent="space-between">
              <ProfileCard.SpecialRules />
              <ProfileCard.Points />
            </Stack>
          </ProfileCard.Body>
          <ProfileCard.Body sx={{ display: "flex", gap: 4 }}>
            <UnitProfilePicture
              army={profile.origin}
              profile={profile.profile}
              size={175}
            />
            <ProfileCard.Options />
            <ProfileCard.Wargear />
          </ProfileCard.Body>
        </Stack>
      </ProfileCard>
      <ProfileCard profile={elkProfile}>
        <Stack direction="row" gap={10}>
          <ProfileCard.Body>
            <ProfileCard.Header includeAvatar={false} />
            <ProfileCard.AdditionalRules />
            <ProfileCard.SpecialRules />
          </ProfileCard.Body>
          <ProfileCard.Body>
            <UnitProfilePicture
              army={profile.origin}
              profile={elkProfile.profile}
              size={225}
            />
          </ProfileCard.Body>
        </Stack>
      </ProfileCard>
    </Fragment>
  );
};
