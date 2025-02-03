import { Step, Stepper } from "@mui/material";
import Box from "@mui/material/Box";
import { ChangeEvent, FunctionComponent } from "react";
import { PastGame } from "../../../state/recent-games/history";
import { steps } from "./steps.ts";

export type GameResultStepperProps = {
  activeStep: number;
  formValues: PastGame;
  updateFormValues: (values: Partial<PastGame>) => void;
  missingFields: string[];
};

export const GameResultStepper: FunctionComponent<GameResultStepperProps> = ({
  activeStep,
  formValues,
  updateFormValues,
  missingFields,
}) => {
  const handleChangeByEvent = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormValues({
      [name as keyof PastGame]: value,
    });
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((Component, index) => (
          <Step key={index}>
            <Component
              activeStep={activeStep === index}
              formValues={formValues}
              missingFields={missingFields}
              updateFormValues={updateFormValues}
              handleChangeByEvent={handleChangeByEvent}
            />
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
