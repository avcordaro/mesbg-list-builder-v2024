import { v4 as randomUuid } from "uuid";
import { mesbgData } from "../../assets/data.ts";
import { emptyWarband } from "../../state/roster-building/roster";
import { Unit } from "../../types/mesbg-data.types.ts";
import { isSelectedUnit, Roster } from "../../types/roster.ts";
import { useCalculator } from "../calculations-and-displays/useCalculator.ts";

export const useWithSelectedHero = () => {
  const calculator = useCalculator();

  function addNewWarbandWithHero(roster: Roster, hero: Unit) {
    return calculator.recalculateRoster({
      ...roster,
      warbands: [
        ...roster.warbands,
        calculator.recalculateWarband({
          ...emptyWarband,
          id: randomUuid(),
          hero: calculator.recalculatePointsForUnit({
            ...hero,
            id: randomUuid(),
            pointsPerUnit: hero.base_points,
            pointsTotal: hero.base_points,
            quantity: 1,
          }),
          meta: {
            ...emptyWarband.meta,
            num: roster.warbands.length + 1,
          },
        }),
      ],
    });
  }

  function withFirstWarbandHero(roster: Roster, hero: Unit) {
    const [first, ...rest] = roster.warbands;
    return calculator.recalculateRoster({
      ...roster,
      warbands: [
        calculator.recalculateWarband({
          ...first,
          hero: calculator.recalculatePointsForUnit({
            ...hero,
            id: randomUuid(),
            pointsPerUnit: hero.base_points,
            pointsTotal: hero.base_points,
            quantity: 1,
          }),
        }),
        ...rest,
      ],
    });
  }

  return function (roster: Roster, hero: string): Roster {
    // if roster was not created from a selected hero but via an actual army list, return the unmodified roster.
    if (!hero) return roster;

    const heroData = Object.values(mesbgData)
      .filter((model) => model.army_list === roster.armyList)
      .find((model) => model.name === hero);

    // in case the hero data cannot be found (which would be strange), return the unmodified roster.
    if (!heroData) return roster;

    const heroAlreadyInRoster = roster.warbands
      .flatMap((wb) => [wb.hero, ...wb.units])
      .filter(isSelectedUnit)
      .map((unit) => unit.model_id)
      .filter((v, i, a) => a.indexOf(v) === i)
      .includes(heroData.model_id);

    // if the hero already exists in the roster, just return the roster.
    if (heroAlreadyInRoster) return roster;

    if (!roster.warbands[0].hero) {
      return withFirstWarbandHero(roster, heroData);
    } else {
      return addNewWarbandWithHero(roster, heroData);
    }
  };
};
