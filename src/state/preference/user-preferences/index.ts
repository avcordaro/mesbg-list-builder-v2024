import { Slice } from "../../Slice.ts";

export type Preferences =
  //   General UI preferences
  | "darkMode"
  | "mobileRosterToolbar"
  | "oldShareScreen"
  | "hideRostersInNavigation"
  | "forceShowCardActionButtons"
  //   Builder restriction preferences
  | "allowCompulsoryGeneralDelete"
  //   Collection preferences
  | "collectionWarnings"
  //   Auto update preferences
  | "autoUpdateUnitData"
  // Pdf Preferences
  | "removePdfPageBreak"
  | "includePdfSpecialRuleDescriptions"
  | "includePdfHeroicActionDescriptions"
  | "enableHidePdfSections"
  | "hidePdfQuickRefTable"
  | "hidePdfArmyComposition"
  | "hidePdfProfiles"
  | "hidePdfSpecialRules"
  | "hidePdfArmyRules"
  | "hidePdfHeroicActions"
  | "hidePdfMagicPowers"
  | "hidePdfStatTrackers"
  //   Special rule drawer preferences
  | "colorCodedRules"
  | "splitActiveRules";

export type PreferenceState = {
  preferences: Record<Preferences, boolean>;
  setPreference: (key: Preferences, value: boolean) => void;
};

const initialState: Pick<PreferenceState, "preferences"> = {
  preferences: {
    mobileRosterToolbar: true,
    autoUpdateUnitData: false,
    colorCodedRules: true,
    splitActiveRules: false,
    oldShareScreen: false,
    collectionWarnings: false,
    darkMode: false,
    allowCompulsoryGeneralDelete: false,
    removePdfPageBreak: false,
    includePdfSpecialRuleDescriptions: false,
    includePdfHeroicActionDescriptions: false,
    enableHidePdfSections: false,
    hidePdfArmyComposition: false,
    hidePdfHeroicActions: false,
    hidePdfMagicPowers: false,
    hidePdfProfiles: false,
    hidePdfQuickRefTable: false,
    hidePdfSpecialRules: false,
    hidePdfArmyRules: false,
    hidePdfStatTrackers: false,
    hideRostersInNavigation: false,
    forceShowCardActionButtons: false,
  },
};

export const userPreferences: Slice<PreferenceState, PreferenceState> = (
  set,
) => ({
  ...initialState,

  setPreference: (key: Preferences, value: boolean) =>
    set(
      ({ preferences }) => ({
        preferences: {
          ...preferences,
          [key]: value,
        },
      }),
      undefined,
      "UPDATE_PREFERENCES",
    ),
});
