import { DragStart, DropResult } from "@hello-pangea/dnd";
import { useRosterBuildingState } from "../state/roster-building";
import { moveItem, moveItemBetweenLists } from "../utils/array.ts";
import { useRosterInformation } from "./useRosterInformation.ts";

export const useRosterSorting = () => {
  const { roster } = useRosterInformation();
  const { updateRoster } = useRosterBuildingState();

  function onUnitDropped(result: DropResult) {
    console.debug("Drag and drop result:", result);
    if (!result.destination) return;

    if (result.source.droppableId === result.destination.droppableId) {
      if (result.source.index === result.destination.index) return;

      const warband = roster.warbands.find(
        (warband) => warband.id === result.source.droppableId,
      );
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

    const sourceWarband = roster.warbands.find(
      (warband) => warband.id === result.source.droppableId,
    );
    const destinationWarband = roster.warbands.find(
      (warband) => warband.id === result.destination.droppableId,
    );
    if (sourceWarband && destinationWarband) {
      const [reorderedSource, reorderedDestination] = moveItemBetweenLists(
        sourceWarband.units,
        result.source.index,
        destinationWarband.units,
        result.destination.index,
      );

      updateRoster({
        ...roster,
        warbands: roster.warbands.map((wb) =>
          wb.id === sourceWarband.id
            ? {
                ...wb,
                units: reorderedSource,
              }
            : wb.id === destinationWarband.id
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
    console.debug("Drag and drop started:", start);
  }

  return {
    onUnitDropped,
    onUnitStartedDragging,
  };
};
