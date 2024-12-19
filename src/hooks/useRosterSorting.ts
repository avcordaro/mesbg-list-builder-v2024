import { DragStart, DropResult } from "@hello-pangea/dnd";
import { useRosterBuildingState } from "../state/roster-building";
import { moveItem, moveItemBetweenLists } from "../utils/array.ts";
import { useRosterInformation } from "./useRosterInformation.ts";

function byId(id: string) {
  return (warband) => warband.id === id;
}

export const useRosterSorting = () => {
  const { roster } = useRosterInformation();
  const { updateRoster } = useRosterBuildingState();

  function onUnitDropped(result: DropResult) {
    console.debug("Drag and drop result:", result);
    if (!result.destination) return;

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
              ? {
                  ...wb,
                  units: reorderedWarband,
                }
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

      updateRoster({
        ...roster,
        warbands: roster.warbands.map((wb) =>
          wb.id === srcWarband.id
            ? {
                ...wb,
                units: reorderedSource,
              }
            : wb.id === dstWarband.id
              ? {
                  ...wb,
                  units: reorderedDestination,
                }
              : wb,
        ),
      });
    }
  }

  function onUnitStartedDragging(start: DragStart) {
    console.info("Drag and drop started:", start);
  }

  return {
    onUnitDropped,
    onUnitStartedDragging,
  };
};
