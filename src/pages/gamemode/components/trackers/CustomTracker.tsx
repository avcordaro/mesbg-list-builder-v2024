import { DeleteForever, Edit, MoreVert, Save } from "@mui/icons-material";
import {
  InputAdornment,
  ListItemIcon,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { FunctionComponent, MouseEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { SquareIconButton } from "../../../../components/common/icon-button/SquareIconButton.tsx";
import { useScreenSize } from "../../../../hooks/useScreenSize.ts";
import { useGameModeState } from "../../../../state/gamemode";
import { CustomTracker as CustomTrackerType } from "../../../../state/gamemode/gamestate";
import { useThemeContext } from "../../../../theme/ThemeContext.tsx";
import { Counter } from "./Counter.tsx";

type CustomTrackerProps = {
  tracker: CustomTrackerType;
};

export const CustomTracker: FunctionComponent<CustomTrackerProps> = ({
  tracker,
}) => {
  const { rosterId } = useParams();
  const screen = useScreenSize();
  const { gameState, updateGameState } = useGameModeState();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  const open = Boolean(anchorEl);

  // list of all trackers for updating the state without losing data.
  const trackers = gameState[rosterId]?.customTrackers || [];

  const removeTracker = () => {
    updateGameState(rosterId, {
      customTrackers: trackers.filter(({ id }) => tracker.id !== id),
    });
  };

  const updateTrackerValue = (newValue: number) => {
    updateGameState(rosterId, {
      customTrackers: trackers.map((otherTracker) =>
        otherTracker.id !== tracker.id
          ? otherTracker
          : { ...otherTracker, value: newValue },
      ),
    });
  };

  const updateTrackerLabel = (newLabel: string) => {
    updateGameState(rosterId, {
      customTrackers: trackers.map((otherTracker) =>
        otherTracker.id !== tracker.id
          ? otherTracker
          : { ...otherTracker, name: newLabel },
      ),
    });
  };

  const toggleEditLabelMode = (event: MouseEvent<HTMLElement>) => {
    handleClose(event);
    setEditMode(!editMode);
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.bubbles = false;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.bubbles = false;
    setAnchorEl(null);
  };

  return (
    <Paper
      key={tracker.id}
      sx={[
        { p: 0.5, pb: 1.5 },
        screen.isTablet
          ? { flex: "1 1 33%", minWidth: "33%" }
          : { flex: "1 1 25%", minWidth: "25%" },
      ]}
      elevation={5}
    >
      <Stack
        justifyContent={screen.isMobile ? "space-between" : "center"}
        alignItems="center"
        gap={1}
      >
        {tracker.permanent ? (
          <Typography sx={{ fontSize: "1.1rem" }} className="middle-earth">
            {tracker.name}
          </Typography>
        ) : editMode ? (
          <EditTrackerLabel
            value={tracker.name}
            updateTrackerLabel={updateTrackerLabel}
            save={toggleEditLabelMode}
          />
        ) : (
          <EditableTrackerLabel
            label={tracker.name}
            menuOpen={open}
            openMenu={handleClick}
            closeMenu={handleClose}
            menuAnchorRef={anchorEl}
            toggleEditMode={toggleEditLabelMode}
            removeTracker={removeTracker}
          />
        )}
        <Counter
          value={tracker.value}
          maxValue={tracker.maxValue}
          update={updateTrackerValue}
        />
      </Stack>
    </Paper>
  );
};

interface EditTrackerLabelProps {
  value: string;
  updateTrackerLabel: (newLabel: string) => void;
  save: (event: MouseEvent<HTMLElement>) => void;
}

const EditTrackerLabel = ({
  value,
  updateTrackerLabel,
  save,
}: EditTrackerLabelProps) => (
  <TextField
    value={value}
    onChange={(e) => updateTrackerLabel(e.target.value)}
    label="Army"
    size="small"
    sx={{ m: 1, mb: 0 }}
    slotProps={{
      input: {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={save}>
              <Save />
            </IconButton>
          </InputAdornment>
        ),
      },
    }}
  />
);

interface EditableTrackerLabelProps {
  label?: string;
  openMenu?: (event: React.MouseEvent<HTMLElement>) => void;
  closeMenu?: (event: React.MouseEvent<HTMLElement>) => void;
  toggleEditMode?: (event: React.MouseEvent<HTMLElement>) => void;
  menuOpen?: boolean;
  removeTracker?: () => void;
  menuAnchorRef?: HTMLElement;
}

export const EditableTrackerLabel = ({
  label,
  openMenu,
  closeMenu,
  toggleEditMode,
  menuOpen,
  removeTracker,
  menuAnchorRef,
}: EditableTrackerLabelProps) => {
  const { mode } = useThemeContext();

  return (
    <Stack direction="row" gap={1} alignItems="center">
      <Typography sx={{ fontSize: "1.1rem" }} className="middle-earth">
        {label}
      </Typography>
      <SquareIconButton
        aria-label="more"
        aria-controls={open ? "menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={openMenu}
        icon={<MoreVert />}
        iconColor={mode === "dark" ? "white" : "black"}
        backgroundColor="inherit"
        backgroundColorHover="inherit"
      />
      <Menu
        id="menu"
        anchorEl={menuAnchorRef}
        open={menuOpen}
        onClose={closeMenu}
      >
        <MenuItem onClick={toggleEditMode}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText> Rename tracker</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={removeTracker}>
          <ListItemIcon>
            <DeleteForever fontSize="small" />
          </ListItemIcon>
          <ListItemText> Remove tracker</ListItemText>
        </MenuItem>
      </Menu>
    </Stack>
  );
};
