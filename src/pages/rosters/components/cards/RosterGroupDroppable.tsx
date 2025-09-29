import { Droppable } from "@hello-pangea/dnd";
import Box from "@mui/material/Box";
import { CARD_SIZE_IN_PX } from "../../../../components/common/roster-card/RosterSummaryCard.tsx";
import { RosterGroupCard } from "../../../../components/common/roster-group-card/RosterGroupCard.tsx";
import { useScreenSize } from "../../../../hooks/calculations-and-displays/useScreenSize.ts";
import { RosterGroup } from "../../../../state/roster-building/groups";

export const RosterGroupDroppable = ({ group }: { group: RosterGroup }) => {
  const screen = useScreenSize();
  return (
    <Droppable key={group.id} droppableId={"group:" + group.id}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={[
            {
              width: screen.isTooSmall ? "100%" : `${CARD_SIZE_IN_PX}px`,
              aspectRatio: "1/1",
            },
            snapshot.isDraggingOver
              ? {
                  backgroundColor: "#FFFFFF33",
                  border: "1px dashed white",
                  p: 1,
                  transition: "padding 0.3s ease",
                }
              : {
                  p: 1,
                  transition: "padding 0.3s ease",
                },
          ]}
        >
          <RosterGroupCard
            name={group.name}
            slug={group.slug}
            icon={group.icon}
            rosters={group.rosters.length}
          />
          <Box sx={{ "&>*": { height: "0px !important" } }}>
            {provided.placeholder}
          </Box>
        </Box>
      )}
    </Droppable>
  );
};
