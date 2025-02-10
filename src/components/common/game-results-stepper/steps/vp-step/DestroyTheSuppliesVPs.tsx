import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FunctionComponent, useEffect, useState } from "react";
import { useGameModeState } from "../../../../../state/gamemode";
import { QuestionListProps } from "../VictoryPoints.tsx";
import { BannerVPs } from "../vp-common/BannerVPs.tsx";
import { BrokenVPs } from "../vp-common/BrokenVPs.tsx";
import { GeneralWoundVPs } from "../vp-common/GeneralWoundVPs.tsx";
import RadioMatrix from "../vp-common/RadioMatrix.tsx";
import { VictoryPointStepper } from "../vp-common/VictoryPointStepper.tsx";

const OBJECTIVES = 0;
const GENERAL = 1;
const BROKEN = 2;
const BANNERS = 3;

/**
 * **SCORING VICTORY POINTS**
 *
 * - You score 3 Victory Points for each enemy Supply Marker that has been destroyed.
 *
 * - You score 1 Victory Point for each enemy Supply Marker that has not been destroyed,
 * but you have more models within 3" than your opponent.
 *
 * - If you have destroyed more Supply Markers than your opponent, you score 1 Victory Point.
 *
 * - You score 1 Victory Point if the enemy General was wounded during the game.
 * If the enemy General was removed as a casualty, you instead score 3 Victory Points.
 *
 * - You score 1 Victory Point if the enemy Army is Broken at the end of the game.
 * If the enemy Army is Broken and your Army is not, you instead score 3 Victory Points.
 *
 * - You score 2 Victory Points if your opponent has no banners remaining at the end of the game
 * (if they didn’t have a banner to start with, you automatically score this).
 *
 * - You score 1 Victory Point if you have at least one banner remaining at the end of the game.
 * If you have more banners remaining than your opponent, then you instead score 2 Victory Points
 */
export const DestroyTheSuppliesVPs: FunctionComponent<QuestionListProps> = (
  props,
) => {
  const { victoryPoints, setVictoryPoints } = useGameModeState();
  const [activeStep, setActiveStep] = useState(0);

  const [objectiveVPs, setObjectiveVPs] = useState(victoryPoints[0]);
  const [generalVPs, setGeneralVPs] = useState(victoryPoints[1]);
  const [brokenVPs, setBrokenVPs] = useState(victoryPoints[2]);
  const [bannersRemaining, setBannersRemaining] = useState(victoryPoints[3]);

  const getBannerVPs = (banners: number, oBanners: number) => {
    let playerVPs = 0,
      opponentVPs = 0;

    if (banners === 0) opponentVPs += 2;
    if (banners !== 0) playerVPs += 1;
    if (banners > oBanners) playerVPs += 1;

    if (oBanners === 0) playerVPs += 2;
    if (oBanners !== 0) opponentVPs += 1;
    if (oBanners > banners) opponentVPs += 1;

    return [playerVPs, -opponentVPs];
  };

  const getObjectiveVPs = (objectives: number[]) => {
    const playerObjectives = objectives.slice(0, 3);
    const opponentObjectives = objectives.slice(3, 6);
    const oDestroy = playerObjectives.filter((v) => v === 3).length;
    const pDestroy = opponentObjectives.filter((v) => v === 3).length;
    const basePlayerVPs = opponentObjectives.reduce((a, b) => a + b, 0);
    const baseOpponentVPs = playerObjectives.reduce((a, b) => a + b, 0);

    if (oDestroy < pDestroy) return [basePlayerVPs + 1, -baseOpponentVPs];
    if (oDestroy > pDestroy) return [basePlayerVPs, -(baseOpponentVPs + 1)];
    return [basePlayerVPs, -baseOpponentVPs];
  };

  const updateGameResultState = () => {
    const bannerVPs = getBannerVPs(bannersRemaining[0], bannersRemaining[1]);
    const oVPs = getObjectiveVPs(objectiveVPs);
    const playerVPs = [
      oVPs[0],
      bannerVPs[0],
      generalVPs[0],
      brokenVPs[0],
    ].reduce((a, b) => a + b, 0);
    const opponentVPs = [
      oVPs[1],
      bannerVPs[1],
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
    setVictoryPoints([objectiveVPs, generalVPs, brokenVPs, bannersRemaining]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectiveVPs, generalVPs, brokenVPs, bannersRemaining]);

  return (
    <Box sx={{ mt: 2 }}>
      {activeStep === OBJECTIVES && (
        <>
          <RadioMatrix
            rows={[
              "Own Supply Marker 1",
              "Own Supply Marker 2",
              "Own Supply Marker 3",
              "Enemy Supply Marker 1",
              "Enemy Supply Marker 2",
              "Enemy Supply Marker 3",
            ]}
            columns={[
              "Not Destroyed",
              <>
                Contested <sup>[1]</sup>
              </>,
              "Destroyed",
            ]}
            values={[0, 1, 3]}
            selection={objectiveVPs}
            setSelection={setObjectiveVPs}
          />
          <Typography variant="caption">
            [1]: Supply Marker that has not been destroyed, but has more
            attackers within 3&quot; than defenders.
          </Typography>
        </>
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
