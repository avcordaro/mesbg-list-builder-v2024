import { AlertTitle } from "@mui/material";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { useRosterInformation } from "../../hooks/useRosterInformation.ts";
import { useRosterBuildingState } from "../../state/roster-building";
import { CreateRosterCardButton } from "./components/CreateRosterCardButton.tsx";
import {
  RosterSummaryCard,
  RosterSummaryCardProps,
} from "./components/RosterSummaryCard.tsx";

export const Rosters: FunctionComponent = () => {
  const { rosters } = useRosterBuildingState();
  const { getAdjustedMetaData } = useRosterInformation();

  const rosterLinks: RosterSummaryCardProps[] = rosters
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((roster) => {
      const metadata = getAdjustedMetaData(roster);
      return {
        id: roster.id,
        name: roster.name,
        armyList: roster.armyList,
        points: metadata.points,
        units: metadata.units,
        warbands: roster.warbands.length,
        bows: metadata.bows,
        throwing_weapons: metadata.throwingWeapons,
        might: metadata.might,
      };
    });

  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      <Stack>
        <Typography variant="h4" className="middle-earth">
          My Rosters
        </Typography>
        <Alert severity="warning" sx={{ maxWidth: "90ch", my: 2 }}>
          <AlertTitle>
            <Typography sx={{ maxWidth: "72ch" }}>
              <strong>
                You are currently looking at a &quot;Work in Progress&quot;
                build.
              </strong>
            </Typography>
          </AlertTitle>
          <Stack sx={{ maxWidth: "72ch" }} gap={2}>
            <Typography>
              The MESBG List Builder for the new &apos;24 edition of MESBG is
              still in a work in progress state. This means that there are still
              missing profiles and there can be errors.
            </Typography>
            <Typography>
              Feel free to help us test and report any errors you see or find to
              us via:{" "}
              <a href="mailto:support@mesbg-list-builder.com?subject=MESBG List Builder (v2024) - Bug/Correction">
                support@mesbg-list-builder.com
              </a>
            </Typography>
          </Stack>
        </Alert>

        <Stack direction="row" gap={2} sx={{ my: 2 }} flexWrap="wrap" flex={1}>
          {rosterLinks.map((roster, index) => (
            <RosterSummaryCard key={index} {...roster} />
          ))}
          <CreateRosterCardButton />
        </Stack>
      </Stack>
    </Container>
  );
};
