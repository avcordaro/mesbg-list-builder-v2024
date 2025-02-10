import { FormControl, FormLabel, Radio, RadioGroup } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ChangeEvent, FunctionComponent } from "react";

type GeneralWoundVPsProps = {
  label: string;
  groupId?: string;
  setValue: (value: number) => void;
  value: number;
  vpSpread?: number[];
};

export const GeneralWoundVPs: FunctionComponent<GeneralWoundVPsProps> = ({
  label,
  groupId = label,
  value,
  setValue,
  vpSpread = [0, 1, 2],
}) => {
  const handleOnChange = (_: ChangeEvent, value: string) => {
    switch (value) {
      case "unharmed":
        setValue(vpSpread[0]);
        break;
      case "wounded":
        setValue(vpSpread[1]);
        break;
      case "killed":
        setValue(vpSpread[2]);
        break;
    }
  };
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <RadioGroup row name={groupId} onChange={handleOnChange}>
        <FormControlLabel
          value="unharmed"
          checked={value === vpSpread[0]}
          control={<Radio />}
          label="Unharmed"
        />
        <FormControlLabel
          value="wounded"
          checked={value === vpSpread[1]}
          control={<Radio />}
          label="Wounded"
        />
        <FormControlLabel
          value="killed"
          checked={value === vpSpread[2]}
          control={<Radio />}
          label="Killed"
        />
      </RadioGroup>
    </FormControl>
  );
};
