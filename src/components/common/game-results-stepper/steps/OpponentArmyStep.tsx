import {
  Collapse,
  Stack,
  StepContent,
  StepLabel,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { ArmyPicker } from "../../game-results-form/ArmyPicker.tsx";
import { StepProps } from "./StepProps.ts";

export const OpponentArmyStep: FunctionComponent<StepProps> = ({
  formValues,
  missingFields,
  updateFormValues,
  handleChangeByEvent,
  activeStep,
}) => {
  return (
    <>
      <StepLabel
        error={missingFields.includes("Opponent Armies")}
        optional={
          <Collapse in={!activeStep}>
            <Typography variant="caption" color="textDisabled">
              {formValues.opponentArmies}
            </Typography>
          </Collapse>
        }
      >
        Players - Opponent Name & Army
      </StepLabel>
      <StepContent>
        <Typography>
          Some extra description on what this step is about
        </Typography>
        <Stack gap={2} sx={{ my: 2 }}>
          <TextField
            fullWidth
            label="Opponent Name"
            name="opponentName"
            value={formValues.opponentName}
            onChange={handleChangeByEvent}
            size="small"
          />
          <ArmyPicker
            label="Opponent Armies"
            placeholder="Your opponent's armies"
            error={missingFields.includes("Opponent Armies")}
            onChange={(values) =>
              updateFormValues({
                opponentArmies: values.map((v) => v.army).join(", "),
              })
            }
            required
            defaultSelection={formValues.opponentArmies
              .split(",")
              .map((o) => o.trim())}
          />
        </Stack>
      </StepContent>
    </>
  );
};
