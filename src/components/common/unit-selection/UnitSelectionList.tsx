import { TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import { ChangeEvent, FunctionComponent, useState } from "react";
import data from "../../../assets/data/mesbg_data.json";
import { heroConstraintData } from "../../../assets/data.ts";
import { useRosterInformation } from "../../../hooks/calculations-and-displays/useRosterInformation.ts";
import { Unit } from "../../../types/mesbg-data.types.ts";
import { UnitSelectionButton } from "./UnitSelectionButton.tsx";
import { WithRibbon } from "./WithRibbon.tsx";
import { handleSpecialRestriction } from "./special-unit-selection-rules.ts";

export type UnitSelectionListProps = {
  leadingHeroModelId: string;
  selectUnit: (unit: Unit) => void;
};

export const UnitSelectionList: FunctionComponent<UnitSelectionListProps> = ({
  leadingHeroModelId,
  selectUnit,
}) => {
  const selectedModels = useRosterInformation().getSetOfModelIds();
  const [filter, setFilter] = useState("");

  const unitIds =
    heroConstraintData[leadingHeroModelId]?.valid_warband_units || [];

  const units = unitIds
    .map((modelId) => data[modelId] as Unit)
    .filter(handleSpecialRestriction(selectedModels))
    .filter(
      (unit: Unit) => !unit.unique || !selectedModels.includes(unit.model_id),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Stack gap={1.5}>
      <TextField
        id="hero-selection-list--name-filter"
        label="Filter"
        placeholder="Filter heroes by name..."
        value={filter}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setFilter(event.target.value);
        }}
      />
      {units
        .filter((unit) =>
          unit.name.toLowerCase().includes(filter.toLowerCase()),
        )
        .map((unit) => (
          <WithRibbon
            key={unit.model_id}
            label="Legacy"
            hideRibbon={!unit.legacy}
          >
            <UnitSelectionButton unit={unit} onClick={() => selectUnit(unit)} />
          </WithRibbon>
        ))}
    </Stack>
  );
};
