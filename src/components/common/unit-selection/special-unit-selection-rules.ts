import { Unit } from "../../../types/mesbg-data.types.ts";

export function handleGarrisonOfIthilien(unit: Unit, selectedUnits: string[]) {
  return unit.army_list === "Garrison of Ithilien"
    ? ![
        "[garrison-of-ithilien] samwise-gamgee",
        "[garrison-of-ithilien] smeagol",
      ].includes(unit.model_id) ||
        !selectedUnits.includes("[garrison-of-ithilien] frodo-baggins")
    : true;
}

export const handleSpecialRestriction =
  (selectedUnits: string[]) => (unit: Unit) => {
    return [handleGarrisonOfIthilien].every((restriction) =>
      restriction(unit, selectedUnits),
    );
  };
