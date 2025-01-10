import { AlertTitle, Button, Tab, Tabs } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useRosterInformation } from "../../hooks/useRosterInformation.ts";
import { useScreenSize } from "../../hooks/useScreenSize.ts";
import { useGameModeState } from "../../state/gamemode";
import { deepEqual } from "../../utils/objects.ts";
import { drawerWidth, RosterInfoDrawer } from "../builder/RosterInfoDrawer.tsx";
import { GamemodeToolbar } from "./components/GamemodeToolbar.tsx";
import { DeploymentHelper } from "./components/tabs/DeploymentHelperTable.tsx";
import { ProfileCards } from "./components/tabs/ProfileCards.tsx";
import { StatTrackers } from "./components/tabs/StatTrackers.tsx";
import { StatsTable } from "./components/tabs/StatsTable.tsx";
import { TabPanel } from "./components/tabs/TabPanel.tsx";

export const Gamemode = () => {
  const screen = useScreenSize();
  const { roster } = useRosterInformation();
  const { gameState, startNewGame } = useGameModeState();

  const [value, setValue] = useState(0);
  const [rosterChangedWarning, setRosterChangedWarning] = useState(true);

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
          Please navigate back to{" "}
          <Link to="/gamemode/start">the roster selection</Link> and start a
          game from there.
        </Typography>
      </Box>
    );
  }

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const resetMatch = () => {
    startNewGame(roster);
  };

  const changedSinceStart =
    gameState[roster.id].rosterMetadata &&
    !deepEqual(roster.metadata, gameState[roster.id].rosterMetadata);

  return (
    <Container
      maxWidth={false}
      sx={{
        p: 2,
      }}
    >
      <Box
        sx={{
          width: screen.isDesktop ? `calc(100% - ${drawerWidth}ch)` : "100%",
        }}
      >
        <GamemodeToolbar />
        {changedSinceStart && rosterChangedWarning && (
          <Alert
            severity="warning"
            onClose={() => setRosterChangedWarning(false)}
          >
            <AlertTitle>
              <Typography>
                <strong>Your roster was changed!</strong>
              </Typography>
            </AlertTitle>
            <Typography
              sx={{ display: "flex", alignItems: "center", gap: 0.4 }}
            >
              Your roster was changed after starting this match.{" "}
              <Button onClick={resetMatch}>Click here</Button> to reset your
              game to your current roster.
            </Typography>
          </Alert>
        )}
        <Box sx={{ width: "100%", bgcolor: "background.paper", mt: 2 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
          >
            <Tab label="Trackers" />
            <Tab label="Army overview" />
            <Tab label="Profiles" />
            <Tab label="Stats table" />
          </Tabs>
        </Box>
        <TabPanel tabName="trackers" visible={value === 0}>
          <StatTrackers />
        </TabPanel>
        <TabPanel tabName="profile cards" visible={value === 1}>
          <DeploymentHelper />
        </TabPanel>{" "}
        <TabPanel tabName="profile cards" visible={value === 2}>
          <ProfileCards />
        </TabPanel>
        <TabPanel tabName="stats" visible={value === 3}>
          <StatsTable />
        </TabPanel>
      </Box>
      <RosterInfoDrawer roster={roster} />
    </Container>
  );
};
