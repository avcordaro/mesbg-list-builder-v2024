import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
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

export const WargMarauderProfileCard: FunctionComponent<ProfileCardProps> = ({
  profile,
}) => {
  const [goblin, warg] = profile.additional_stats;
  const goblinProfile = data[goblin] as Profile;
  const wargProfile = data[warg] as Profile;
  return (
    <ProfileCard profile={profile}>
      <Stack direction="row" gap={3}>
        <Box sx={{ width: "55ch" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <ProfileCard.Header includeStats={false} includeAvatar={false} />
            <Stack direction="row" gap={1} alignItems="center">
              <Typography
                variant="h6"
                color="#800000"
                fontSize="1.05rem"
                fontWeight="bold"
                textTransform="uppercase"
              >
                Points:{" "}
              </Typography>
              <Typography fontWeight="bold" fontSize="1.4rem">
                {profile.points}
              </Typography>
            </Stack>
          </Stack>
          <Divider sx={{ mb: 1, color: "#800000" }} />
          <Typography
            fontSize="1.4rem"
            fontWeight="bold"
            color="#800000"
            textTransform="uppercase"
          >
            {goblinProfile.profile}
          </Typography>
          <Typography
            fontSize="1.05rem"
            fontWeight="bold"
            color="#800000"
            textTransform="uppercase"
          >
            {goblinProfile.keywords}
          </Typography>
          <AdditionalStats stats={goblinProfile.stats} />
          <ProfileCardSection>
            {goblinProfile.additional_rules.map((rule, index) => (
              <AdditionalRule index={index} rule={rule} key={index} />
            ))}
          </ProfileCardSection>
          <Stack direction="row" justifyContent="space-between">
            <ProfileCardSection title="special rules">
              {goblinProfile.special_rules.join(", ")}
            </ProfileCardSection>
            <ProfileCardSection title="options">None.</ProfileCardSection>
          </Stack>
          <ProfileCardSection title="wargear">
            {goblinProfile.wargear.join(", ")}
          </ProfileCardSection>
        </Box>
        <Box
          sx={{
            width: "37ch",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <UnitProfilePicture
            army={profile.origin}
            profile={profile.profile}
            size={200}
          />
          <Typography
            fontSize="0.9rem"
            lineHeight={1}
            textAlign="justify"
            sx={{ my: 2 }}
          >
            {profile.additional_text[0]}
          </Typography>
          <Box sx={{ width: "38ch", p: 1, border: "3px solid #A98B5F" }}>
            <Typography
              fontSize="1.05rem"
              fontWeight="bold"
              color="#800000"
              textTransform="uppercase"
            >
              {wargProfile.profile}
            </Typography>
            <AdditionalStats stats={wargProfile.stats} />
          </Box>
        </Box>
      </Stack>
    </ProfileCard>
  );
};
