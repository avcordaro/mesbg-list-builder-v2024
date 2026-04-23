import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { FunctionComponent, useEffect, useState } from "react";
import { useGameModeState } from "../../../../../state/gamemode";
import { QuestionListProps } from "../VictoryPoints.tsx";
import { BrokenVPs } from "../vp-common/BrokenVPs.tsx";
import { GeneralWoundVPs } from "../vp-common/GeneralWoundVPs.tsx";
import RadioMatrix from "../vp-common/RadioMatrix.tsx";
import { VictoryPointStepper } from "../vp-common/VictoryPointStepper.tsx";

const OBJECTIVE = 0;
const GENERAL = 1;
const BROKEN = 2;

/**
 * **SCORING VICTORY POINTS**
 *
 * - At the start of the game, secretly note down one of your own Hero models
 * (this may not be your General unless you only have one Hero.)
 * You score 1 Victory Point if the nominated Hero is still alive at the end of the game.
 * If the nominated Hero is still alive and has suffered no Wounds, you instead score 3 Victory Points.
 * If the nominated Hero is still alive and has suffered no Wounds, and spent no Fate Points, you instead score 5 Victory Points.
 *
 * - At the start of the game, secretly note down one of your opponent’s Hero models
 * (this may not be your opponent’s General unless they only have one Hero.)
 * You score 1 Victory Point for causing one or more Wounds on the nominated Hero. Wounds prevented by a successful Fate roll do not count.
 * If the nominated Hero has been removed as a casualty, you instead score 3 Victory Points.
 * If the nominated Hero has been removed as a casualty as a result of one of your models wounding them in Combat, you instead score 5 Victory Points.
 *
 * - At the start of the game secretly note down a single terrain piece wholly within your opponent’s half of the board.
 * You score 1 Victory Point if at the end of the game you have more models than your opponent on or in base contact with your chosen terrain piece.
 * If at the end of the game, you have at least two models and twice as many as your opponent on or in base contact with your chosen terrain piece,
 * you instead score 3 Victory Points.
 * If your opponent has no models on or in base contact with your chosen terrain piece and you have at least two, you instead score 5 Victory Points.
 *
 * - You score 1 Victory Point if the enemy General was wounded during the game.
 * If the enemy General was removed as a casualty, you instead score 2 Victory Points.
 *
 * - You score 1 Victory Point if the enemy Army is Broken at the end of the game.
 * If the enemy Army is Broken and your Army is not, you instead score 3 Victory Points.
 */
export const FogOfWarVPs: FunctionComponent<QuestionListProps> = (props) => {
  const { victoryPoints, setVictoryPoints } = useGameModeState();
  const [activeStep, setActiveStep] = useState(0);

  const [selectedModelVPs, setSelectedModelVPs] = useState(victoryPoints[0]);
  const [selectedTerrainVPs, setSelectedTerrainVPs] = useState(
    victoryPoints[1],
  );
  const [generalVPs, setGeneralVPs] = useState(victoryPoints[2]);
  const [brokenVPs, setBrokenVPs] = useState(victoryPoints[3]);

  const getObjectiveVPs = (
    modelVPs: number[],
    terrainVPs: number[],
  ): [number, number] => {
    const playerObjectives = [...modelVPs.slice(0, 2), terrainVPs[0]].reduce(
      (a, b) => a + b,
      0,
    );
    const opponentObjectives = [...modelVPs.slice(2, 4), terrainVPs[1]].reduce(
      (a, b) => a - b,
      0,
    );

    return [playerObjectives, opponentObjectives];
  };

  const updateGameResultState = () => {
    const objectiveVPs = getObjectiveVPs(selectedModelVPs, selectedTerrainVPs);

    const playerVPs = [objectiveVPs[0], generalVPs[0], brokenVPs[0]].reduce(
      (a, b) => a + b,
      0,
    );
    const opponentVPs = [objectiveVPs[1], generalVPs[1], brokenVPs[1]].reduce(
      (a, b) => a - b,
      0,
    );

    props.updateFormValues({
      victoryPoints: playerVPs,
      opponentVictoryPoints: opponentVPs,
    });
  };

  useEffect(() => {
    updateGameResultState();
    setVictoryPoints([
      selectedModelVPs,
      selectedTerrainVPs,
      generalVPs,
      brokenVPs,
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModelVPs, selectedTerrainVPs, generalVPs, brokenVPs]);

  return (
    <Box sx={{ mt: 2 }}>
      {activeStep === OBJECTIVE && (
        <Stack>
          <RadioMatrix
            rows={["Your Nominated Hero", "Their Nominated Hero"]}
            columns={[
              "Zero fate used",
              "Used Fate but no Wounds",
              "Wounded",
              "Killed",
            ]}
            values={[5, 3, 1, 0]}
            selection={[selectedModelVPs[0], selectedModelVPs[2]]}
            setSelection={([x, y]) =>
              setSelectedModelVPs(([, a, , b]) => [x, a, y, b])
            }
          />
          <RadioMatrix
            rows={["Your selected Enemy Hero", "Their selected Enemy Hero"]}
            columns={["Unharmed", "Wounded", "Killed", "Killed in combat"]}
            values={[0, 1, 3, 5]}
            selection={[selectedModelVPs[1], selectedModelVPs[3]]}
            setSelection={([x, y]) =>
              setSelectedModelVPs(([a, , b]) => [a, x, b, y])
            }
          />
          <RadioMatrix
            rows={[
              "Your selected terrain piece",
              "Their selected terrain piece",
            ]}
            columns={[
              "No or less models",
              "More models",
              "At least 2 models and 2x as many",
              "At least 2 models and no enemy models",
            ]}
            values={[0, 1, 3, 5]}
            selection={selectedTerrainVPs}
            setSelection={setSelectedTerrainVPs}
          />
        </Stack>
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
