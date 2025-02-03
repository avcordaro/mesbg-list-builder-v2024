import { AdditionalTagsStep } from "./steps/AdditionalTagsStep.tsx";
import { OpponentArmyStep } from "./steps/OpponentArmyStep.tsx";
import { PlayerArmyStep } from "./steps/PlayerArmyStep.tsx";
import { PointsAndScenarioStep } from "./steps/PointsAndScenarioStep.tsx";
import { TimeAndDurationStep } from "./steps/TimeAndDurationStep.tsx";
import { VictoryPointsStep } from "./steps/VictoryPoints.tsx";
import { WinnerStep } from "./steps/Winner.tsx";

export const steps = [
  TimeAndDurationStep,
  PointsAndScenarioStep,
  AdditionalTagsStep,
  PlayerArmyStep,
  OpponentArmyStep,
  VictoryPointsStep,
  WinnerStep,
];
