import { Slice } from "../../Slice.ts";

export type Preferences =
  | "mobileRosterToolbar"
  | "autoUpdateUnitData"
  | "colorCodedRules"
  | "splitActiveRules"
  | "oldShareScreen";

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
