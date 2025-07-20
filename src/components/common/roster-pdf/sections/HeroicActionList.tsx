import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import keywords from "../../../../assets/data/keywords.json";
import { Profile } from "../../../../hooks/profiles/profile-utils/profile.type.ts";
import { useUserPreferences } from "../../../../state/preference";

interface HeroicActionListProps {
  profiles: Profile[];
}

type HeroicAction = {
  name: string;
  description: string;
};

function duplicates(item: string, index: number, self: string[]) {
  return index === self.findIndex((other) => other === item);
}

function mapToHeroicAction(heroicActionName: string) {
  const rule = keywords.find((keyword) => keyword.name === heroicActionName);
  return {
    name: rule?.name || heroicActionName,
    description: rule?.description,
  };
}

export const HeroicActionList = ({ profiles }: HeroicActionListProps) => {
  const {
    preferences: { removePdfPageBreak },
  } = useUserPreferences();
  const heroicActions: HeroicAction[] = profiles
    .flatMap((profile) => profile.heroic_actions || [])
    // Currently hiding these, their rules should be well known.
    // Including them will increase the PDF size quite a lot.
    // .concat("Heroic Move", "Heroic Shoot", "Heroic Combat")
    .filter(duplicates)
    .sort((a, b) => a.localeCompare(b))
    .map(mapToHeroicAction);

  return (
    <>
      <Box id="pdf-actions" className={removePdfPageBreak ? "" : "page-break"}>
        <Typography variant="h5">Heroic Actions</Typography>
        <Stack gap={1} sx={{ py: 1 }}>
          {heroicActions.map((rule) => (
            <Box key={rule.name} sx={{ py: 0.8, pageBreakInside: "avoid" }}>
              <Typography variant="body1">
                <b>{rule.name}</b>
              </Typography>
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{
                  __html: rule.description?.replaceAll("\n", "<br />"),
                }}
              />
            </Box>
          ))}
        </Stack>
      </Box>
    </>
  );
};
