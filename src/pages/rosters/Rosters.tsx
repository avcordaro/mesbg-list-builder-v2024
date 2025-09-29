import { DragDropContext } from "@hello-pangea/dnd";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { FunctionComponent, useState } from "react";
import { useParams } from "react-router-dom";
import { NewRosterButton } from "../../components/atoms/new-roster-button/NewRosterButton.tsx";
import { useRosterBuildingState } from "../../state/roster-building";
import { RostersPageHeader } from "./components/RostersPageHeader.tsx";
import { RostersSearchFilter } from "./components/RostersSearchFilter.tsx";
import { RemoveFromGroupDroppable } from "./components/cards/RemoveFromGroupDroppable.tsx";
import { RosterCardList } from "./components/cards/RosterCardList.tsx";
import { RosterGroupCardList } from "./components/cards/RosterGroupCardList.tsx";
import { useRostersDragAndDrop } from "./useRostersDragAndDrop.ts";

export const Rosters: FunctionComponent = () => {
  const { groupId } = useParams();

  const { rosters, groups } = useRosterBuildingState();
  const { onDragStart, onDragEnd, dragging } = useRostersDragAndDrop();

  const activeGroup = groups.find((group) => group.slug === groupId);

  const [filter, setFilter] = useState("");

  return (
    <Container maxWidth={false} sx={{ my: 2 }}>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Stack>
          <RostersPageHeader group={activeGroup} />
          <RostersSearchFilter filter={filter} setFilter={setFilter} />
          <Stack direction="row" gap={4} sx={{ m: 1 }} flexWrap="wrap" flex={1}>
            <RemoveFromGroupDroppable visible={!!activeGroup} />
            <RosterGroupCardList groups={groups} dragged={dragging} />
            <RosterCardList rosters={rosters} dragged={dragging} />
          </Stack>
        </Stack>
      </DragDropContext>
      <NewRosterButton />
    </Container>
  );
};
