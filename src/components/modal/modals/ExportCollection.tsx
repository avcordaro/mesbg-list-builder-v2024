import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { download } from "../../../hooks/export/useDownload.ts";
import { useAppState } from "../../../state/app";
import { useCollectionState } from "../../../state/collection";
import { AlertTypes } from "../../alerts/alert-types.tsx";

export const ExportCollection = () => {
  const { closeModal, triggerAlert } = useAppState();
  const { inventory } = useCollectionState();

  const [filename, setFilename] = useState("mesbg-game-collection");
  const [filenameValid, setFilenameValid] = useState(true);

  const handleExport = (e) => {
    e.preventDefault();
    const validFilename = filename.trim().length > 0;
    setFilenameValid(validFilename);
    if (validFilename) {
      download(
        JSON.stringify(inventory),
        filename + ".json",
        "application/json",
      );
      closeModal();
    }
  };

  const handleCopy = (e) => {
    e.preventDefault();
    const content = JSON.stringify(inventory);
    window.navigator.clipboard.writeText(content);
    triggerAlert(AlertTypes.EXPORT_HISTORY_ALERT);
    closeModal();
  };

  return (
    <>
      <DialogContent>
        <Stack gap={2}>
          <FormControl error={!filenameValid} variant="standard" fullWidth>
            <InputLabel htmlFor="component-error">Filename</InputLabel>
            <Input
              value={filename}
              onChange={(e) => {
                const filename = e.target.value.trim();
                setFilename(filename);
                const validFilename = filename.length > 0;
                setFilenameValid(validFilename);
              }}
              endAdornment=".json"
            />
            {!filenameValid && (
              <FormHelperText id="component-error-text">
                Filename cannot be empty
              </FormHelperText>
            )}
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ display: "flex", gap: 2 }}>
        <Button onClick={handleCopy} data-test-id="dialog--secondary-button">
          copy to clipboard
        </Button>
        <Button
          variant="contained"
          onClick={handleExport}
          disabled={!filenameValid}
          data-test-id="dialog--submit-button"
        >
          Save file
        </Button>
      </DialogActions>
    </>
  );
};
