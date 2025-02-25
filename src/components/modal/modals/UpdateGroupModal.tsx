import { Button, DialogActions, DialogContent, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";
import { slugify, withSuffix } from "../../../utils/string.ts";
import { AlertTypes } from "../../alerts/alert-types.tsx";
import {
  GroupIconSelector,
  Option as IconOption,
} from "../../common/group-icon/GroupIconSelector.tsx";

export const UpdateGroupModal = () => {
  const {
    closeModal,
    modalContext: { groupId, redirect },
    triggerAlert,
  } = useAppState();
  const { updateGroup, groups } = useRosterBuildingState();
  const { id, name, icon } =
    groups.find((group) => group.slug === groupId) || {};

  const navigate = useNavigate();

  const [rosterGroupName, setRosterGroupName] = useState(name);
  const [rosterGroupNameValid, setRosterGroupNameValid] = useState(true);
  const [rosterGroupIcon, setRosterGroupIcon] = useState<IconOption>({
    name: icon || "",
  } as IconOption);

  const handleUpdateRosterGroup = (e) => {
    e.preventDefault();

    const rosterGroupNameValue = rosterGroupName.trim();
    const nameValid = !!rosterGroupNameValue;
    setRosterGroupNameValid(nameValid);

    if (nameValid) {
      const slug = withSuffix(slugify(rosterGroupNameValue));
      updateGroup(id, {
        name: rosterGroupNameValue,
        slug: slug,
        icon: rosterGroupIcon?.name,
      });
      if (redirect === true) {
        navigate(`/rosters/${slug}`);
      }
      triggerAlert(AlertTypes.UPDATE_GROUP_SUCCES);
      closeModal();
    }
  };

  function updateRosterGroupName(value: string) {
    setRosterGroupName(value);
    setRosterGroupNameValid(true);
  }

  return (
    <>
      <DialogContent sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
        <TextField
          sx={{ mt: 2 }}
          fullWidth
          label="New group name"
          error={!rosterGroupNameValid}
          helperText={
            !rosterGroupNameValid ? "The group name cannot be empty." : ""
          }
          value={rosterGroupName}
          onChange={(e) => updateRosterGroupName(e.target.value)}
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
          onClick={handleUpdateRosterGroup}
          disabled={!rosterGroupNameValid}
          data-test-id="dialog--submit-button"
        >
          Update group
        </Button>
      </DialogActions>
    </>
  );
};
