import { Autocomplete, ListItemIcon, TextField } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import data from "../../../assets/data/mesbg_data.json";
import { ArmyType } from "../../../types/mesbg-data.types.ts";
import { FactionLogo } from "../images/FactionLogo.tsx";

export type SelectedArmyList = {
  title: string;
  type: string;
  hero?: string;
  army: string;
};

export type ArmySelectionInputProps = {
  armyList: SelectedArmyList;
  setArmyList: (armyList: SelectedArmyList) => void;
};

export const ArmySelectionInput = ({
  armyList,
  setArmyList,
}: ArmySelectionInputProps) => {
  const armyTypeOrder: Record<ArmyType, number> = {
    "Evil (Legacy)": 4,
    "Good (Legacy)": 2,
    Evil: 3,
    Good: 1,
  };

  const armyLists = Object.values(data)
    .map((item) => ({
      title: item.army_list,
      army: item.army_list,
      type: item.army_type,
    }))
    .filter(
      (value, index, array) =>
        array.findIndex((other) => other.title === value.title) === index,
    )
    .sort((a, b) => armyTypeOrder[a.type] - armyTypeOrder[b.type]);

  const heroesPerArmy = Object.values(data)
    .filter((item) => item.unit_type && item.unit_type.includes("Hero"))
    .map((item) => ({
      title: `${item.name.split("(")[0].trim()} (${item.army_list})`,
      hero: item.name.split("(")[0].trim(),
      army: item.army_list,
      type: "Hero",
    }))
    .filter(
      (value, index, array) =>
        array.findIndex((other) => other.title === value.title) === index,
    )
    .sort((a, b) => armyTypeOrder[a.type] - armyTypeOrder[b.type]);

  return (
    <Autocomplete
      disableClearable
      options={[...armyLists, ...heroesPerArmy]}
      getOptionLabel={(option) => option.title}
      renderOption={(props, option) => {
        return (
          <ListItem {...props} key={option.title}>
            <ListItemIcon>
              <FactionLogo faction={option.army} />
            </ListItemIcon>
            <ListItemText>{option.title}</ListItemText>
          </ListItem>
        );
      }}
      groupBy={(option) => option.type}
      value={armyList}
      onChange={(_, newValue) => {
        setArmyList(newValue);
      }}
      filterOptions={(_, state) => {
        if (state.inputValue.length === 0) return armyLists;
        const f = state.inputValue.toLowerCase();
        const lists = armyLists.filter(({ army }) =>
          army.toLowerCase().includes(f),
        );
        if (f.length < 3) {
          return lists;
        }
        const heroes = heroesPerArmy.filter(({ hero }) =>
          hero.toLowerCase().includes(f),
        );
        return [...lists, ...heroes];
      }}
      blurOnSelect={true}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Type to filter..."
          label="Army"
          helperText="Filter by typing the name of the Army List OR the name of a Hero you wish to play."
        />
      )}
    />
  );
};
