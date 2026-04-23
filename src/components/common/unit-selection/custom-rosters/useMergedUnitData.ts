import { unitSortOrder } from "../../../../hooks/profiles/profile-utils/sorting.ts";
import { Option, Unit } from "../../../../types/mesbg-data.types.ts";

export const useMergedUnitData = () => {
  function getHighestUnitTier(existing: Unit, entry: Unit) {
    const currentRank = unitSortOrder[existing.unit_type];
    const newRank = unitSortOrder[entry.unit_type];

    return newRank < currentRank ? entry.unit_type : existing.unit_type;
  }

  function deduplicateOptions(options: Option[]): Option[] {
    const map = new Map<string, Option>();

    for (const opt of options) {
      const key = opt.name.trim().toLowerCase();
      const existing = map.get(key);

      if (!existing) {
        map.set(key, { ...opt, included: false, quantity: 0 });
      } else {
        // Prefer the non-zero points if one of them has 0
        const updated = { ...existing };

        if (existing.points === 0 && opt.points !== 0) {
          updated.points = opt.points;
        }

        map.set(key, updated);
      }
    }

    return Array.from(map.values());
  }

  function withMissingOptions(unit: Unit): Unit {
    if (
      unit.name === "The Witch-king of Angmar" &&
      unit.profile_origin === "Mordor"
    ) {
      return {
        ...unit,
        options: [
          ...unit.options,
          {
            id: "CUST0001",
            name: "1A / 1M / 10W / 1F",
            points: 80,
            type: "ringwraith_amwf",
            quantity: 1,
          },
        ],
      };
    }
    if (unit.name === "Ringwraith" && unit.profile_origin === "Mordor") {
      return {
        ...unit,
        options: [
          ...unit.options,
          {
            id: "CUST0002",
            name: "1A / 0M / 7W / 0F",
            points: 60,
            type: "ringwraith_amwf",
            quantity: 1,
          },
        ],
      };
    }

    return unit;
  }

  function withSortedOptions(unit: Unit): Unit {
    return {
      ...unit,
      options: unit.options.sort((a, b) => b.points - a.points),
    };
  }

  return function mergeData(data: Unit[]): Unit[] {
    const map = new Map<string, Unit>();

    for (const entry of data) {
      const key = `${entry.name}||${entry.profile_origin}`;
      const existing = map.get(key);

      if (existing) {
        // apply the highest tier to models of the same name/origin.
        existing.unit_type = getHighestUnitTier(existing, entry);
        // make sure everything can have followers
        existing.no_followers = false;

        // combine options on existing model with current entry.
        const mergedOptions = [...existing.options, ...entry.options];

        // Remove any duplicates based on the name
        existing.options = deduplicateOptions(mergedOptions);
      } else {
        // Add entry if it's missing.
        map.set(key, { ...entry, options: [...entry.options] });
      }
    }

    return Array.from(map.values())
      .map(withMissingOptions)
      .map(withSortedOptions);
  };
};
