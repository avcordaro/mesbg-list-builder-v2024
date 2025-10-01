import { Draggable, Droppable } from "@hello-pangea/dnd";
import Box from "@mui/material/Box";
import { CARD_SIZE_IN_PX } from "../../../../components/common/roster-card/RosterSummaryCard.tsx";
import { RosterGroupCard } from "../../../../components/common/roster-group-card/RosterGroupCard.tsx";
import { useScreenSize } from "../../../../hooks/calculations-and-displays/useScreenSize.ts";
import { RosterGroup } from "../../../../state/roster-building/groups";

export const RosterGroupDroppable = ({
  group,
  index,
  isDragged,
}: {
  group: RosterGroup;
  index: number;
  isDragged?: string;
}) => {
  const screen = useScreenSize();
  return (
    <Droppable droppableId={"group:" + group.id}>
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
                  border: "1px dashed black",
                  p: 1,
                  transition: "padding 0.3s ease",
                }
              : {
                  p: 1,
                  transition: "padding 0.3s ease",
                },
          ]}
        >
          <Draggable draggableId={"group:" + group.id} index={index}>
            {(draggableProvided, draggableSnapshot) => {
              const { style, ...props } = draggableProvided.draggableProps;
              return (
                <Box
                  ref={draggableProvided.innerRef}
                  {...draggableProvided.dragHandleProps}
                  {...props}
                  style={isDragged === "group:" + group.id ? style : {}}
                >
                  <Box
                    sx={[
                      {
                        width: screen.isTooSmall
                          ? "100%"
                          : `${CARD_SIZE_IN_PX}px`,
                        aspectRatio: "1/1",
                      },
                      draggableSnapshot.isDragging
                        ? {
                            transform: "rotate(1.5deg)",
                            transition:
                              "transform 0.3s ease, boxShadow 0.3s ease",
                          }
                        : {
                            transition:
                              "transform 0.3s ease, boxShadow 0.3s ease",
                          },
                    ]}
                  >
                    <RosterGroupCard
                      group={group}
                      dragged={isDragged === "group:" + group.id}
                    />
                  </Box>
                </Box>
              );
            }}
          </Draggable>
          <Box sx={{ "&>*": { height: "0px !important" } }}>
            {provided.placeholder}
          </Box>
        </Box>
      )}
    </Droppable>
  );
};
