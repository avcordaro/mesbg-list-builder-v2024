import { Breadcrumbs } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useProfiles } from "../../../hooks/useProfiles.ts";
import { useRosterInformation } from "../../../hooks/useRosterInformation.ts";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";
import { CustomAlert } from "../alert/CustomAlert.tsx";
import { Link } from "../link/Link.tsx";
import { ArmyComposition } from "./pdf/ArmyComposition.tsx";
import { MagicalPowerList } from "./pdf/MagicalPowers.tsx";
import { QuickReferenceTable } from "./pdf/QuickReferenceTable.tsx";
import { SpecialRuleList } from "./pdf/SpecialRuleList.tsx";
import { StatTrackers } from "./pdf/StatTrackers.tsx";
import { UnitProfileList } from "./pdf/UnitProfileList.tsx";

export const PdfView = () => {
  const { roster } = useRosterInformation();

  if (!roster) {
    return (
      <Box sx={{ m: 2 }}>
        <Typography variant="h4" className="middle-earth">
          Roster not found!
        </Typography>
        <Typography sx={{ mb: 2 }}>
          One does not simply navigate to a roster that does not exist.
        </Typography>
        <Typography>
          Please navigate back to <Link to="/rosters">My Rosters</Link> and
          select a roster from there.
        </Typography>
      </Box>
    );
  }

  return <PrintablePdf />;
};

const PrintablePdf = () => {
  const { profiles, missingProfiles } = useProfiles();
  const { roster } = useRosterInformation();
  const theme = useTheme();
  const themeContext = useThemeContext();

  return (
    <>
      <Container sx={{ mb: 8, py: 2 }}>
        <Breadcrumbs sx={{ mb: 1 }}>
          <Link
            to="/rosters"
            style={{
              textDecoration: "none",
            }}
          >
            My Rosters
          </Link>
          {roster.group && (
            <Link
              to={`/rosters/${roster.group}`}
              style={{
                textDecoration: "none",
              }}
            >
              {roster.group}
            </Link>
          )}
          <Link
            to={`/roster/${roster.id}`}
            style={{
              textDecoration: "none",
            }}
          >
            {roster.name}
          </Link>
          <Typography sx={{ color: "text.secondary" }}>Printable</Typography>
        </Breadcrumbs>

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
            <QuickReferenceTable profiles={profiles} />
            <ArmyComposition />
            <UnitProfileList units={profiles} />
            <SpecialRuleList profiles={profiles} />
            <MagicalPowerList profiles={profiles} />
            <StatTrackers />
          </Stack>
        </Box>
      </Container>
    </>
  );
};
