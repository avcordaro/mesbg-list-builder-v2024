import { v4 } from "uuid";
import { getSumOfUnits } from "../../../components/common/roster-summary/totalUnits.ts";
import { convertRosterToProfiles } from "../../../hooks/profiles/profile-utils/profiles.ts";
import { SiegeEquipment } from "../../../types/mesbg-data.types.ts";
import { Profile } from "../../../types/profile-data.types.ts";
import {
  FreshUnit,
  isSelectedUnit,
  Roster,
  SelectedUnit,
} from "../../../types/roster.ts";
import { CustomTracker, Trackable } from "./index.ts";

const convertToStats = (
  name: string | number,
  MWFW: string,
  unit: SelectedUnit,
  isArmyLeader: boolean,
): Trackable => ({
  name: String(name),
  MWFW: MWFW,
  xMWFW: MWFW,
  profile_origin: unit.profile_origin,
  leader: isArmyLeader,
});

const mapHeroToStats = (
  unit: SelectedUnit | FreshUnit | SiegeEquipment,
  isArmyLeader?: boolean,
): Trackable[] => {
  // check if a unit is selected (and not an empty selector box)
  if (!isSelectedUnit(unit)) return null;
  // check if unit is a hero
  if (unit.MWFW.length === 0) return null;

  // check if unit is composed of multiple hero's (such as Alladan & Elrohir)
  if (unit.MWFW.length > 1) {
    return unit.MWFW.map(([name, MWFW]) =>
      convertToStats(name, MWFW, unit, isArmyLeader),
    );
  }

  const [[name, MWFW]] = unit.MWFW;
  return Array.from({ length: unit.quantity }, () =>
    convertToStats(name || unit.name, MWFW, unit, isArmyLeader),
  );
};

const getHeroes = (roster: Roster): Trackable[] => {
  return roster.warbands
    .flatMap(({ hero, units, id }) => [
      mapHeroToStats(hero, roster.metadata.leader === id),
      ...units.map((unit) => mapHeroToStats(unit)),
    ])
    .flat()
    .filter((v) => !!v);
};

const mapListToTrackers = (
  list: {
    additional_stats: Profile["additional_stats"];
    W?: number;
    name?: string;
  }[],
  units: { amount: number; name: string }[],
  includeSelf: boolean = true,
) => {
  return list
    .map((unit) => ({
      ...unit,
      amount: units.find((profile) => profile.name === unit.name)?.amount || 1,
    }))
    .flatMap(({ amount, name, ...unit }) =>
      Array.from({ length: amount }, (_, index) => ({
        ...unit,
        name: amount > 1 ? `${name} (${index + 1})` : name,
      })),
    )
    .flatMap((tracker) => {
      if (!tracker.additional_stats)
        return includeSelf ? [{ name: tracker.name, W: tracker.W }] : [];
      return includeSelf
        ? [
            { name: tracker.name, W: tracker.W },
            ...tracker.additional_stats
              .filter((additionalTracker) => Number(additionalTracker.W) >= 2)
              .map(({ name, W }) => ({
                name: name,
                W: Number(W),
              })),
          ]
        : tracker.additional_stats
            .filter((additionalTracker) => Number(additionalTracker.W) >= 2)
            .map(({ name, W }) => ({
              name: name,
              W: Number(W),
            }));
    })
    .map((tracker) => ({
      id: v4(),
      name: tracker.name,
      value: tracker.W,
      maxValue: tracker.W,
    }));
};

const getListOfMultiWoundModels = (roster: Roster): CustomTracker[] => {
  const units = getSumOfUnits(roster, { ignoreOptions: true }).map((unit) => ({
    name: unit.name,
    amount: unit.quantity,
  }));

  const { profiles } = convertRosterToProfiles(roster);

  const trackers = mapListToTrackers(
    profiles
      .filter(({ type, W }) => !type?.includes("Hero") && Number(W) >= 2)
      .map(({ name, W, additional_stats }) => ({
        name,
        W: Number(W),
        additional_stats,
      })),
    units,
  );

  const specialCases = [
    "Iron Hills Captain",
    "War Mumak of Harad", // Howdah
    "Mumak War Leader", // Howdah
    "Gandalf the Grey", // His Cart
    "Radagast the Brown", // Sleigh or Eagle
    "Girion, Lord of Dale", // Windlance
    "Bard the Bowman", // Windlance
  ];
  const excludedCases = [
    "Haradrim Commander",
    "Mahud Beastmaster Chieftain",
    "Royal War Mumak",
  ];
  const additionalTrackers = mapListToTrackers(
    profiles
      .filter(
        ({ type, name }) =>
          type?.includes("Hero") && specialCases.includes(name),
      )
      .map(({ name, additional_stats }) => {
        return {
          name,
          additional_stats: additional_stats
            .filter(({ name }) => !excludedCases.includes(name))
            .map((stat) => ({
              ...stat,
              name: `${name} - ${stat.name}`,
            })),
        };
      }),
    units,
    false,
  );

  return [...trackers, ...additionalTrackers];
};

export const createGameState = (
  roster: Roster,
): {
  trackables: Trackable[];
  customTrackers: CustomTracker[];
  casualties: number;
  heroCasualties: number;
} => ({
  trackables: getHeroes(roster),
  customTrackers: getListOfMultiWoundModels(roster),
  casualties: 0,
  heroCasualties: 0,
});
