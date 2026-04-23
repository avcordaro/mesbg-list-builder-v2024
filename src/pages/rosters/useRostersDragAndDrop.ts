import { DragStart, DropResult } from "@hello-pangea/dnd";
import { useState } from "react";
import { ModalTypes } from "../../components/modal/modals.tsx";
import { useApi } from "../../hooks/cloud-sync/useApi.ts";
import { useAppState } from "../../state/app";
import { useRosterBuildingState } from "../../state/roster-building";

export const REMOVE_FOM_GROUP = "remove:from-group";

export const useRostersDragAndDrop = () => {
  const api = useApi();
  const { setCurrentModal } = useAppState();
  const { rosters, groups, updateGroup, updateRoster } =
    useRosterBuildingState();

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

  function removeRosterFromGroup(groupId: string, rosterId: string) {
    const group = groups.find((group) => group.id === groupId);
    const newRosters = group.rosters.filter((roster) => roster !== rosterId);

    updateRoster({
      ...rosters.find(({ id }) => id === rosterId),
      group: null,
    });
    updateGroup(groupId, { rosters: newRosters });
    api.removeRosterFromGroup(group.slug, rosterId);
  }

  function setParentGroup(parent: string, groupId: string) {
    const groupSlug = groups.find((group) => group.id === groupId)?.slug;
    const parentSlug = groups.find((group) => group.id === parent)?.slug;

    updateGroup(groupId, { parent: parentSlug });
    api.setParentGroup(groupSlug, parentSlug);
  }

  function moveGroupUpOneGroup(itemId: string) {
    const group = groups.find((group) => group.id === itemId);
    const groupSlug = group.slug;
    const parentId = group.parent;
    const parentOfParent = groups.find(
      (group) => group.slug === parentId,
    )?.parent;

    if (parentOfParent) {
      updateGroup(itemId, { parent: parentOfParent });
      api.setParentGroup(groupSlug, parentOfParent);
    } else {
      updateGroup(itemId, { parent: null });
      api.removeParentGroup(groupSlug);
    }
  }

  function moveRosterUpOneGroup(itemId: string) {
    const roster = rosters.find((roster) => roster.id === itemId);
    const currentGroup = groups.find((group) => group.slug === roster.group);
    const parentGroup = groups.find(
      (group) => group.slug === currentGroup.parent,
    );

    if (parentGroup) {
      addRosterToGroup(parentGroup.id, roster.id);
    } else {
      removeRosterFromGroup(currentGroup.id, roster.id);
    }
  }

  function removeFromGroup(itemType: string, itemId: string) {
    if (itemType === "group") {
      moveGroupUpOneGroup(itemId);
    } else if (itemType === "roster") {
      moveRosterUpOneGroup(itemId);
    }
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

    if (destType === "remove") {
      console.log(`Remove ${sourceType} ${sourceId} from the current group...`);
      removeFromGroup(sourceType, sourceId);
    } else if (sourceType === "group" && destType === "group") {
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
