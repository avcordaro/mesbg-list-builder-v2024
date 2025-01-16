import { DeleteForever, Edit, MoreVert, Save } from "@mui/icons-material";
import { InputAdornment, ListItemIcon, Stack, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { MouseEvent, useState } from "react";
import { SquareIconButton } from "../../../../components/common/icon-button/SquareIconButton.tsx";
import { useThemeContext } from "../../../../theme/ThemeContext.tsx";

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

interface TrackerLabelProps {
  label?: string;
  openMenu?: (event: React.MouseEvent<HTMLElement>) => void;
  closeMenu?: (event: React.MouseEvent<HTMLElement>) => void;
  toggleEditMode?: (event: React.MouseEvent<HTMLElement>) => void;
  menuOpen?: boolean;
  removeTracker?: () => void;
  menuAnchorRef?: HTMLElement;
}

const TrackerLabel = ({
  label,
  openMenu,
  closeMenu,
  toggleEditMode,
  menuOpen,
  removeTracker,
  menuAnchorRef,
}: TrackerLabelProps) => {
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
        {removeTracker && (
          <MenuItem onClick={removeTracker}>
            <ListItemIcon>
              <DeleteForever fontSize="small" />
            </ListItemIcon>
            <ListItemText> Remove tracker</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Stack>
  );
};

export const EditableTrackerLabel = ({
  label,
  updateLabel,
  removeTracker,
}: {
  label: string;
  updateLabel: (newLabel: string) => void;
  removeTracker?: () => void;
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

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
    <>
      {editMode ? (
        <EditTrackerLabel
          value={label}
          updateTrackerLabel={updateLabel}
          save={toggleEditLabelMode}
        />
      ) : (
        <TrackerLabel
          label={label}
          menuOpen={open}
          openMenu={handleClick}
          closeMenu={handleClose}
          menuAnchorRef={anchorEl}
          toggleEditMode={toggleEditLabelMode}
          removeTracker={removeTracker}
        />
      )}
    </>
  );
};
