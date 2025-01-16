import { SelectedUnit } from "../../../types/roster.ts";

export function getMightWillAndFate(unit: SelectedUnit) {
  const specialCases = [];
  if (specialCases.includes(unit.model_id) || unit.unit_type === "Siege Engine")
    return { HM: "-", HW: "-", HF: "-" };

  if (unit.MWFW && unit.MWFW[0]) {
    const [HM, HW, HF] = unit.MWFW[0][1].split(":");
    return { HM, HW, HF };
  } else {
    return { HM: "-", HW: "-", HF: "-" };
  }
}
