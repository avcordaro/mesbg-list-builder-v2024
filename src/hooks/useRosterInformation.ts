import { useParams } from "react-router-dom";
import { mesbgData } from "../assets/data.ts";
import { handleSpecialRestriction } from "../components/common/unit-selection/special-hero-selection-rules.ts";
import { useRosterBuildingState } from "../state/roster-building";
import { Unit } from "../types/mesbg-data.types.ts";
import { isSelectedUnit, Roster } from "../types/roster.ts";
import { isNotNull } from "../utils/nulls.ts";
import { slugify } from "../utils/string.ts";

export type RosterInformationFunctions = {
  roster: Roster;
  isCustomRoster: boolean;
  getSetOfModelIds: (roster?: Roster) => string[];
  getSetOfModelIdsInWarband: (warbandId: string, roster?: Roster) => string[];
  getAdjustedMetaData: (roster?: Roster) => Roster["metadata"];
  canSupportMoreWarbands: (roster?: Roster) => boolean;
};

export const useRosterInformation = (): RosterInformationFunctions => {
  const { rosterId } = useParams();
  const currentRoster = useRosterBuildingState(
    (state): Roster => state.rosters.find(({ id }) => id === rosterId),
  );
  const isCustomRoster = ["Custom: Good", "Custom: Evil"].includes(
    currentRoster?.armyList,
  );

  function getModelIdsFromOptions(unit: Unit): string[] {
    const armyList = slugify(unit.army_list);
    if (unit.name === "Gandalf the White") {
      const hasPippinPassenger = !!unit.options.find(
        ({ name, quantity }) => name === "Pippin" && quantity > 0,
      );
      if (hasPippinPassenger) {
        return [`[${armyList}] peregrin-took`];
      }
    }
    if (unit.name === "Arwen") {
      const hasFrodoPassenger = !!unit.options.find(
        ({ name, quantity }) => name === "Frodo Baggins" && quantity > 0,
      );
      if (hasFrodoPassenger) {
        return [`[${armyList}] frodo-baggins`];
      }
    }
    if (unit.name === "Eowyn") {
      const hasMerryPassenger = !!unit.options.find(
        ({ name, quantity }) => name === "Merry" && quantity > 0,
      );
      if (hasMerryPassenger) {
        return [`[${armyList}] meriadoc-brandybuck`];
      }
    }
    if (unit.name === "Treebeard") {
      const hasMerryPassenger = !!unit.options.find(
        ({ name, quantity }) => name === "Merry & Pippin" && quantity > 0,
      );
      if (hasMerryPassenger) {
        return [
          `[${armyList}] peregrin-took`,
          `[${armyList}] meriadoc-brandybuck`,
        ];
      }
    }
    return [];
  }

  function getSetOfModelIds(roster: Roster = currentRoster) {
    if (!roster) return [];
    return roster.warbands
      .flatMap((wb) => [wb.hero, ...wb.units])
      .filter(isNotNull)
      .filter(isSelectedUnit)
      .flatMap((unit) => [unit.model_id, ...getModelIdsFromOptions(unit)])
      .filter(
        (item, index, self) =>
          self.findIndex((other) => other === item) === index,
      );
  }

  function getSetOfModelIdsInWarband(
    warbandId: string,
    roster: Roster = currentRoster,
  ) {
    if (!roster) return [];
    return roster.warbands
      .filter((wb) => wb.id === warbandId)
      .flatMap((wb) => [wb.hero, ...wb.units])
      .filter(isNotNull)
      .filter(isSelectedUnit)
      .map((unit) => unit.model_id)
      .filter(
        (item, index, self) =>
          self.findIndex((other) => other === item) === index,
      );
  }

  function getAdjustedMetaData(
    roster: Roster = currentRoster,
  ): Roster["metadata"] {
    if (
      roster.armyList === "Rivendell" &&
      getSetOfModelIds(roster).includes("[rivendell] elrond")
    ) {
      const knights = roster.warbands
        .flatMap((wb) => wb.units)
        .filter(isSelectedUnit)
        .filter((unit) => unit.model_id === "[rivendell] rivendell-knight")
        .reduce((a, b) => a + b.quantity, 0);
      return {
        ...roster.metadata,
        bows: roster.metadata.bows - knights,
        bowLimit: roster.metadata.bowLimit - knights,
      };
    }

    if (roster.armyList === "The Three Trolls") {
      return {
        ...roster.metadata,
        points:
          roster.metadata.points +
          (roster.metadata.tttSpecialUpgrades?.length * 50 || 0),
      };
    }

    if (roster.armyList === "Erebor & Dale") {
      const units = roster.warbands
        .flatMap((w) => w.units)
        .filter(isSelectedUnit);
      return {
        ...roster.metadata,
        bowLimit: units
          .filter((u) => u.profile_origin === "Kingdoms of Men")
          .reduce((s, u) => s + u.quantity, 0),
        throwLimit: units
          .filter((u) => u.profile_origin === "Dwarven Holds")
          .reduce((s, u) => s + u.quantity, 0),
      };
    }

    return roster.metadata;
  }

  function canSupportMoreWarbands(roster: Roster = currentRoster): boolean {
    if (!roster) return false;

    if (
      roster.armyList === "Custom: Good" ||
      roster.armyList === "Custom: Evil"
    )
      return true;

    if (roster.armyList === "The Fellowship")
      // The Fellowship is always deployed as a single Warband. You cannot add more warbands!
      return roster.warbands.length < 1;
    if (roster.armyList === "The White Council")
      // The white council is always deployed as a single Warband. You cannot add more warbands!
      return roster.warbands.length < 1;
    if (roster.armyList === "Wraiths on Wings")
      // The Wraiths on Wings any only ever be 9 wraiths big. You cannot add more warbands!
      return roster.warbands.length < 9;

    const setOfModelIds = getSetOfModelIds(roster);
    const stillAvailableWarbandLeaders = Object.values(mesbgData)
      .filter(
        ({ unit_type }) =>
          unit_type.includes("Hero") || unit_type === "Siege Engine",
      )
      .filter(
        (unit) =>
          unit.army_list === roster.armyList && handleSpecialRestriction(unit),
      )
      .filter(
        (unit: Unit) => !unit.unique || !setOfModelIds.includes(unit.model_id),
      );

    if (stillAvailableWarbandLeaders.some((unit) => !unit.unique)) {
      // if there are any non-unique heroes, you can spam warbands.
      return true;
    }

    const warbandsInNeedOfHero = roster.warbands.filter(
      (warband) => !warband.hero,
    ).length;

    return stillAvailableWarbandLeaders.length - warbandsInNeedOfHero > 0;
  }

  return {
    roster: currentRoster,
    isCustomRoster,
    getSetOfModelIds,
    getSetOfModelIdsInWarband,
    getAdjustedMetaData,
    canSupportMoreWarbands,
  };
};
