import { Button, DialogActions, DialogContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";
import { AlertTypes } from "../../alerts/alert-types.tsx";
import { CustomAlert } from "../../common/alert/CustomAlert.tsx";

export const ConfirmDisbandGroupModal = () => {
  const {
    closeModal,
    modalContext: { groupId, redirect },
    triggerAlert,
  } = useAppState();
  const { disbandGroup, groups } = useRosterBuildingState();
  const id = groups.find((group) => group.slug === groupId)?.id;
  const navigate = useNavigate();

  const handleConfirmDisband = (e) => {
    e.preventDefault();

    console.log(id);

    if (id) {
      disbandGroup(id);
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
            Disbanding a roster group means the rosters will be moved back to
            your &apos;My Rosters&apos; page.{" "}
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
