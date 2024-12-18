import { Button, DialogActions, DialogContent, TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";

export const CreateNewRosterGroupModal = () => {
  const {
    closeModal,
    modalContext: { rosters = [] },
  } = useAppState();
  const { updateRoster } = useRosterBuildingState();

  const [rosterGroupName, setRosterGroupName] = useState("");
  const [rosterGroupNameValid, setRosterGroupNameValid] = useState(true);

  function updateRosterName(name: string) {
    setRosterGroupName(name);
    setRosterGroupNameValid(true);
  }

  function handleCreateNewRosterGroup(e) {
    e.preventDefault();

    const rosterGroupNameValue = rosterGroupName.trim();
    const nameValid = !!rosterGroupNameValue;

    setRosterGroupNameValid(nameValid);

    if (nameValid) {
      rosters.forEach((roster) => {
        updateRoster({
          ...roster,
          group: rosterGroupNameValue,
        });
      });

      closeModal();
    }
  }

  return (
    <>
      <DialogContent sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
        <Alert severity="info" icon={false}>
          Choose a name for your roster group. Keep in mind that reusing an
          existing name will add the rosters to that group instead!
        </Alert>

        <TextField
          fullWidth
          label="Group name"
          error={!rosterGroupNameValid}
          helperText={
            !rosterGroupNameValid ? "Group name cannot be empty." : ""
          }
          value={rosterGroupName}
          onChange={(e) => updateRosterName(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="text"
          color="inherit"
          onClick={closeModal}
          sx={{ minWidth: "20ch" }}
          data-test-id="dialog--cancel-button"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleCreateNewRosterGroup}
          disabled={!rosterGroupNameValid}
          data-test-id="dialog--submit-button"
        >
          Create group
        </Button>
      </DialogActions>
    </>
  );
};
