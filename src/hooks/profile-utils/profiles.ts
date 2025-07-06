import { profileData } from "../../assets/data.ts";
import { Option, StatModifier } from "../../types/mesbg-data.types.ts";
import { Stats } from "../../types/profile-data.types.ts";
import {
  isSelectedUnit,
  Roster,
  SelectedUnit,
  Warband,
} from "../../types/roster.ts";
import { selectedOptionWithName } from "../../utils/options.ts";
import { getAdditionalStats } from "./additional-profiles.ts";
import { combineProfiles, duplicateProfiles } from "./deduplication.ts";
import { getMightWillAndFate } from "./might-will-fate.ts";
import { Profile } from "./profile.type.ts";
import { byHeroicTier } from "./sorting.ts";
import { getAdditionalSpecialRules } from "./special-rules.ts";

type ProfileList = {
  profiles: Profile[];
  missing: string[];
};

export const isMissingProfile = (
  unit: Profile[] | { missing: true; profile: string },
): unit is { missing: true; profile: string } =>
  !!(unit as { missing: true; profile: string })?.missing === true;

const sumModifiers = (
  modifiers: StatModifier[],
): Record<keyof Stats, number> => {
  return modifiers.reduce(
    (acc, { stat, mod }) => {
      acc[stat] = (acc[stat] || 0) + mod;
      return acc;
    },
    {} as Record<keyof Stats, number>,
  );
};

const splitStatValue = (value: string) => {
  if (!value) return ["", ""];
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return [value, ""]; // fallback if not a match
  return [parseInt(match[1], 10), match[2]];
};

const applyModifiersToStats = (
  { Mv, Fv, Sv, S, D, A, W, C, I, Range }: Stats,
  modifiers: Record<keyof Stats, number>,
): Stats => {
  const baseStats = { Mv, Fv, Sv, S, D, A, W, C, I, Range };
  return Object.fromEntries(
    Object.entries(baseStats).map(([stat, value]) => {
      const mod = modifiers[stat] || 0;
      const [num, suffix] = splitStatValue(value);
      if (typeof num === "number" && !isNaN(num)) {
        return [stat, String(num + mod) + suffix];
      }
      return [stat, value]; // fallback: leave unchanged
    }),
  ) as Stats;
};

const getCorrectedProfileBasedOnOptionSelection = (
  options: Option[],
  originalStats: Stats,
): { suffix: string; correctedStats: Partial<Stats> } => {
  const modifiers = options.filter(
    (option) =>
      option.quantity > 0 && !!option.modifiers && option.modifiers.length > 0,
  );

  if (modifiers.length === 0) return { correctedStats: {}, suffix: "" };

  const optionNames = modifiers
    .flatMap((option) => option.modifiers)
    .map((modifier) => modifier.label)
    .join(", ");
  const corrections = applyModifiersToStats(
    originalStats,
    sumModifiers(modifiers.flatMap((option) => option.modifiers)),
  );

  return { correctedStats: corrections, suffix: ` (${optionNames})` };
};

/**
 * This function transforms a specific Unit into all the profile data. For most units this is simple lookup
 * of the profile data in the datafile. Here the data is listed as part of the army (profile origin) and the
 * unit's name.
 *
 * In case of more complex units this could and up into multiple profiles.
 *
 * @param unit
 */
function transformUnitToListOfProfiles(
  unit: SelectedUnit,
): Profile[] | { missing: true; profile: string } {
  const army = profileData[unit.profile_origin];
  if (!army)
    return { missing: true, profile: `${unit.profile_origin} - ${unit.name}` };

  const profile = army[unit.name];
  if (!profile)
    return { missing: true, profile: `${unit.profile_origin} - ${unit.name}` };

  if (unit.name.includes("&") || unit.name === "Sharkey and Worm") {
    return profile.additional_stats.map((stats) => {
      const MWFW = unit.MWFW.find(([hName]) => hName === stats.name);
      if (!MWFW)
        return {
          ...stats,
          HM: "-",
          HW: "-",
          HF: "-",
          type: ["Snow Troll"].includes(stats.name)
            ? "Warrior"
            : unit.unit_type,
        };
      const [HM, HW, HF] = MWFW[1].split(":");
      return { ...stats, HM, HW, HF, type: unit.unit_type };
    });
  }

  if (
    unit.profile_origin === "Mordor" &&
    ["The Witch-king of Angmar", "Ringwraith"].includes(unit.name)
  ) {
    const regex = /^(\d+)A \/ (\d+)M \/ (\d+)W \/ (\d+)F$/;
    const amwfOption = unit.options.find(
      (option) => option.name.match(regex) && option.quantity > 0,
    );
    if (amwfOption) {
      const matches = amwfOption.name.match(regex);
      profile.A = matches[1];
    }
  }

  const { correctedStats, suffix } = getCorrectedProfileBasedOnOptionSelection(
    unit.options,
    profile,
  );

  const modifiedProfile = {
    ...profile,
    ...getMightWillAndFate(unit),
    ...correctedStats,
  };

  const additional_stats =
    suffix && !unit.unique
      ? [
          { name: unit.name + suffix, ...modifiedProfile },
          ...getAdditionalStats(unit, profile),
        ]
      : getAdditionalStats(unit, profile);
  const additional_special_rules = getAdditionalSpecialRules(unit);
  const used_active_or_passive_rules = profile.active_or_passive_rules.filter(
    (rule) => {
      if (!rule.option_dependency) return true;
      const option = unit.options.find(
        selectedOptionWithName(rule.option_dependency),
      );
      return !!option; // return true if the option was found with quantity >0
    },
  );

  return [
    {
      name: unit.name,
      type: unit.unit_type,
      ...profile,
      ...getMightWillAndFate(unit),
      ...(suffix && unit.unique ? modifiedProfile : {}), // apply the stat updates if the unit is unique and does not get a additional row.
      additional_stats,
      special_rules: [...profile.special_rules, ...additional_special_rules],
      active_or_passive_rules: used_active_or_passive_rules,
    },
  ];
}

/**
 * Creates a list of all units in a given warband, including the hero leading the warband.
 *
 * @param warband
 */
function convertWarbandToUnits(warband: Warband): SelectedUnit[] {
  return [warband.hero, ...warband.units].filter(isSelectedUnit);
}

/**
 * Function that converts the roster into all the required profiles. It comes back with a
 * complete list of profiles and a set missing profiles (units that have no profile data
 * in the data files)
 *
 * @param roster
 */
export function convertRosterToProfiles(roster: Roster): ProfileList {
  const allUnits = roster.warbands
    .flatMap(convertWarbandToUnits)
    .sort(byHeroicTier);

  const { profiles, missing } = allUnits
    .map(transformUnitToListOfProfiles)
    .reduce(
      (data, current) => {
        if (isMissingProfile(current)) {
          data["missing"] = [...data["missing"], current.profile];
        } else {
          data["profiles"] = [...data["profiles"], ...current];
        }

        return data;
      },
      {
        profiles: [],
        missing: [],
      },
    );
  return {
    profiles: profiles.map(combineProfiles()).filter(duplicateProfiles()),
    missing,
  };
}
