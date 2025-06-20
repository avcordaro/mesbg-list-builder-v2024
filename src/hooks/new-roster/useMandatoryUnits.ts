import { v4 as randomUuid } from "uuid";
import { mesbgData } from "../../assets/data.ts";
import { emptyWarband } from "../../state/roster-building/roster";
import { Roster } from "../../types/roster.ts";
import { useCalculator } from "../useCalculator.ts";
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

    return roster;
  }

  function addMandatoryWoses(roster: Roster) {
    const ghan = mesbgData["[paths-of-the-druadan] ghan-buri-ghan"];
    const woses = mesbgData["[paths-of-the-druadan] woses-warrior"];

    const wosesWarband = calculator.recalculateWarband({
      id: randomUuid(),
      hero: calculator.recalculatePointsForUnit({
        ...ghan,
        id: randomUuid(),
        pointsPerUnit: ghan.base_points,
        pointsTotal: ghan.base_points,
        quantity: 1,
      }),
      units: [
        calculator.recalculatePointsForUnit({
          ...woses,
          id: randomUuid(),
          pointsPerUnit: woses.base_points,
          pointsTotal: woses.base_points * 12,
          quantity: 12,
        }),
      ],
      meta: {
        ...emptyWarband.meta,
        num: 2,
      },
    });

    return calculator.recalculateRoster({
      ...roster,
      warbands: [...roster.warbands, wosesWarband],
    });
  }
};
