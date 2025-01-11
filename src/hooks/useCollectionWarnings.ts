import { useCollectionState } from "../state/collection";
import { useUserPreferences } from "../state/preference";
import { isSiegeEquipment, SelectedUnit } from "../types/roster.ts";
import { arraysMatch } from "../utils/array.ts";
import { findBestMatch } from "../utils/string.ts";
import {
  calculateGenericModels,
  getAmountOfAvailableUnitsIncludingGenerics,
  getAmountOfSelectedUnitsWithGivenOptions,
  getListOfOptionsForGivenUnit,
  getMountName,
  getTotalSelectedModelsGroupedPerChosenOptions,
} from "./collections/utils.ts";
import { useRosterInformation } from "./useRosterInformation.ts";

export const useCollectionWarnings = (
  unit: SelectedUnit,
): {
  warnings: "off" | "on";
  overExceededCollection?: boolean;
  available?: number;
  selected?: number;
} => {
  const { preferences } = useUserPreferences();
  const { inventory } = useCollectionState();
  const { roster } = useRosterInformation();

  if (!preferences.collectionWarnings || isSiegeEquipment(unit)) {
    return {
      warnings: "off",
    };
  }

  // The full collection for a given miniature
  const { collection } = (inventory[unit.profile_origin] &&
    inventory[unit.profile_origin][unit.name.replace(" (General)", "")]) || {
    collection: [],
  };

  // The amount of miniatures marked as 'Generic' grouped by their mount.
  const generics = calculateGenericModels(collection);
  // The total amount of selected grouped by chosen options
  const totalSelected = getTotalSelectedModelsGroupedPerChosenOptions(
    roster,
    unit,
    collection,
  );

  // A list of selected options and selected mount
  const mount = getMountName(unit);
  const options = getListOfOptionsForGivenUnit(unit);

  // The total amount of generic models used,
  // used to check if there are enough models in the collection.
  // if (genericsUsed > genericsAvailable) then there is a problem.
  const totalGenericsUsed = totalSelected
    .map((ts) => ts.genericsUsed)
    .reduce((a, b) => a + b, 0);

  const totalGenericsUsedElseWhere = totalSelected
    .filter((ts) => !arraysMatch(ts.options, options))
    .map((ts) => ts.genericsUsed)
    .reduce((a, b) => a + b, 0);

  // Get the amount of generic models used for the chosen selection. This is based on the selected mount.
  const bestMatchingMount = findBestMatch(mount, generics);
  const amountOfGenericsForGivenMount = generics[bestMatchingMount] ?? 0;

  // The total amount of available units given the current selection of options
  const available = getAmountOfAvailableUnitsIncludingGenerics(
    collection,
    options,
    mount,
    amountOfGenericsForGivenMount,
    totalGenericsUsedElseWhere,
  );
  // The total amount of selected units given the current selection of options
  const selected = getAmountOfSelectedUnitsWithGivenOptions(
    totalSelected,
    options,
  );

  // // Debug line given a specific profile name,
  // // ~ Keep commented until needed!! ~
  if (unit.name.includes("Uruk-Hai")) {
    console.dir({
      name: unit.name,
      generics,
      mount,
      bestMatchingMount,
      amountOfGenericsForGivenMount,
      totalGenericsUsed,
      collection,
      options,
      totalSelected,
      available,
      selected,
    });
  }

  return {
    warnings: "on",
    available,
    selected,
    overExceededCollection:
      totalGenericsUsed > amountOfGenericsForGivenMount &&
      !!totalSelected.find(
        (ts) => ts.genericsUsed > 0 && arraysMatch(ts.options, options),
      ),
  };
};
