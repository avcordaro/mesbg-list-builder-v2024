import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import data from "../../../../../../assets/data/profile_data_new.json";
import { ProfileCard } from "../../profile-card";
import { ProfileCardProps } from "../../profile-card/ProfileCard.tsx";
import { ProfileCardSection } from "../../profile-card/ProfileCardSection.tsx";
import { Profile } from "../../profile-card/types.ts";
import { AdditionalStats } from "./AdditionalStats.tsx";

type AdditionalStatProps = {
  profileId: string;
};

function BroodProfile({ profileId }: AdditionalStatProps) {
  const profile = data[profileId] as Profile;
  if (!profile) return <Typography>{profileId} not found</Typography>;

  return (
    <Box
      sx={{
        width: "42ch",
        ml: 3,
        p: 1,
        border: "3px solid #A98B5F",
        position: "absolute",
        right: "20px",
        bottom: "50px",
      }}
    >
      <Typography
        fontSize="1.05rem"
        fontWeight="bold"
        color="#800000"
        textTransform="uppercase"
      >
        {profile.profile}
      </Typography>
      <AdditionalStats stats={profile.stats} />
      <ProfileCardSection title="wargear">
        {profile.wargear.join(", ")}
      </ProfileCardSection>
      <ProfileCardSection title="special rules">
        {profile.special_rules.join(", ")}
      </ProfileCardSection>
    </Box>
  );
}

export const SpiderQueenProfileCard: FunctionComponent<ProfileCardProps> = ({
  profile,
}) => {
  const [brood] = profile.additional_stats;

  return (
    <ProfileCard profile={profile}>
      <ProfileCard.Header />
      <Box sx={{ my: 1 }}>
        <ProfileCard.AdditionalRules />
      </Box>
      <Stack direction="row">
        <ProfileCard.Body sx={{ width: "60ch" }}>
          <Stack direction="row">
            <Box sx={{ width: "30ch" }}>
              <ProfileCard.Options />
            </Box>
            <ProfileCard.Points />
          </Stack>
          <Stack direction="row">
            <Box sx={{ width: "30ch" }}>
              <ProfileCard.Wargear />
            </Box>
            <ProfileCard.Heroics />
          </Stack>
          <Box sx={{ width: "45ch" }}>
            <ProfileCard.SpecialRules />
          </Box>
        </ProfileCard.Body>
        <ProfileCard.Body>
          <BroodProfile profileId={brood} />
        </ProfileCard.Body>
      </Stack>
    </ProfileCard>
  );
};
