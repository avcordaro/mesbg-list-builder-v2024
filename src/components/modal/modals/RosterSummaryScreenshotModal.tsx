import { Button, DialogContent } from "@mui/material";
import { useRosterInformation } from "../../../hooks/useRosterInformation.ts";
import { useAppState } from "../../../state/app";

export const RosterSummaryScreenshotModal = () => {
  const { modalContext } = useAppState();
  const { roster } = useRosterInformation();
  return (
    <>
      <DialogContent>
        {modalContext.screenshot != null && (
          <>
            <img
              src={modalContext.screenshot}
              alt="roster screenshot"
              style={{
                margin: "1rem 0",
                border: "1px solid black",
                boxShadow: "1px 1px 5px 0px #000000AA",
                width: "100%",
              }}
            />
            <Button
              fullWidth
              variant="contained"
              href={modalContext.screenshot}
              download={roster.id + ".png"}
            >
              Save image
            </Button>
          </>
        )}
      </DialogContent>
    </>
  );
};
