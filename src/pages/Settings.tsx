import {
  AutoAwesome,
  CategoryOutlined,
  ChecklistRtl,
  DarkMode,
  HideImageOutlined,
  InsertPageBreak,
  ManageAccounts,
  PersonRemove,
  PhotoCameraOutlined,
  Summarize,
  SwitchAccessShortcut,
  UnfoldLess,
  Update,
} from "@mui/icons-material";

import { Collapse } from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
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
import { useThemeContext } from "../theme/ThemeContext.tsx";
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
  const { toggleTheme, mode } = useThemeContext();
  const { preferences, setPreference } = useUserPreferences();
  const { openSidebar } = useAppState();

  const pdfSectionOptions: {
    key: Preferences;
    name: string;
    description: string;
  }[] = [
    {
      key: "hidePdfQuickRefTable",
      name: "Hide quick reference sheet",
      description: "Quick reference sheet",
    },
    {
      key: "hidePdfArmyComposition",
      name: "Hide army composition",
      description: "Army Composition",
    },
    {
      key: "hidePdfProfiles",
      name: "Hide profiles",
      description: "Profiles",
    },
    {
      key: "hidePdfSpecialRules",
      name: "Hide special rules",
      description: "Special rules",
    },
    {
      key: "hidePdfArmyRules",
      name: "Hide Army special rules",
      description: "Army special rules",
    },
    {
      key: "hidePdfHeroicActions",
      name: "Hide heroic actions",
      description: "Heroic Actions",
    },
    {
      key: "hidePdfMagicPowers",
      name: "Hide magical powers",
      description: "Magical Powers",
    },
    {
      key: "hidePdfStatTrackers",
      name: "Hide might/will/fate trackers",
      description: "Might / Will / Fate trackers",
    },
  ];

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
          mt: 2,
        }}
      >
        <Divider textAlign="left">
          <Typography variant="h6">General preferences</Typography>
        </Divider>
        <SettingsOption
          icon={<DarkMode />}
          label="Darkmode"
          description="Switch between light and dark themes to adjust the app's appearance for better readability and comfort in different lighting conditions."
          value={mode === "dark"}
          onChange={toggleTheme}
        />
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
          icon={<Summarize />}
          label="Hide individual rosters in navigation"
          description={
            "Having many rosters can clog-up your menubar on the left. Hiding individual rosters and allowing " +
            "direct group navigation can help you stay organized!"
          }
          value={preferences.hideRostersInNavigation || false}
          onChange={updatePreference("hideRostersInNavigation")}
        />
        <SettingsOption
          icon={<UnfoldLess />}
          label="Show mutation buttons when collapsed"
          description="Keep the mutation buttons (increment, decrement, delete, ect.) in view when collapsing a warband. (Note: this only affect small screens!)"
          value={preferences.forceShowCardActionButtons || false}
          onChange={updatePreference("forceShowCardActionButtons")}
        />
        <SettingsOption
          icon={<PhotoCameraOutlined />}
          label="Use the old roster summary table"
          description="If you dislike the new Roster Summary screen you can go back to the old v2018 'black and white' table layout."
          value={preferences.oldShareScreen || false}
          onChange={updatePreference("oldShareScreen")}
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
        />

        <Divider textAlign="left">
          <Typography variant="h6">Drawer preferences</Typography>
        </Divider>
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
          label="Move 'active' special rules and magical powers to the top"
          description={
            "Split the list of special rules and magical powers in their respective drawers into a list of rules " +
            "that are applicable to the selected roster."
          }
          value={preferences.splitActiveRules}
          onChange={updatePreference("splitActiveRules")}
        />
        <Divider textAlign="left">
          <Typography variant="h6">PDF preferences</Typography>
        </Divider>
        <SettingsOption
          icon={<ManageAccounts />}
          label="Include Special Rule description per unit"
          description="Include the full special rule description directly into the relevant profiles within the Profiles section of the Printable PDF."
          value={preferences.includePdfSpecialRuleDescriptions || false}
          onChange={updatePreference("includePdfSpecialRuleDescriptions")}
        />
        <SettingsOption
          icon={<ManageAccounts />}
          label="Include Heroic Action description per unit"
          description="Include the full heroic action description directly into the relevant profiles within the Profiles section of the Printable PDF."
          value={preferences.includePdfHeroicActionDescriptions || false}
          onChange={updatePreference("includePdfHeroicActionDescriptions")}
        />
        <SettingsOption
          icon={<InsertPageBreak />}
          label="Disable page breaks"
          description="Remove all the page breaks on the PDF and create one fluid document."
          value={preferences.removePdfPageBreak || false}
          onChange={updatePreference("removePdfPageBreak")}
        />
        <SettingsOption
          icon={<HideImageOutlined />}
          label="Hide specific sections"
          description="Enable hiding specific sections on the Printable PDF such as the heroic actions or army composition."
          value={preferences.enableHidePdfSections || false}
          onChange={updatePreference("enableHidePdfSections")}
        />
        <Collapse in={preferences.enableHidePdfSections}>
          {pdfSectionOptions.map((option) => (
            <SettingsOption
              key={option.key}
              icon={<></>}
              label={option.name}
              description={`Hide the ${option.description} section on the Printable PDF.`}
              value={preferences[option.key] || false}
              onChange={updatePreference(option.key)}
            />
          ))}
        </Collapse>
        <Divider textAlign="left">
          <Typography variant="h6">Collection preferences</Typography>
        </Divider>
        <SettingsOption
          icon={<CategoryOutlined />}
          label="Collection based warnings"
          description="Receive warnings/notifications if your army list includes models outside your collection or exceeds the quantity you own, ensuring your lists stay within the limits of your personal inventory."
          value={preferences.collectionWarnings || false}
          onChange={updatePreference("collectionWarnings")}
        />

        <Divider textAlign="left">
          <Typography variant="h6">Builder restrictions preferences</Typography>
        </Divider>
        <SettingsOption
          icon={<PersonRemove />}
          label="Enable removing mandatory army generals"
          description={
            'Certain tournaments allow you to remove mandatory army generals in favor of smaller list. Enabling this allows you to remove the "who is always the Army\'s General" unit from your rosters.'
          }
          value={preferences.allowCompulsoryGeneralDelete || false}
          onChange={updatePreference("allowCompulsoryGeneralDelete")}
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
