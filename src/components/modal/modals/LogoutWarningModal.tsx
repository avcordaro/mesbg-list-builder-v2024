import { Button, DialogActions, DialogContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../../state/app";
import { useCollectionState } from "../../../state/collection";
import { useGameModeState } from "../../../state/gamemode";
import { useRecentGamesState } from "../../../state/recent-games";
import { useRosterBuildingState } from "../../../state/roster-building";

export const LogoutWarningModal = () => {
  const { closeModal, modalContext } = useAppState();
  const navigate = useNavigate();

  const resetCollection = useCollectionState((state) => state.reset);
  const resetRostersAndGroups = useRosterBuildingState((state) => state.reset);
  const resetGameMode = useGameModeState((state) => state.reset);
  const resetRecentGames = useRecentGamesState((state) => state.reset);

  const logout = () => {
    modalContext.signOut().then(async () => {
      await navigate("/sign-in", { state: { allowNavigation: true } });
      resetCollection();
      resetGameMode();
      resetRostersAndGroups();
      resetRecentGames();
    });

    closeModal();
  };

  return (
    <>
      <DialogContent>
        <Typography>
          Logging out will clear the app’s data from this device. Don’t
          worry—your information is safely stored in your account and will be
          restored when you log back in.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={closeModal}
          sx={{ minWidth: "20ch" }}
          data-test-id="dialog--cancel-button"
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          color="warning"
          onClick={logout}
          sx={{ minWidth: "20ch" }}
          data-test-id="dialog--submit-button"
        >
          Logout
        </Button>
      </DialogActions>
    </>
  );
};
