import {
  isSelectedUnit,
  isSiegeEquipment,
  Roster,
  SelectedUnit,
  Warband,
} from "../../types/roster.ts";
import { isNotNull } from "../../utils/nulls.ts";

const heroesThatAreIncludedInTheWarbandCount = [
  "[the-spider-queens-brood] bat-swarm-cpt",
  "[the-spider-queens-brood] fell-warg-cpt",
  "[the-spider-queens-brood] mirkwood-giant-spider-cpt",
  "[the-spider-queens-brood] mirkwood-hunting-spider-cpt",
  "[sharkey's-rogues] ruffian-cpt",
];

function heroAdditionalUnitRosterCount(warband: Warband) {
  if (!warband.hero) return 0;
  if (
    warband.hero?.name === "Saruman" &&
    warband.units.filter(isSelectedUnit).find((unit) => unit.name === "Grima")
  ) {
    return 2; // this includes Saruman and Grima
  }

  if (["Gandalf the White", "Eowyn"].includes(warband.hero?.name)) {
    const passengers = warband.hero.options.find(
      (option) => option.type === "passenger" && option.quantity > 0,
    );
    return 1 + (passengers?.passengers ?? 0);
  }

  if (["Bofur the Dwarf, Champion of Erebor"].includes(warband.hero?.name)) {
    const hasTroll = warband.hero.options.find(
      (option) => option.name === "Troll Brute" && option.quantity > 0,
    );
    return hasTroll ? 2 : 1;
  }

  if (
    [
      "Mumak War Leader",
      "War Mumak of Harad",
      "Troll Brute",
      "Great Beast of Gorgoroth",
    ].includes(warband.hero?.name)
  ) {
    return 2;
  }

  if (heroesThatAreIncludedInTheWarbandCount.includes(warband.hero?.model_id)) {
    return 0;
  }

  return 1;
}

function heroAdditionalUnitWarbandCount(warband: Warband) {
  if (!warband.hero) return 0;

  if (warband.hero?.name === "Treebeard") {
    const passenger = warband.hero.options.find(
      (option) => option.type === "passenger",
    );
    if (passenger) return passenger.passengers * (passenger.quantity ?? 0);
  }

  if (
    warband.units
      .filter(isSelectedUnit)
      .find((unit) => unit.name === "Farmer Maggot")
  ) {
    return 1;
  }

  return 0;
}

