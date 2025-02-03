import { Button, DialogActions, DialogContent } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { useAppState } from "../../../state/app";
import { useGameModeState } from "../../../state/gamemode";
import { useRecentGamesState } from "../../../state/recent-games";
import { PastGame } from "../../../state/recent-games/history";
import { AlertTypes } from "../../alerts/alert-types.tsx";
import {
  findStepWithError,
  validateFormInputForStepper,
} from "../../common/game-results-form/validateInput.ts";
import { GameResultStepper } from "../../common/game-results-stepper/GameResultStepper.tsx";
import { steps as resultStepperSteps } from "../../common/game-results-stepper/steps.ts";

export const EndGameStepperDialog = () => {
  const navigate = useNavigate();
  const { closeModal, modalContext, triggerAlert } = useAppState();
  const { endGame } = useGameModeState();
  const { addGame } = useRecentGamesState();
  const [activeStep, setActiveStep] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [formValues, setFormValues] = useState<PastGame>({
    id: v4(),
    ...modalContext.formValues,
  });

  const finalStep = activeStep === resultStepperSteps.length - 1;

  const patchFormValues = (updatedValues: Partial<PastGame>) => {
    setFormValues((prevState) => {
      const newFormValues = { ...prevState, ...updatedValues };
      if (missingFields.length > 0) {
        const missingFields = validateFormInputForStepper(newFormValues);
        setMissingFields(missingFields);
      }
      return newFormValues;
    });
  };

  const closeModalAndEndGame = async () => {
    await navigate("/gamemode/start");
    endGame(modalContext.gameId);
    closeModal();
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    const missingFields = validateFormInputForStepper(formValues);
    setMissingFields(missingFields);
    if (missingFields.length > 0) {
      const errorStep = findStepWithError(formValues);
      setActiveStep(errorStep);
      return;
    }

    addGame(formValues);
    await navigate("/gamemode/start");
    triggerAlert(AlertTypes.EXPORT_HISTORY_ALERT);
    endGame(modalContext.gameId);
    closeModal();
  };

  return (
    <>
      <DialogContent>
        <GameResultStepper
          activeStep={activeStep}
          formValues={formValues}
          missingFields={missingFields}
          updateFormValues={patchFormValues}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="warning"
          onClick={closeModalAndEndGame}
          sx={{ minWidth: "20ch" }}
          data-test-id="dialog--cancel-button"
        >
          End Game without saving
        </Button>
        <Box flexGrow={1} />

        {activeStep > 0 ? (
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleBack}
            sx={{ minWidth: "20ch" }}
            data-test-id="dialog--submit-button"
          >
            Back
          </Button>
        ) : (
          <Button
            variant="text"
            color="inherit"
            onClick={closeModal}
            sx={{ minWidth: "20ch" }}
            data-test-id="dialog--submit-button"
          >
            Cancel
          </Button>
        )}

        <Button
          variant="contained"
          color={finalStep ? "success" : "primary"}
          onClick={finalStep ? handleSubmit : handleNext}
          sx={{ minWidth: "20ch" }}
          data-test-id="dialog--submit-button"
        >
          {finalStep ? "Save game" : "Next"}
        </Button>
      </DialogActions>
    </>
  );
};
