import { Button, DialogActions, DialogContent, TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";
import { AlertTypes } from "../../alerts/alert-types.tsx";

export const ConfirmDeleteGroupModal = () => {
  const {
    closeModal,
    modalContext: { groupId, redirect },
    triggerAlert,
  } = useAppState();
  const { deleteRoster, rosters } = useRosterBuildingState();
  const navigate = useNavigate();

  const affectedRosters = rosters.filter((roster) => roster.group === groupId);

  const [rosterGroupName, setRosterGroupName] = useState("");

  const handleConfirmDisband = (e) => {
    e.preventDefault();

    affectedRosters.forEach((roster) => {
      deleteRoster(roster);
    });
    if (redirect !== true) {
      navigate("/rosters");
    }
    triggerAlert(AlertTypes.DELETE_GROUP_SUCCES);
    closeModal();
  };

  return (
    <>
      <DialogContent sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
        <Alert severity="warning">
          <Typography>Your are about to delete your roster group!</Typography>
        </Alert>

        {affectedRosters.length > 0 && (
          <Alert severity="error">
            <Typography>
              Deleting this roster group will also delete the{" "}
              {affectedRosters.length === 1
                ? "roster"
                : `${affectedRosters.length} rosters`}{" "}
              inside of it.
            </Typography>
          </Alert>
        )}

        <Typography>
          Confirm the group name to confirm: <br />
          <b>{groupId}</b>
        </Typography>
        <TextField
          fullWidth
          label="Confirm Group name"
          value={rosterGroupName}
          onChange={(e) => setRosterGroupName(e.target.value)}
          sx={{ mt: 1 }}
        />
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
          onClick={handleConfirmDisband}
          color="error"
          disabled={groupId !== rosterGroupName}
          data-test-id="dialog--submit-button"
        >
          Delete group
        </Button>
      </DialogActions>
    </>
  );
};
