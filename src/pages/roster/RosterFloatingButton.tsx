import {
  Close,
  Download,
  History,
  Print,
  Redo,
  Undo,
} from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import {
  Badge,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect, useRef, useState } from "react";
import { GiRollingDices } from "react-icons/gi";
import { useNavigate, useParams } from "react-router-dom";
import { drawerWidth } from "../../components/common/roster-info/RosterInfoDrawer.tsx";
import { ModalTypes } from "../../components/modal/modals.tsx";
import { useScreenSize } from "../../hooks/calculations-and-displays/useScreenSize.ts";
import { useRosterSync } from "../../hooks/cloud-sync/RosterCloudSyncProvider.tsx";
import { useAppState } from "../../state/app";
import { useTemporalRosterBuildingState } from "../../state/roster-building";
import { useThemeContext } from "../../theme/ThemeContext.tsx";
import { Roster as RosterType } from "../../types/roster.ts";

export const RosterFloatingButton = ({ roster }: { roster: RosterType }) => {
  const navigate = useNavigate();
  const screen = useScreenSize();
  const { mode } = useThemeContext();
  const { syncPending } = useRosterSync();
  const { setCurrentModal } = useAppState();
  const { undo, redo, pastStates, futureStates, clear } =
    useTemporalRosterBuildingState((state) => state);
  const { rosterId } = useParams();

  const speedDialRef = useRef<HTMLDivElement | null>(null);
  const [fabOpen, setFabOpen] = useState(false);
  const [redoOpen, setRedoOpen] = useState(false);

  const actions = [
    {
      icon: <SaveIcon />,
      name: "Export roster",
      callback: () => setCurrentModal(ModalTypes.EXPORT_ROSTER, { roster }),
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
      callback: () =>
        setCurrentModal(ModalTypes.TABLETOP_SIM_EXPORT, { roster }),
      disabled: roster.metadata.units === 0,
    },
    {
      icon: <ShareIcon />,
      name: "Roster summary & sharing",
      callback: () => setCurrentModal(ModalTypes.ROSTER_SUMMARY, { roster }),
      disabled: roster.metadata.units === 0,
    },
  ];

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

  return (
    <Box ref={speedDialRef}>
      <SpeedDial
        ariaLabel="share-buttons"
        sx={{
          position: "fixed",
          bottom: syncPending && screen.isMobile ? 62 : 16,
          right: screen.isDesktop ? `calc(${drawerWidth}ch + 16px)` : 16,
          transition: "bottom 0.3s",
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
        ariaLabel="undo-buttons"
        sx={{
          position: "fixed",
          bottom: syncPending && screen.isMobile ? 62 : 16,
          right: { xl: `calc(${drawerWidth}ch + 80px)`, xs: 80 },
          transition: "bottom 0.3s",
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
  );
};
