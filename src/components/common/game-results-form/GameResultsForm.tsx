import {
  Autocomplete,
  Box,
  Grid2,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";
import { v4 } from "uuid";
import { useScreenSize } from "../../../hooks/useScreenSize.ts";
import { useAppState } from "../../../state/app";
import { useRecentGamesState } from "../../../state/recent-games";
import { PastGame } from "../../../state/recent-games/history";
import { ArmyPicker } from "./ArmyPicker.tsx";
import { AdditionalTagsInput } from "./TagsInput.tsx";

type Result = "Won" | "Lost" | "Draw";

const results: Result[] = ["Won", "Lost", "Draw"];

const scenarios = [
  "Domination",
  "To the death!",
  "Hold ground",
  "Reconnoitre",
  "Destroy the supplies",
  "Fog of war",
].map((s) => s.replace(/(^\w)|(\s+\w)/g, (letter) => letter.toUpperCase()));

export type GameResultsFormHandlers = {
  saveToState: () => boolean;
};

export const GameResultsForm = forwardRef<GameResultsFormHandlers>((_, ref) => {
  const { modalContext } = useAppState();
  const { addGame, editGame } = useRecentGamesState();

  const { isMobile, isTablet } = useScreenSize();

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

  const calculateResult = (
    vp: string | number,
    ovp: string | number,
    originalResult: Result,
  ): Result => {
    if (!hasValue(vp) || !hasValue(ovp)) {
      return originalResult;
    }

    const resultList: Record<Result, boolean> = {
      Won: Number(vp) > Number(ovp),
      Draw: Number(vp) === Number(ovp),
      Lost: Number(vp) < Number(ovp),
    };
    return Object.entries(resultList).find(([, value]) => value)[0] as Result;
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

  function hasValue(value: string | number | unknown) {
    return (
      (typeof value === "string" && value.trim() !== "") ||
      typeof value === "number"
    );
  }

  function isAboveZero(value: number) {
    return hasValue(value) && value > 0;
  }

  const saveToState = (): boolean => {
    const missingFields = [];

    if (!hasValue(formValues.gameDate)) missingFields.push("Date of the game");
    if (!isAboveZero(formValues.points)) missingFields.push("Points");
    if (!hasValue(formValues.result)) missingFields.push("Match result");
    if (!hasValue(formValues.armies)) missingFields.push("Armies");
    if (!hasValue(formValues.victoryPoints))
      missingFields.push("Victory points");
    if (!hasValue(formValues.bows)) missingFields.push("Bows");
    if (!hasValue(formValues.throwingWeapons))
      missingFields.push("throwingWeapons");
    if (
      hasValue(formValues.opponentName) ||
      hasValue(formValues.opponentVictoryPoints)
    ) {
      if (!hasValue(formValues.opponentName))
        missingFields.push("Opponent's Victory points");
      if (!hasValue(formValues.opponentVictoryPoints)) {
        missingFields.push("Opponent name");
      }
    }

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
        <Alert severity="error" sx={{ mb: 3 }}>
          Please fill in the following required fields:{" "}
          {missingRequiredFields.join(", ").replace(/,([^,]*)$/, " & $1")}
        </Alert>
      )}

      <Grid2 container spacing={2}>
        <Grid2 container component="fieldset">
          <Typography component="legend" sx={{ mb: 1 }}>
            General game information
          </Typography>
          <Grid2 size={isTablet ? 12 : 7}>
            <TextField
              fullWidth
              label="Date of the game"
              name="gameDate"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={formValues.gameDate}
              onChange={handleChangeByEvent}
              required
              size="small"
            />
          </Grid2>
          <Grid2 size={isTablet ? (isMobile ? 12 : 6) : 3}>
            <TextField
              fullWidth
              label="Duration"
              name="duration"
              value={formValues.duration}
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
          <Grid2 size={isTablet ? (isMobile ? 12 : 6) : 2}>
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
                    label="Match results"
                    required
                    error={missingRequiredFields.includes("Match result")}
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
              error={missingRequiredFields.includes("throwingWeapons")}
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
              error={missingRequiredFields.includes("Victory points")}
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
            Your opponents information
          </Typography>
          <Grid2 size={12}>
            <ArmyPicker
              label="Opponent Armies"
              placeholder="Your opponents armies"
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
