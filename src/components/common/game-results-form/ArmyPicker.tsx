import { Autocomplete, ListItemIcon, TextField } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { FunctionComponent, useEffect, useState } from "react";
import data from "../../../assets/data/mesbg_data.json";
import { ArmyType } from "../../../types/mesbg-data.types.ts";
import { FactionLogo } from "../images/FactionLogo.tsx";

const armiesByType = Object.values(data)
  .map((item) => ({
    army: item.army_list,
    type: item.army_type,
    faction: item.profile_origin,
  }))
  .filter(
    (item, index, array) =>
      array.findIndex((other) => other.army === item.army) === index,
  )
  .reduce(
    (a, { army, faction, type }) => {
      if (!a[type]) a[type] = new Set();
      a[type].add({ army, faction });
      return a;
    },
    {
      Good: undefined,
      Evil: undefined,
    } as Record<ArmyType, Set<{ army: string; faction: string }>>,
  );

type Option = {
  army: string;
  faction: string;
  type: ArmyType;
};

export type ArmyPickerProps = {
  label: string;
  placeholder?: string;
  defaultSelection?: string[];
  onChange: (values: Option[]) => void;
  autoFocus?: boolean;
  required?: boolean;
  error?: boolean;
};

export const ArmyPicker: FunctionComponent<ArmyPickerProps> = (props) => {
  const makeOptions = (type: ArmyType): Option[] =>
    [...armiesByType[type]].map(({ army, faction }) => ({
      army,
      faction,
      type,
    }));

  const allOptions = [...makeOptions("Good"), ...makeOptions("Evil")];

  const [value, setValue] = useState<Option[]>([]);
  const [options, setOptions] = useState<Option[]>(allOptions);

  const onOptionSelectionChanged = (newSelection: Option[]) => {
    setValue(newSelection); // update the selection in state
    if (newSelection.length > 0) {
      const armyType = newSelection[0].type;
      if (armyType.includes("LL")) {
        // If an LL is selected, it will be the only available option, nothing can be added.
        setOptions(newSelection);
      } else {
        // Else (so Good/Evil Army), only armies of that same type can be selected.
        setOptions(makeOptions(armyType));
      }
    } else {
      // If the input was cleared, all options become available.
      setOptions(allOptions);
    }

    // Forward the change to the parent component.
    props.onChange(newSelection);
  };

  useEffect(() => {
    if (props.defaultSelection) {
      const defaultSelection = allOptions.filter((option) =>
        props.defaultSelection.includes(option.army),
      );
      onOptionSelectionChanged(defaultSelection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Autocomplete
      multiple
      options={options}
      getOptionLabel={(option) => option.army}
      renderOption={(props, option) => {
        return (
          <ListItem {...props}>
            <ListItemIcon>
              <FactionLogo faction={option.army} />
            </ListItemIcon>
            <ListItemText>
              <Typography>{option.army}</Typography>
            </ListItemText>
          </ListItem>
        );
      }}
      groupBy={(option) => option.type}
      value={value}
      onChange={(_, newValue) => {
        onOptionSelectionChanged(newValue);
      }}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          placeholder={props.placeholder}
          size="small"
          required={props.required}
          error={props.error}
        />
      )}
      autoFocus={props.autoFocus}
    />
  );
};
