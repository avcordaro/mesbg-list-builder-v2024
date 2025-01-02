import data from "../assets/data/warning_rules.json";
import { isSelectedUnit, Roster } from "../types/roster.ts";
import { WarningRule, WarningRules } from "../types/warning-rules.types.ts";
import { useRosterInformation } from "./useRosterInformation.ts";

function checkRequiresOne(rule: WarningRule, setOfModelIds: string[]): boolean {
  return !rule.dependencies.some((compulsoryModel) =>
    setOfModelIds.includes(compulsoryModel),
  );
}

function checkRequiresAll(rule: WarningRule, setOfModelIds: string[]): boolean {
  return !rule.dependencies.every((compulsoryModel) =>
    setOfModelIds.includes(compulsoryModel),
  );
}

function checkCompulsory(rule: WarningRule, setOfModelIds: string[]): boolean {
  return !rule.dependencies.every((compulsoryModel) =>
    setOfModelIds.includes(compulsoryModel),
  );
}

function extraScriptedRosterWarnings(roster: Roster): WarningRule[] {
  const warnings = [];

  if (
    roster.armyList === "The Eagles" ||
    roster.armyList === "Radagast's Alliance"
  ) {
    const units = roster.warbands
      .flatMap((wb) => [wb.hero, ...wb.units])
      .filter(isSelectedUnit)
      .filter((unit) => unit.name.includes("Great Eagle"))
      .reduce(
        (a, b) => {
          if (!a[b.name]) {
            a[b.name] = 0;
          }
          a[b.name] += b.quantity;
          return a;
        },
        { "Great Eagle": 0, "Fledgeling Great Eagle": 0 },
      );
    const diff = units["Fledgeling Great Eagle"] - units["Great Eagle"];
    if (diff > 0) {
      warnings.push({
        warning: `${roster.armyList} may not include more Fledgeling Great Eagles than Great Eagles. There are currently ${diff} Fledgeling Great Eagle too many.`,
        type: undefined,
        dependencies: [],
      });
    }
  }

  if (roster.armyList === "Rise of the Necromancer") {
    const mustBeBrokenUp =
      roster.warbands
        .flatMap((wb) => [wb.hero, ...wb.units])
        .filter(isSelectedUnit)
        .filter((unit) =>
          [
            "Hunter Orc Captain",
            "Hunter Orc Warrior",
            "Hunter Orc Warg Rider",
            "Fell Warg",
            "Mirkwood Giant Spider",
            "Mirkwood Hunting Spider",
          ].includes(unit.name),
        ).length > 0;

    if (mustBeBrokenUp) {
      const hasHeroesInWarband =
        roster.warbands
          .flatMap((wb) => wb.units)
          .filter(isSelectedUnit)
          .filter((unit) => unit.unit_type.includes("Hero")).length > 0;
      if (hasHeroesInWarband) {
        warnings.push({
          warning: `Heroes cannot be followers in another hero's warband if your army includes any Warrior models or Hunter Orc Captains.`,
          type: undefined,
          dependencies: [],
        });
      }
    }
  }

  if (roster.armyList === "Men of the West") {
    const containsAnyMountedHero = !!roster.warbands.find(
      ({ hero }) =>
        isSelectedUnit(hero) &&
        !!hero.options.find(
          (option) => option.type === "mount" && option.quantity > 0,
        ),
    );
    const hasGwaihir = !!roster.warbands.find(
      ({ hero }) => isSelectedUnit(hero) && hero.name === "Gwaihir",
    );

    if (containsAnyMountedHero && hasGwaihir) {
      warnings.push({
        warning: `If your Army includes any Cavalry models then it cannot include any Eagle models, and vice versa.`,
        type: undefined,
        dependencies: [],
      });
    }
  }

  const siegeEngines = roster.warbands.filter(
    ({ hero }) => hero?.unit_type === "Siege Engine",
  );
  const heroesOfFort = roster.warbands.filter(({ hero }) =>
    ["Hero of Legend", "Hero of Valour", "Hero of Fortitude"].includes(
      hero?.unit_type,
    ),
  );
  if (siegeEngines > heroesOfFort) {
    warnings.push({
      warning: `An army may only include one Siege Engine for each Hero with a Heroic Tier of Hero of Fortitude or above.`,
      type: undefined,
      dependencies: [],
    });
  }

  return warnings;
}

function isActiveRule(setOfModelIds: string[]) {
  return (rule: WarningRule) => {
    switch (rule.type) {
      case "requires_one":
        return checkRequiresOne(rule, setOfModelIds);
      case "requires_all":
        return checkRequiresAll(rule, setOfModelIds);
      case "compulsory":
        return checkCompulsory(rule, setOfModelIds);
      default:
        return true;
    }
  };
}

export const useRosterWarnings = (): WarningRule[] => {
  const rosterInformation = useRosterInformation();
  const setOfModelIds = rosterInformation.getSetOfModelIds();
  const allWarnings = data as WarningRules;

  const possibleWarnings = [
    ...(allWarnings[rosterInformation.roster.armyList] || []),
    ...setOfModelIds.flatMap((model) => allWarnings[model]),
    ...extraScriptedRosterWarnings(rosterInformation.roster),
  ].filter((v) => !!v);

  if (!possibleWarnings || possibleWarnings.length === 0) return [];

  return possibleWarnings.filter(isActiveRule(setOfModelIds));
};