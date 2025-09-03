import { Button, DialogActions, DialogContent, TextField } from "@mui/material";
import { useState } from "react";
import { useApi } from "../../../hooks/cloud-sync/useApi.ts";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";
import { Roster } from "../../../types/roster.ts";
import { slugify, withSuffix } from "../../../utils/string.ts";
import {
  GroupIconSelector,
  Option as IconOption,
} from "../../common/group-icon/GroupIconSelector.tsx";

export const CreateNewRosterGroupModal = () => {
  const {
    closeModal,
    modalContext: { rosters = [] },
  } = useAppState();
  const { createGroup } = useRosterBuildingState();
  const { createGroup: remoteCreate } = useApi();

  const [rosterGroupName, setRosterGroupName] = useState("");
  const [rosterGroupNameValid, setRosterGroupNameValid] = useState(true);
  const [rosterGroupIcon, setRosterGroupIcon] = useState<IconOption>({
    name: "",
  } as IconOption);

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
      const group = {
        name: rosterGroupNameValue,
        slug: withSuffix(slugify(rosterGroupNameValue)),
        rosters: rosters.map((roster: Roster) => roster.id),
        icon: rosterGroupIcon?.name,
      };
      const id = createGroup(group);
      remoteCreate({ id, ...group });

      closeModal();
    }
  }

  return (
    <>
      <DialogContent sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
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
        <GroupIconSelector
          selectedIcon={rosterGroupIcon}
          setSelectedIcon={setRosterGroupIcon}
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
