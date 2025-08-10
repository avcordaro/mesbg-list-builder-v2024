import { unitSortOrder } from "../../../../hooks/profile-utils/sorting.ts";
import { Unit } from "../../../../types/mesbg-data.types.ts";

export const useMergedUnitData = () => {
  function getHighestUnitTier(existing: Unit, entry: Unit) {
    const currentRank = unitSortOrder[existing.unit_type];
    const newRank = unitSortOrder[entry.unit_type];

    return newRank < currentRank ? entry.unit_type : existing.unit_type;
  }

  return function mergeData(data: Unit[]): Unit[] {
    const map = new Map<string, Unit>();

    for (const entry of data) {
      const key = `${entry.name}||${entry.profile_origin}`;
      const existing = map.get(key);

      if (existing) {
        // apply the highest tier to models of the same name/origin.
        existing.unit_type = getHighestUnitTier(existing, entry);

        // combine options on existing model with current entry.
        const mergedOptions = [...existing.options, ...entry.options];

        // Remove any duplicates based on the name
        existing.options = Array.from(
          new Map(
            mergedOptions.map((opt) => [
              opt.name,
              { ...opt, included: false, quantity: 0 },
            ]),
          ).values(),
        );
      } else {
        // Add entry if it's missing.
        map.set(key, { ...entry, options: [...entry.options] });
      }
    }

    return Array.from(map.values());
  };
};
