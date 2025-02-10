import { Checkbox, FormGroup, FormLabel } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FunctionComponent, useEffect, useState } from "react";

type BrokenVPsProps = {
  value: number[];
  setValue: (value: number[]) => void;
  label?: string;
  vpSpread?: number[];
};

export const BrokenVPs: FunctionComponent<BrokenVPsProps> = ({
  value,
  setValue,
  label = "broken",
  vpSpread = [0, 1, 3],
}) => {
  const [broken, setBroken] = useState(value[1] !== 0);
  const [enemyBroken, setEnemyBroken] = useState(value[0] !== 0);

  const getVPs = () => {
    if (broken && enemyBroken) return [vpSpread[1], -vpSpread[1]];
    if (!broken && enemyBroken) return [vpSpread[2], vpSpread[0]];
    if (broken && !enemyBroken) return [vpSpread[0], -vpSpread[2]];
    return [0, 0];
  };

  useEffect(() => {
    const vps = getVPs();
    setValue(vps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [broken, enemyBroken]);

  return (
    <FormGroup>
      <FormLabel>Who was {label} at the end of the game</FormLabel>
      <FormControlLabel
        checked={broken}
        onChange={(_, value) => setBroken(value)}
        control={<Checkbox />}
        label={`I was ${label}`}
      />
      <FormControlLabel
        checked={enemyBroken}
        onChange={(_, value) => setEnemyBroken(value)}
        control={<Checkbox />}
        label={`They were ${label}`}
      />
    </FormGroup>
  );
};
