import { Stack, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import { useGameModeState } from "../../../../../state/gamemode";
import { QuestionListProps } from "../VictoryPoints.tsx";
import { BannerVPs } from "../vp-common/BannerVPs.tsx";
import { BrokenVPs } from "../vp-common/BrokenVPs.tsx";
import { GeneralWoundVPs } from "../vp-common/GeneralWoundVPs.tsx";
import { VictoryPointStepper } from "../vp-common/VictoryPointStepper.tsx";

const OBJECTIVES = 0;
const GENERAL = 1;
const BROKEN = 2;
const BANNERS = 3;

/**
 * **SCORING VICTORY POINTS**
 *
 * - You score 4 Victory Points if you have more models within 6" of the objective than your opponent.
 * If you have twice as many models within 6" of the objective than your opponent, then you instead score 8 Victory Points.
 * If you have three times as many models within 6" of the objective than your opponent, or you are the only player to have
 * models within 6" of the objective, then you instead score 12 Victory Points.
 *
 * - You score 1 Victory Point if the enemy General was wounded during the game.
 * If the enemy General was removed as a casualty, you instead score 3 Victory Points.
 *
 * - You score 1 Victory Point if the enemy Army is Broken at the end of the game.
 * If the enemy Army is Broken and your Army is not, you instead score 3 Victory Points.
 *
 * - You score 2 Victory Points if your opponent has no banners remaining at the end of the game
 * (if they didn’t have a banner to start with, you automatically score this).
 */
export const HoldGroundVPs: FunctionComponent<QuestionListProps> = (props) => {
  const { victoryPoints, setVictoryPoints } = useGameModeState();
  const [activeStep, setActiveStep] = useState(0);

  const [modelsOnObjective, setModelsOnObjective] = useState(victoryPoints[0]);
  const [generalVPs, setGeneralVPs] = useState(victoryPoints[1]);
  const [brokenVPs, setBrokenVPs] = useState(victoryPoints[2]);
  const [bannersRemaining, setBannersRemaining] = useState(victoryPoints[3]);

  const getObjectiveVPs = (
    playerModelsOnObjective: number = 0,
    enemyModelsOnObjective: number = 0,
  ): [number, number] => {
    if (playerModelsOnObjective === enemyModelsOnObjective) {
      return [0, 0];
    }
    if (
      playerModelsOnObjective >= enemyModelsOnObjective * 3 ||
      enemyModelsOnObjective === 0
    ) {
      return [12, 0];
    }
    if (playerModelsOnObjective >= enemyModelsOnObjective * 2) {
      return [8, 0];
    }
    if (playerModelsOnObjective > enemyModelsOnObjective) {
      return [4, 0];
    }
    if (
      enemyModelsOnObjective >= playerModelsOnObjective * 3 ||
      playerModelsOnObjective === 0
    ) {
      return [0, -12];
    }
    if (enemyModelsOnObjective >= playerModelsOnObjective * 2) {
      return [0, -8];
    }
    if (enemyModelsOnObjective > playerModelsOnObjective) {
      return [0, -4];
    }
  };

  const updateGameResultState = () => {
    const objectiveVPs = getObjectiveVPs(
      modelsOnObjective[0],
      modelsOnObjective[1],
    );

    const playerVPs = [
      objectiveVPs[0],
      generalVPs[0],
      brokenVPs[0],
      bannersRemaining[1] > 0 ? 0 : 2,
    ].reduce((a, b) => a + b, 0);
    const opponentVPs = [
      objectiveVPs[1],
      generalVPs[1],
      brokenVPs[1],
      bannersRemaining[0] > 0 ? 0 : -2,
    ].reduce((a, b) => a - b, 0);

    props.updateFormValues({
      victoryPoints: playerVPs,
      opponentVictoryPoints: opponentVPs,
    });
  };

  useEffect(() => {
    updateGameResultState();
    setVictoryPoints([
      modelsOnObjective,
      generalVPs,
      brokenVPs,
      bannersRemaining,
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelsOnObjective, generalVPs, brokenVPs, bannersRemaining]);

  return (
    <Box sx={{ mt: 2 }}>
      {activeStep === OBJECTIVES && (
        <HoldGroundObjectiveVPs
          value={modelsOnObjective}
          setValue={setModelsOnObjective}
        />
      )}

      {activeStep === GENERAL && (
        <Stack>
          <GeneralWoundVPs
            label="Your General"
            value={-generalVPs[1]}
            setValue={(VPs) => setGeneralVPs((prev) => [prev[0], -VPs])}
            vpSpread={[0, 1, 3]}
          />
          <GeneralWoundVPs
            label="Enemy General"
            value={generalVPs[0]}
            setValue={(VPs) => setGeneralVPs((prev) => [VPs, prev[1]])}
            vpSpread={[0, 1, 3]}
          />
        </Stack>
      )}

      {activeStep === BROKEN && (
        <BrokenVPs value={brokenVPs} setValue={setBrokenVPs} />
      )}

      {activeStep === BANNERS && (
        <BannerVPs value={bannersRemaining} setValue={setBannersRemaining} />
      )}

      <VictoryPointStepper
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        totalSteps={4}
      />
    </Box>
  );
};

type HoldGroundObjectiveVPsProps = {
  value: number[];
  setValue: (value: (number | null)[]) => void;
};
const HoldGroundObjectiveVPs: FunctionComponent<
  HoldGroundObjectiveVPsProps
> = ({ value, setValue }) => {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value ? Number(event.target.value) : null;
    return setValue([newValue, value[1]]);
  };
  const onChangeOpponent = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value ? Number(event.target.value) : null;
    return setValue([value[0], newValue]);
  };
  return (
    <Stack gap={2}>
      <TextField
        fullWidth
        label='models within 6" of the objective'
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
        label='Enemy models within 6" of the objective'
        name="opponentModels"
        value={value[1]}
        type="number"
        slotProps={{ htmlInput: { min: 0 } }}
        onChange={onChangeOpponent}
        size="small"
        required
      />
    </Stack>
  );
};
