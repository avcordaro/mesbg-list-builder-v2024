import { mesbgData, profileData } from "../../assets/data.ts";
import { Option, Unit } from "../../types/mesbg-data.types.ts";
import { Profile } from "../../types/profile-data.types.ts";
import {
  convertBardsFamilyToSingleRows,
  convertShankAndWrotToSingleRows,
  convertSharkeyAndWormToSingleRows,
} from "./utils/special-rows.ts";

const emptyProfile: Profile = {
  Mv: "",
  Fv: "",
  Sv: "",
  S: "",
  D: "",
  A: "",
  W: "",
  C: "",
  I: "",
  Range: "",
  special_rules: [],
  active_or_passive_rules: [],
  additional_stats: [],
  additional_text: [],
  heroic_actions: [],
  magic_powers: [],
  wargear: [],
};

const getProfileData = ([{ profile_origin, name }]: Unit[]) => {
  const profiles = profileData[profile_origin];
  if (!profiles) return emptyProfile;
  const profile = profiles[name];
  if (!profile) return emptyProfile;
  return profile;
};

export type DatabaseRow = {
  army_type: "Good" | "Good (Legacy)" | "Evil" | "Evil (Legacy)";
  profile_origin: string;
  unit_type: (
    | "Warrior"
    | "Hero of Legend"
    | "Hero of Valour"
    | "Hero of Fortitude"
    | "Minor Hero"
    | "Independent Hero"
    | "Independent Hero*"
    | "Siege Engine"
    | "Siege Equipment"
    | string
  )[];
  army_list: string[];
  option_mandatory: boolean;
  options: Option[];
  name: string;
  MWFW: string[][] | never[];
  profile: (Profile & { name: string }) | Profile;
  Mv: number;
  M: number | string;
  W: number | string;
  F: number | string;
  searchString: string;
};

export const rows: DatabaseRow[] = Object.values(
  Object.values(mesbgData).reduce((acc, currentValue) => {
    const name = `${currentValue.name}-${currentValue.profile_origin}`;
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(currentValue);

    return acc;
  }, {}),
)
  .flatMap((dataPoint: Unit[]) => {
    if (dataPoint[0].name === "Bard's Family") {
      return convertBardsFamilyToSingleRows(dataPoint);
    }
    if (dataPoint[0].name === "Shank & Wrot") {
      return convertShankAndWrotToSingleRows(dataPoint);
    }
    if (dataPoint[0].name === "Sharkey & Worm") {
      return convertSharkeyAndWormToSingleRows(dataPoint);
    }
    const profile = getProfileData(dataPoint);
    return {
      name: dataPoint[0].name,
      army_type: dataPoint[0].army_type,
      profile_origin: dataPoint[0].profile_origin,
      unit_type: [...new Set(dataPoint.map((p) => p.unit_type))],
      army_list: dataPoint.map((p) => p.army_list),
      option_mandatory: dataPoint[0].opt_mandatory,
      options: dataPoint
        .flatMap((p) => p.options)
        .filter((o, i, s) => s.findIndex((ot) => ot.name === o.name) === i),
      MWFW: dataPoint.flatMap((p) => p.MWFW),
      profile: profile,
    };
  })
  .map((row) => {
    const [M, W, F] =
      row.name === "The Witch-king of Angmar" || row.name === "Ringwraith"
        ? ["*", "*", "*"]
        : row.MWFW[0]
          ? row.MWFW[0][1].split(":")
          : ["-", "-", "-"];
    return {
      ...row,
      Mv: !Number.isNaN(parseInt(row.profile.Mv))
        ? parseInt(row.profile.Mv)
        : -1,
      M,
      W,
      F,
      searchString: [
        row.name,
        row.profile_origin,
        row.army_list.join(","),
        row.profile.special_rules.join(","),
        row.profile.heroic_actions.join(","),
        row.profile.wargear.join(","),
        row.profile.active_or_passive_rules.map(({ name }) => name).join(","),
        row.profile.magic_powers.map(({ name }) => name).join(","),
      ]
        .join(",")
        .toLowerCase(),
    };
  });
