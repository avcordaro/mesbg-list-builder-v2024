import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import { useExport } from "../../../hooks/useExport.ts";
import { useRosterInformation } from "../../../hooks/useRosterInformation.ts";
import { useAppState } from "../../../state/app";
import { slugify } from "../../../utils/string.ts";
import { CustomAlert } from "../../common/alert/CustomAlert.tsx";

export const ExportRosterModal = () => {
  const { closeModal } = useAppState();
  const { roster } = useRosterInformation();
  const { exportToFile, exportToClipboard } = useExport();

  const [filename, setFilename] = useState(slugify(roster.name));
  const [filenameValid, setFilenameValid] = useState(true);

  const handleExport = (e) => {
    e.preventDefault();
    const validFilename = filename.trim().length > 0;
    setFilenameValid(validFilename);
    if (validFilename) {
      exportToFile(filename + ".json");
      closeModal();
    }
  };

  const handleCopy = (e) => {
    e.preventDefault();
    exportToClipboard();
    closeModal();
  };

  return (
    <>
      <DialogContent>
        <CustomAlert severity="info" title="">
          You can export your roster to a <i>.json</i> (or to your clipboard).
          This allows you to reimport your roster on another device or when you
          lose your browser data.
        </CustomAlert>
        <FormControl
          error={!filenameValid}
          variant="standard"
          fullWidth
          sx={{ mt: 2 }}
        >
          <InputLabel htmlFor="component-error">Roster filename</InputLabel>
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
      </DialogContent>
      <DialogActions sx={{ display: "flex", gap: 2 }}>
        <Button onClick={handleCopy}>copy to clipboard</Button>
        <Button
          variant="contained"
          onClick={handleExport}
          disabled={!filenameValid}
        >
          Save file
        </Button>
      </DialogActions>
    </>
  );
};
