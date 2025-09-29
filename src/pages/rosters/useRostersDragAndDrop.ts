import { DragStart, DropResult } from "@hello-pangea/dnd";
import { useState } from "react";
import { ModalTypes } from "../../components/modal/modals.tsx";
import { useApi } from "../../hooks/cloud-sync/useApi.ts";
import { useAppState } from "../../state/app";
import { useRosterBuildingState } from "../../state/roster-building";

export const REMOVE_FOM_GROUP = "remove-from-group";

export const useRostersDragAndDrop = () => {
  const api = useApi();
  const { setCurrentModal } = useAppState();
  const { rosters, groups, updateGroup } = useRosterBuildingState();

  const [draggingRoster, setDraggingRoster] = useState<string>();

  function onDragStart(start: DragStart) {
    setDraggingRoster(start.draggableId);
  }

  function addRosterToGroup(groupId: string, rosterId: string) {
    console.debug(`Add roster ${rosterId} to group ${groupId}`);
    const groupSlug = groups.find((group) => group.id === groupId)?.slug;

    updateGroup(groupId, {
      rosters: [
        ...groups.find((group) => group.id === groupId).rosters,
        rosterId,
      ],
    });
    api.addRosterToGroup(groupSlug, rosterId);
  }

  function onDragEnd(result: DropResult) {
    setDraggingRoster(null);

    if (!result.destination) return; // dropped outside a droppable container. Nothing to be done.

    if (result.source.droppableId === result.destination.droppableId) return; // dropped item on its self (same spot). Nothing needs to be done here.

    const [type, destinationId] = result.destination.droppableId.split(":");

    if (type === "group") {
      addRosterToGroup(destinationId, result.draggableId);
      return;
    }

    console.debug(`Attempt create group...`);
    const rosterA = rosters.find(({ id }) => id === result.draggableId);
    const rosterB = rosters.find(({ id }) => id === destinationId);
    setCurrentModal(ModalTypes.CREATE_ROSTER_GROUP, {
      rosters: [rosterA, rosterB],
    });
  }

  return { onDragStart, onDragEnd, draggingRoster };
};
