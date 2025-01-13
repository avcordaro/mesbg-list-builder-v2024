import { Delete, DeleteForever, Edit } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ListItemIcon } from "@mui/material";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, MouseEvent } from "react";
import { SquareIconButton } from "../../../components/common/icon-button/SquareIconButton.tsx";
import { ModalTypes } from "../../../components/modal/modals.tsx";
import { useAppState } from "../../../state/app";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";

export const GroupOptionsPopoverMenu = ({
  groupId,
  redirect,
}: {
  groupId: string;
  redirect?: boolean;
}) => {
  const { mode } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { setCurrentModal } = useAppState();
  const open = Boolean(anchorEl);
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

  const handleUpdateGroup = (event: MouseEvent<HTMLElement>) => {
    setCurrentModal(ModalTypes.UPDATE_ROSTER_GROUP, { groupId, redirect });
    handleClose(event);
  };
  const handleDisband = (event: MouseEvent<HTMLElement>) => {
    setCurrentModal(ModalTypes.DISBAND_ROSTER_GROUP, { groupId, redirect });
    handleClose(event);
  };
  const handleDelete = (event: MouseEvent<HTMLElement>) => {
    setCurrentModal(ModalTypes.DELETE_ROSTER_GROUP, { groupId, redirect });
    handleClose(event);
  };

  return (
    <div>
      <SquareIconButton
        aria-label="more"
        aria-controls={open ? "menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        icon={<MoreVertIcon />}
        iconColor={mode === "dark" ? "white" : "black"}
        backgroundColor="inherit"
        backgroundColorHover="inherit"
      />
      <Menu id="menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleUpdateGroup}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText> Rename group</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDisband}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText> Disband group</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteForever fontSize="small" />
          </ListItemIcon>
          <ListItemText> Delete group</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};
