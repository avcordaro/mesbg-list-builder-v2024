import { Roster } from "../../../types/roster.ts";
import { SortField, SortOrder } from "./RosterSortButton.tsx";

export const getComparator: (
  searchParams: URLSearchParams,
) => (a: Roster, b: Roster) => number = (searchParams) => {
  const direction = searchParams.get("direction") as SortOrder;
  const sortBy = searchParams.get("sortBy") as SortField;

  const compareFunctions: Record<SortField, (a: Roster, b: Roster) => number> =
    {
      name: (a, b) => a.name.localeCompare(b.name),
      army: (a, b) => a.armyList.localeCompare(b.armyList),
      points: (a, b) => a.metadata.points - b.metadata.points,
      units: (a, b) => a.metadata.units - b.metadata.units,
    };

  return (a, b) => {
    const value = compareFunctions[sortBy]?.(a, b) ?? 0;
    return direction === "asc" ? value : -value;
  };
};
