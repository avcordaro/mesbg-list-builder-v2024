import { AttachFileOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  DialogActions,
  DialogContent,
  ListItemIcon,
  TextField,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as randomUuid } from "uuid";
import data from "../../../assets/data/mesbg_data.json";
import models from "../../../assets/data/mesbg_data.json";
import warningRules from "../../../assets/data/warning_rules.json";
import { useCalculator } from "../../../hooks/useCalculator.ts";
import { useExport } from "../../../hooks/useExport.ts";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";
import { emptyRoster } from "../../../state/roster-building/roster";
import { Roster } from "../../../types/roster.ts";
import { WarningRules } from "../../../types/warning-rules.types.ts";
import { slugify, withSuffix } from "../../../utils/string.ts";
import { FactionLogo } from "../../common/images/FactionLogo.tsx";

const armyLists = Object.values(data)
  .map((item) => ({
    title: item.army_list,
    army: item.army_list,
    type: item.army_type,
  }))
  .filter(
    (value, index, array) =>
      array.findIndex((other) => other.title === value.title) === index,
  )
  .sort((a, b) => b.type.localeCompare(a.type));

export const CreateNewRosterModal = () => {
  const { closeModal } = useAppState();
  const { createRoster, rosters } = useRosterBuildingState();
  const navigate = useNavigate();
  const { importJsonRoster } = useExport();
  const calculator = useCalculator();
  const { groupId } = useParams();

  const existingRosterIds = rosters.map(({ id }) => id);

  const [armyList, setArmyList] = useState<{
    title: string;
    type: string;
    army: string;
  }>({
    title: "",
    type: "",
    army: "",
  });

  const [rosterName, setRosterName] = useState("");
  const [JSONImport, setJSONImport] = useState("");
  const [JSONImportError, setJSONImportError] = useState("");

  const jsonImportTextField = useRef<HTMLInputElement | null>(null);

  function scrollToBottom() {
    if (jsonImportTextField.current) {
      // Scroll the input to the bottom
      jsonImportTextField.current.scrollTop =
        jsonImportTextField.current.scrollHeight;
    }
  }

  function validateAndAdjustForCompulsoryRules(roster: Roster): Roster {
    const rules = (warningRules as WarningRules)[roster.armyList];
    if (!rules) return roster;

    const compulsoryRules = rules.filter(
      ({ type, warning }) =>
        type === "compulsory" &&
        warning.includes("who is always the Army's General"),
    );
    if (compulsoryRules.length === 0) return roster;

    const [requiredGeneral] = compulsoryRules[0].dependencies;
    const general = models[requiredGeneral];
    const warband = roster.warbands[0];

    return calculator.recalculateRoster({
      ...roster,
      warbands: [
        calculator.recalculateWarband({
          ...warband,
          hero: calculator.recalculatePointsForUnit({
            ...general,
            id: randomUuid(),
            pointsPerUnit: general.base_points,
            pointsTotal: general.base_points,
            quantity: 1,
            compulsory: true,
          }),
        }),
      ],
      metadata: {
        ...roster.metadata,
        leader: warband.id,
        leaderCompulsory: true,
      },
    });
  }

  function fillRosterNameIfEmpty(rosterNameValue: string) {
    if (rosterNameValue) {
      return rosterNameValue;
    }
    const regex = new RegExp(`^${armyList.title} ?(\\(\\d+\\))?$`);
    const matchingRosterNames = rosters
      .filter((roster) => regex.test(roster.name))
      .map((r) => r.name);

    if (matchingRosterNames.length === 0) return `${armyList.title}`;
    const maxNameIndex = Math.max(
      ...matchingRosterNames.map((name) => {
        const matches = name.match(/\((\d+)\)/);
        const index = matches ? matches[1] : "0";
        return parseInt(index);
      }),
    );
    return `${armyList.title} (${maxNameIndex + 1})`;
  }

  function getRosterId(rosterNameValue: string) {
    let id = slugify(rosterNameValue);
    if (existingRosterIds.includes(id)) {
      id = withSuffix(id, existingRosterIds);
    }
    return id;
  }

  function handleCreateNewRoster(e) {
    e.preventDefault();

    const rosterNameValue = fillRosterNameIfEmpty(rosterName.trim());

    if (armyList.army) {
      const newRoster = validateAndAdjustForCompulsoryRules({
        ...emptyRoster,
        id: getRosterId(rosterNameValue),
        group: groupId,
        name: rosterNameValue,
        armyList: armyList.title,
      });

      createRoster(newRoster);
      navigate(`/roster/${newRoster.id}`, { viewTransition: true });
      closeModal();
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

    const id = slugify(roster.name);
    const importedRoster = {
      ...roster,
      id: existingRosterIds.includes(id)
        ? withSuffix(id, existingRosterIds)
        : id,
      group: groupId,
    };
    createRoster(importedRoster);
    navigate(`/roster/${importedRoster.id}`, { viewTransition: true });
    closeModal();
  }

  function updateRosterName(value: string) {
    setRosterName(value);
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

  return (
    <>
      <DialogContent sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
        <Alert severity="info" icon={false}>
          You can create a <u>new roster from scratch</u> <b>or</b>{" "}
          <u>
            import your existing roster<sup>*</sup>
          </u>
        </Alert>

        <Divider>
          <Typography className="middle-earth">Create a Roster</Typography>
        </Divider>

        <Autocomplete
          disableClearable
          options={armyLists}
          getOptionLabel={(option) => option.title}
          renderOption={(props, option) => {
            return (
              <ListItem {...props} key={option.title}>
                <ListItemIcon>
                  <FactionLogo faction={option.army} />
                </ListItemIcon>
                <ListItemText>{option.title}</ListItemText>
              </ListItem>
            );
          }}
          groupBy={(option) => option.type}
          value={armyList}
          onChange={(_, newValue) => {
            setArmyList(newValue);
          }}
          filterSelectedOptions
          blurOnSelect={true}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Type to filter..."
              label="Army"
            />
          )}
        />
        <TextField
          fullWidth
          label="Roster name (Optional)"
          value={rosterName}
          onChange={(e) => updateRosterName(e.target.value)}
        />

        <Divider>
          <Typography className="middle-earth">
            Or import an existing roster
          </Typography>
        </Divider>
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
          onClick={
            JSONImport.length > 0 ? handleImportRoster : handleCreateNewRoster
          }
          disabled={JSONImport.length === 0 && !armyList}
          data-test-id="dialog--submit-button"
        >
          {JSONImport.length > 0 ? "Import" : "Create"} roster
        </Button>
      </DialogActions>
    </>
  );
};