export const useCalculator = () => {
  function numberOfBows(unit: SelectedUnit): number {
    if (!unit.bow_limit) return 0;

    const hasBowOption = unit.options.find(
      (option) =>
        option.type &&
        option.type
          .split(",")
          .map((o) => o.trim())
          .includes("bow") &&
        option.quantity > 0,
    );

    if (unit.default_bow || hasBowOption) return getBowLimit(unit);

    return 0;
  }

  function getBowLimit(unit: SelectedUnit): number {
    if (unit.name === "Farmer Maggot") return 3;
    if (!unit.bow_limit) return 0;
    return unit.quantity * (unit.siege_crew || 1);
  }

  function getThrowLimit(unit: SelectedUnit): number {
    if (unit.name === "Farmer Maggot") return 3;
    return unit.quantity * (unit.siege_crew || 1);
  }

  function numberOfThrowingWeapons(unit: SelectedUnit): number {
    if (unit.unit_type.includes("Hero")) return 0;

    const hasThrowingWeapon = unit.options.find(
      (option) =>
        option.type &&
        option.type
          .split(",")
          .map((o) => o.trim())
          .includes("throw") &&
        option.quantity > 0,
    );

    if (unit.default_throw || hasThrowingWeapon)
      return unit.quantity * (unit.siege_crew || 1);

    return 0;
  }

  function recalculatePointsForUnit(unit: SelectedUnit): SelectedUnit {
    const base = unit.base_points;
    const optionCost = unit.options
      .map((option) => option.points * option.quantity || 0)
      .reduce((a, b) => a + b, 0);

    const pointsPerUnit = base + optionCost;
    const pointsTotal = pointsPerUnit * unit.quantity;

    return {
      ...unit,
      pointsPerUnit,
      pointsTotal,
    };
  }

  function recalculateWarband(warband: Warband): Warband {
    const totalUnits = warband.units
      .filter(isSelectedUnit)
      .filter((unit) => !isSiegeEquipment(unit))
      .filter(
        // If Grima is deployed as part of Saruman's warband, he should not take up space in the warband.
        (unit) =>
          warband?.hero?.name === "Saruman" ? unit.name !== "Grima" : true,
      )
      .map((unit) => unit.quantity * (unit.siege_crew || 1))
      .reduce(
        (a, b) => a + b,
        heroesThatAreIncludedInTheWarbandCount.includes(warband.hero?.model_id)
          ? 1
          : 0,
      );

    const totalPoints = [warband.hero, ...warband.units]
      .filter(isNotNull)
      .filter(isSelectedUnit)
      .map((unit) => unit.pointsTotal)
      .reduce((a, b) => a + b, 0);

    const totalBows = warband.units
      .filter(isSelectedUnit)
      .filter((unit) => !isSiegeEquipment(unit))
      .map(numberOfBows)
      .reduce((a, b) => a + b, 0);

    const totalThrowingWeapons = warband.units
      .filter(isSelectedUnit)
      .filter((unit) => !isSiegeEquipment(unit))
      .map(numberOfThrowingWeapons)
      .reduce((a, b) => a + b, 0);

    const bowLimit = warband.units
      .filter(isSelectedUnit)
      .filter((unit) => !isSiegeEquipment(unit))
      .map(getBowLimit)
      .reduce((a, b) => a + b, warband.hero ? getBowLimit(warband.hero) : 0);

    const throwLimit = warband.units
      .filter(isSelectedUnit)
      .filter((unit) => !isSiegeEquipment(unit))
      .filter(({ unit_type }) => !unit_type.includes("Hero"))
      .map(getThrowLimit)
      .reduce(
        (a, b) => a + b,
        warband.hero &&
          (warband.hero.unit_type === "Siege Engine" ||
            warband.hero.name === "Farmer Maggot")
          ? getThrowLimit(warband.hero)
          : 0,
      );

    return {
      ...warband,
      meta: {
        num: warband.meta.num,
        points: totalPoints,
        units:
          totalUnits +
          (warband.hero?.siege_crew || 0) +
          heroAdditionalUnitWarbandCount(warband),
        heroes: warband.hero ? heroAdditionalUnitRosterCount(warband) : 0,
        bows: totalBows,
        throwingWeapons: totalThrowingWeapons,
        bowLimit: bowLimit,
        throwLimit: throwLimit,
        maxUnits: warband.hero?.warband_size ?? "-",
      },
    };
  }

  function recalculateRoster(roster: Roster): Roster {
    const summedWarbandMetadata = roster.warbands
      .map((warband) => {
        const mwfUnits = [warband.hero, ...warband.units]
          .filter(isNotNull)
          .filter(isSelectedUnit)
          .filter((unit) => unit.unit_type !== "Siege Equipment")
          .filter((unit) => unit.MWFW.length > 0)
          .flatMap((unit) => Array(unit.quantity).fill(unit))
          .flatMap((unit) => unit.MWFW)
          .map((mwfw) => mwfw[1].split(":").map(Number))
          .map(([might, will, fate]) => ({ might, will, fate }))
          .reduce(
            (total, current) => ({
              might: current.might + total.might,
              will: current.will + total.will,
              fate: current.fate + total.fate,
            }),
            { might: 0, will: 0, fate: 0 },
          );
        return {
          points: warband.meta.points,
          units: warband.meta.units + warband.meta.heroes,
          bows: warband.meta.bows,
          throwingWeapons: warband.meta.throwingWeapons,
          bowLimit: warband.meta.bowLimit,
          throwLimit: warband.meta.throwLimit,
          might: mwfUnits.might,
          will: mwfUnits.will,
          fate: mwfUnits.fate,
        };
      })
      .reduce(
        (acc, item) => {
          acc.points += item.points;
          acc.units += item.units;
          acc.bows += item.bows;
          acc.bowLimit += item.bowLimit;
          acc.throwingWeapons += item.throwingWeapons;
          acc.throwLimit += item.throwLimit;
          acc.might += item.might;
          acc.will += item.will;
          acc.fate += item.fate;
          return acc;
        },
        {
          points: 0,
          units: 0,
          bows: 0,
          throwingWeapons: 0,
          bowLimit: 0,
          throwLimit: 0,
          might: 0,
          will: 0,
          fate: 0,
        },
      );

    return {
      ...roster,
      metadata: {
        ...roster.metadata,
        ...summedWarbandMetadata,
      },
    };
  }

  return {
    recalculatePointsForUnit,
    recalculateWarband,
    recalculateRoster,
  };
};
