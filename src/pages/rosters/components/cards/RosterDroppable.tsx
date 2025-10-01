import { Draggable, Droppable } from "@hello-pangea/dnd";
import Box from "@mui/material/Box";
import {
  CARD_SIZE_IN_PX,
  RosterSummaryCard,
} from "../../../../components/common/roster-card/RosterSummaryCard.tsx";
import { useScreenSize } from "../../../../hooks/calculations-and-displays/useScreenSize.ts";
import { Roster } from "../../../../types/roster.ts";

type RosterDroppableProps = {
  roster: Roster;
  index: number;
  isDragged?: string;
  isDisabled?: boolean;
};

export const RosterDroppable = ({
  roster,
  index,
  isDragged,
  isDisabled,
}: RosterDroppableProps) => {
  const screen = useScreenSize();
  return (
    <Droppable
      droppableId={"roster:" + roster.id}
      isDropDisabled={isDisabled || isDragged?.startsWith("group")}
    >
      {(provided, snapshot) => {
        return (
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
                    p: "calc(0.5rem - 2px)",
                    transition: "padding 0.3s ease",
                  }
                : {
                    p: "0.5rem",
                    transition: "padding 0.3s ease",
                  },
            ]}
          >
            <Draggable
              draggableId={"roster:" + roster.id}
              index={index}
              isDragDisabled={isDisabled}
            >
              {(draggableProvided, draggableSnapshot) => {
                const { style, ...props } = draggableProvided.draggableProps;
                return (
                  <Box
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.dragHandleProps}
                    {...props}
                    style={isDragged === "roster:" + roster.id ? style : {}}
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
                              boxShadow: "1rem 1rem 1rem #00000099",
                              transition:
                                "transform 0.3s ease, boxShadow 0.3s ease",
                            }
                          : {
                              transition:
                                "transform 0.3s ease, boxShadow 0.3s ease",
                            },
                      ]}
                    >
                      <RosterSummaryCard roster={roster} />
                    </Box>
                  </Box>
                );
              }}
            </Draggable>
            <Box sx={{ "&>*": { height: "0px !important" } }}>
              {provided.placeholder}
            </Box>
          </Box>
        );
      }}
    </Droppable>
  );
};
