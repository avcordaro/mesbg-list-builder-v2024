import { mesbgData } from "../../../assets/data.ts";
import { Option } from "../../../types/mesbg-data.types.ts";
import { SelectedUnit } from "../../../types/roster.ts";
import { selectedOptionWithName } from "../../../utils/options.ts";
import { MwfwUpdater } from "../useMwfMutations.ts";

export const handledModels = [
  "[the-battle-of-five-armies] bofur-the-dwarf-champion-of-erebor",
];

export const handler: MwfwUpdater = {
  isMatchingUnit(unitId: string): boolean {
    return handledModels.includes(unitId);
  },
  update(unit: SelectedUnit, options: Option[]): SelectedUnit["MWFW"] {
    const hasTrollBrute = !!options.find(selectedOptionWithName("Troll Brute"));

    const untouchedMWFW = mesbgData[unit.model_id].MWFW;

    if (!hasTrollBrute) {
      return untouchedMWFW;
    }

    return [
      [unit.name, untouchedMWFW[0][1]],
      ["Troll Brute", "0:0:0:4"],
    ];
  },
};
