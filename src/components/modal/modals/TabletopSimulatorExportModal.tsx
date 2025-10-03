import CloseIcon from "@mui/icons-material/Close";
import { Button, DialogContent, DialogTitle } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useRef } from "react";
import { FaClipboard } from "react-icons/fa6";
import { GiRollingDices } from "react-icons/gi";
import { useAppState } from "../../../state/app";
import { RosterTextViewHandlers } from "../../common/roster-summary/TextView.tsx";
import { RosterTabletopSimView } from "../../common/roster-summary/TtsView.tsx";

export const TabletopSimulatorExportModal = () => {
  const {
    closeModal,
    modalContext: { roster },
  } = useAppState();
  const rosterTextRef = useRef<RosterTextViewHandlers>();

  return (
    <>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h5"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexGrow: 1,
            }}
            className="middle-earth"
          >
            <GiRollingDices size="2.4rem" />
            Tabletop Simulator export
          </Typography>
          <Box sx={{ px: 1 }}>
            <Button
              variant="contained"
              startIcon={<FaClipboard />}
              onClick={() => {
                rosterTextRef.current.copyToClipboard();
              }}
            >
              Copy to clipboard
            </Button>
          </Box>

          <IconButton
            onClick={() => closeModal()}
            sx={{ ml: "auto" }}
            data-test-id="dialog--close-button"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogTitle></DialogTitle>
      <DialogContent>
        <RosterTabletopSimView ref={rosterTextRef} roster={roster} />
      </DialogContent>
    </>
  );
};
