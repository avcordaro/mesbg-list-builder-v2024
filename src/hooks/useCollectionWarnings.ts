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

  const options = unit.options.filter((o) => o.quantity > 0).map((o) => o.name);

  if (unit.name === "Cave Troll") {
    console.log(
      JSON.stringify(
        {
          collection,
          totalSelected,
          options,
        },
        null,
        1,
      ),
    );
  }

  return {
    warnings: "on",
  };
};
