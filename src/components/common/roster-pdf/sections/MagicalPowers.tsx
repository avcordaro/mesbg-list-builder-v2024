import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import keywords from "../../../../assets/data/keywords.json";

import {
  MagicalPower as Caster,
  Profile,
} from "../../../../hooks/profile-utils/profile.type.ts";
import { useUserPreferences } from "../../../../state/preference";

interface MagicalPowerListProps {
  profiles: Profile[];
}

type MagicalPower = {
  name: string;
  description: string;
  casters: Caster[];
};

function mergeCasters(powers: MagicalPower[]): MagicalPower[] {
  return Object.values(
    powers.reduce((acc, power) => {
      const key = power.name;

      if (!acc[key]) {
        // Clone the object to avoid mutating the original
        acc[key] = { ...power, casters: [...power.casters] };
      } else {
        acc[key].casters.push(...power.casters);
      }

      return acc;
    }, {}),
  );
}

export const MagicalPowerList = ({ profiles }: MagicalPowerListProps) => {
  const {
    preferences: { removePdfPageBreak },
  } = useUserPreferences();

  const magicalPowers: MagicalPower[] = mergeCasters(
    profiles
      .flatMap((profile) =>
        profile.magic_powers.map((mp) => {
          const name = mp.name.replace(/\(.*?\)/g, "(X)");
          const power = keywords.find((keyword) => keyword.name === name);
          return {
            name,
            description: power?.description,
            casters: [{ name: profile.name, cast: mp.cast, range: mp.range }],
          };
        }),
      )
      .sort((a, b) => a.name.localeCompare(b.name)),
  );

  return (
    <>
      {magicalPowers.length > 0 && (
        <Box id="pdf-magic" className={removePdfPageBreak ? "" : "page-break"}>
          <Typography variant="h5">Magical Powers</Typography>
          <Stack gap={1} sx={{ py: 1 }}>
            {magicalPowers.map((rule) => (
              <Box key={rule.name} sx={{ pageBreakInside: "avoid" }}>
                <Typography variant="h6">
                  <b>{rule.name}</b>
                </Typography>
                <Typography
                  dangerouslySetInnerHTML={{
                    __html: rule.description
                      ?.replaceAll("\n\n", "<br />")
                      ?.replaceAll(
                        "<b>",
                        "<h4 style='margin-top: 8px; display: inline-block'>",
                      )
                      ?.replaceAll("</b>:", ":</h4>"),
                  }}
                />
                <Typography variant="body2">
                  <b>Cast by: </b>
                  <i>
                    {rule.casters
                      .map(
                        (caster) =>
                          `${caster.name} (${caster.range} at ${caster.cast})`,
                      )
                      .join(" | ")}
                  </i>
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </>
  );
};
