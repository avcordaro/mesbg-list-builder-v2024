import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { ProfileCardSection } from "./ProfileCardSection.tsx";
import { useCard } from "./useCard.ts";

export const ProfileCardHeroicActions: FunctionComponent = () => {
  const {
    heroic_actions,
    stats: { M },
  } = useCard();

  if (M === undefined || heroic_actions === undefined) return null;
  if (heroic_actions.length === 0)
    return (
      <ProfileCardSection title="heroic actions">None.</ProfileCardSection>
    );

  return (
    <ProfileCardSection title="heroic actions">
      <Box component="ul" sx={{ pl: 2 }}>
        {heroic_actions.map((action, index) => (
          <Typography component="li" key={index}>
            {action}
          </Typography>
        ))}
      </Box>
    </ProfileCardSection>
  );
};
