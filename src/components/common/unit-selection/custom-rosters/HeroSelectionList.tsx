import { TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { mesbgData } from "../../../../assets/data";
import { unitSortOrder } from "../../../../hooks/profile-utils/sorting";
import { useRosterInformation } from "../../../../hooks/useRosterInformation";
import { Unit } from "../../../../types/mesbg-data.types";
import { UnitSelectionButton } from "../UnitSelectionButton.tsx";
import { WithRibbon } from "../WithRibbon.tsx";
import { useMergedUnitData } from "./useMergedUnitData.ts";

export type HeroSelectionListProps = {
  armyList: string;
  selectUnit: (unit: Unit) => void;
};

export const HeroSelectionList: FunctionComponent<HeroSelectionListProps> = ({
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

  const heroes: Unit[] = mergeDuplicateHeroes(
    Object.values(mesbgData)
      .filter((unit) => unit.army_type.includes(goodOrEvil))
      .filter(
        (unit) =>
          unit.unit_type.includes("Hero") || unit.unit_type === "Siege Engine",
      )
      .filter(
        (unit: Unit) =>
          !unit.unique ||
          !actualSelectedModels.includes(removeArmyListSection(unit.model_id)),
      )
      .sort((a, b) => {
        const byTier = unitSortOrder[a.unit_type] - unitSortOrder[b.unit_type];
        const byPoints = b.base_points > a.base_points ? 1 : -1;
        const byName = b.name.localeCompare(a.name);
        // Make sure each element weighs more in the sorting starting
        // with Heroic Tier, then Points followed by name.
        return byTier * 100 + byPoints * 10 + byName;
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
      {heroes
        .filter((hero) =>
          hero.name.toLowerCase().includes(filter.toLowerCase()),
        )
        .map((hero) => (
          <WithRibbon
            key={hero.model_id}
            label="Legacy"
            hideRibbon={!hero.legacy}
          >
            <UnitSelectionButton unit={hero} onClick={() => selectUnit(hero)} />
          </WithRibbon>
        ))}
    </Stack>
  );
};
