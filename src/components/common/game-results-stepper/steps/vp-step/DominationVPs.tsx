import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { FunctionComponent, useEffect, useState } from "react";
import { useGameModeState } from "../../../../../state/gamemode";
import { QuestionListProps } from "../VictoryPoints.tsx";
import { BrokenVPs } from "../vp-common/BrokenVPs.tsx";
import { GeneralWoundVPs } from "../vp-common/GeneralWoundVPs.tsx";
import RadioMatrix from "../vp-common/RadioMatrix.tsx";
import { VictoryPointStepper } from "../vp-common/VictoryPointStepper.tsx";

const OBJECTIVES = 0;
const GENERAL = 1;
const BROKEN = 2;

/*
 * **SCORING VICTORY POINTS**
 *
 * - For each Objective Marker, you score 1 Victory Point if you have more models within 3" than your opponent.
 * If you have at least twice as many models as your opponent within 3", you instead score 2 Victory Points.
 * If you are the only player to have models within 3", you instead score 3 Victory Points.
 *
 * - You score 1 Victory Point if the enemy General was wounded during the game.
 * If the enemy General was removed as a casualty, you instead score 2 Victory Points.
 *
 * - You score 1 Victory Point if the enemy Army is Broken at the end of the game.
 * If the enemy Army is Broken and your Army is not, you instead score 3 Victory Points
 */
export const DominationVPs: FunctionComponent<QuestionListProps> = (props) => {
  const { victoryPoints, setVictoryPoints } = useGameModeState();
  const [activeStep, setActiveStep] = useState(0);

  const [objectiveVPs, setObjectiveVPs] = useState(victoryPoints[0]);
  const [generalVPs, setGeneralVPs] = useState(victoryPoints[1]);
  const [brokenVPs, setBrokenVPs] = useState(victoryPoints[2]);

  const updateGameResultState = () => {
    const playerVPs = [
      ...objectiveVPs.filter((value) => value > 0),
      generalVPs[0],
      brokenVPs[0],
    ].reduce((a, b) => a + b, 0);
    const opponentVPs = [
      ...objectiveVPs.filter((value) => value < 0),
      generalVPs[1],
      brokenVPs[1],
    ].reduce((a, b) => a - b, 0);

    props.updateFormValues({
      victoryPoints: playerVPs,
      opponentVictoryPoints: opponentVPs,
    });
  };

  useEffect(() => {
    updateGameResultState();
    setVictoryPoints([objectiveVPs, generalVPs, brokenVPs]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectiveVPs, generalVPs, brokenVPs]);

  return (
    <Box sx={{ mt: 2 }}>
      {activeStep === OBJECTIVES && (
        <RadioMatrix
          rows={[
            "Objective 1",
            "Objective 2",
            "Objective 3",
            "Objective 4",
            "Objective 5",
          ]}
          columns={[
            "Fully Mine",
            "2x Mine",
            "Mine",
            "Neutral / Tied",
            "Theirs",
            "2x Theirs",
            "Fully Theirs",
          ]}
          values={[3, 2, 1, 0, -1, -2, -3]}
          selection={objectiveVPs}
          setSelection={setObjectiveVPs}
        />
      )}

      {activeStep === GENERAL && (
        <Stack>
          <GeneralWoundVPs
            label="Your General"
            value={-generalVPs[1]}
            setValue={(VPs) => setGeneralVPs((prev) => [prev[0], -VPs])}
          />
          <GeneralWoundVPs
            label="Enemy General"
            value={generalVPs[0]}
            setValue={(VPs) => setGeneralVPs((prev) => [VPs, prev[1]])}
          />
        </Stack>
      )}

      {activeStep === BROKEN && (
        <BrokenVPs value={brokenVPs} setValue={setBrokenVPs} />
      )}

      <VictoryPointStepper
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        totalSteps={3}
      />
    </Box>
  );
};
