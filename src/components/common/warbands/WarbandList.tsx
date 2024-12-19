import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { createRef, FunctionComponent, useEffect, useRef } from "react";
import { useRosterInformation } from "../../../hooks/useRosterInformation.ts";
import { useRosterMutations } from "../../../hooks/useRosterMutations.ts";
import { useRosterSorting } from "../../../hooks/useRosterSorting.ts";
import { Warband as WarbandType } from "../../../types/roster.ts";
import { Warband, WarbandActions } from "./Warband.tsx";

export type WarbandListProps = {
  warbands: WarbandType[];
};

export const WarbandList: FunctionComponent<WarbandListProps> = ({
  warbands,
}) => {
  const mutations = useRosterMutations();
  const sorting = useRosterSorting();
  const { canSupportMoreWarbands, roster } = useRosterInformation();

  const refs = useRef(roster.warbands.map(() => createRef<WarbandActions>()));

  useEffect(() => {
    // Adjust the refs array when the warbands get updated.
    refs.current = roster.warbands.map(
      (_, i) => refs.current[i] || createRef<WarbandActions>(),
    );
  }, [roster.warbands]);

  const collapseAll = (collapsed: boolean) => {
    refs.current.forEach((ref) => {
      ref.current.collapseAll(collapsed);
    });
  };

  return (
    <Stack spacing={1} sx={{ pb: 16 }}>
      <DragDropContext
        onDragEnd={sorting.onUnitDropped}
        onDragStart={sorting.onUnitStartedDragging}
      >
        <Droppable droppableId="warbands" type="warband">
          {(droppable, droppableSnapshot) => (
            <Stack
              gap={1}
              ref={droppable.innerRef}
              {...droppable.droppableProps}
              sx={
                droppableSnapshot.isDraggingOver
                  ? {
                      backgroundColor: "#00000033",
                      border: "1px dashed black",
                      p: 1,
                      transition: "padding 0.3s ease",
                    }
                  : {
                      transition: "padding 0.3s ease",
                    }
              }
            >
              {warbands.map((warband, index) => (
                <Draggable
                  draggableId={warband.id}
                  index={index}
                  key={warband.id}
                >
                  {(draggable, snapshot) => (
                    <Box
                      ref={draggable.innerRef}
                      {...draggable.draggableProps}
                      {...draggable.dragHandleProps}
                    >
                      <Box
                        sx={[
                          { transition: "padding 0.3s ease" },
                          snapshot.isDragging ? { p: 3 } : {},
                        ]}
                      >
                        <Box
                          sx={
                            snapshot.isDragging
                              ? {
                                  transform: "rotate(1.5deg)",
                                  boxShadow: "1rem 1rem 1rem #00000099",
                                  transition:
                                    "transform 0.3s ease, boxShadow 0.3s ease",
                                }
                              : {
                                  transition:
                                    "transform 0.3s ease, boxShadow 0.3s ease",
                                }
                          }
                        >
                          <Warband
                            key={warband.id}
                            warband={warband}
                            ref={refs.current[index]}
                            collapseAll={collapseAll}
                          />
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Draggable>
              ))}
              {droppable.placeholder}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>

      {canSupportMoreWarbands() && (
        <Button
          onClick={() => mutations.addNewWarband()}
          endIcon={<AddIcon />}
          variant="contained"
          data-test-id="add-warband"
        >
          Add Warband
        </Button>
      )}
    </Stack>
  );
};
