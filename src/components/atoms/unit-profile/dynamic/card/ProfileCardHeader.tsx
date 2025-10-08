import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { UnitProfilePicture } from "../../UnitProfilePicture.tsx";
import { ProfileCardStats } from "./ProfileCardStats.tsx";
import { useCard } from "./useCard.ts";

export const ProfileCardHeader = () => {
  const { origin, profile, keywords } = useCard();
  return (
    <Stack direction="row" justifyContent="space-between">
      <Box>
        <Typography fontSize="1.3rem" fontWeight="bold" color="#800000">
          {profile}
        </Typography>
        <Typography fontWeight="bold" color="#800000">
          {keywords.join(" | ") || "NO | KEYWORDS | ARE, CONFIGURED | SORRY"}
        </Typography>
        <ProfileCardStats />
      </Box>
      <Box>
        <UnitProfilePicture army={origin} profile={profile} size="large" />
      </Box>
    </Stack>
  );
};
