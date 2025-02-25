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
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "../../components/common/link/Link.tsx";
import { WarbandList } from "../../components/common/warbands/WarbandList.tsx";
import { ModalTypes } from "../../components/modal/modals.tsx";
import { useRosterInformation } from "../../hooks/useRosterInformation.ts";
import { useRosterWarnings } from "../../hooks/useRosterWarnings.ts";
import { useScreenSize } from "../../hooks/useScreenSize.ts";
import { useAppState } from "../../state/app";
import { useUserPreferences } from "../../state/preference";
import {
  useRosterBuildingState,
  useTemporalRosterBuildingState,
} from "../../state/roster-building";
import { useThemeContext } from "../../theme/ThemeContext.tsx";
import {
  MobileRosterInfoToolbar,
  ROSTER_INFO_BAR_HEIGHT,
} from "./MobileRosterInfoToolbar.tsx";
import { RosterInfoDrawer, drawerWidth } from "./RosterInfoDrawer.tsx";

export const Roster = () => {
  const screen = useScreenSize();
  const { mode } = useThemeContext();
  const { undo, redo, pastStates, futureStates, clear } =
    useTemporalRosterBuildingState((state) => state);
  const { rosterId } = useParams();
  const { roster } = useRosterInformation();
  const { groups } = useRosterBuildingState();
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
      icon: <ShareIcon />,
      name: "Roster summary & sharing",
      callback: () => setCurrentModal(ModalTypes.ROSTER_SUMMARY),
      disabled: roster.metadata.units === 0,
    },
  ];

  return (
    <>
      {displayMobileToolbar && <MobileRosterInfoToolbar />}
      <Container
        maxWidth={false}
        sx={{
          p: 2,
          pt:
            !screen.isDesktop && displayMobileToolbar
              ? `calc(${ROSTER_INFO_BAR_HEIGHT}px + 1rem)`
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

            {screen.isMobile ? (
              <IconButton
                aria-label="open drawer"
                onClick={() =>
                  window.dispatchEvent(new Event("mlb-event--open-roster-info"))
                }
                sx={
                  warnings.length > 0
                    ? {
                        backgroundColor: (theme) => theme.palette.error.main,
                        color: (theme) => theme.palette.error.contrastText,
                        "&:hover": {
                          backgroundColor: (theme) => theme.palette.error.light,
                        },
                      }
                    : {
                        backgroundColor: (theme) => theme.palette.success.main,
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
                  window.dispatchEvent(new Event("mlb-event--open-roster-info"))
                }
                startIcon={warnings.length > 0 ? <WarningRounded /> : <Info />}
                sx={{
                  whiteSpace: "nowrap", // Prevent text from wrapping
                }}
              >
                Roster information
              </Button>
            ) : null}
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
