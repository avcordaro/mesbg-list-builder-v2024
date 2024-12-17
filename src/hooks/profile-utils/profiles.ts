import { profileData } from "../../assets/data.ts";
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
      if (!MWFW) return { ...stats, HM: "-", HW: "-", HF: "-" };
      const [HM, HW, HF] = MWFW[1].split(":");
      return { ...stats, HM, HW, HF };
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

  const additional_stats = getAdditionalStats(unit, profile);
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
