import { Button, DialogActions, DialogContent, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNewRosterBuilder } from "../../../hooks/new-roster/useNewRosterBuilder.ts";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";
import { CustomAlert } from "../../atoms/alert/CustomAlert.tsx";
import {
  ArmySelectionInput,
  SelectedArmyList,
} from "../../atoms/army-selector/ArmySelectionInput.tsx";
import { AdditionalTagsInput } from "../../atoms/tags-input/TagsInput.tsx";

export const EditRosterModal = () => {
  const {
    closeModal,
    modalContext: { roster },
  } = useAppState();
  const { updateRoster } = useRosterBuildingState();
  const rebuildRoster = useNewRosterBuilder();

  const [rosterName, setRosterName] = useState(roster?.name || "");
  const [rosterNameValid, setRosterNameValid] = useState(true);
  const [armyList, setArmyList] = useState<SelectedArmyList>({
    title: roster.armyList,
    army: roster.armyList,
    type: "",
  });
  const [tags, setTags] = useState(roster.metadata.tags || []);

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
      if (armyList.army === roster.armyList) {
        updateRoster({
          ...roster,
          name: rosterNameValue,
          metadata: {
            ...roster.metadata,
            maxPoints: Number(pointLimit),
            tags,
          },
        });
      } else {
        updateRoster(
          rebuildRoster({
            id: roster.id,
            groupId: roster.group,
            name: rosterNameValue,
            armyList: armyList.army,
            maximumPoints: Number(pointLimit),
            enableSiege: roster.metadata.siegeRoster,
            siegeRole: roster.metadata.siegeRole,
            withHero: armyList.hero,
            tags,
          }),
        );
      }

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
        {armyList.army !== roster.armyList && (
          <Box sx={{ mb: 2 }}>
            <CustomAlert severity="warning" title="Changing the army list">
              <Typography>
                Changing the army list on your roster will reset your current
                selection. You are basically starting over from scratch!
              </Typography>
            </CustomAlert>
          </Box>
        )}

        {roster.armyList.startsWith("Custom:") ? (
          <TextField value={roster.armyList} label="Army" disabled />
        ) : (
          <ArmySelectionInput armyList={armyList} setArmyList={setArmyList} />
        )}

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
        <AdditionalTagsInput values={tags} onChange={setTags} size="medium" />
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
