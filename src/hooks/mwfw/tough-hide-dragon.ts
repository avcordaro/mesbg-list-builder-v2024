import { mesbgData } from "../../assets/data.ts";
import { Option } from "../../types/mesbg-data.types.ts";
import { SelectedUnit } from "../../types/roster.ts";
import { selectedOptionWithName } from "../../utils/options.ts";
import { MwfwUpdater } from "../useMwfMutations.ts";

export const handledModels = [
  "[dragons-of-the-north] dragon-general",
  "[dragons-of-the-north] dragon",
  "[moria] dragon",
];

export const handler: MwfwUpdater = {
  isMatchingUnit(unitId: string): boolean {
    return handledModels.includes(unitId);
  },
  update(unit: SelectedUnit, options: Option[]): SelectedUnit["MWFW"] {
    const hasToughHide = !!options.find(selectedOptionWithName("Tough Hide"));

    const untouchedMWFW = mesbgData[unit.model_id].MWFW;

    if (!hasToughHide) {
      return untouchedMWFW;
    }

    const dragon = untouchedMWFW[0][1];
    const [m, w, f, x] = dragon.split(":");
    const mwfw = [m, w, f, Number(x) + 2].join(":");

    console.log(mwfw);

    return [["", mwfw]];
  },
};
