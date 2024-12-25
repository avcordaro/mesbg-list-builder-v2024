import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Button, ButtonGroup, Stack, Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { SyntheticEvent, useState } from "react";
import { FaSkullCrossbones } from "react-icons/fa";
import { GiCrackedShield } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { armyListData } from "../../assets/data.ts";
import { SquareIconButton } from "../../components/common/icon-button/SquareIconButton.tsx";
import { useRosterInformation } from "../../hooks/useRosterInformation.ts";
import { useScreenSize } from "../../hooks/useScreenSize.ts";
import { useGameModeState } from "../../state/gamemode";
import { drawerWidth, RosterInfoDrawer } from "../builder/RosterInfoDrawer.tsx";
import { DeploymentHelper } from "./components/tabs/DeploymentHelperTable.tsx";
import { ProfileCards } from "./components/tabs/ProfileCards.tsx";
import { StatTrackers } from "./components/tabs/StatTrackers.tsx";
import { StatsTable } from "./components/tabs/StatsTable.tsx";
import { TabPanel } from "./components/tabs/TabPanel.tsx";

export const Gamemode = () => {
  const screen = useScreenSize();
  const { roster, getAdjustedMetaData } = useRosterInformation();
  const [value, setValue] = useState(0);
  const { gameState, updateGameState, endGame } = useGameModeState();
  const navigate = useNavigate();

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

  const game = gameState[roster.id];

  const updateCasualties = (update: 1 | -1) => {
    updateGameState(roster.id, {
      casualties: game.casualties + update,
    });
  };

  const armyListMetadata = armyListData[roster.armyList];
  const metadata = getAdjustedMetaData(roster);
  const breakPoint =
    metadata.units -
    Math.floor(metadata.units * (1 - (armyListMetadata.break_point ?? 0.49)));
  const quarter = metadata.units - Math.floor(metadata.units * 0.25);
  const casualties = game.casualties + game.heroCasualties;

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
        <Toolbar
          sx={{
            backgroundColor: "rgba(211,211,211,0.5)",
            mb: 2,
            justifyContent: "space-between",
          }}
        >
          <Box>
            <ButtonGroup>
              <Button
                startIcon={<ChevronLeft />}
                onClick={() => {
                  if (window.history.state && window.history.state.idx > 0) {
                    navigate(-1);
                  } else {
                    navigate("/gamemode/start", { replace: true }); // the current entry in the history stack will be replaced with the new one with { replace: true }
                  }
                }}
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  endGame(roster.id);
                  navigate("/gamemode/start");
                }}
              >
                End game
              </Button>
            </ButtonGroup>
          </Box>
          <Stack direction="row" gap={2}>
            <Typography variant="h6" className="middle-earth">
              Casualties:
            </Typography>
            <SquareIconButton
              onClick={() => updateCasualties(-1)}
              icon={<ChevronLeft />}
              iconColor="white"
              backgroundColor="darkgrey"
              iconPadding=".3rem"
              disabled={game.casualties === 0}
            />
            <Typography variant="h6" className="middle-earth" sx={{ mx: 1 }}>
              {casualties}
            </Typography>
            <SquareIconButton
              onClick={() => updateCasualties(+1)}
              icon={<ChevronRight />}
              iconColor="white"
              backgroundColor="darkgrey"
              iconPadding=".3rem"
            />
          </Stack>
          <Box>
            <Typography
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
              color={breakPoint - casualties <= 0 ? "error" : "inherit"}
            >
              Until Broken:{" "}
              <b>
                {breakPoint - casualties > 0 ? (
                  breakPoint - casualties
                ) : (
                  <GiCrackedShield />
                )}
              </b>
            </Typography>
            <Typography
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
              color={quarter - casualties <= 0 ? "error" : "inherit"}
            >
              Until Quartered:{" "}
              <b>
                {quarter - casualties > 0 ? (
                  quarter - casualties
                ) : (
                  <FaSkullCrossbones />
                )}
              </b>
            </Typography>
          </Box>
        </Toolbar>
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <Tabs value={value} onChange={handleChange} centered>
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
