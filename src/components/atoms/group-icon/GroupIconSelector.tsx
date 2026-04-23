import { Autocomplete, ListItemIcon, TextField } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { JSX } from "react";
import { factionLogos, gameIcons, numberIcons } from "./icons.tsx";

export type Option = {
  name: string;
  icon: JSX.Element;
  type: "Faction Icons" | "Custom Icons" | "Number Icons";
};

export const GroupIconSelector = ({
  selectedIcon,
  setSelectedIcon,
}: {
  selectedIcon: Option;
  setSelectedIcon: (newValue: Option) => void;
}) => {
  const getIconSet = (
    icons: Record<string, JSX.Element>,
    type: Option["type"],
  ): Option[] =>
    Object.entries(icons)
      .map(([name, icon]) => ({ name, icon, type }))
      .sort((a, b) => a.name.localeCompare(b.name));

  const options: Option[] = [
    ...getIconSet(factionLogos, "Faction Icons"),
    ...getIconSet(gameIcons, "Custom Icons"),
    ...getIconSet(numberIcons, "Number Icons"),
  ];

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => {
        return (
          <ListItem {...props} key={option.name}>
            <ListItemIcon>{option.icon}</ListItemIcon>
            <ListItemText>{option.name}</ListItemText>
          </ListItem>
        );
      }}
      groupBy={(option) => option.type}
      value={selectedIcon}
      onChange={(_, newValue) => {
        setSelectedIcon(newValue);
      }}
      filterSelectedOptions
      blurOnSelect={true}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Type to filter..."
          label="Group Icon (optional)"
          helperText={
            <Typography variant="body2" component="span">
              Extra custom icons can be included on request. See{" "}
              <a href="https://react-icons.github.io/react-icons/">
                react-icons
              </a>{" "}
              for all potential options.
            </Typography>
          }
        />
      )}
    />
  );
};
