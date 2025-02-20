import { UnitType } from "../../../types/mesbg-data.types.ts";
import { isSelectedUnit, Roster, SelectedUnit } from "../../../types/roster.ts";

const defaultOptions = {
  ignoreOptions: true,
};

export const getSumOfUnits = (
  roster: Roster,
  options: { ignoreOptions: boolean } = defaultOptions,
) => {
  const units = roster.warbands.flatMap((warband) => [
    warband.hero,
    ...warband.units,
  ]);

  const totalledUnits: SelectedUnit[] = Object.values(
    Object.create(units)
      .filter(isSelectedUnit)
      // clone the unit so not to update its 'quantity' by object reference in state.
      .map(Object.create)
      .map((unit: SelectedUnit) => {
        if (options.ignoreOptions) return { key: unit.name, unit };

        const unitOptions = unit.options
          .filter((o) => o.quantity)
          .map((o) => o.name + o.quantity)
          .join(",");
        const key = unit.name + " [" + unitOptions + "]";

        return { key, unit };
      })
      .reduce(
        (totals: Record<string, SelectedUnit>, { key, unit }) => {
          if (!totals[key]) {
            totals[key] = unit;
          } else {
            totals[key].quantity += unit.quantity;
            totals[key].pointsTotal += unit.pointsTotal;
          }
          return totals;
        },
        {} as Record<string, SelectedUnit>,
      ),
  );

  const sorting: Record<UnitType, number> = {
    "Hero of Legend": 1,
    "Hero of Valour": 2,
    "Hero of Fortitude": 3,
    "Minor Hero": 4,
    "Independent Hero": 5,
    Warrior: 6,
    "Siege Engine": 7,
  };

  return totalledUnits.sort((a, b) => {
    if (a.unit_type.includes("Hero") && a.unique) {
      if (b.unit_type.includes("Hero") && b.unique) {
        return sorting[a.unit_type] - sorting[b.unit_type];
      }
      return -1;
    }

    if (a.unit_type === "Warrior" && b.unit_type === "Warrior") {
      return a.name.localeCompare(b.name);
    }

    return sorting[a.unit_type] - sorting[b.unit_type];
  });
};
