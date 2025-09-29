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

  const [dragging, setDragging] = useState<string>();

  function onDragStart(start: DragStart) {
    setDragging(start.draggableId);
  }

  function addRosterToGroup(groupId: string, rosterId: string) {
    const groupSlug = groups.find((group) => group.id === groupId)?.slug;
    updateGroup(groupId, {
      rosters: [
        ...groups.find((group) => group.id === groupId).rosters,
        rosterId,
      ],
    });
    api.addRosterToGroup(groupSlug, rosterId);
  }

  function setParentGroup(parent: string, groupId: string) {
    const groupSlug = groups.find((group) => group.id === groupId)?.slug;
    const parentSlug = groups.find((group) => group.id === parent)?.slug;

    updateGroup(groupId, { parent: parentSlug });
    api.setParentGroup(groupSlug, parentSlug);
  }

  function onDragEnd(result: DropResult) {
    setDragging(null);

    if (!result.destination) {
      console.debug(
        "Dropped outside a droppable container. Nothing to be done.",
      );
      return;
    }

    if (result.source.droppableId === result.destination.droppableId) {
      console.debug(
        "Dropped item on its self (same spot). Nothing needs to be done here.",
      );
      return;
    }

    const [destType, destId] = result.destination.droppableId.split(":");
    const [sourceType, sourceId] = result.source.droppableId.split(":");

    if (sourceType === "group" && destType === "group") {
      console.log(`Set parent group for ${sourceId} to group ${destId}`);
      setParentGroup(destId, sourceId);
    } else if (sourceType === "roster" && destType === "group") {
      console.log(`Add roster ${sourceId} to group ${destId}`);
      addRosterToGroup(destId, sourceId);
    } else if (sourceType === "roster" && destType === "roster") {
      console.log(`Create new group with rosters...`);
      const rosterA = rosters.find(({ id }) => id === sourceId);
      const rosterB = rosters.find(({ id }) => id === destId);
      setCurrentModal(ModalTypes.CREATE_ROSTER_GROUP, {
        rosters: [rosterA, rosterB],
      });
    } else {
      console.warn(
        `Unable to perform operation dropping ${sourceType} on ${destType}`,
      );
    }
  }

  return { onDragStart, onDragEnd, dragging };
};
