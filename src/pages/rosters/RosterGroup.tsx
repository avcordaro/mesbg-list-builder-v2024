import { Breadcrumbs } from "@mui/material";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { Link, useParams } from "react-router-dom";
import { useRosterInformation } from "../../hooks/useRosterInformation.ts";
import { useRosterBuildingState } from "../../state/roster-building";
import { CreateRosterCardButton } from "./components/CreateRosterCardButton.tsx";
import {
  RosterSummaryCard,
  RosterSummaryCardProps,
} from "./components/RosterSummaryCard.tsx";

export const RosterGroup: FunctionComponent = () => {
  const { rosters } = useRosterBuildingState();
  const { getAdjustedMetaData } = useRosterInformation();
  const { groupId } = useParams();

  const rosterLinks: RosterSummaryCardProps[] = rosters
    .filter((roster) => roster.group === groupId)
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
        <Breadcrumbs>
          <Link
            to="/rosters"
            style={{
              textDecoration: "none",
            }}
          >
            Rosters
          </Link>
          <Typography sx={{ color: "text.secondary" }}>{groupId}</Typography>
        </Breadcrumbs>

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
