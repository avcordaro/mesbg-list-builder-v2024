import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import { useGameModeState } from "../../../../../state/gamemode";
import { QuestionListProps } from "../VictoryPoints.tsx";
import { BannerVPs } from "../vp-common/BannerVPs.tsx";
import { BrokenVPs } from "../vp-common/BrokenVPs.tsx";
import { VictoryPointStepper } from "../vp-common/VictoryPointStepper.tsx";

const GENERAL = 0;
const BROKEN = 1;
const BANNERS = 2;
const QUARTERED = 3;
const HERO_KILLS = 4;

/*
 * **SCORING VICTORY POINTS**
 *
 * - You score 1 Victory Point if the enemy General was wounded during the game.
 * If the enemy General has been wounded, and only has 1 Wound remaining, then you instead score 3 Victory Points.
 * If the enemy General was removed as a casualty, you instead score 5 Victory Points.
 *
 * - You score 3 Victory Points if the enemy Army is Broken at the end of the game.
 * If the enemy Army is Broken and your Army is not, you instead score 5 Victory Points.
 *
 * - You score 2 Victory Points if your opponent has no banners remaining at the end of the game
 * (if they didn’t have a banner to start with, you automatically score this).
 *
 * - You score 1 Victory Point if you have at least one banner remaining at the end of the game.
 * If you have more banners remaining than your opponent, then you instead score 2 Victory Points.
 *
 * - You score 3 Victory Points if the enemy Army has been reduced to 25% of its starting models at the end of the game.
 *
 * - You score 1 Victory Point for each enemy Hero model that has been removed as a casualty, up to a maximum of 3 Victory Points
 */
export const ToTheDeathVPs: FunctionComponent<QuestionListProps> = (props) => {
  const { victoryPoints, setVictoryPoints } = useGameModeState();
  const [activeStep, setActiveStep] = useState(0);

  const [generalVPs, setGeneralVPs] = useState(victoryPoints[0]);
  const [brokenVPs, setBrokenVPs] = useState(victoryPoints[1]);
  const [bannersRemaining, setBannersRemaining] = useState(victoryPoints[2]);
  const [quarteredVPs, setQuarteredVPs] = useState(victoryPoints[3]);
  const [heroesKilled, setHeroesKilled] = useState(victoryPoints[4]);

  const getBannerVPs = (banners: number, enemyBanners: number) => {
    if (banners === 0 && enemyBanners === 0) {
      return [0, 0];
    }
    if (banners === enemyBanners) {
      return [1, -1];
    }
    const other = banners !== 0 && enemyBanners !== 0 ? 1 : 0;
    return banners > enemyBanners ? [2, -other] : [other, -2];
  };

  const getHeroKillVPs = () => {
    return [Math.min(heroesKilled[0], 3), -Math.min(heroesKilled[1], 3)];
  };

  const updateGameResultState = () => {
    const bannerVPs = getBannerVPs(bannersRemaining[0], bannersRemaining[1]);
    const heroKillVPs = getHeroKillVPs();
    const playerVPs = [
      generalVPs[0],
      brokenVPs[0],
      bannerVPs[0],
      quarteredVPs[0],
      heroKillVPs[0],
    ].reduce((a, b) => a + b, 0);
    const opponentVPs = [
      generalVPs[1],
      brokenVPs[1],
      bannerVPs[1],
      quarteredVPs[1],
      heroKillVPs[1],
    ].reduce((a, b) => a - b, 0);

    props.updateFormValues({
      victoryPoints: playerVPs,
      opponentVictoryPoints: opponentVPs,
    });
  };

  useEffect(() => {
    updateGameResultState();
    setVictoryPoints([
      generalVPs,
      brokenVPs,
      bannersRemaining,
      quarteredVPs,
      heroesKilled,
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generalVPs, brokenVPs, bannersRemaining, quarteredVPs, heroesKilled]);

  return (
    <Box sx={{ mt: 2 }}>
      {activeStep === GENERAL && (
        <ToTheDeathGeneralWoundVPs
          value={generalVPs}
          setValue={setGeneralVPs}
        />
      )}

      {activeStep === BROKEN && (
        <BrokenVPs
          value={brokenVPs}
          setValue={setBrokenVPs}
          vpSpread={[0, 3, 5]}
        />
      )}

      {activeStep === BANNERS && (
        <BannerVPs value={bannersRemaining} setValue={setBannersRemaining} />
      )}

      {activeStep === QUARTERED && (
        <BrokenVPs
          value={quarteredVPs}
          setValue={setQuarteredVPs}
          label="quartered"
          vpSpread={[0, 3, 3]}
        />
      )}

      {activeStep === HERO_KILLS && (
        <ToTheDeathHeroKillVPs
          value={heroesKilled}
          setValue={setHeroesKilled}
        />
      )}

      <VictoryPointStepper
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        totalSteps={5}
      />
    </Box>
  );
};

type GeneralWoundVPsProps = {
  setValue: (value: number[]) => void;
  value: number[];
};
export const ToTheDeathGeneralWoundVPs: FunctionComponent<
  GeneralWoundVPsProps
> = ({ value, setValue }) => {
  const vpSpread = { killed: 5, oneWound: 3, wounded: 1, unharmed: 0 };
  const handleOnChange = (_: ChangeEvent, v: string) => {
    setValue([value[0], -vpSpread[v]]);
  };
  const handleOnChangeEnemy = (_: ChangeEvent, v: string) => {
    setValue([vpSpread[v], value[1]]);
  };
  return (
    <Stack>
      <FormControl>
        <FormLabel>Your General</FormLabel>
        <RadioGroup row name="hero" onChange={handleOnChange}>
          <FormControlLabel
            value="unharmed"
            checked={value[1] === 0}
            control={<Radio />}
            label="Unharmed"
          />
          <FormControlLabel
            value="wounded"
            checked={value[1] === -1}
            control={<Radio />}
            label="Wounded"
          />
          <FormControlLabel
            value="oneWound"
            checked={value[1] === -3}
            control={<Radio />}
            label="One wound left"
          />
          <FormControlLabel
            value="killed"
            checked={value[1] === -5}
            control={<Radio />}
            label="Killed"
          />
        </RadioGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Enemy General</FormLabel>
        <RadioGroup row name="hero" onChange={handleOnChangeEnemy}>
          <FormControlLabel
            value="unharmed"
            checked={value[0] === 0}
            control={<Radio />}
            label="Unharmed"
          />
          <FormControlLabel
            value="wounded"
            checked={value[0] === 1}
            control={<Radio />}
            label="Wounded"
          />
          <FormControlLabel
            value="oneWound"
            checked={value[0] === 3}
            control={<Radio />}
            label="One wound left"
          />
          <FormControlLabel
            value="killed"
            checked={value[0] === 5}
            control={<Radio />}
            label="Killed"
          />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
};

type HeroKillVPsProps = {
  value: number[];
  setValue: (value: (number | null)[]) => void;
};
const ToTheDeathHeroKillVPs: FunctionComponent<HeroKillVPsProps> = ({
  value,
  setValue,
}) => {
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
        label="Enemy heroes you killed"
        name="heroes"
        value={value[0]}
        type="number"
        slotProps={{ htmlInput: { min: 0 } }}
        onChange={onChange}
        size="small"
        required
      />
      <TextField
        fullWidth
        label="Heroes killed by the enemy"
        name="opponentHeroes"
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
