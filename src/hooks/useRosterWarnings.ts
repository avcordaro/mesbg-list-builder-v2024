import data from "../assets/data/warning_rules.json";
import { useUserPreferences } from "../state/preference";
import { isSelectedUnit, Roster } from "../types/roster.ts";
import { WarningRule, WarningRules } from "../types/warning-rules.types.ts";
import { byHeroicTier } from "./profile-utils/sorting.ts";
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

function checkIncompatible(
  rule: WarningRule,
  setOfModelIds: string[],
): boolean {
  return rule.dependencies.some((incompatibleModel) =>
    setOfModelIds.includes(incompatibleModel),
  );
}

function extraScriptedRosterWarnings(
  roster: Roster,
  ignoreCompulsoryArmyGeneral: boolean,
): WarningRule[] {
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
        {
          "Great Eagle": roster.armyList === "Radagast's Alliance" ? 1 : 0,
          "Fledgeling Great Eagle": 0,
        },
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

  if (roster.armyList === "Kingdom of Khazad-Dum") {
    const dKingId = "[kingdom-of-khazad-dum] dwarf-king";
    const hasIllegalKhazadGuard = roster.warbands
      .filter(({ hero }) => isSelectedUnit(hero))
      .filter(({ hero }) => hero.model_id === dKingId)
      .filter(({ id }) => id !== roster.metadata.leader)
      .flatMap(({ units }) => units)
      .filter(isSelectedUnit)
      .map(({ model_id }) => model_id)
      .includes("[kingdom-of-khazad-dum] khazad-guard");

    if (hasIllegalKhazadGuard) {
      warnings.push({
        warning: `A Dwarf King can only include Khazad Guards in his warband if he is also your army's General.`,
        type: undefined,
        dependencies: [],
      });
    }
  }

  if (roster.armyList === "Assault on Lothlorien") {
    const orcs = [
      "[assault-on-lothlorien] muzgur-orc-shaman",
      "[assault-on-lothlorien] mordor-orc-captain",
      "[assault-on-lothlorien] mordor-orc-shaman",
      "[assault-on-lothlorien] mordor-orc-warrior",
      "[assault-on-lothlorien] mordor-warg-rider",
      "[assault-on-lothlorien] orc-tracker",
    ];
    const goblins = [
      "[assault-on-lothlorien] ashrak",
      "[assault-on-lothlorien] druzag-the-beastcaller",
      "[assault-on-lothlorien] moria-goblin-captain",
      "[assault-on-lothlorien] moria-goblin-prowler",
      "[assault-on-lothlorien] moria-goblin-shaman",
      "[assault-on-lothlorien] moria-goblin-warrior",
      "[assault-on-lothlorien] warg-marauder",
    ];

    const [amountOfOrcs, amountOfGoblins] = roster.warbands
      .flatMap((wb) => [wb.hero, ...wb.units])
      .filter(isSelectedUnit)
      .filter((unit) => [...orcs, ...goblins].includes(unit.model_id))
      .map((unit) => ({
        type: orcs.includes(unit.model_id) ? "orc" : "goblin",
        quantity: unit.quantity + unit.quantity * unit.siege_crew,
      }))
      .reduce(
        ([orcs, goblins], { type, quantity }) =>
          type === "orc"
            ? [orcs + quantity, goblins]
            : [orcs, goblins + quantity],
        [0, 0],
      );

    if (amountOfGoblins > amountOfOrcs) {
      warnings.push({
        warning: `This Army may not include more Goblin models than Orc models. Currently counting ${amountOfOrcs} Orcs and ${amountOfGoblins} Goblins.`,
        type: undefined,
        dependencies: [],
      });
    }
  }

  if (roster.armyList === "The Spider Queen's Brood") {
    roster.warbands
      .filter((wb) => isSelectedUnit(wb.hero))
      .filter((wb) => wb.hero.name !== "The Spider Queen")
      .map((wb) => ({
        num: wb.meta.num,
        quantity: wb.units
          .filter(isSelectedUnit)
          .map((unit) => unit.quantity)
          .reduce((a, b) => a + b, 1), // starting with 1 cause the hero is included in the 6.
      }))
      .filter((wb) => wb.quantity < 6)
      .forEach((wb) =>
        warnings.push({
          warning: `Warbands without a hero require 6 or more models. Warband ${wb.num} only has ${wb.quantity}`,
          type: undefined,
          dependencies: [],
        }),
      );
  }

  if (roster.armyList === "Sharkey's Rogues") {
    roster.warbands
      .filter((wb) => isSelectedUnit(wb.hero))
      .filter((wb) => wb.hero.model_id === "[sharkey's-rogues] ruffian-cpt")
      .map((wb) => ({
        num: wb.meta.num,
        quantity: wb.units
          .filter(isSelectedUnit)
          .map((unit) => unit.quantity)
          .reduce((a, b) => a + b, 1), // starting with 1 cause the hero is included in the 6.
      }))
      .filter((wb) => wb.quantity < 10 || wb.quantity > 12)
      .forEach((wb) =>
        warnings.push({
          warning: `Warbands without a hero require 10 to 12 models. Warband ${wb.num} is outside this range.`,
          type: undefined,
          dependencies: [],
        }),
      );
  }

  if (roster.armyList === "Defenders of Helm's Deep") {
    const lothlorienIds = [
      "[defenders-of-helm's-deep] haldir-galadhrim-captain",
      "[defenders-of-helm's-deep] galadhrim-captain",
      "[defenders-of-helm's-deep] galadhrim-warrior",
    ];

    const [lothlorienModels, others] = roster.warbands
      .flatMap((wb) => [wb.hero, ...wb.units])
      .filter(isSelectedUnit)
      .map((unit) => ({
        type: lothlorienIds.includes(unit.model_id) ? "lothlorien" : "other",
        quantity: unit.quantity + unit.quantity * unit.siege_crew,
      }))
      .reduce(
        ([l, o], { type, quantity }) =>
          type === "lothlorien" ? [l + quantity, o] : [l, o + quantity],
        [0, 0],
      );

    const perc = Math.floor(
      (lothlorienModels / (others + lothlorienModels)) * 100,
    );
    if (perc > 33) {
      warnings.push({
        warning: `Only 33% of this army can have the Lothlórien keyword. The current roster has ${perc}% models with the Lothlórien keyword`,
        type: undefined,
        dependencies: [],
      });
    }
  }

  if (
    [
      "Defenders of the Pelennor",
      "Men of the West",
      "Rivendell",
      "The Grey Company",
    ].includes(roster.armyList)
  ) {
    const brothers = roster.warbands
      .map((wb) => wb.hero)
      .filter(isSelectedUnit)
      .filter((hero) => ["Elladan", "Elrohir"].includes(hero.name));
    if (brothers.length == 2) {
      const mountsSelected = brothers
        .flatMap((brother) => brother.options)
        .filter((option) => option.type === "mount")
        .map((option) => option.quantity ?? 0)
        .reduce((a, b) => b + a, 0);
      if (mountsSelected === 1) {
        // either none or both need a mount, not just 1.
        warnings.push({
          warning: `If you wish to upgrade Elladan & Elrohir with horses, then you must purchase horses for both the Elven twins at the given cost.`,
          type: undefined,
          dependencies: [],
        });
      }
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

  if (!roster.metadata.leader) {
    warnings.push({
      warning: `An army list should always have an army general.`,
      type: undefined,
      dependencies: [],
    });
  }

  if (
    roster.metadata.leader &&
    (!roster.metadata.leaderCompulsory || ignoreCompulsoryArmyGeneral)
  ) {
    const heroicTiers = roster.warbands
      .filter(
        ({ hero }) => isSelectedUnit(hero) && hero.unit_type.includes("Hero"),
      )
      .map(({ hero }) => hero)
      .sort(byHeroicTier)
      .map(({ unit_type }) => unit_type)
      .filter((t, i, s) => s.findIndex((o) => o === t) === i);

    const leaderTier = roster.warbands.find(
      (wb) => wb.id === roster.metadata.leader,
    )?.hero?.unit_type;
    const leaderTierIndex = heroicTiers.findIndex(
      (tier) => tier === leaderTier,
    );

    if (leaderTierIndex === -1) {
      // warband was deleted... so there actually isn't a leader...
      warnings.push({
        warning: `An army list should always have an army general.`,
        type: undefined,
        dependencies: [],
      });
    } else if (leaderTierIndex !== 0) {
      // leader is not the highest available heroic tier...
      warnings.push({
        warning: `The army general should always be the hero with the highest tier available. You should select a ${heroicTiers[0]} to be your army general.`,
        type: undefined,
        dependencies: [],
      });
    }
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
      case "incompatible":
        return checkIncompatible(rule, setOfModelIds);
      default:
        return true;
    }
  };
}

export const useRosterWarnings = (): WarningRule[] => {
  const rosterInformation = useRosterInformation();
  const { preferences } = useUserPreferences();
  const setOfModelIds = rosterInformation.getSetOfModelIds();
  const allWarnings = data as WarningRules;

  const possibleWarnings = [
    ...(allWarnings[rosterInformation.roster.armyList] || []),
    ...setOfModelIds.flatMap((model) => allWarnings[model]),
    ...extraScriptedRosterWarnings(
      rosterInformation.roster,
      preferences.allowCompulsoryGeneralDelete,
    ),
  ].filter((v) => !!v);

  if (!possibleWarnings || possibleWarnings.length === 0) return [];

  return possibleWarnings.filter(isActiveRule(setOfModelIds));
};
