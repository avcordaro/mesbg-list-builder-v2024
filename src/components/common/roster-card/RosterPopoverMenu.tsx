import { DeleteForever, Edit } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ListItemIcon } from "@mui/material";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MouseEvent, useState } from "react";
import { FaChessRook, FaClone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../hooks/cloud-sync/useApi.ts";
import { useAppState } from "../../../state/app";
import { useGameModeState } from "../../../state/gamemode";
import { useRosterBuildingState } from "../../../state/roster-building";
import { Roster } from "../../../types/roster.ts";
import { slugify, withSuffix } from "../../../utils/string.ts";
import { SquareIconButton } from "../../atoms/icon-button/SquareIconButton.tsx";
import { ModalTypes } from "../../modal/modals.tsx";

export const RosterPopoverMenu = (props: { roster: Roster }) => {
  const { setCurrentModal } = useAppState();
  const navigate = useNavigate();
  const api = useApi();
  const { createRoster } = useRosterBuildingState();
  const [startNewGame, hasStartedGame] = useGameModeState((state) => [
    state.startNewGame,
    state.gameState[props.roster.id],
  ]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.bubbles = false;
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.bubbles = false;
    setAnchorEl(null);
  };

  const editRoster = (event: MouseEvent<HTMLElement>) => {
    setCurrentModal(ModalTypes.EDIT_ROSTER_NAME, {
      roster: props.roster,
    });
    handleClose(event);
  };

  const cloneRoster = (event: MouseEvent<HTMLElement>) => {
    const newRoster = {
      ...props.roster,
      id: withSuffix(slugify(props.roster.name)),
      name: "Copy of '" + props.roster.name + "'",
    };

    createRoster(newRoster);
    api.createRoster(newRoster).then(() => {
      if (newRoster.group) api.addRosterToGroup(newRoster.group, newRoster.id);
    });

    handleClose(event);
  };

  const deleteRoster = (event: MouseEvent<HTMLElement>) => {
    setCurrentModal(ModalTypes.CONFIRM_DELETE_ROSTER, {
      roster: props.roster,
      manualRedirect: true,
    });

    handleClose(event);
  };

  const startGame = (event: MouseEvent<HTMLElement>) => {
    if (!hasStartedGame) {
      const game = startNewGame(props.roster);
      api.createGamestate(props.roster.id, game);
    }
    navigate(`/gamemode/${props.roster.id}`);
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
        iconColor="inherit"
        backgroundColor="inherit"
        backgroundColorHover="inherit"
      />
      <Menu id="menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={editRoster}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText> Edit roster</ListItemText>
        </MenuItem>
        <MenuItem onClick={cloneRoster}>
          <ListItemIcon>
            <FaClone />
          </ListItemIcon>
          <ListItemText> Duplicate roster</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={startGame}>
          <ListItemIcon>
            <FaChessRook />
          </ListItemIcon>
          <ListItemText> Start/Continue game</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={deleteRoster}>
          <ListItemIcon>
            <DeleteForever fontSize="small" />
          </ListItemIcon>
          <ListItemText> Delete roster</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};
