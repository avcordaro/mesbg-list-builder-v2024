import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Button, MobileStepper } from "@mui/material";

interface VictoryPointStepperProps {
  activeStep: number;
  setActiveStep: (value: ((prevState: number) => number) | number) => void;
  totalSteps: number;
}

export const VictoryPointStepper = ({
  activeStep,
  setActiveStep,
  totalSteps,
}: VictoryPointStepperProps) => {
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <MobileStepper
      variant="text"
      steps={totalSteps}
      position="static"
      sx={{ backgroundColor: "transparent" }}
      activeStep={activeStep}
      nextButton={
        <Button
          onClick={handleNext}
          disabled={activeStep >= totalSteps - 1}
          endIcon={<KeyboardArrowRight />}
        >
          Next
        </Button>
      }
      backButton={
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<KeyboardArrowLeft />}
        >
          Back
        </Button>
      }
    />
  );
};
