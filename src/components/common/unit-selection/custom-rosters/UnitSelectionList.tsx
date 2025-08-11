import { TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { mesbgData } from "../../../../assets/data";
import { useRosterInformation } from "../../../../hooks/useRosterInformation";
import { Unit } from "../../../../types/mesbg-data.types";
import { VirtualUnitRow } from "./VirtualUnitRow.tsx";
import { removeArmyListSection } from "./removeArmyListSection.ts";
import { useMergedUnitData } from "./useMergedUnitData.ts";

export type UnitSelectionListProps = {
  armyList: string;
  selectUnit: (unit: Unit) => void;
};

export const UnitSelectionList: FunctionComponent<UnitSelectionListProps> = ({
  armyList,
  selectUnit,
}) => {
  const [filter, setFilter] = useState("");
  const [rows, setRows] = useState([]);
  const mergeDuplicateUnits = useMergedUnitData();
  const selectedModels = useRosterInformation().getSetOfModelIds();
  const actualSelectedModels = selectedModels.map(removeArmyListSection);
  const goodOrEvil = armyList.replaceAll("Custom: ", "");
  const units: Unit[] = mergeDuplicateUnits(
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

  useEffect(() => {
    setRows(
      units.filter((unit) =>
        unit.name.toLowerCase().includes(filter.toLowerCase()),
      ),
    );
  }, [filter, setRows, units]);

  return (
    <Stack gap={1.5} sx={{ height: "100%" }}>
      <TextField
        id="hero-selection-list--name-filter"
        label="Filter"
        placeholder="Filter heroes by name..."
        value={filter}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setFilter(event.target.value);
        }}
      />
      <Virtuoso
        style={{ height: "100%", minHeight: "200px" }}
        totalCount={rows.length}
        itemContent={(index) => (
          <VirtualUnitRow unit={rows[index]} selectUnit={selectUnit} />
        )}
      />
    </Stack>
  );
};
