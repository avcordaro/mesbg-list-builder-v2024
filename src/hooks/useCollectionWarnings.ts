import { useCollectionState } from "../state/collection";
import { useUserPreferences } from "../state/preference";
import { isSelectedUnit, SelectedUnit } from "../types/roster.ts";
import { arraysMatch, groupBy } from "../utils/array.ts";
import { findBestMatch } from "../utils/string.ts";
import { useRosterInformation } from "./useRosterInformation.ts";

export const useCollectionWarnings = (unit: SelectedUnit) => {
  const { preferences } = useUserPreferences();
  const { inventory } = useCollectionState();
  const { roster } = useRosterInformation();

  if (!preferences.collectionWarnings) {
    return {
      warnings: "off",
    };
  }

  const { collection } = (inventory[unit.profile_origin] &&
    inventory[unit.profile_origin][unit.name]) || { collection: [] };

  const generics = Object.fromEntries(
    Object.entries(groupBy(collection, "mount")).map(([key, value]) => {
      return [
        key,
        Number(
          value.find((c) =>
            typeof c.options === "string"
              ? c.options === "Generic"
              : c.options.includes("Generic"),
          )?.amount || "0",
        ),
      ];
    }),
  );

  const totalSelected = Object.values(
    roster.warbands
      .flatMap((wb) => [wb.hero, ...wb.units])
      .filter(isSelectedUnit)
      .filter(
        ({ name, profile_origin }) =>
          name === unit.name && profile_origin === unit.profile_origin,
      )
      .map(({ options, quantity }) => ({
        options: options.filter((o) => o.quantity > 0).map((o) => o.name),
        mount:
          options.find(
            (o) => o.quantity > 0 && o.type && o.type.includes("mount"),
          )?.name || "",
        quantity,
      }))
      .reduce((acc, item) => {
        const key = JSON.stringify(item.options); // Serialize the options array as a key
        if (!acc[key]) {
          acc[key] = item;
        } else {
          acc[key].quantity += item.quantity;
        }
        return acc;
      }, {}),
  ).map((unit: { options: string[]; quantity: number; mount: string }) => {
    const collectionUsed =
      Number(
        collection.find((c) => {
          if (typeof c.options === "string") {
            // warriors
            if (c.options === "None") {
              return unit.options.length === 0;
            }
            return arraysMatch(unit.options, [c.options]);
          } else {
            // heroes
            if (c.options[0] === "None") {
              return unit.options.length === 0 && unit.mount === c.mount;
            }
            return (
              c.mount === unit.mount &&
              arraysMatch(
                unit.options.filter((o) => o !== unit.mount),
                c.options,
              )
            );
          }
        })?.amount || "",
      ) - unit.quantity;

    return {
      ...unit,
      genericsUsed: collectionUsed > 0 ? 0 : -collectionUsed,
    };
  });

  const totalGenericsUsed = totalSelected
    .map((ts) => ts.genericsUsed)
    .reduce((a, b) => a + b, 0);

  const options = unit.options.filter((o) => o.quantity > 0).map((o) => o.name);
  const mount =
    unit.options.find(
      (o) => o.quantity > 0 && o.type && o.type.includes("mount"),
    )?.name || "";

  const bestMatchingMount = findBestMatch(mount, generics);
  const amountOfGenericsForGivenMount = generics[bestMatchingMount] ?? 0;

  if (unit.name.includes("Madril")) {
    console.log(
      JSON.stringify(
        {
          generics,
          mount,
          bestMatchingMount,
          amountOfGenericsForGivenMount,
          totalGenericsUsed,
          collection,
          options,
          totalSelected,
        },
        null,
        2,
      ),
    );
  }

  return {
    warnings: "on",
    overexceededCollections:
      totalGenericsUsed > amountOfGenericsForGivenMount &&
      totalSelected.find(
        (ts) => ts.genericsUsed > 0 && arraysMatch(ts.options, options),
      ),
  };
};
