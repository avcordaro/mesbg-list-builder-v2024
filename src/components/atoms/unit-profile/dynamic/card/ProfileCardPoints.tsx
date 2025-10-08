import Typography from "@mui/material/Typography";
import { ProfileCardSection } from "./ProfileCardSection.tsx";
import { useCard } from "./useCard.ts";

export const ProfileCardPoints = () => {
  const { points } = useCard();
  return (
    <ProfileCardSection title="points">
      <Typography
        fontWeight="bold"
        fontSize="1.4rem"
        sx={{
          my: -1,
        }}
      >
        {points}
      </Typography>
    </ProfileCardSection>
  );
};
