import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ProfileCardSection } from "./ProfileCardSection";
import { useCard } from "./useCard.ts";

export const ProfileCardAdditionalRules = () => {
  const { additional_rules } = useCard();
  if (!additional_rules) return null;
  return (
    <ProfileCardSection>
      <Stack gap={1}>
        {additional_rules.map((rule, index) => (
          <Typography key={index}>
            <Typography component="span" fontWeight="bold">
              {rule.name}
            </Typography>{" "}
            -{" "}
            <Typography
              component="span"
              fontWeight="bold"
              color={getTypeColor(rule.type)}
            >
              {rule.type}
            </Typography>{" "}
            - <Typography component="span">{rule.description}</Typography>
          </Typography>
        ))}
      </Stack>
    </ProfileCardSection>
  );
};

function getTypeColor(type: string) {
  switch (type) {
    case "Active":
      return "red";
    case "Passive":
      return "darkorange";
    case "Brutal Power Attack":
      return "darkcyan";

    default:
      return "green";
  }
}
