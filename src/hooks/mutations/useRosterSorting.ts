import { DragStart, DropResult } from "@hello-pangea/dnd";
import { useRosterBuildingState } from "../../state/roster-building";
import { SiegeEquipment } from "../../types/mesbg-data.types.ts";
import { FreshUnit, SelectedUnit, Warband } from "../../types/roster.ts";
import { moveItem, moveItemBetweenLists } from "../../utils/array.ts";
import { useCalculator } from "../calculations-and-displays/useCalculator.ts";
import { useRosterInformation } from "../calculations-and-displays/useRosterInformation.ts";

function byId(id: string) {
  return (warband) => warband.id === id;
}

export const useRosterSorting = () => {
  const { roster } = useRosterInformation();
  const calculator = useCalculator();
  const { updateRoster } = useRosterBuildingState();

  const getResortedWarband = (
    wb: Warband,
    reorderedSource: (FreshUnit | SelectedUnit | SiegeEquipment)[],
  ) =>
    calculator.recalculateWarband({
      ...wb,
      units: reorderedSource,
    });

  function onUnitDropped(result: DropResult) {
    console.debug("Drag and drop result:", result);
    if (!result.destination) return;

    if (result.type === "warband") {
      const reorderedWarbands = moveItem(
        roster.warbands,
        result.source.index,
        result.destination.index,
      );
      updateRoster({
        ...roster,
        warbands: reorderedWarbands.map((warband, index) => ({
          ...warband,
          meta: { ...warband.meta, num: index + 1 },
        })),
      });
    }

    const srcId = result.source.droppableId;
    const dstId = result.destination.droppableId;

    if (srcId === dstId) {
      if (result.source.index === result.destination.index) return;

      const warband = roster.warbands.find(byId(srcId));
      if (warband) {
        const reorderedWarband = moveItem(
          warband.units,
          result.source.index,
          result.destination.index,
        );
        updateRoster({
          ...roster,
          warbands: roster.warbands.map((wb) =>
            wb.id === warband.id
              ? getResortedWarband(wb, reorderedWarband)
              : wb,
          ),
        });
      }
      return;
    }

    const srcWarband = roster.warbands.find(byId(srcId));
    const dstWarband = roster.warbands.find(byId(dstId));
    if (srcWarband && dstWarband) {
      const [reorderedSource, reorderedDestination] = moveItemBetweenLists(
        srcWarband.units,
        result.source.index,
        dstWarband.units,
        result.destination.index,
      );

      updateRoster(
        calculator.recalculateRoster({
          ...roster,
          warbands: roster.warbands.map((wb) =>
            wb.id === srcWarband.id
              ? getResortedWarband(wb, reorderedSource)
              : wb.id === dstWarband.id
                ? getResortedWarband(wb, reorderedDestination)
                : wb,
          ),
        }),
      );
    }
  }

  function onUnitStartedDragging(start: DragStart) {
    console.debug("Drag and drop started:", start);
  }

  return {
    onUnitDropped,
    onUnitStartedDragging,
  };
};
