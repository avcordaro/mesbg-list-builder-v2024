import {
  Close,
  Download,
  History,
  Info,
  Print,
  Redo,
  Undo,
  WarningRounded,
} from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import {
  Badge,
  Breadcrumbs,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import { FaChessRook } from "react-icons/fa";
import { GiRollingDices } from "react-icons/gi";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "../components/common/link/Link.tsx";
import {
  RosterInfoDrawer,
  drawerWidth,
} from "../components/common/roster-info/RosterInfoDrawer.tsx";
import {
  MobileRosterInfoToolbar,
  ROSTER_INFO_BAR_HEIGHT,
} from "../components/common/toolbar/MobileRosterInfoToolbar.tsx";
import { MobileRosterWarningsToolbar } from "../components/common/toolbar/MobileRosterWarningsToolbar.tsx";
import { WarbandList } from "../components/common/warbands/WarbandList.tsx";
import { ModalTypes } from "../components/modal/modals.tsx";
import { OpenNavigationDrawerEvent } from "../events/OpenNavigationDrawerEvent.ts";
import { useRosterInformation } from "../hooks/calculations-and-displays/useRosterInformation.ts";
import { useRosterWarnings } from "../hooks/calculations-and-displays/useRosterWarnings.ts";
import { useScreenSize } from "../hooks/calculations-and-displays/useScreenSize.ts";
import { useRosterSync } from "../hooks/cloud-sync/RosterCloudSyncProvider.tsx";
import { useApi } from "../hooks/cloud-sync/useApi.ts";
import { useAppState } from "../state/app";
import { useGameModeState } from "../state/gamemode";
import { useUserPreferences } from "../state/preference";
import {
  useRosterBuildingState,
  useTemporalRosterBuildingState,
} from "../state/roster-building";
import { useThemeContext } from "../theme/ThemeContext.tsx";

export const Roster = () => {
  const screen = useScreenSize();
  const { mode } = useThemeContext();
  const sync = useRosterSync();
  const api = useApi();
  const { undo, redo, pastStates, futureStates, clear } =
    useTemporalRosterBuildingState((state) => state);
  const { rosterId } = useParams();
  const { roster } = useRosterInformation();
  const { groups } = useRosterBuildingState();
  const [startNewGame, hasStartedGame] = useGameModeState((state) => [
    state.startNewGame,
    state.gameState[roster.id],
  ]);
  const group = roster.group && groups.find(({ id }) => roster.group === id);
  const { setCurrentModal } = useAppState();
  const displayMobileToolbar = useUserPreferences(
    ({ preferences }) => preferences.mobileRosterToolbar,
  );
  const navigate = useNavigate();
  const warnings = useRosterWarnings();

  const speedDialRef = useRef<HTMLDivElement | null>(null);
  const [fabOpen, setFabOpen] = useState(false);
  const [redoOpen, setRedoOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => clear());
  }, [rosterId, clear]);

  useEffect(() => {
    if (!roster) return () => {};
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey) return;

      if (event.key === "z" && !event.shiftKey) undo();
      else if (event.key === "y" || (event.shiftKey && event.key === "z"))
        redo();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, roster]);

  useEffect(() => {
    function openMenuDrawer(event: OpenNavigationDrawerEvent) {
      setNavDrawerOpen(event.open);
    }

    window.addEventListener("mlb-event--open-nav-bar", openMenuDrawer);
    return () =>
      window.removeEventListener("mlb-event--open-nav-bar", openMenuDrawer);
  }, []);

  useEffect(() => {
    if (roster) sync(roster);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roster]);

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

  const actions = [
    {
      icon: <SaveIcon />,
      name: "Export roster",
      callback: () => setCurrentModal(ModalTypes.EXPORT_ROSTER),
      disabled: roster.metadata.units === 0,
    },
    {
      icon: <Download />,
      name: "Download profile cards",
      callback: () => setCurrentModal(ModalTypes.DOWNLOAD_PROFILE_CARDS),
      disabled: roster.metadata.units === 0,
    },
    {
      icon: <Print />,
      name: "Open Printable PDF view",
      callback: () => navigate(`/roster/${rosterId}/pdf-printable`),
      disabled: roster.metadata.units === 0,
    },
    {
      icon: <GiRollingDices size="1.8rem" />,
      name: "Tabletop Simulator Export",
      callback: () => setCurrentModal(ModalTypes.TABLETOP_SIM_EXPORT),
      disabled: roster.metadata.units === 0,
    },
    {
      icon: <ShareIcon />,
      name: "Roster summary & sharing",
      callback: () => setCurrentModal(ModalTypes.ROSTER_SUMMARY),
      disabled: roster.metadata.units === 0,
    },
  ];

  const toolbarsActive = [displayMobileToolbar, warnings.length > 0].filter(
    (value) => value === true,
  ).length;

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
            <Breadcrumbs sx={{ mb: 1 }}>
              <Link
                to="/rosters"
                style={{
                  textDecoration: "none",
                }}
              >
                My Rosters
              </Link>
              {group && (
                <Link
                  to={`/rosters/${group.slug}`}
                  style={{
                    textDecoration: "none",
                  }}
                >
                  {group.name}
                </Link>
              )}
              <Typography sx={{ color: "text.secondary" }}>
                {roster.name}
              </Typography>
            </Breadcrumbs>

            <Stack gap={2} direction="row">
              <Button
                color="primary"
                variant="contained"
                aria-label="open drawer"
                onClick={() => {
                  if (!hasStartedGame) {
                    const game = startNewGame(roster);
                    api.createGamestate(roster.id, game);
                  }
                  navigate(`/gamemode/${rosterId}`);
                }}
                startIcon={<FaChessRook />}
                sx={{
                  whiteSpace: "nowrap", // Prevent text from wrapping
                  minWidth: "20ch",
                }}
              >
                {hasStartedGame ? "Continue" : "Start"} Game
              </Button>

              {screen.isMobile ? (
                <IconButton
                  aria-label="open drawer"
                  onClick={() =>
                    window.dispatchEvent(
                      new Event("mlb-event--open-roster-info"),
                    )
                  }
                  sx={
                    warnings.length > 0
                      ? {
                          backgroundColor: (theme) => theme.palette.error.main,
                          color: (theme) => theme.palette.error.contrastText,
                          "&:hover": {
                            backgroundColor: (theme) =>
                              theme.palette.error.light,
                          },
                        }
                      : {
                          backgroundColor: (theme) =>
                            theme.palette.success.main,
                          color: (theme) => theme.palette.success.contrastText,
                          "&:hover": {
                            backgroundColor: (theme) =>
                              theme.palette.success.light,
                          },
                        }
                  }
                >
                  {warnings.length > 0 ? <WarningRounded /> : <Info />}
                </IconButton>
              ) : !screen.isDesktop ? (
                <Button
                  color={warnings.length > 0 ? "error" : "success"}
                  variant="contained"
                  aria-label="open drawer"
                  onClick={() =>
                    window.dispatchEvent(
                      new Event("mlb-event--open-roster-info"),
                    )
                  }
                  startIcon={
                    warnings.length > 0 ? <WarningRounded /> : <Info />
                  }
                  sx={{
                    whiteSpace: "nowrap", // Prevent text from wrapping
                  }}
                >
                  Roster information
                </Button>
              ) : null}
            </Stack>
          </Stack>

          <WarbandList warbands={roster.warbands} />
        </Box>
        <RosterInfoDrawer roster={roster} editable={true} />
        <Box ref={speedDialRef}>
          <SpeedDial
            ariaLabel="action-buttons"
            sx={{
              position: "fixed",
              bottom: 16,
              right: screen.isDesktop ? `calc(${drawerWidth}ch + 16px)` : 16,
            }}
            icon={<SpeedDialIcon icon={<ShareIcon />} openIcon={<Close />} />}
            open={fabOpen}
            onClick={() => {
              setFabOpen((x) => !x);
              setRedoOpen(false);
            }}
            onClose={null}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                onClick={() => {
                  if (!action.disabled) action.callback();
                }}
                FabProps={{ disabled: action.disabled }}
                tooltipTitle={
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      color: mode === "dark" ? "white" : "inherit",
                    }}
                  >
                    {" "}
                    {action.name}{" "}
                  </span>
                }
                tooltipOpen
              />
            ))}
          </SpeedDial>

          <SpeedDial
            ariaLabel="action-buttons"
            sx={{
              position: "fixed",
              bottom: 80,
              right: { xl: `calc(${drawerWidth}ch + 16px)`, xs: 16 },
            }}
            icon={<SpeedDialIcon icon={<History />} openIcon={<Close />} />}
            open={redoOpen}
            onClick={() => setRedoOpen((x) => !x)}
            hidden={
              fabOpen || (pastStates.length === 0 && futureStates.length === 0)
            }
            FabProps={{
              sx: {
                color: "black",
                bgcolor: "whitesmoke",
              },
            }}
          >
            <SpeedDialAction
              icon={
                <Badge
                  badgeContent={pastStates.length}
                  color="primary"
                  sx={{
                    p: 1,
                  }}
                >
                  <Undo />
                </Badge>
              }
              onClick={(e) => {
                e.stopPropagation();
                if (pastStates.length > 0) undo();
              }}
              FabProps={{ disabled: pastStates.length === 0 }}
              tooltipTitle={
                <span
                  style={{
                    whiteSpace: "nowrap",
                    color: mode === "dark" ? "white" : "inherit",
                  }}
                >
                  Undo{" "}
                  {screen.isDesktop && (
                    <small>
                      <i>[Ctrl + Z]</i>
                    </small>
                  )}
                </span>
              }
              tooltipOpen
            />
            <SpeedDialAction
              icon={
                <Badge
                  badgeContent={futureStates.length}
                  color="primary"
                  sx={{
                    p: 1,
                  }}
                >
                  <Redo />
                </Badge>
              }
              onClick={(e) => {
                e.stopPropagation();
                if (futureStates.length > 0) redo();
              }}
              FabProps={{ disabled: futureStates.length === 0 }}
              tooltipTitle={
                <span
                  style={{
                    whiteSpace: "nowrap",
                    color: mode === "dark" ? "white" : "inherit",
                  }}
                >
                  Redo{" "}
                  {screen.isDesktop && (
                    <small>
                      <i>[Ctrl + Y]</i>
                    </small>
                  )}
                </span>
              }
              tooltipOpen
            />
          </SpeedDial>
        </Box>
      </Container>
    </>
  );
};
