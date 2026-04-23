import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { createRef, FunctionComponent, useEffect, useRef } from "react";
import { useRosterInformation } from "../../../hooks/calculations-and-displays/useRosterInformation.ts";
import { useLockContext } from "../../../hooks/lock/useLockContext.ts";
import { useRosterSorting } from "../../../hooks/mutations/useRosterSorting.ts";
import { useWarbandMutations } from "../../../hooks/mutations/useWarbandMutations.ts";
import { Warband as WarbandType } from "../../../types/roster.ts";
import { toOrdinal } from "../../../utils/string.ts";
import { Warband, WarbandActions } from "./Warband.tsx";

export type WarbandListProps = {
  warbands: WarbandType[];
};

export const WarbandList: FunctionComponent<WarbandListProps> = ({
  warbands,
}) => {
  const { lock } = useLockContext();
  const { canSupportMoreWarbands, roster } = useRosterInformation();
  const { addNewWarband } = useWarbandMutations(roster.id, null);
  const sorting = useRosterSorting();

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
                  isDragDisabled={lock}
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
                                  overflowX: "auto",
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
          onClick={addNewWarband}
          endIcon={<AddIcon />}
          variant="contained"
          data-test-id="add-warband"
        >
          Add {toOrdinal(warbands.length + 1)} Warband
        </Button>
      )}
    </Stack>
  );
};
