import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Button, Stack, Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState, SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { SquareIconButton } from "../../components/common/icon-button/SquareIconButton.tsx";
import { useRosterInformation } from "../../hooks/useRosterInformation.ts";
import { useScreenSize } from "../../hooks/useScreenSize.ts";
import { drawerWidth, RosterInfoDrawer } from "../builder/RosterInfoDrawer.tsx";
import { ProfileCards } from "./components/tabs/ProfileCards.tsx";
import { StatTrackers } from "./components/tabs/StatTrackers.tsx";
import { StatsTable } from "./components/tabs/StatsTable.tsx";
import { TabPanel } from "./components/tabs/TabPanel.tsx";

export const Gamemode = () => {
  const screen = useScreenSize();
  const { roster } = useRosterInformation();
  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
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
          <Button startIcon={<ChevronLeft />}>Back</Button>
          <Stack direction="row" gap={2}>
            <Typography variant="h6" className="middle-earth">
              Casualties:
            </Typography>
            <SquareIconButton
              onClick={() => null}
              icon={<ChevronLeft />}
              iconColor="white"
              backgroundColor="black"
              iconPadding=".2rem"
            />
            <Typography variant="h6" className="middle-earth" sx={{ mx: 1 }}>
              10
            </Typography>
            <SquareIconButton
              onClick={() => null}
              icon={<ChevronRight />}
              iconColor="white"
              backgroundColor="black"
              iconPadding=".25rem"
            />
          </Stack>
          <Box>
            <Typography
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              Until Broken: <b>16</b>
            </Typography>
            <Typography
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              Until Quartered: <b>24</b>
            </Typography>
          </Box>
        </Toolbar>
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Trackers" />
            <Tab label="Profiles" />
            <Tab label="Stats table" />
          </Tabs>
        </Box>
        <TabPanel tabName="profile cards" visible={value === 0}>
          <StatTrackers />
        </TabPanel>
        <TabPanel tabName="profile cards" visible={value === 1}>
          <ProfileCards />
        </TabPanel>
        <TabPanel tabName="stats" visible={value === 2}>
          <StatsTable />
        </TabPanel>
      </Box>
      <RosterInfoDrawer roster={roster} />
    </Container>
  );
};
