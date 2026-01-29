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
};

function HowdahProfile({ profileId }: AdditionalStatProps) {
  const profile = data[profileId] as Profile;
  if (!profile) return <Typography>{profileId} not found</Typography>;

  return (
    <Box sx={{ width: "42ch", pl: 3 }}>
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
    </Box>
  );
}

function CommanderProfile({ profileId }: AdditionalStatProps) {
  const profile = data[profileId] as Profile;
  if (!profile) return <Typography>{profileId} not found</Typography>;

  return (
    <Box sx={[{ width: "53ch", mt: 3 }]}>
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

export const GreatBeastOfGorgorothProfileCard: FunctionComponent<
  ProfileCardProps
> = ({ profile }) => {
  const [howdah, orcCommander] = profile.additional_stats;
  console.log({ orcCommander, howdah });
  return (
    <ProfileCard profile={profile}>
      <Stack direction="row" justifyContent="space-between">
        <ProfileCard.Body sx={{ gap: 0 }}>
          <ProfileCard.Header includeAvatar={false} />
          <ProfileCard.AdditionalRules />
          <Stack direction="row" justifyContent="space-between">
            <ProfileCard.Wargear />
            <ProfileCard.SpecialRules />
          </Stack>
          <CommanderProfile profileId={orcCommander} />
        </ProfileCard.Body>
        <ProfileCard.Body>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="end"
            sx={{ px: 3 }}
          >
            <ProfileCard.Points />
            <UnitProfilePicture
              army={profile.origin}
              profile={profile.profile}
              size={175}
            />
          </Stack>
          <HowdahProfile profileId={howdah} />
        </ProfileCard.Body>
      </Stack>
    </ProfileCard>
  );
};
