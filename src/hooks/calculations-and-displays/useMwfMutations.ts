import { Option } from "../../types/mesbg-data.types.ts";
import { SelectedUnit } from "../../types/roster.ts";
import handlers, { handledModels } from "./mwfw";

export interface MwfwUpdater {
  isMatchingUnit: (unitId: string) => boolean;
  update: (unit: SelectedUnit, options: Option[]) => SelectedUnit["MWFW"];
}

export const useMwfMutations = () => {
  function hasSpecialMwfRules(unit: SelectedUnit): boolean {
    return handledModels.includes(unit.model_id);
  }

  function handleSpecialMwfForUnit(
    unit: SelectedUnit,
    options: Option[],
  ): SelectedUnit["MWFW"] {
    if (!hasSpecialMwfRules(unit)) return unit.MWFW;

    const handler = handlers.find((handler) =>
      handler.isMatchingUnit(unit.model_id),
    );
    if (!handler) {
      console.error(
        "No handler found to handle MWFW for unit which is listed in the hasSpecialMwfRules list!",
        unit.model_id,
      );
      return unit.MWFW; // Fallback to default MWFW.
    }

    return handler.update(unit, options);
  }

  return {
    hasSpecialMwfRules,
    handleSpecialMwfForUnit,
  };
};
