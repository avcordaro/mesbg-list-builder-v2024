import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useRosterInformation } from "../../../hooks/calculations-and-displays/useRosterInformation.ts";
import { useProfiles } from "../../../hooks/profiles/useProfiles.ts";
import { RosterNotFound } from "../../../pages/not-found/RosterNotFound.tsx";
import { RosterBreadcrumbs } from "../../../pages/roster/RosterBreadcrumbs.tsx";
import { useUserPreferences } from "../../../state/preference";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";
import { CustomAlert } from "../../atoms/alert/CustomAlert.tsx";
import { ArmyComposition } from "./sections/ArmyComposition.tsx";
import { HeroicActionList } from "./sections/HeroicActionList.tsx";
import { MagicalPowerList } from "./sections/MagicalPowers.tsx";
import { QuickReferenceTable } from "./sections/QuickReferenceTable.tsx";
import { SpecialRuleList } from "./sections/SpecialRuleList.tsx";
import { StatTrackers } from "./sections/StatTrackers.tsx";
import { UnitProfileList } from "./sections/UnitProfileList.tsx";

export const PdfView = () => {
  const { roster } = useRosterInformation();

  if (!roster) {
    return <RosterNotFound />;
  }

  return <PrintablePdf />;
};

const PrintablePdf = () => {
  const theme = useTheme();
  const themeContext = useThemeContext();
  const { preferences } = useUserPreferences();
  const { roster } = useRosterInformation();
  const { profiles, missingProfiles } = useProfiles();

  return (
    <>
      <Container sx={{ mb: 8, py: 2, maxWidth: "calc(100vw - 3*24px)" }}>
        <RosterBreadcrumbs roster={roster} subpath="PDF" />

        <Stack gap={1} sx={{ mb: 2 }}>
          {missingProfiles.length > 0 && (
            <CustomAlert
              severity="error"
              title="Some selected units are missing profile data"
            >
              <Typography>
                Some of the units selected in your roster have no registered
                profile data. If you see this message, please let us know via{" "}
                <a
                  href="mailto:support@mesbg-list-builder.com?subject=MESBG List Builder (v2018) - Bug/Correction"
                  style={{
                    color:
                      themeContext.mode === "dark"
                        ? theme.palette.secondary.light
                        : theme.palette.secondary.dark,
                  }}
                >
                  support@mesbg-list-builder.com
                </a>
                .
              </Typography>
              <Typography sx={{ mt: 1 }}>
                The following units have no profile data:
              </Typography>
              <Typography sx={{ mt: 1 }} variant="body2">
                <i>{JSON.stringify(missingProfiles)}</i>
              </Typography>
            </CustomAlert>
          )}
          <CustomAlert severity="info" title="">
            Below is a preview of the PDF. You can print it directly or save it
            as a PDF.{" "}
            <a
              onClick={() => window.print()}
              href="#"
              style={{
                color:
                  themeContext.mode === "dark"
                    ? theme.palette.secondary.light
                    : theme.palette.secondary.dark,
              }}
            >
              Click here
            </a>{" "}
            to open printer options.
          </CustomAlert>
        </Stack>

        <Box className="print-section">
          <Stack gap={4}>
            {(!preferences.enableHidePdfSections ||
              !preferences.hidePdfQuickRefTable) && (
              <QuickReferenceTable profiles={profiles} />
            )}
            {(!preferences.enableHidePdfSections ||
              !preferences.hidePdfArmyComposition) && <ArmyComposition />}
            {(!preferences.enableHidePdfSections ||
              !preferences.hidePdfProfiles) && (
              <UnitProfileList units={profiles} />
            )}
            {(!preferences.enableHidePdfSections ||
              !preferences.hidePdfSpecialRules ||
              !preferences.hidePdfArmyRules) && (
              <SpecialRuleList profiles={profiles} />
            )}
            {(!preferences.enableHidePdfSections ||
              !preferences.hidePdfHeroicActions) && (
              <HeroicActionList profiles={profiles} />
            )}
            {(!preferences.enableHidePdfSections ||
              !preferences.hidePdfMagicPowers) && (
              <MagicalPowerList profiles={profiles} />
            )}
            {(!preferences.enableHidePdfSections ||
              !preferences.hidePdfStatTrackers) && <StatTrackers />}
          </Stack>
        </Box>
      </Container>
    </>
  );
};
