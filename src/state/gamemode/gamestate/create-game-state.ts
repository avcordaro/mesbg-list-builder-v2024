import { v4 } from "uuid";
import { getSumOfUnits } from "../../../components/common/roster/totalUnits.ts";
import { convertRosterToProfiles } from "../../../hooks/profile-utils/profiles.ts";
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
  unit: SelectedUnit | FreshUnit,
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
  return [convertToStats(name || unit.name, MWFW, unit, isArmyLeader)];
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

const getListOfMultiWoundModels = (roster: Roster): CustomTracker[] => {
  const units = getSumOfUnits(roster, { ignoreOptions: true }).map((unit) => ({
    name: unit.name,
    amount: unit.quantity,
  }));

  return convertRosterToProfiles(roster)
    .profiles.filter(({ type, W }) => !type?.includes("Hero") && Number(W) >= 2)
    .map(({ name, W, type }) => ({ name, W: Number(W), type }))
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
    .map((tracker) => ({
      id: v4(),
      name: tracker.name,
      value: tracker.W,
      maxValue: tracker.W,
      permanent: true,
    }));
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
