import { mesbgData } from "../../../assets/data.ts";
import { Option } from "../../../types/mesbg-data.types.ts";
import { SelectedUnit } from "../../../types/roster.ts";
import { selectedOptionWithName } from "../../../utils/options.ts";
import { MwfwUpdater } from "../useMwfMutations.ts";

export const handledModels = [
  "[defenders-of-the-pelennor] gandalf-the-white",
  "[men-of-the-west] gandalf-the-white",
  "[atop-the-walls] gandalf-the-white",
  "[riders-of-eomer] gandalf-the-white", // just for shadowfax.
];

export const handler: MwfwUpdater = {
  isMatchingUnit(unitId: string): boolean {
    return handledModels.includes(unitId);
  },
  update(unit: SelectedUnit, options: Option[]): SelectedUnit["MWFW"] {
    const hasPippin = !!options.find(selectedOptionWithName("Pippin"));
    const hasShadowfax = !!options.find(selectedOptionWithName("Shadowfax"));

    const untouchedMWFW = mesbgData[unit.model_id].MWFW;

    if (!hasPippin && !hasShadowfax) {
      return untouchedMWFW;
    }

    if (!hasPippin) {
      return [untouchedMWFW[0], ["Shadowfax", "0:2:1:1"]];
    }

    return [
      untouchedMWFW[0],
      ["Peregrin Took", "1:1:2:2"],
      ["Shadowfax", "0:2:1:1"],
    ];
  },
};
