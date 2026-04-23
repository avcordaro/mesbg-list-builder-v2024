import { Box } from "@mui/material";
import { Unit } from "../../../../types/mesbg-data.types.ts";
import { UnitSelectionButton } from "../UnitSelectionButton.tsx";
import { WithRibbon } from "../WithRibbon.tsx";

export function VirtualUnitRow({
  unit,
  selectUnit,
}: {
  unit: Unit;
  selectUnit: (unit: Unit) => void;
}) {
  return (
    <Box sx={{ my: 1 }}>
      <WithRibbon key={unit.model_id} label="Legacy" hideRibbon={!unit.legacy}>
        <UnitSelectionButton unit={unit} onClick={() => selectUnit(unit)} />
      </WithRibbon>
    </Box>
  );
}
