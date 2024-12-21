import { Button, DialogActions, DialogContent } from "@mui/material";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";
import { AlertTypes } from "../../alerts/alert-types.tsx";

export const ConfirmDeleteRosterModal = () => {
  const {
    closeModal,
    modalContext: { roster, manualRedirect },
    triggerAlert,
  } = useAppState();
  const { deleteRoster } = useRosterBuildingState();
  const navigate = useNavigate();

  const handleConfirmDelete = (e) => {
    e.preventDefault();

    deleteRoster(roster);
    if (manualRedirect !== true) {
      navigate("/rosters");
    }
    triggerAlert(AlertTypes.DELETE_ARMY_LIST_SUCCESS);
    closeModal();
  };

  return (
    <>
      <DialogContent sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
        <Alert severity="warning">
          <Typography>
            Your are about to delete your roster!{" "}
            <b>This action is irreversible.</b> You will have to recreate the
            roster from scratch!
          </Typography>
        </Alert>
      </DialogContent>
      <DialogActions sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="text"
          onClick={closeModal}
          data-test-id="dialog--cancel-button"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirmDelete}
          color="error"
          data-test-id="dialog--submit-button"
        >
          Delete roster
        </Button>
      </DialogActions>
    </>
  );
};
