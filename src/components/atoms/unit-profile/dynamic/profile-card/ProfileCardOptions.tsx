import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ProfileCardSection } from "./ProfileCardSection";
import { useCard } from "./useCard.ts";

export const ProfileCardOptions = () => {
  const { options } = useCard();
  return (
    <ProfileCardSection title="Options">
      {options.map((option, index) => (
        <Stack key={index} direction="row" justifyContent="space-between">
          <Typography>{option.name}</Typography>
          <Typography>{option.points} pts</Typography>
        </Stack>
      ))}
      {options.length === 0 && "None."}
    </ProfileCardSection>
  );
};
