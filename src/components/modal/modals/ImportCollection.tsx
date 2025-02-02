import { AttachFileOutlined } from "@mui/icons-material";
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
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useAppState } from "../../../state/app";
import { useCollectionState } from "../../../state/collection";
import { AlertTypes } from "../../alerts/alert-types.tsx";
import { CustomAlert } from "../../common/alert/CustomAlert.tsx";

export const ImportCollection = () => {
  const { closeModal, triggerAlert } = useAppState();
  const { upsertInventory } = useCollectionState();

  const [importedData, setImportedData] = useState("");
  const [importAlert, setImportAlert] = useState(false);

  const handleImport = (e) => {
    e.preventDefault();

    try {
      const importData = transformInputToArray(JSON.parse(importedData));

      if (
        importData.some(
          ({ group, model, data }) =>
            !group ||
            !model ||
            !data ||
            !data.collection ||
            data.collection.length === 0,
        )
      ) {
        triggerAlert(AlertTypes.IMPORT_COLLECTION_ERROR);
        return;
      }

      importData.forEach(({ group, model, data }) =>
        upsertInventory(group, model, data),
      );

      triggerAlert(AlertTypes.IMPORT_COLLECTION_COMPLETED);
      closeModal();
    } catch {
      triggerAlert(AlertTypes.IMPORT_COLLECTION_ERROR);
    }
  };

  function transformInputToArray(input) {
    return Object.entries(input).flatMap(([group, models]) =>
      Object.entries(models).map(([model, data]) => ({
        group,
        model,
        data,
      })),
    );
  }

  // Handler for file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file

    if (!(file && file.type === "application/json")) {
      alert("Please select a JSON" + file.type);
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    // Handler for when the file is successfully read
    reader.onload = () => {
      setImportAlert(false);
      try {
        setImportedData(reader.result as string);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Invalid file type. Please use JSON.");
      }
    };
    reader.readAsText(file);

    // Clear the file input value
    event.target.value = "";
  };

  const handleButtonClick = () => {
    document.getElementById("file-input").click();
  };

  return (
    <>
      <DialogContent>
        <Stack gap={2}>
          <CustomAlert title="" severity="warning">
            <Typography>
              Overlapping collection data will be replaced with imported data!{" "}
              <strong>For example:</strong> if you already have an collection
              entry for the Warrior of Minas Tirith and it is also present in
              your imported data, your collection will be updated to match the
              import.
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Entries imported which are not part of the profile database will
              be visible on the collections table but will not have any other
              effect.
            </Typography>
          </CustomAlert>
          <FormControl error={importAlert} variant="standard" fullWidth>
            <InputLabel htmlFor="component-error">Collection data</InputLabel>
            <Input
              multiline
              maxRows={4}
              value={importedData}
              onChange={(e) => setImportedData(e.target.value)}
            />
            {importAlert && (
              <FormHelperText id="component-error-text">
                Importing the data resulted in an error. Please check the import
                and verify a data type has been selected!
              </FormHelperText>
            )}
          </FormControl>
          <input
            id="file-input"
            type="file"
            accept=".json, .csv"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button
            variant="contained"
            onClick={handleButtonClick}
            fullWidth
            startIcon={<AttachFileOutlined />}
          >
            Select a file
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleImport}
          disabled={!importedData}
          data-test-id="dialog--submit-button"
        >
          Import collection
        </Button>
      </DialogActions>
    </>
  );
};
