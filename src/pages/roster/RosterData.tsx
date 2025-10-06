import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useEffect, useRef, useState } from "react";
import {
  drawerWidth,
  RosterInfoDrawer,
} from "../../components/common/roster-info/RosterInfoDrawer.tsx";
import {
  MobileRosterInfoToolbar,
  ROSTER_INFO_BAR_HEIGHT,
} from "../../components/common/toolbar/MobileRosterInfoToolbar.tsx";
import { MobileRosterWarningsToolbar } from "../../components/common/toolbar/MobileRosterWarningsToolbar.tsx";
import { WarbandList } from "../../components/common/warbands/WarbandList.tsx";
import { OpenNavigationDrawerEvent } from "../../events/OpenNavigationDrawerEvent.ts";
import { useRosterWarnings } from "../../hooks/calculations-and-displays/useRosterWarnings.ts";
import { useScreenSize } from "../../hooks/calculations-and-displays/useScreenSize.ts";
import { useRosterSync } from "../../hooks/cloud-sync/RosterCloudSyncProvider.tsx";
import { useUserPreferences } from "../../state/preference";
import { Roster } from "../../types/roster.ts";
import { RosterBreadcrumbs } from "./RosterBreadcrumbs.tsx";
import { RosterFloatingButton } from "./RosterFloatingButton.tsx";
import { RosterSidebarButton } from "./RosterSidebarButton.tsx";
import { StartGameButton } from "./StartGameButton.tsx";

export const RosterData = ({ roster }: { roster: Roster }) => {
  const prevRoster = useRef<typeof roster>();
  const firstRenderRef = useRef(true);

  const warnings = useRosterWarnings();
  const screen = useScreenSize();
  const { sync } = useRosterSync();
  const displayMobileToolbar = useUserPreferences(
    ({ preferences }) => preferences.mobileRosterToolbar,
  );
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const toolbarsActive = [displayMobileToolbar, warnings.length > 0].filter(
    (value) => value === true,
  ).length;

  useEffect(() => {
    function openMenuDrawer(event: OpenNavigationDrawerEvent) {
      setNavDrawerOpen(event.open);
    }

    window.addEventListener("mlb-event--open-nav-bar", openMenuDrawer);
    return () =>
      window.removeEventListener("mlb-event--open-nav-bar", openMenuDrawer);
  }, []);

  useEffect(() => {
    if (!roster) return;

    if (
      prevRoster.current !== undefined &&
      roster !== prevRoster.current &&
      !firstRenderRef.current
    ) {
      sync(roster);
    }

    prevRoster.current = roster;
    firstRenderRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roster]);

  return (
    <>
      <Stack
        sx={{
          position: "fixed",
          width: `calc(100% - ${navDrawerOpen ? 320 : 56}px)`,
          transition: "width 0.3s ease",
          zIndex: "100",
        }}
      >
        {displayMobileToolbar && <MobileRosterInfoToolbar />}
        {warnings.length > 0 && <MobileRosterWarningsToolbar />}
      </Stack>
      <Container
        maxWidth={false}
        sx={{
          p: 2,
          pt:
            !screen.isDesktop && toolbarsActive > 0
              ? `calc(${ROSTER_INFO_BAR_HEIGHT}px * ${toolbarsActive} + 1rem)`
              : 2,
        }}
      >
        <Box
          sx={{
            width: screen.isDesktop ? `calc(100% - ${drawerWidth}ch)` : "100%",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <RosterBreadcrumbs roster={roster} />
            <Stack gap={2} direction="row">
              <StartGameButton roster={roster} />
              <RosterSidebarButton />
            </Stack>
          </Stack>
          <WarbandList warbands={roster.warbands} />
        </Box>
        <RosterInfoDrawer roster={roster} editable={true} />
        <RosterFloatingButton roster={roster} />
      </Container>
    </>
  );
};
