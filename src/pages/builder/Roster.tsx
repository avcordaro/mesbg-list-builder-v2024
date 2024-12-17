import { Close, Download, History, Redo, Undo } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import {
  Badge,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { RosterInformation } from "../../components/common/roster-info/RosterInformation.tsx";
import { WarbandList } from "../../components/common/warbands/WarbandList.tsx";
import { ModalTypes } from "../../components/modal/modals.tsx";
import { useRosterInformation } from "../../hooks/useRosterInformation.ts";
import { useScreenSize } from "../../hooks/useScreenSize.ts";
import { DrawerHeader } from "../../layout/Navigation.tsx";
import { useAppState } from "../../state/app";
import { useTemporalRosterBuildingState } from "../../state/roster-building";
import {
  MobileRosterInfoToolbar,
  ROSTER_INFO_BAR_HEIGHT,
} from "./MobileRosterInfoToolbar.tsx";

const drawerWidth = 55;

export const Roster = () => {
  const screen = useScreenSize();
  const { undo, redo, pastStates, futureStates, clear } =
    useTemporalRosterBuildingState((state) => state);
  const { id } = useParams();
  const { roster } = useRosterInformation();
  const { setCurrentModal } = useAppState();

  const speedDialRef = useRef<HTMLDivElement | null>(null);
  const [fabOpen, setFabOpen] = useState(false);
  const [redoOpen, setRedoOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => clear());
  }, [id, clear]);

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
    if (!roster) return () => {};
    const handleOpenRosterInfo = () => {
      setInfoOpen(true);
    };

    window.addEventListener(
      "mlb-event--open-roster-info",
      handleOpenRosterInfo,
    );
    return () =>
      window.removeEventListener(
        "mlb-event--open-roster-info",
        handleOpenRosterInfo,
      );
  }, [undo, redo, roster]);

  if (!roster) {
    return (
      <>
        <Typography variant="h4" className="middle-earth">
          Roster not found!
        </Typography>
        <Typography sx={{ mb: 2 }}>
          One does not simply navigate to a roster that does not exist.
        </Typography>

        <Typography>
          Please navigate back to the roster overview and select a roster from
          there.
        </Typography>
      </>
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
      icon: <Download />,
      name: "Download Printable PDF",
      callback: () => setCurrentModal(ModalTypes.DOWNLOAD_REFERENCE_PDF),
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
      <MobileRosterInfoToolbar />
      <Container
        maxWidth={false}
        sx={{
          p: 2,
          pt: screen.isDesktop ? 2 : `calc(${ROSTER_INFO_BAR_HEIGHT}px + 1rem)`,
        }}
      >
        <Box
          sx={{
            width: screen.isDesktop ? `calc(100% - ${drawerWidth}ch)` : "100%",
          }}
        >
          <WarbandList warbands={roster.warbands} />
        </Box>
        <Drawer
          variant={screen.getSize() === "desktop" ? "permanent" : "temporary"}
          anchor="right"
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: `${drawerWidth}ch`,
            },
          }}
          open={infoOpen}
        >
          {screen.isDesktop && <DrawerHeader />}
          <RosterInformation
            roster={roster}
            onClose={() => setInfoOpen(false)}
          />
        </Drawer>
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
                  <span style={{ whiteSpace: "nowrap" }}> {action.name} </span>
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
                bgcolor: "background.default",
                "&:hover": {
                  bgcolor: "background.default",
                },
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
                <span style={{ whiteSpace: "nowrap" }}>
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
                <span style={{ whiteSpace: "nowrap" }}>
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
