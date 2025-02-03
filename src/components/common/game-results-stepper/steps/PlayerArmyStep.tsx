import {
  Collapse,
  Stack,
  StepContent,
  StepLabel,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { useScreenSize } from "../../../../hooks/useScreenSize.ts";
import { ArmyPicker } from "../../game-results-form/ArmyPicker.tsx";
import { StepProps } from "./StepProps.ts";

export const PlayerArmyStep: FunctionComponent<StepProps> = ({
  formValues,
  missingFields,
  updateFormValues,
  handleChangeByEvent,
  activeStep,
}) => {
  const { isMobile } = useScreenSize();
  return (
    <>
      <StepLabel
        error={
          missingFields.includes("Armies") ||
          missingFields.includes("Bows") ||
          missingFields.includes("Throwing Weapons")
        }
        optional={
          <Collapse in={!activeStep}>
            <Typography variant="caption" color="textDisabled">
              {formValues.armies}
            </Typography>
          </Collapse>
        }
      >
        Players - Your army
      </StepLabel>
      <StepContent>
        <Typography>
          Select which army you played and how much bows & throwing weapons you
          included.
        </Typography>
        <Stack gap={2} sx={{ my: 2 }}>
          <ArmyPicker
            label="Armies"
            placeholder="Your armies"
            required
            error={missingFields.includes("Armies")}
            onChange={(values) => {
              updateFormValues({
                armies: values.map((v) => v.army).join(", "),
              });
            }}
            defaultSelection={formValues.armies.split(",").map((o) => o.trim())}
          />
          <Stack gap={2} direction={isMobile ? "column" : "row"}>
            <TextField
              required
              fullWidth
              label="Bows"
              name="bows"
              type="number"
              error={missingFields.includes("Bows")}
              slotProps={{ htmlInput: { min: 0 } }}
              value={formValues.bows}
              onChange={handleChangeByEvent}
              size="small"
            />
            <TextField
              required
              fullWidth
              label="Throwing Weapons"
              name="throwingWeapons"
              type="number"
              error={missingFields.includes("Throwing Weapons")}
              slotProps={{ htmlInput: { min: 0 } }}
              value={formValues.throwingWeapons}
              onChange={handleChangeByEvent}
              size="small"
            />
          </Stack>
        </Stack>
      </StepContent>
    </>
  );
};
