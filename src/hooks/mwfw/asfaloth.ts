import { mesbgData } from "../../assets/data.ts";
import { Option } from "../../types/mesbg-data.types.ts";
import { SelectedUnit } from "../../types/roster.ts";
import { selectedOptionWithName } from "../../utils/options.ts";
import { MwfwUpdater } from "../useMwfMutations.ts";

export const handledModels = [
  "[battle-of-fornost] glorfindel-lord-of-the-west",
  "[rivendell] arwen",
  "[road-to-rivendell] arwen",
];

export const handler: MwfwUpdater = {
  isMatchingUnit(unitId: string): boolean {
    return handledModels.includes(unitId);
  },
  update(unit: SelectedUnit, options: Option[]): SelectedUnit["MWFW"] {
    const hasAsfaloth = !!options.find(selectedOptionWithName("Asfaloth"));

    const untouchedMWFW = mesbgData[unit.model_id].MWFW;

    if (!hasAsfaloth) {
      return untouchedMWFW;
    }

    return [
      [unit.name, untouchedMWFW[0][1]],
      ["Asfaloth", "0:1:1:1"],
    ];
  },
};
