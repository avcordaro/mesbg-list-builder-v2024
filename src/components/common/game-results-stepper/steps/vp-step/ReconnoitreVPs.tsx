import { Stack, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import { useGameModeState } from "../../../../../state/gamemode";
import { QuestionListProps } from "../VictoryPoints.tsx";
import { BrokenVPs } from "../vp-common/BrokenVPs.tsx";
import { GeneralWoundVPs } from "../vp-common/GeneralWoundVPs.tsx";
import { VictoryPointStepper } from "../vp-common/VictoryPointStepper.tsx";

const OBJECTIVES = 0;
const GENERAL = 1;
const BROKEN = 2;

/**
 * **SCORING VICTORY POINTS**
 *
 * - You score 4 Victory Points if more of your models have escaped the battlefield via your opponent’s board edge than vice versa.
 * If at least two of your models and twice as many models than your opponent have escaped the board, then you instead score 8 Victory Points.
 * If at least three of your models, and three times as many models than your opponent have escaped the board, then you instead score 12 Victory Points.
 *
 * - You score 1 Victory Point for each of your Hero models that escapes the board, to a maximum of 3 Victory Points.
 *
 * - You score 1 Victory Point if the enemy General was wounded during the game.
 * If the enemy General was removed as a casualty, you instead score 2 Victory Points.
 *
 * - You score 1 Victory Point if the enemy Army is Broken at the end of the game.
 * If the enemy Army is Broken and your Army is not, you instead score 3 Victory Points
 **/
export const ReconnoitreVPs: FunctionComponent<QuestionListProps> = (props) => {
  const { victoryPoints, setVictoryPoints } = useGameModeState();
  const [activeStep, setActiveStep] = useState(0);

  const [objectiveVPs, setObjectiveVPs] = useState(victoryPoints[0]);
  const [generalVPs, setGeneralVPs] = useState(victoryPoints[1]);
  const [brokenVPs, setBrokenVPs] = useState(victoryPoints[2]);

  const isTimesAsMany = (a: number, b: number, x: number) => {
    return a >= x && a >= b * x;
  };

  const getEscapeVPs = (
    playerEscapedModels: number,
    enemyEscapedModels: number,
  ): [number, number] => {
    if (playerEscapedModels === enemyEscapedModels) {
      return [0, 0];
    }

    if (playerEscapedModels > enemyEscapedModels) {
      if (isTimesAsMany(playerEscapedModels, enemyEscapedModels, 3)) {
        return [12, 0];
      }
      if (isTimesAsMany(playerEscapedModels, enemyEscapedModels, 2)) {
        return [8, 0];
      }
      return [4, 0];
    } else {
      if (isTimesAsMany(enemyEscapedModels, playerEscapedModels, 3)) {
        return [0, 12];
      }
      if (isTimesAsMany(enemyEscapedModels, playerEscapedModels, 2)) {
        return [0, 8];
      }
      return [0, 4];
    }
  };

  const getObjectiveVPs = (objectiveVPs: number[]): [number, number] => {
    const [playerModels, playerHeroes, opponentModels, opponentHeroes] =
      objectiveVPs;

    const heroVPs = Math.min(playerHeroes, 3);
    const oHeroVps = Math.min(opponentHeroes, 3);
    const [playerEscapeVPs, opponentEscapeVPs] = getEscapeVPs(
      playerModels,
      opponentModels,
    );

    return [heroVPs + playerEscapeVPs, -(oHeroVps + opponentEscapeVPs)];
  };

  const updateGameResultState = () => {
    const escapeVPs = getObjectiveVPs(objectiveVPs);
    const playerVPs = [escapeVPs[0], generalVPs[0], brokenVPs[0]].reduce(
      (a, b) => a + b,
      0,
    );
    const opponentVPs = [escapeVPs[1], generalVPs[1], brokenVPs[1]].reduce(
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
    setVictoryPoints([objectiveVPs, generalVPs, brokenVPs]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectiveVPs, generalVPs, brokenVPs]);

  return (
    <Box sx={{ mt: 2 }}>
      {activeStep === OBJECTIVES && (
        <ReconnoitreObjectiveVPs
          value={objectiveVPs}
          setValue={setObjectiveVPs}
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

type HoldGroundObjectiveVPsProps = {
  value: number[];
  setValue: (value: (number | null)[]) => void;
};
const ReconnoitreObjectiveVPs: FunctionComponent<
  HoldGroundObjectiveVPsProps
> = ({ value, setValue }) => {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value ? Number(event.target.value) : null;
    return setValue([newValue, value[1], value[2], value[3]]);
  };
  const onChangeOpponent = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value ? Number(event.target.value) : null;
    return setValue([value[0], value[1], newValue, value[3]]);
  };
  const onChangeHeroes = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value ? Number(event.target.value) : null;
    return setValue([value[0], newValue, value[2], value[3]]);
  };
  const onChangeOpponentHeroes = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value ? Number(event.target.value) : null;
    return setValue([value[0], value[1], value[2], newValue]);
  };
  return (
    <Stack gap={2}>
      <TextField
        fullWidth
        label="Models escaped from via the opponent's board edge"
        name="models"
        value={value[0]}
        type="number"
        slotProps={{ htmlInput: { min: 0 } }}
        onChange={onChange}
        size="small"
        required
      />
      <TextField
        fullWidth
        label="Enemy models escaped from via your board edge"
        name="opponentModels"
        value={value[2]}
        type="number"
        slotProps={{ htmlInput: { min: 0 } }}
        onChange={onChangeOpponent}
        size="small"
        required
      />
      <TextField
        fullWidth
        label="Heroes escaped"
        name="heroes"
        value={value[1]}
        type="number"
        slotProps={{ htmlInput: { min: 0 } }}
        onChange={onChangeHeroes}
        size="small"
        required
      />
      <TextField
        fullWidth
        label="Enemy Heroes escaped"
        name="opponentHeroes"
        value={value[3]}
        type="number"
        slotProps={{ htmlInput: { min: 0 } }}
        onChange={onChangeOpponentHeroes}
        size="small"
        required
      />
    </Stack>
  );
};
