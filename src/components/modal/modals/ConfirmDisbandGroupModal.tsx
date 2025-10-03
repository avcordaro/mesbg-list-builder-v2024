import { Button, DialogActions, DialogContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../hooks/cloud-sync/useApi.ts";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";
import { RosterGroup } from "../../../state/roster-building/groups";
import { CustomAlert } from "../../atoms/alert/CustomAlert.tsx";
import { AlertTypes } from "../../notifications/alert-types.tsx";

function findDirectSubgroups(
  slug: string,
  groups: RosterGroup[],
): RosterGroup[] {
  return groups.filter((g) => g.parent === slug);
}

export const ConfirmDisbandGroupModal = () => {
  const {
    closeModal,
    modalContext: { groupId, redirect },
    triggerAlert,
  } = useAppState();
  const { disbandGroup, groups, updateGroup } = useRosterBuildingState();
  const api = useApi();
  const group = groups.find((group) => group.slug === groupId);
  const navigate = useNavigate();

  const handleConfirmDisband = async (e) => {
    e.preventDefault();

    if (group) {
      const subgroups = findDirectSubgroups(groupId, groups);
      for (const subgroup of subgroups) {
        if (!group.parent) {
          await api.removeParentGroup(subgroup.slug);
        } else {
          await api.setParentGroup(subgroup.slug, group.parent);
        }
        updateGroup(subgroup.id, { ...subgroup, parent: group.parent });
      }

      await api.deleteGroup(groupId, true);
      disbandGroup(group.id);

      if (redirect === true) {
        navigate("/rosters");
      }
      triggerAlert(AlertTypes.DISBAND_GROUP_SUCCES);
    } else {
      triggerAlert(AlertTypes.DISBAND_GROUP_FAILED);
    }

    closeModal();
  };

  return (
    <>
      <DialogContent sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
        <CustomAlert severity="warning" title="">
          <Typography>Your are about to disband your roster group!</Typography>
        </CustomAlert>

        <CustomAlert severity="info" title="">
          <Typography>
            Disbanding a roster group means the rosters and subgroups inside
            this group will be moved to their parent group.{" "}
            <strong>They will not be deleted!</strong>
          </Typography>
        </CustomAlert>
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
          data-test-id="dialog--submit-button"
        >
          Disband group
        </Button>
      </DialogActions>
    </>
  );
};
