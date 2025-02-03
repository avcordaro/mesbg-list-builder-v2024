import { ChangeEvent } from "react";
import { PastGame } from "../../../../state/recent-games/history";

export type StepProps = {
  formValues: PastGame;
  updateFormValues: (values: Partial<PastGame>) => void;
  handleChangeByEvent: (event: ChangeEvent<HTMLInputElement>) => void;
  missingFields: string[];
  activeStep: boolean;
};
