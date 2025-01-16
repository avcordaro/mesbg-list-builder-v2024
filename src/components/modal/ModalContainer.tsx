import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogTitle } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useScreenSize } from "../../hooks/calculations-and-displays/useScreenSize.ts";
import { useAppState } from "../../state/app";
import { slugify } from "../../utils/string.ts";
import { modals } from "./modals.tsx";

export const ModalContainer = () => {
  const state = useAppState();
  const { isMobile } = useScreenSize();

  if (!state.currentlyOpenendModal) {
    // No model is shown, return...
    return null;
  }

  const currentModal = modals.get(state.currentlyOpenendModal);
  const { title, onClose } = state?.modalContext || {};
  return (
    <Dialog
      open={true} // handled by the modal container, so this should always be true
      onClose={onClose ? onClose : () => state.closeModal()}
      scroll="paper"
      disableRestoreFocus
      fullWidth={true}
      maxWidth={currentModal.maxWidth ?? "lg"}
      fullScreen={isMobile}
      data-test-id={`dialog--${slugify(title)}`}
    >
      {!currentModal.customModalHeader && (
        <>
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h5"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
                className="middle-earth"
              >
                {currentModal.icon} {title || currentModal.title}
              </Typography>
              <IconButton
                onClick={onClose ? onClose : () => state.closeModal()}
                sx={{ ml: "auto" }}
                data-test-id="dialog--close-button"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <Divider />
        </>
      )}
      {currentModal.children}
    </Dialog>
  );
};
