import { mesbgData } from "../../assets/data.ts";
import { Option } from "../../types/mesbg-data.types.ts";
import { SelectedUnit } from "../../types/roster.ts";
import { selectedOptionWithName } from "../../utils/options.ts";
import { MwfwUpdater } from "../useMwfMutations.ts";

export const handledModels = [
  "[harad] war-mumak-of-harad",
  "[legions-of-mordor] war-mumak-of-harad",
  "[grand-army-of-the-south] war-mumak-of-harad",
  "[the-serpent-horde] war-mumak-of-harad",
];

export const handler: MwfwUpdater = {
  isMatchingUnit(unitId: string): boolean {
    return handledModels.includes(unitId);
  },
  update(unit: SelectedUnit, options: Option[]): SelectedUnit["MWFW"] {
    const hasMahudBeastmasterChieftain = !!options.find(
      selectedOptionWithName("Mahud Beastmaster Chieftain"),
    );

    const untouchedMWFW = mesbgData[unit.model_id].MWFW;

    if (!hasMahudBeastmasterChieftain) {
      return untouchedMWFW;
    }

    return [["Mahud Beastmaster Chieftain", "2:2:1:2"], untouchedMWFW[1]];
  },
};
