import { v4 as randomUuid } from "uuid";
import { mesbgData, warningRulesData } from "../../assets/data.ts";
import { emptyWarband } from "../../state/roster-building/roster";
import { Unit } from "../../types/mesbg-data.types.ts";
import { Roster, SelectedUnit, Warband } from "../../types/roster.ts";
import { useCalculator } from "../calculations-and-displays/useCalculator.ts";
import { useMandatoryGeneral } from "./useMandatoryGeneral.ts";

export const useMandatoryUnits = () => {
  const calculator = useCalculator();
  const addCompulsoryGeneral = useMandatoryGeneral();

  return function addMandatoryUnits(roster: Roster) {
    return checkForAndAddMandatoryUnits(addCompulsoryGeneral(roster));
  };

  function checkForAndAddMandatoryUnits(roster: Roster) {
    if (roster.armyList === "Paths of the Druadan") {
      return addMandatoryWoses(roster);
    }

    if (roster.armyList === "Battle of Bywater") {
      return addMandatoryHobbits(roster);
    }

    return addCompulsoryHeroes(roster);
  }

  function addCompulsoryHeroes(roster: Roster): Roster {
    const additionalWarbands = (warningRulesData[roster.armyList] || [])
      .filter((rule) => rule.type === "compulsory")
      .filter((rule) => rule.warning.includes("must always contain"))
      .filter(
        (rule) => !rule.warning.includes("who is always the Army's General"),
      )
      .flatMap((rule) => rule.dependencies)
      .map((modelId) => mesbgData[modelId])
      .filter((unit) => !!unit)
      .filter((unit) => unit.unit_type.includes("Hero"))
      .map((hero, i) => createWarband(i + roster.warbands.length, hero))
      .map((warband) => calculator.recalculateWarband(warband));

    return {
      ...roster,
      warbands: [...roster.warbands, ...additionalWarbands],
    };
  }

  function addMandatoryHobbits(roster: Roster) {
    const hobbits = [
      "[battle-of-bywater] peregrin-took-captain-of-the-shire",
      "[battle-of-bywater] frodo-of-the-nine-fingers",
      "[battle-of-bywater] samwise-the-brave",
    ];

    const additionalWarbands = hobbits
      .map((modelId) => mesbgData[modelId])
      .map((hero, i) => createWarband(i + roster.warbands.length, hero))
      .map((warband) => calculator.recalculateWarband(warband));

    return {
      ...roster,
      warbands: [...roster.warbands, ...additionalWarbands],
    };
  }

  function addMandatoryWoses(roster: Roster) {
    const ghan = mesbgData["[paths-of-the-druadan] ghan-buri-ghan"];
    const woses = mesbgData["[paths-of-the-druadan] woses-warrior"];

    const wosesWarband = calculator.recalculateWarband(
      createWarband(2, ghan, [
        calculator.recalculatePointsForUnit({
          ...woses,
          id: randomUuid(),
          pointsPerUnit: woses.base_points,
          pointsTotal: woses.base_points * 12,
          quantity: 12,
        }),
      ]),
    );

    return calculator.recalculateRoster({
      ...roster,
      warbands: [...roster.warbands, wosesWarband],
    });
  }

  function createWarband(
    warbandNumber: number,
    hero: Unit,
    units: SelectedUnit[] = [],
  ): Warband {
    return {
      id: randomUuid(),
      hero: calculator.recalculatePointsForUnit({
        ...hero,
        id: randomUuid(),
        pointsPerUnit: hero.base_points,
        pointsTotal: hero.base_points,
        quantity: 1,
      }),
      units: units,
      meta: {
        ...emptyWarband.meta,
        num: warbandNumber,
      },
    };
  }
};
