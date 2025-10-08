import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { ProfileCardSection } from "./ProfileCardSection.tsx";
import { useCard } from "./useCard.ts";

export const ProfileCardMagicalPowers: FunctionComponent = () => {
  const {
    magical_powers,
    stats: { M },
  } = useCard();

  if (
    M === undefined ||
    magical_powers === undefined ||
    magical_powers.length === 0
  )
    return null;

  return (
    <ProfileCardSection title="magic">
      <Box component="ul" sx={{ pl: 2 }}>
        {magical_powers.map(({ name, range, cast }, index) => (
          <Box component="li" key={index}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "4fr 2fr 1fr",
              }}
            >
              <Typography whiteSpace="nowrap">{name}</Typography>
              <Typography align="center">{range}</Typography>
              <Typography align="right">{cast}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </ProfileCardSection>
  );
};
