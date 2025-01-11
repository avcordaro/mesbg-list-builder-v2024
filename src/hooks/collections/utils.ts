import { Collection } from "../../state/collection/inventory";
import { isSelectedUnit, Roster, SelectedUnit } from "../../types/roster.ts";
import { arraysMatch, groupBy } from "../../utils/array.ts";

type SelectedModel = {
  quantity: number;
  options: string[];
  genericsUsed: number;
  mount: string;
};
export type GenericModels = { [mountName: string]: number };

export function getTotalSelectedModelsGroupedPerChosenOptions(
  roster: Roster,
  unit: SelectedUnit,
  collection: Collection[],
): SelectedModel[] {
  return Object.values(
    roster.warbands
      .flatMap((wb) => [wb.hero, ...wb.units])
      .filter(isSelectedUnit)
      .filter(
        ({ name, profile_origin }) =>
          name.replace(" (General)", "") ===
            unit.name.replace(" (General)", "") &&
          profile_origin === unit.profile_origin,
      )
      .map(({ name, unit_type, options, quantity }) => {
        let selectedOptions = options
          .filter((o) => o.quantity > 0)
          .map((o) => o.name);
        if (
          name === "Rohan Royal Guard" &&
          arraysMatch(selectedOptions, ["Horse", "Throwing spears"])
        ) {
          selectedOptions = ["Horse and throwing spears"];
        }
        return {
          options: selectedOptions,
          mount: unit_type.includes("Hero")
            ? options.find(
                (o) => o.quantity > 0 && o.type && o.type.includes("mount"),
              )?.name || ""
            : "",
          quantity,
        };
      })
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
}

export function calculateGenericModels(
  collection: Collection[],
): GenericModels {
  return Object.fromEntries(
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
}

export function getListOfOptionsForGivenUnit(unit: SelectedUnit): string[] {
  let options = unit.options.filter((o) => o.quantity > 0).map((o) => o.name);
  if (
    unit.name === "Rohan Royal Guard" &&
    arraysMatch(options, ["Horse", "Throwing spears"])
  ) {
    options = ["Horse and throwing spears"];
  }
  return options;
}

export function getMountName(unit: SelectedUnit) {
  return (
    (unit.unit_type.includes("Hero") &&
      unit.options.find(
        (o) => o.quantity > 0 && o.type && o.type.includes("mount"),
      )?.name) ||
    ""
  );
}

export function getAmountOfAvailableUnitsIncludingGenerics(
  collection: Collection[],
  options: string[],
  mount: string,
  amountOfGenericsForGivenMount: number,
  totalGenericsUsedElseWhere: number,
) {
  return (
    Number(
      collection.find(
        (ts) =>
          arraysMatch(
            typeof ts.options === "string" ? [ts.options] : ts.options,
            options.length === 0
              ? ["None"]
              : options.filter((o) => o !== mount),
          ) && mount === ts.mount,
      )?.amount || "0",
    ) + Math.max(amountOfGenericsForGivenMount - totalGenericsUsedElseWhere, 0)
  );
}

export function getAmountOfSelectedUnitsWithGivenOptions(
  totalSelected: SelectedModel[],
  options: string[],
) {
  return (
    totalSelected.find((ts) => arraysMatch(ts.options, options))?.quantity || 0
  );
}
