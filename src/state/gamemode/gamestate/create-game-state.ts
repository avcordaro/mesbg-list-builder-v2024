import {
  FreshUnit,
  isSelectedUnit,
  Roster,
  SelectedUnit,
} from "../../../types/roster.ts";
import { Trackable } from "./index.ts";

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

export const createGameState = (
  roster: Roster,
): {
  trackables: Trackable[];
  casualties: number;
  heroCasualties: number;
} => ({
  trackables: getHeroes(roster),
  casualties: 0,
  heroCasualties: 0,
});
