import { TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { mesbgData } from "../../../../assets/data";
import { useRosterInformation } from "../../../../hooks/useRosterInformation";
import { Unit } from "../../../../types/mesbg-data.types";
import { UnitSelectionButton } from "../UnitSelectionButton.tsx";
import { WithRibbon } from "../WithRibbon.tsx";
import { useMergedUnitData } from "./useMergedUnitData.ts";

export type UnitSelectionListProps = {
  armyList: string;
  selectUnit: (unit: Unit) => void;
};

export const UnitSelectionList: FunctionComponent<UnitSelectionListProps> = ({
  armyList,
  selectUnit,
}) => {
  const selectedModels = useRosterInformation().getSetOfModelIds();
  const [filter, setFilter] = useState("");
  const mergeDuplicateHeroes = useMergedUnitData();

  function removeArmyListSection(item: string) {
    return item.replace(/\[[^\]]*\]\s*/g, "");
  }

  const actualSelectedModels = selectedModels.map((item) =>
    removeArmyListSection(item),
  );

  const goodOrEvil = armyList.replaceAll("Custom: ", "");

  const units: Unit[] = mergeDuplicateHeroes(
    Object.values(mesbgData)
      .filter((unit) => unit.army_type.includes(goodOrEvil))
      .filter(
        (unit) =>
          unit.unit_type === "Warrior" || unit.unit_type === "Independent Hero",
      )
      .filter(
        (unit: Unit) =>
          !unit.unique ||
          !actualSelectedModels.includes(removeArmyListSection(unit.model_id)),
      )
      .sort((a, b) => {
        const byPoints = b.base_points > a.base_points ? 1 : -1;
        const byName = b.name.localeCompare(a.name);
        // Make sure each element weighs more in the sorting starting
        // with Points followed by name.
        return byPoints * 10 + byName;
      }),
  );

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
