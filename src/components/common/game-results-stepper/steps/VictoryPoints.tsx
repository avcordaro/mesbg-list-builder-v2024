import { StepContent, StepLabel } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { useGameModeState } from "../../../../state/gamemode"; //   "Domination",
import { PastGame } from "../../../../state/recent-games/history";
import { CustomAlert } from "../../alert/CustomAlert.tsx";
import { calculateResult } from "../../game-results-form/result.ts";
import { StepProps } from "./StepProps.ts";
import { DestroyTheSuppliesVPs } from "./vp-step/DestroyTheSuppliesVPs.tsx";
import { DominationVPs } from "./vp-step/DominationVPs.tsx";
import { FogOfWarVPs } from "./vp-step/FogOfWarVPs.tsx";
import { HoldGroundVPs } from "./vp-step/HoldGroundVPs.tsx";
import { ReconnoitreVPs } from "./vp-step/ReconnoitreVPs.tsx";
import { ToTheDeathVPs } from "./vp-step/ToTheDeathVPs.tsx";

export type QuestionListProps = {
  updateFormValues: (values: Partial<PastGame>) => void;
};

export const VictoryPointsStep: FunctionComponent<StepProps> = ({
  formValues,
  updateFormValues,
}) => {
  const { additionalVictoryPoints, setCalculatedVictoryPoints } =
    useGameModeState();

  const QuestionList = {
    Domination: DominationVPs,
    "To The Death!": ToTheDeathVPs,
    "Fog Of War": FogOfWarVPs,
    "Hold Ground": HoldGroundVPs,
    Reconnoitre: ReconnoitreVPs,
    "Destroy The Supplies": DestroyTheSuppliesVPs,
  }[formValues.scenarioPlayed];

  const handleUpdateVPs = ({
    victoryPoints,
    opponentVictoryPoints,
  }: Pick<PastGame, "victoryPoints" | "opponentVictoryPoints">) => {
    setCalculatedVictoryPoints([victoryPoints, opponentVictoryPoints]);
    const [additionalVPs, additionalOpponentVPs] = additionalVictoryPoints;
    const tpvs = victoryPoints + additionalVPs;
    const tovs = opponentVictoryPoints + additionalOpponentVPs;
    updateFormValues({
      victoryPoints: tpvs,
      opponentVictoryPoints: tovs,
      result: calculateResult(tpvs, tovs, "Draw"),
    });
  };

  return (
    <>
      <StepLabel
        optional={
          <Typography variant="caption" color="textDisabled">
            {formValues.victoryPoints || 0} -{" "}
            {formValues.opponentVictoryPoints || 0}{" "}
            <i>[ {formValues.result} ]</i>
          </Typography>
        }
      >
        Result - Victory points
      </StepLabel>
      <StepContent>
        {QuestionList !== undefined ? (
          <>
            <Typography>
              Follow the VP calculation for &quot;{formValues.scenarioPlayed}
              &quot; to calculate the VP&apos;s for each player.
            </Typography>
            <Box sx={{ mb: 2 }}>
              <QuestionList updateFormValues={handleUpdateVPs} />
            </Box>
          </>
        ) : formValues.scenarioPlayed !== null ? (
          <CustomAlert title="No victory points guide" severity="info">
            The selected scenario ({formValues.scenarioPlayed}) does not not
            have a victory points stepper. You can skip this step and fill in
            the VP&apos;s in the next step.
          </CustomAlert>
        ) : (
          <CustomAlert title="No scenario selected" severity="warning">
            You have not selected a scenario in step 2. Please go back and
            select a scenario.
          </CustomAlert>
        )}
      </StepContent>
    </>
  );
};
