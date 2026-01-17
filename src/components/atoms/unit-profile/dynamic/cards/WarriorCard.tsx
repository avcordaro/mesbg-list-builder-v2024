import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FunctionComponent } from "react";
import { UnitProfilePicture } from "../../UnitProfilePicture.tsx";
import { ProfileCard } from "../profile-card";
import { ProfileCardProps } from "../profile-card/ProfileCard.tsx";

export const WarriorCard: FunctionComponent<ProfileCardProps> = ({
  profile,
}) => {
  return (
    <ProfileCard profile={profile}>
      <Stack direction="row" gap={2} justifyContent="space-between">
        <Box>
          <ProfileCard.Header includeAvatar={false} />
          <Stack direction="row" gap={4}>
            <ProfileCard.Body
              sx={{ width: "65ch", height: "100%", pb: 5, pr: 5 }}
            >
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
          </Stack>
        </Box>
        <UnitProfilePicture
          army={profile.origin}
          profile={profile.profile}
          size={250}
        />
      </Stack>
    </ProfileCard>
  );
};
