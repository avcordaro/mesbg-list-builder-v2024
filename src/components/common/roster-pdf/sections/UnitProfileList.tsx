import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Fragment } from "react";
import { keywords } from "../../../../assets/data.ts";
import { Profile } from "../../../../hooks/profiles/profile-utils/profile.type.ts";
import { useUserPreferences } from "../../../../state/preference";
import { Stats } from "./Stats.tsx";

interface UnitListProps {
  units: Profile[];
}

const AdditionalText = ({ profile }: { profile: Profile }) => {
  return (
    <>
      {profile.additional_text && (
        <Typography sx={{ mb: 0.5 }} variant="body2">
          {profile.additional_text.map((text, index) => (
            <Typography sx={{ my: 0.5 }} key={index}>
              <i>{text}</i>
            </Typography>
          ))}
        </Typography>
      )}
    </>
  );
};

const SpecialRules = ({ profile }: { profile: Profile }) => {
  const {
    preferences: { includePdfSpecialRuleDescriptions },
  } = useUserPreferences();
  const specialRules: { name: string; description: string }[] = [
    ...profile.active_or_passive_rules,
    ...profile.special_rules.map((rule) => ({
      ...keywords.find((kw) =>
        rule.endsWith("bane")
          ? kw.name === "Bane Weapons"
          : kw.name === rule.replace(/\(.*?\)/g, "(X)"),
      ),
      name: rule,
    })),
  ].sort((a, b) => a.name.localeCompare(b.name));

  if (includePdfSpecialRuleDescriptions) {
    return (
      <>
        <Typography sx={{ mt: 0.5 }}>
          <b>Special Rules</b> {specialRules.length === 0 && <i>None</i>}
        </Typography>
        {specialRules.map((rule, index) => (
          <Box key={index} sx={{ my: 1, ml: 2 }}>
            <Typography>
              <b>{rule.name}</b>
              <br />
              {rule.description}
            </Typography>
          </Box>
        ))}
      </>
    );
  }

  return (
    <Typography sx={{ mt: 0.5 }}>
      <b>Special Rules:</b> {specialRules.map((rule) => rule.name).join(", ")}{" "}
      {specialRules.length === 0 && <i>None</i>}
    </Typography>
  );
};

const MagicalPowers = ({ profile }: { profile: Profile }) => {
  return (
    <>
      {profile.magic_powers && profile.magic_powers.length > 0 && (
        <>
          <Typography sx={{ mt: 0.5 }}>
            <b>Magical powers:</b>
          </Typography>
          <TableContainer
            component="div"
            sx={{ width: "42ch", borderBottom: "none" }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Range</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody
                sx={{ "& > *:last-child > *": { borderBottom: "none" } }}
              >
                {profile.magic_powers.map((power, index) => (
                  <TableRow key={index}>
                    <TableCell>{power.name}</TableCell>
                    <TableCell align="center">{power.range}</TableCell>
                    <TableCell align="center">{power.cast}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
};

const HeroicActions = ({ profile }: { profile: Profile }) => {
  const {
    preferences: { includePdfHeroicActionDescriptions },
  } = useUserPreferences();

  if (!profile.heroic_actions || profile.heroic_actions.length === 0) {
    return <></>;
  }

  if (includePdfHeroicActionDescriptions) {
    const heroicActions = profile.heroic_actions.map((action) =>
      keywords.find((kw) => kw.name === action),
    );

    return (
      <>
        <Typography sx={{ mt: 0.5 }}>
          <b>Heroic actions:</b>
        </Typography>
        {heroicActions.map((rule, index) => (
          <Box key={index} sx={{ my: 1, ml: 2 }}>
            <Typography>
              <b>{rule.name}</b>
              <br />
              {rule.description}
            </Typography>
          </Box>
        ))}
      </>
    );
  }

  return (
    <>
      {profile.heroic_actions && profile.heroic_actions.length > 0 && (
        <Typography sx={{ mt: 0.5 }}>
          <b>Heroic actions:</b> {profile.heroic_actions.join(", ")}{" "}
        </Typography>
      )}
    </>
  );
};

const AdditionalProfiles = ({
  additionalProfiles,
}: {
  additionalProfiles: Profile[];
}) => {
  return (
    <Box sx={{ pl: 2, mt: 2 }}>
      {additionalProfiles.map((profile, index) => (
        <Box key={index} sx={{ mt: 2 }}>
          <Typography>
            <b>{profile.name}</b>
          </Typography>
          <Box sx={{ pl: 2 }}>
            <AdditionalText profile={profile} />
            <HeroicActions profile={profile} />
            <SpecialRules profile={profile} />
            <MagicalPowers profile={profile} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const ListItem = ({ profile }: { profile: Profile }) => {
  return (
    <>
      <Box sx={{ py: 2, pageBreakInside: "avoid" }}>
        <Typography variant="h6">
          <b>{profile.name}</b>
        </Typography>
        <AdditionalText profile={profile} />
        <Stats profile={profile} />
        <HeroicActions profile={profile} />
        <SpecialRules profile={profile} />
        <MagicalPowers profile={profile} />
        <AdditionalProfiles
          additionalProfiles={profile?.additional_stats || []}
        />
      </Box>
    </>
  );
};

export const UnitProfileList = ({ units }: UnitListProps) => {
  const {
    preferences: { removePdfPageBreak },
  } = useUserPreferences();
  return (
    <Box id="pdf-profiles" className={removePdfPageBreak ? "" : "page-break"}>
      <Typography variant="h5">Profiles</Typography>
      {units
        .filter((unit) => unit.type !== "Siege Equipment")
        .map((unit, index) => (
          <Fragment key={index}>
            <ListItem profile={unit} />
            {units.length !== index && <Divider variant="fullWidth" />}
          </Fragment>
        ))}
    </Box>
  );
};
