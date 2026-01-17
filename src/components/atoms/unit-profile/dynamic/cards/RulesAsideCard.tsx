import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FunctionComponent } from "react";
import { ProfileCard } from "../profile-card";
import { ProfileCardProps } from "../profile-card/ProfileCard.tsx";

export const RulesAsideCard: FunctionComponent<ProfileCardProps> = ({
  profile,
}) => {
  return (
    <ProfileCard profile={profile}>
      <ProfileCard.Header />
      <Stack direction="row" gap={5}>
        <ProfileCard.Body sx={{ width: "65ch", height: "100%", pb: 5 }}>
          <ProfileCard.AdditionalRules />
          <Stack direction="row" justifyContent="space-between" gap={10}>
            <Box sx={{ flexGrow: 3 }}>
              <ProfileCard.Options />
            </Box>
            <ProfileCard.Points />
          </Stack>
        </ProfileCard.Body>
        <ProfileCard.Body sx={{ width: "25ch", height: "100%", pb: 5 }}>
          <ProfileCard.Heroics />
          <ProfileCard.SpecialRules />
          <ProfileCard.Wargear />
          <ProfileCard.Magic />
        </ProfileCard.Body>
      </Stack>
    </ProfileCard>
  );
};
