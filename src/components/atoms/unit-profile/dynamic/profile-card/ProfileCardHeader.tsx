import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { UnitProfilePicture } from "../../UnitProfilePicture.tsx";
import { ProfileCardStats } from "./ProfileCardStats.tsx";
import { useCard } from "./useCard.ts";

export const ProfileCardHeader = ({
  includeAvatar = true,
  includeStats = true,
}: {
  includeAvatar?: boolean;
  includeStats?: boolean;
}) => {
  const { origin, profile, keywords } = useCard();
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ pb: 1 }}>
      <Box>
        <Typography
          fontSize="1.4rem"
          fontWeight="bold"
          color="#800000"
          textTransform="uppercase"
        >
          {profile}
        </Typography>
        <Typography
          fontSize="1.05rem"
          fontWeight="bold"
          color="#800000"
          textTransform="uppercase"
        >
          {keywords}
        </Typography>
        {includeStats && <ProfileCardStats />}
      </Box>
      {includeAvatar && (
        <Box>
          <UnitProfilePicture army={origin} profile={profile} size="large" />
        </Box>
      )}
    </Stack>
  );
};
