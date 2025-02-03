import {
  Autocomplete,
  Box,
  Grid2,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";
import { v4 } from "uuid";
import { useScreenSize } from "../../../hooks/useScreenSize.ts";
import { useAppState } from "../../../state/app";
import { useRecentGamesState } from "../../../state/recent-games";
import { PastGame } from "../../../state/recent-games/history";
import { hasValue } from "../../../utils/objects.ts";
import { CustomAlert } from "../alert/CustomAlert.tsx";
import { ArmyPicker } from "./ArmyPicker.tsx";
import { AdditionalTagsInput } from "./TagsInput.tsx";
import { calculateResult, results } from "./result.ts";
import { scenarios } from "./scenarios.ts";
import { validateFormInput } from "./validateInput.ts";

export type GameResultsFormHandlers = {
  saveToState: () => boolean;
};

export const GameResultsForm = forwardRef<GameResultsFormHandlers>((_, ref) => {
  const { modalContext } = useAppState();
  const { addGame, editGame } = useRecentGamesState();

  const { isMobile } = useScreenSize();

  const [formValues, setFormValues] = useState<PastGame>({
    id: v4(),
    ...modalContext.formValues,
  });

  const [missingRequiredFields, setMissingRequiredFields] = useState<string[]>(
    [],
  );

  const handleChangeByEvent = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name as keyof PastGame]: value,
    });
  };

  const handleChangeVictoryPoints = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((formValues) => ({
      ...formValues,
      result: calculateResult(
        name === "victoryPoints" ? value : formValues.victoryPoints,
        name === "opponentVictoryPoints"
          ? value
          : formValues.opponentVictoryPoints,
        formValues.result,
      ),
      [name as keyof PastGame]: value,
    }));
  };

  const handleChangeField = (name: keyof PastGame, value: unknown) => {
    setFormValues((formValues) => ({
      ...formValues,
      [name]: value,
    }));
  };

  const saveToState = (): boolean => {
    const missingFields = validateFormInput(formValues);
    setMissingRequiredFields(missingFields);
    if (missingFields.length > 0) {
      return false;
    }

    switch (modalContext.mode) {
      case "edit":
        editGame({ ...formValues });
        break;
      case "record":
      case "create":
        addGame({ ...formValues });
        break;
      default:
        console.error("Unknown mode ", modalContext.mode);
    }

    setFormValues({
      id: v4(),
      gameDate: "",
      duration: 0,
      tags: [],
      result: "Won",
      scenarioPlayed: null,
      armies: "",
      points: 0,
      bows: 0,
      throwingWeapons: 0,
      victoryPoints: 0,
      opponentArmies: "",
      opponentName: "",
      opponentVictoryPoints: 0,
    });
    return true;
  };

  useImperativeHandle(ref, () => ({
    saveToState,
  }));

  return (
    <Box>
      {missingRequiredFields.length > 0 && (
        <CustomAlert severity="error" title="Some fields are incorrect">
          Please fill in the following required fields:{" "}
          {missingRequiredFields.join(", ").replace(/,([^,]*)$/, " & $1")}
        </CustomAlert>
      )}

      <Grid2 container spacing={2} sx={{ mt: 2 }}>
        <Grid2 container component="fieldset">
          <Typography component="legend" sx={{ mb: 1 }}>
            General game information
          </Typography>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label="Date of the Game"
              name="gameDate"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={formValues.gameDate}
              onChange={handleChangeByEvent}
              required
              size="small"
            />
          </Grid2>
          <Grid2 size={6}>
            <TextField
              fullWidth
              label="Duration"
              name="duration"
              value={formValues.duration}
              error={missingRequiredFields.includes("Duration")}
              autoFocus={!formValues.duration}
              onChange={handleChangeByEvent}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">minutes</InputAdornment>
                  ),
                },
              }}
              size="small"
            />
          </Grid2>
          <Grid2 size={6}>
            <TextField
              required
              error={missingRequiredFields.includes("Points")}
              fullWidth
              label="Points"
              name="points"
              type="number"
              slotProps={{ htmlInput: { min: 0 } }}
              value={formValues.points}
              onChange={handleChangeByEvent}
              size="small"
            />
          </Grid2>
          <Grid2 size={isMobile ? 12 : 9}>
            <Autocomplete
              options={scenarios}
              value={formValues.scenarioPlayed}
              onChange={(_, newValue) =>
                handleChangeField("scenarioPlayed", newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Scenario Played"
                  autoFocus={!!formValues.duration}
                />
              )}
              filterOptions={(options, { inputValue }) => {
                const filtered = options.filter((option) =>
                  option.toLowerCase().includes(inputValue.toLowerCase()),
                );

                const isExisting = options.some(
                  (option) => inputValue.toLowerCase() === option.toLowerCase(),
                );
                if (inputValue !== "" && !isExisting) {
                  filtered.push(`Custom: "${inputValue}"`);
                }

                return filtered;
              }}
              fullWidth
              size="small"
            />
          </Grid2>
          <Grid2 size={isMobile ? 12 : 3}>
            <Tooltip
              title={
                hasValue(formValues.victoryPoints) &&
                hasValue(formValues.opponentVictoryPoints)
                  ? "The state of this field is managed by the VP's"
                  : ""
              }
            >
              <Autocomplete
                options={results}
                value={formValues.result}
                onChange={(_, newValue) =>
                  handleChangeField("result", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Match Results"
                    required
                    error={missingRequiredFields.includes("Match Results")}
                  />
                )}
                fullWidth
                disableClearable
                disabled={
                  hasValue(formValues.victoryPoints) &&
                  hasValue(formValues.opponentVictoryPoints)
                }
                size="small"
              />
            </Tooltip>
          </Grid2>
          <Grid2 size={12}>
            <AdditionalTagsInput
              values={formValues.tags}
              onChange={(values) => handleChangeField("tags", values)}
            />
          </Grid2>
        </Grid2>
        <Grid2 container component="fieldset" size={isMobile ? 12 : 6}>
          <Typography component="legend" sx={{ mb: 1 }}>
            Your army information
          </Typography>
          <Grid2 size={12}>
            <ArmyPicker
              label="Armies"
              placeholder="Your armies"
              required
              error={missingRequiredFields.includes("Armies")}
              onChange={(values) => {
                handleChangeField(
                  "armies",
                  values.map((v) => v.army).join(", "),
                );
              }}
              defaultSelection={formValues.armies
                .split(",")
                .map((o) => o.trim())}
            />
          </Grid2>
          <Grid2 size={isMobile ? 12 : 3}>
            <TextField
              required
              error={missingRequiredFields.includes("Bows")}
              fullWidth
              label="Bows"
              name="bows"
              type="number"
              slotProps={{ htmlInput: { min: 0 } }}
              value={formValues.bows}
              onChange={handleChangeByEvent}
              size="small"
            />
          </Grid2>
          <Grid2 size={isMobile ? 12 : 3}>
            <TextField
              required
              error={missingRequiredFields.includes("Throwing Weapons")}
              fullWidth
              label="Throwing Weapons"
              name="throwingWeapons"
              type="number"
              slotProps={{ htmlInput: { min: 0 } }}
              value={formValues.throwingWeapons}
              onChange={handleChangeByEvent}
              size="small"
            />
          </Grid2>
          <Grid2 size={isMobile ? 12 : 6}>
            <TextField
              required
              error={missingRequiredFields.includes("Victory Points")}
              fullWidth
              label="Victory Points"
              name="victoryPoints"
              type="number"
              slotProps={{ htmlInput: { min: 0 } }}
              value={formValues.victoryPoints}
              onChange={handleChangeVictoryPoints}
              size="small"
            />
          </Grid2>
        </Grid2>
        <Grid2 container component="fieldset" size={isMobile ? 12 : 6}>
          <Typography component="legend" sx={{ mb: 1 }}>
            Your opponent&apos;s information
          </Typography>
          <Grid2 size={12}>
            <ArmyPicker
              label="Opponent Armies"
              placeholder="Your opponent's armies"
              onChange={(values) =>
                handleChangeField(
                  "opponentArmies",
                  values.map((v) => v.army).join(", "),
                )
              }
              defaultSelection={formValues.opponentArmies
                .split(",")
                .map((o) => o.trim())}
            />
          </Grid2>
          <Grid2 size={isMobile ? 12 : 6}>
            <TextField
              fullWidth
              label="Opponent Name"
              name="opponentName"
              error={missingRequiredFields.includes("Opponent Name")}
              value={formValues.opponentName}
              onChange={handleChangeByEvent}
              required={
                !!formValues.opponentName || !!formValues.opponentVictoryPoints
              }
              size="small"
            />
          </Grid2>
          <Grid2 size={isMobile ? 12 : 6}>
            <TextField
              fullWidth
              label="Victory Points"
              name="opponentVictoryPoints"
              value={formValues.opponentVictoryPoints}
              type="number"
              error={missingRequiredFields.includes(
                "Opponent's Victory Points",
              )}
              slotProps={{ htmlInput: { min: 0 } }}
              onChange={handleChangeVictoryPoints}
              size="small"
              required={
                !!formValues.opponentName || !!formValues.opponentVictoryPoints
              }
            />
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
});
