import { AlertTitle, Breadcrumbs } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useProfiles } from "../../../hooks/useProfiles.ts";
import { useRosterInformation } from "../../../hooks/useRosterInformation.ts";
import { ArmyComposition } from "./pdf/ArmyComposition.tsx";
import { MagicalPowerList } from "./pdf/MagicalPowers.tsx";
import { QuickReferenceTable } from "./pdf/QuickReferenceTable.tsx";
import { SpecialRuleList } from "./pdf/SpecialRuleList.tsx";
import { StatTrackers } from "./pdf/StatTrackers.tsx";
import { UnitProfileList } from "./pdf/UnitProfileList.tsx";

export const PdfView = () => {
  const { profiles, missingProfiles } = useProfiles();
  const { roster } = useRosterInformation();

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

        {missingProfiles.length > 0 && (
          <Alert icon={false} severity="error" sx={{ mb: 1 }}>
            <AlertTitle>
              <b>Some selected units are missing profile data</b>
            </AlertTitle>
            <Typography>
              Some of the units selected in your roster have no registered
              profile data. If you see this message, please let us know via{" "}
              <a href="mailto:support@mesbg-list-builder.com?subject=MESBG List Builder (v2018) - Bug/Correction">
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
          </Alert>
        )}
        <Alert severity="info" sx={{ mb: 2 }}>
          Below is a preview of the PDF. You can print it directly or save it as
          a PDF.{" "}
          <a onClick={() => window.print()} href="#">
            Click here
          </a>{" "}
          to open printer options.
        </Alert>
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
