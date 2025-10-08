import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FunctionComponent } from "react";
import { ProfileCard } from "../profile-card";
import { ProfileCardProps } from "../profile-card/ProfileCard.tsx";

export const SimpleHeroCard: FunctionComponent<ProfileCardProps> = ({
  profile,
}) => {
  return (
    <ProfileCard profile={profile}>
      <ProfileCard.Header />
      <Stack direction="row" gap={5}>
        <ProfileCard.Body sx={{ width: "60ch", height: "100%", pb: 5 }}>
          <ProfileCard.AdditionalRules />
          <Stack direction="row" gap={10}>
            <Box sx={{ flexGrow: 3 }}>
              <ProfileCard.Options />
            </Box>
            <ProfileCard.Points />
          </Stack>
          <ProfileCard.SpecialRules />
          <ProfileCard.Wargear />
        </ProfileCard.Body>
        <ProfileCard.Body sx={{ flexGrow: 4, height: "100%", pb: 5 }}>
          <ProfileCard.Heroics />
          <ProfileCard.Magic />
        </ProfileCard.Body>
      </Stack>
    </ProfileCard>
  );
};
