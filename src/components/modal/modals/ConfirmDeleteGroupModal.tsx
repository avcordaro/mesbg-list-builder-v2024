import { Button, DialogActions, DialogContent, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../hooks/cloud-sync/useApi.ts";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";
import { AlertTypes } from "../../alerts/alert-types.tsx";
import { CustomAlert } from "../../common/alert/CustomAlert.tsx";

export const ConfirmDeleteGroupModal = () => {
  const {
    closeModal,
    modalContext: { groupId, redirect },
    triggerAlert,
  } = useAppState();
  const { deleteGroup, groups, rosters } = useRosterBuildingState();
  const api = useApi();
  const navigate = useNavigate();
  const { id, name } = groups.find((group) => group.slug === groupId) || {};
  const affectedRosters = rosters.filter((roster) => roster.group === id);

  const [rosterGroupName, setRosterGroupName] = useState("");

  const handleConfirmDisband = (e) => {
    e.preventDefault();

    if (id) {
      deleteGroup(id);
      api.deleteGroup(groupId, false);
      if (redirect === true) {
        navigate("/rosters");
      }
      triggerAlert(AlertTypes.DELETE_GROUP_SUCCES);
    } else {
      triggerAlert(AlertTypes.DELETE_GROUP_FAILED);
    }

    closeModal();
  };

  return (
    <>
      <DialogContent sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
        <CustomAlert severity="warning" title="">
          <Typography>Your are about to delete your roster group!</Typography>
        </CustomAlert>

        {affectedRosters.length > 0 && (
          <CustomAlert severity="error" title="">
            <Typography>
              Deleting this roster group will also delete the{" "}
              {affectedRosters.length === 1
                ? "roster"
                : `${affectedRosters.length} rosters`}{" "}
              inside of it.
            </Typography>
          </CustomAlert>
        )}

        <Typography>
          Confirm the group name to confirm: <br />
          <b>{name}</b>
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
          disabled={name !== rosterGroupName}
          data-test-id="dialog--submit-button"
        >
          Delete group
        </Button>
      </DialogActions>
    </>
  );
};
