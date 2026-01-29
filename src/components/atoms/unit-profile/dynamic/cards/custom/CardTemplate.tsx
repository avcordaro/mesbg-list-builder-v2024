import Box from "@mui/material/Box";
import { FunctionComponent } from "react";
import { ProfileCard } from "../../profile-card";
import { ProfileCardProps } from "../../profile-card/ProfileCard.tsx";

export const CardTemplate: FunctionComponent<ProfileCardProps> = ({
  profile,
}) => {
  return (
    <Box
      onClick={() => {
        window.navigator.clipboard.writeText(profile.id);
      }}
    >
      <ProfileCard profile={profile}>
        <ProfileCard.Header />
      </ProfileCard>
    </Box>
  );
};
