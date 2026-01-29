import Stack from "@mui/material/Stack";
import { FunctionComponent } from "react";
import { ProfileCard } from "../profile-card";
import { ProfileCardProps } from "../profile-card/ProfileCard.tsx";

export const ManyRulesCard: FunctionComponent<ProfileCardProps> = ({
  profile,
}) => {
  return (
    <ProfileCard profile={profile}>
      <ProfileCard.Header />
      <Stack direction="row" gap={5}>
        <ProfileCard.Body sx={{ width: "60ch", height: "100%", pb: 5 }}>
          <ProfileCard.AdditionalRules />
        </ProfileCard.Body>
        <ProfileCard.Body sx={{ flexGrow: 4, height: "100%", pb: 5 }}>
          <ProfileCard.Points />
          <ProfileCard.Heroics />
          <ProfileCard.Options />
          <ProfileCard.SpecialRules />
          <ProfileCard.Wargear />
          <ProfileCard.Magic />
        </ProfileCard.Body>
      </Stack>
    </ProfileCard>
  );
};
