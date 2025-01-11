import { Button, DialogActions, DialogContent, TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";

export const EditRosterModal = () => {
  const {
    closeModal,
    modalContext: { roster },
  } = useAppState();
  const { updateRoster } = useRosterBuildingState();

  const [rosterName, setRosterName] = useState(roster?.name || "");
  const [rosterNameValid, setRosterNameValid] = useState(true);

  const [rosterPointsLimit, setRosterPointsLimit] = useState(
    roster?.metadata.maxPoints ? String(roster.metadata.maxPoints) : "",
  );
  const [rosterPointsLimitValid, setRosterPointsLimitValid] = useState(true);

  const handleUpdateRoster = (e) => {
    e.preventDefault();

    const rosterNameValue = rosterName.trim();
    const nameValid = !!rosterNameValue;
    setRosterNameValid(nameValid);

    const pointLimit = rosterPointsLimit.trim();
    const pointLimitValid = !pointLimit || Number(pointLimit) > 0;
    setRosterPointsLimitValid(pointLimitValid);

    if (nameValid && pointLimitValid) {
      updateRoster({
        ...roster,
        name: rosterNameValue,
        metadata: {
          ...roster.metadata,
          maxPoints: Number(pointLimit),
        },
      });
      closeModal();
    }
  };

  function updateRosterName(value: string) {
    setRosterName(value);
    setRosterNameValid(true);
  }

  function updateRosterPointsLimit(value: string) {
    setRosterPointsLimit(value);
    setRosterPointsLimitValid(true);
  }

  return (
    <>
      <DialogContent sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography>
            You can change the name of your roster. The ID, and thus the URL to
            your roster, will remain unchanged!
          </Typography>
        </Alert>

        <TextField value={roster.armyList} label="Army" disabled />
        <TextField
          fullWidth
          label="Roster name"
          error={!rosterNameValid}
          helperText={
            !rosterNameValid
              ? "Roster name cannot be empty and must be unique."
              : ""
          }
          value={rosterName}
          onChange={(e) => updateRosterName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Points limit (optional)"
          error={!rosterPointsLimitValid}
          helperText={
            !rosterPointsLimitValid
              ? "The roster points limit needs to be above 0"
              : ""
          }
          value={rosterPointsLimit}
          onChange={(e) => updateRosterPointsLimit(e.target.value)}
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
          onClick={handleUpdateRoster}
          disabled={!rosterNameValid}
          data-test-id="dialog--submit-button"
        >
          Update roster
        </Button>
      </DialogActions>
    </>
  );
};
