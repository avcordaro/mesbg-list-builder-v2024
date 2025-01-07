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
          acc[key] = { options: item.options, quantity: 0 };
        }
        acc[key].quantity += item.quantity;
        return acc;
      }, {}),
  );

  const options = unit.options.filter((o) => o.quantity > 0).map((o) => o.name);

  console.log(
    JSON.stringify(
      {
        collection,
        totalSelected,
        options,
      },
      null,
      2,
    ),
  );

  return {
    warnings: "on",
  };
};
