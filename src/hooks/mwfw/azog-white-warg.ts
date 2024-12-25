import { mesbgData } from "../../assets/data.ts";
import { Option } from "../../types/mesbg-data.types.ts";
import { SelectedUnit } from "../../types/roster.ts";
import { selectedOptionWithName } from "../../utils/options.ts";
import { MwfwUpdater } from "../useMwfMutations.ts";

export const handledModels = [
  "[pits-of-dol-guldur] azog-the-defiler",
  "[azog's-hunters] azog-the-defiler",
];

export const handler: MwfwUpdater = {
  isMatchingUnit(unitId: string): boolean {
    return handledModels.includes(unitId);
  },
  update(unit: SelectedUnit, options: Option[]): SelectedUnit["MWFW"] {
    const hasTheWhiteWarg = !!options.find(
      selectedOptionWithName("The White Warg"),
    );

    const untouchedMWFW = mesbgData[unit.model_id].MWFW;

    if (!hasTheWhiteWarg) {
      return untouchedMWFW;
    }

    return [
      [unit.name, untouchedMWFW[0][1]],
      ["The White Warg", "2:1:1:2"],
    ];
  },
};
