import { v4 as randomUuid } from "uuid";
import models from "../../assets/data/mesbg_data.json";
import warningRules from "../../assets/data/warning_rules.json";
import { Roster } from "../../types/roster.ts";
import { WarningRules } from "../../types/warning-rules.types.ts";
import { useCalculator } from "../useCalculator.ts";

export const useMandatoryGeneral = () => {
  const calculator = useCalculator();

  return function addCompulsoryArmyGeneral(roster: Roster): Roster {
    const rules = (warningRules as WarningRules)[roster.armyList];
    if (!rules) return roster;

    const compulsoryRules = rules.filter(
      ({ type, warning }) =>
        type === "compulsory" &&
        warning.includes("who is always the Army's General"),
    );
    if (compulsoryRules.length === 0) return roster;

    const [requiredGeneral] = compulsoryRules[0].dependencies;
    const general = models[requiredGeneral];
    const warband = roster.warbands[0];

    return calculator.recalculateRoster({
      ...roster,
      warbands: [
        calculator.recalculateWarband({
          ...warband,
          hero: calculator.recalculatePointsForUnit({
            ...general,
            id: randomUuid(),
            pointsPerUnit: general.base_points,
            pointsTotal: general.base_points,
            quantity: 1,
            compulsory: true,
          }),
        }),
      ],
      metadata: {
        ...roster.metadata,
        leader: warband.id,
        leaderCompulsory: true,
      },
    });
  };
};
