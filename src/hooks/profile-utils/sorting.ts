import { UnitType } from "../../types/mesbg-data.types.ts";
import { SelectedUnit } from "../../types/roster.ts";

export const unitSortOrder: Record<UnitType, number> = {
  "Hero of Legend": 1,
  "Hero of Valour": 2,
  "Hero of Fortitude": 3,
  "Minor Hero": 4,
  "Independent Hero": 5,
  Warrior: 6,
  "Siege Engine": 7,
};

/**
 * Sorting function to sort units based on their heroic tier.
 *
 * @param a
 * @param b
 */
export function byHeroicTier(a: SelectedUnit, b: SelectedUnit) {
  if (a.unit_type.includes("Hero") && a.unique) {
    if (b.unit_type.includes("Hero") && b.unique) {
      return unitSortOrder[a.unit_type] - unitSortOrder[b.unit_type];
    }
    return -1;
  }

  if (a.unit_type === "Warrior" && b.unit_type === "Warrior") {
    return a.name.localeCompare(b.name);
  }

  return unitSortOrder[a.unit_type] - unitSortOrder[b.unit_type];
}
