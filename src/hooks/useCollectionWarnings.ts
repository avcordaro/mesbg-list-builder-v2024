import { useCollectionState } from "../state/collection";
import { useUserPreferences } from "../state/preference";
import { isSelectedUnit, SelectedUnit } from "../types/roster.ts";
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
  const generics = Number(
    collection.find((c) =>
      typeof c.options === "string"
        ? c.options === "Generic"
        : c.options.includes("Generic"),
    )?.amount || "0",
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
  ).map((unit: { options: string[]; quantity: number }) => {
    const collectionUsed =
      Number(
        collection.find((c) => {
          if (typeof c.options === "string") {
            return unit.options.includes(c.options);
          } else {
            return false;
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

  return {
    warnings: "on",
    overexceededCollections:
      totalGenericsUsed > generics &&
      totalSelected.find(
        (ts) =>
          ts.genericsUsed > 0 && ts.options.every((x) => options.includes(x)),
      ),
  };
};
