import {
  Autocomplete,
  Collapse,
  Stack,
  StepContent,
  StepLabel,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { useGameModeState } from "../../../../state/gamemode";
import { scenarios } from "../../game-results-form/scenarios.ts";
import { StepProps } from "./StepProps.ts";

const vpSets = {
  Domination: [
    [0, 0, 0, 0, 0],
    [0, 0],
    [0, 0],
  ],
  "To The Death!": [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  "Hold Ground": [
    [0, 0],
    [0, 0],
    [0, 0],
    [1, 1],
  ],
  Reconnoitre: [
    [0, 0, 0, 0],
    [0, 0],
    [0, 0],
  ],
  "Destroy The Supplies": [
    [0, 0, 0, 0, 0, 0],
    [0, 0],
    [0, 0],
    [1, 1],
  ],
  "Fog Of War": [
    [0, 0, 0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
};

export const PointsAndScenarioStep: FunctionComponent<StepProps> = ({
  formValues,
  missingFields,
  handleChangeByEvent,
  updateFormValues,
  activeStep,
}) => {
  const { setVictoryPoints } = useGameModeState();
  return (
    <>
      <StepLabel
        error={
          missingFields.includes("Scenario Played") ||
          missingFields.includes("Points")
        }
        optional={
          <Collapse in={!activeStep}>
            <Typography variant="caption" color="textDisabled">
              {formValues.scenarioPlayed}
            </Typography>
          </Collapse>
        }
      >
        General - Scenario & Points
      </StepLabel>
      <StepContent>
        <Typography>
          Select which scenario was played and how much points was agreed upon.
          The selected scenario will affect the victory points step. You are
          able to add your custom scenario name in case of narrative matches or
          when playing games out-side-the-book
        </Typography>
        <Stack gap={2} sx={{ my: 2 }}>
          <Autocomplete
            options={scenarios}
            value={formValues.scenarioPlayed}
            onChange={(_, newValue) => {
              updateFormValues({
                scenarioPlayed: newValue,
                victoryPoints: 0,
                opponentVictoryPoints: 0,
              });
              setVictoryPoints(vpSets[newValue] || []);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Scenario Played"
                required
                error={missingFields.includes("Scenario Played")}
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
          <TextField
            required
            fullWidth
            label="Points"
            name="points"
            type="number"
            slotProps={{ htmlInput: { min: 0 } }}
            value={formValues.points}
            onChange={handleChangeByEvent}
            error={missingFields.includes("Points")}
            size="small"
          />
        </Stack>
      </StepContent>
    </>
  );
};
