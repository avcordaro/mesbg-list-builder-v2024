import { Button, Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { CustomAlert } from "../../components/atoms/alert/CustomAlert.tsx";
import {
  drawerWidth,
  RosterInfoDrawer,
} from "../../components/common/roster-info/RosterInfoDrawer.tsx";
import { useRosterInformation } from "../../hooks/calculations-and-displays/useRosterInformation.ts";
import { useScreenSize } from "../../hooks/calculations-and-displays/useScreenSize.ts";
import { useGamestateSync } from "../../hooks/cloud-sync/GamestateCloudSyncProvider.tsx";
import { useApi } from "../../hooks/cloud-sync/useApi.ts";
import { useGameModeState } from "../../state/gamemode";
import { Roster } from "../../types/roster.ts";
import { deepEqual } from "../../utils/objects.ts";
import { GamestateNotFound } from "../not-found/GameNotFound.tsx";
import { RosterNotFound } from "../not-found/RosterNotFound.tsx";
import { GameSwitcher } from "./components/GameSwitcher.tsx";
import { GamemodeToolbar } from "./components/GamemodeToolbar.tsx";
import { DeploymentHelper } from "./components/tabs/DeploymentHelperTable.tsx";
import { ProfileCards } from "./components/tabs/ProfileCards.tsx";
import { RosterInfoTab } from "./components/tabs/RosterInfoTab.tsx";
import { StatTrackers } from "./components/tabs/StatTrackers.tsx";
import { StatsTable } from "./components/tabs/StatsTable.tsx";
import { TabPanel } from "./components/tabs/TabPanel.tsx";

const removeUncheckedFields = (
  data: Roster["metadata"] & {
    owner?: string;
  },
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { owner, siegeRoster, ...sanitized } = data;
  return sanitized;
};

const hasChanged = (a: Roster["metadata"], b: Roster["metadata"]) => {
  return !deepEqual(removeUncheckedFields(a), removeUncheckedFields(b));
};

export const Gamemode = () => {
  const api = useApi();
  const syncGame = useGamestateSync();
  const screen = useScreenSize();
  const { roster } = useRosterInformation();
  const { gameState, startNewGame } = useGameModeState();

  const [value, setValue] = useState(0);
  const [rosterChangedWarning, setRosterChangedWarning] = useState(true);

  const game = gameState[roster.id];
  const prevGame = useRef<typeof game>();
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (!game) return;

    if (
      prevGame.current !== undefined &&
      game !== prevGame.current &&
      !firstRenderRef.current
    ) {
      syncGame(roster.id, game);
    }

    prevGame.current = game;
    firstRenderRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, roster.id]);

  if (!roster) {
    return <RosterNotFound />;
  }

  if (!gameState[roster.id]) {
    return <GamestateNotFound roster={roster} />;
  }

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const resetMatch = async () => {
    await api.deleteGamestate(roster.id);
    const game = startNewGame(roster);
    await api.createGamestate(roster.id, game);
  };

  const changedSinceStart = hasChanged(
    roster.metadata,
    gameState[roster.id]?.rosterMetadata,
  );

  return (
    <Container maxWidth={false} sx={{ p: 2 }}>
      <Box
        sx={{
          width: screen.isDesktop ? `calc(100% - ${drawerWidth}ch)` : "100%",
        }}
      >
        <GameSwitcher
          activeGame={roster.id}
          games={Object.entries(gameState)
            .map(([roster, game]) => ({
              roster,
              ...game,
            }))
            .sort((a, b) => b.lastUpdated - a.lastUpdated)}
        />
        <GamemodeToolbar />
        {changedSinceStart && rosterChangedWarning && (
          <CustomAlert
            severity="warning"
            onClose={() => setRosterChangedWarning(false)}
            title="Your roster was changed!"
          >
            <Typography>
              Your roster was changed after starting this match.
              <Button onClick={resetMatch}>Click here</Button> to reset your
              game to your current roster.
            </Typography>
          </CustomAlert>
        )}
        <Box sx={{ width: "100%", bgcolor: "background.paper", mt: 2 }}>
          <Tabs value={value} onChange={handleChange} variant="fullWidth">
            <Tab label="Trackers" />
            <Tab label="Army overview" />
            <Tab label="Profiles" />
            <Tab label="Stats table" />
            {!screen.isDesktop && !screen.isTooSmall && (
              <Tab label="Roster Info" />
            )}
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
        <TabPanel tabName="info" visible={value === 4}>
          <RosterInfoTab />
        </TabPanel>
      </Box>

      <RosterInfoDrawer roster={roster} />
    </Container>
  );
};
