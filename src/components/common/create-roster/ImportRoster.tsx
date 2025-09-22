import { AttachFileOutlined } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import {
  forwardRef,
  MouseEvent,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../../hooks/cloud-sync/useApi.ts";
import { useExport } from "../../../hooks/export/useExport.ts";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";
import { Roster } from "../../../types/roster.ts";
import { slugify, withSuffix } from "../../../utils/string.ts";
import { CustomAlert } from "../alert/CustomAlert.tsx";

export type ImportRosterHandlers = {
  handleImportRoster: (e: MouseEvent) => void;
};

export const ImportRoster = forwardRef<ImportRosterHandlers>((_, ref) => {
  const navigate = useNavigate();
  const { closeModal } = useAppState();
  const { importJsonRoster } = useExport();
  const { createRoster, groups } = useRosterBuildingState();
  const { createRoster: remoteCreate, addRosterToGroup } = useApi();
  const { groupId: groupSlug } = useParams();

  const [JSONImport, setJSONImport] = useState("");
  const [JSONImportError, setJSONImportError] = useState("");

  const jsonImportTextField = useRef<HTMLInputElement | null>(null);
  const { id: groupId } =
    groups.find((group) => group.slug === groupSlug) || {};

  function scrollToBottom() {
    if (jsonImportTextField.current) {
      // Scroll the input to the bottom
      jsonImportTextField.current.scrollTop =
        jsonImportTextField.current.scrollHeight;
    }
  }

  const hasError = (
    roster: Roster | { error: true; reason: string },
  ): roster is { error: true; reason: string } =>
    (roster as { error: true; reason: string }).error === true;

  function handleImportRoster(e) {
    e.preventDefault();

    const roster = importJsonRoster(JSONImport);

    if (hasError(roster)) {
      setJSONImportError(roster.reason);
      return;
    }

    const importedRoster = {
      ...roster,
      id: withSuffix(slugify(roster.name)),
      group: groupId,
    };
    createRoster(importedRoster);
    remoteCreate(importedRoster);
    if (groupSlug) addRosterToGroup(groupSlug, importedRoster.id);
    navigate(`/roster/${importedRoster.id}`, { viewTransition: true });
    closeModal();
  }

  // Handler for file selection
  function handleFileChange(event) {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
      // Check if the file is a JSON file
      if (file.type === "application/json") {
        const reader = new FileReader();

        // Handler for when the file is successfully read
        reader.onload = () => {
          try {
            setJSONImport(reader.result as string);
            setTimeout(() => scrollToBottom());
          } catch (error) {
            console.error("Error parsing JSON:", error);
            alert("Invalid JSON file");
          }
        };

        // Read the file as text
        reader.readAsText(file);
      } else {
        alert("Please select a JSON file");
      }
    }

    // Clear the file input value
    event.target.value = "";
  }

  function handleButtonClick() {
    document.getElementById("file-input").click();
  }

  useImperativeHandle(ref, () => ({
    handleImportRoster,
  }));

  return (
    <>
      <CustomAlert title="" severity="info">
        Reimport a roster by selecting a saved .json file or by pasting the json
        directly into the textarea.
      </CustomAlert>
      <TextField
        fullWidth
        label="Roster JSON import"
        helperText={JSONImportError ? JSONImportError : null}
        error={!!JSONImportError}
        multiline
        rows={6}
        inputRef={jsonImportTextField}
        value={JSONImport}
        onChange={(e) => setJSONImport(e.target.value)}
      />

      <input
        id="file-input"
        type="file"
        accept=".json"
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
    </>
  );
});
