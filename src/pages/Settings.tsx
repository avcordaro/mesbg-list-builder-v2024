import {
  AutoAwesome,
  ChecklistRtl,
  SwitchAccessShortcut,
  Update,
} from "@mui/icons-material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { ChangeEvent, FunctionComponent, ReactNode } from "react";
import { DrawerTypes } from "../components/drawer/drawers.tsx";
import { useAppState } from "../state/app";
import { useUserPreferences } from "../state/preference";
import { Preferences } from "../state/preference/user-preferences";
import { slugify } from "../utils/string.ts";

export type SettingsOptionProps = {
  icon: ReactNode;
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

const SettingsOption: FunctionComponent<SettingsOptionProps> = (props) => {
  const handleToggle = (_: ChangeEvent<HTMLInputElement>, value: boolean) =>
    props.onChange(value);

  return (
    <ListItem>
      <ListItemButton
        onClick={() => props.onChange(!props.value)}
        disabled={props.disabled}
      >
        <ListItemIcon>{props.icon}</ListItemIcon>
        <ListItemText
          id={slugify(props.label)}
          primary={props.label}
          secondary={props.description}
        />
        <Switch
          edge="end"
          onChange={handleToggle}
          checked={props.value}
          disabled={props.disabled}
        />
      </ListItemButton>
    </ListItem>
  );
};

export const Settings = () => {
  const { preferences, setPreference } = useUserPreferences();
  const { openSidebar } = useAppState();

  const updatePreference = (preference: Preferences) => (value: boolean) =>
    setPreference(preference, value);

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 5 }}>
      <Typography variant="h4" className="middle-earth">
        Application Settings
      </Typography>

      <List
        sx={{
          width: "100%",
        }}
      >
        <SettingsOption
          icon={<ChecklistRtl />}
          label="Display roster summary toolbar when overview sidebar collapses"
          description={
            "The roster information drawer on the right becomes toggleable on smaller screens. This hides the " +
            "roster total size and bow/throw limits when building the roster. Enabling this option enables the " +
            "roster summary toolbar."
          }
          value={preferences.mobileRosterToolbar}
          onChange={updatePreference("mobileRosterToolbar")}
        />

        <SettingsOption
          icon={<Update />}
          label="Automatically update selected units when datafiles update"
          description={
            "Unit data is locked in when selecting a unit. Changes to the datafiles are not applied to " +
            "already built rosters. Enabling this option will 'auto-update' your roster to the latest " +
            "data file with a (small) risk of corruption."
          }
          value={preferences.autoUpdateUnitData}
          onChange={updatePreference("autoUpdateUnitData")}
          disabled
        />

        <SettingsOption
          icon={<AutoAwesome />}
          label="Highlight special rules and magical powers based on selected roster"
          description={
            "Color-code the special rules and magical powers in their respective drawers for those that are used " +
            "by the selected roster."
          }
          value={preferences.colorCodedRules}
          onChange={updatePreference("colorCodedRules")}
        />

        <SettingsOption
          icon={<SwitchAccessShortcut />}
          label={"Move 'active' special rules and magical powers to the top"}
          description={
            "Split the list of special rules and magical powers in their respective drawers into a list of rules " +
            "that are applicable to the selected roster."
          }
          value={preferences.splitActiveRules}
          onChange={updatePreference("splitActiveRules")}
        />
      </List>

      <Stack>
        <Typography textAlign="center" variant="overline">
          Version {BUILD_VERSION}, Last updated {BUILD_DATE}
        </Typography>
        <Button
          variant="text"
          sx={{ textDecoration: "underline", m: 0, p: 0 }}
          onClick={() => openSidebar(DrawerTypes.CHANGELOG)}
        >
          See changelog
        </Button>
      </Stack>
    </Container>
  );
};
