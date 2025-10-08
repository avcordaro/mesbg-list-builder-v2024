import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import data from "../../../../../../assets/data/profile_data_new.json";
import { UnitProfilePicture } from "../../../UnitProfilePicture.tsx";
import { ProfileCard } from "../../profile-card";
import { AdditionalRule } from "../../profile-card/AdditionalRule.tsx";
import { ProfileCardProps } from "../../profile-card/ProfileCard.tsx";
import { ProfileCardSection } from "../../profile-card/ProfileCardSection.tsx";
import { Profile } from "../../profile-card/types.ts";
import { AdditionalStats } from "./AdditionalStats.tsx";

type AdditionalStatProps = {
  profileId: string;
  align: "left" | "right";
};

function AdditionalProfile({ profileId, align }: AdditionalStatProps) {
  const profile = data[profileId] as Profile;
  if (!profile) return <Typography>{profileId} not found</Typography>;

  return (
    <Box sx={[{ width: "42ch" }, align === "left" ? { pl: 3 } : { pr: 3 }]}>
      <Typography
        fontSize="1.05rem"
        fontWeight="bold"
        color="#800000"
        textTransform="uppercase"
      >
        {profile.profile}
      </Typography>
      <AdditionalStats stats={profile.stats} />
      {profile.additional_rules.map((rule, index) => (
        <AdditionalRule index={index} rule={rule} key={index} />
      ))}
      <ProfileCardSection title="wargear" sx={{ mt: 2 }}>
        {profile.wargear.join(", ")}
      </ProfileCardSection>
    </Box>
  );
}

export const VaultWardenProfileCard: FunctionComponent<ProfileCardProps> = ({
  profile,
}) => {
  const [shield, spear] = profile.additional_stats;

  return (
    <ProfileCard profile={profile}>
      <Stack direction="row" sx={{ width: "100%", height: "100%" }}>
        <ProfileCard.Body
          sx={{
            width: "70ch",
            justifyContent: "space-between",
            height: "100%",
            pb: 5,
          }}
        >
          <ProfileCard.Header includeStats={false} includeAvatar={false} />
          <AdditionalProfile profileId={shield} align="right" />
          <ProfileCard.Points />
        </ProfileCard.Body>
        <ProfileCard.Body
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
            pb: 5,
          }}
        >
          <UnitProfilePicture
            army={profile.origin}
            profile={profile.profile}
            size={225}
          />
          <AdditionalProfile profileId={spear} align="left" />
        </ProfileCard.Body>
      </Stack>
    </ProfileCard>
  );
};
