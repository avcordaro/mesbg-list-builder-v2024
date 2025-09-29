import { CreateNewFolderOutlined, PlaylistAdd } from "@mui/icons-material";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import Box from "@mui/material/Box";
import { FunctionComponent, useRef, useState } from "react";
import { useAppState } from "../../../state/app";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";
import { ModalTypes } from "../../modal/modals.tsx";

export const NewRosterButton: FunctionComponent = () => {
  const { setCurrentModal } = useAppState();
  const { mode } = useThemeContext();

  const speedDialRef = useRef<HTMLDivElement | null>(null);
  const [fabOpen, setFabOpen] = useState(false);

  return (
    <Box ref={speedDialRef}>
      <SpeedDial
        ariaLabel="action-buttons"
        sx={{ position: "fixed", bottom: 32, right: 32 }}
        icon={<SpeedDialIcon />}
        open={fabOpen}
        onClick={() => setFabOpen((x) => !x)}
        onClose={null}
      >
        <SpeedDialAction
          icon={<CreateNewFolderOutlined />}
          onClick={() => setCurrentModal(ModalTypes.CREATE_ROSTER_GROUP, {})}
          tooltipTitle={
            <span
              style={{
                whiteSpace: "nowrap",
                color: mode === "dark" ? "white" : "inherit",
              }}
            >
              Create Group
            </span>
          }
          tooltipOpen
        />
        <SpeedDialAction
          icon={<PlaylistAdd />}
          onClick={() => setCurrentModal(ModalTypes.CREATE_NEW_ROSTER)}
          tooltipTitle={
            <span
              style={{
                whiteSpace: "nowrap",
                color: mode === "dark" ? "white" : "inherit",
              }}
            >
              Create Roster
            </span>
          }
          tooltipOpen
        />
      </SpeedDial>
    </Box>
  );
};
