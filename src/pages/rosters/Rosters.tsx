import {
  DragDropContext,
  Draggable,
  DragStart,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { CancelRounded } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ModalTypes } from "../../components/modal/modals.tsx";
import { useRosterInformation } from "../../hooks/useRosterInformation.ts";
import { useAppState } from "../../state/app";
import { useRosterBuildingState } from "../../state/roster-building";
import { Roster } from "../../types/roster.ts";
import { CreateRosterCardButton } from "./components/CreateRosterCardButton.tsx";
import { RosterGroupCard } from "./components/RosterGroupCard.tsx";
import {
  RosterSortButton,
  SortField,
  SortOrder,
} from "./components/RosterSortButton.tsx";
import {
  RosterSummaryCard,
  RosterSummaryCardProps,
} from "./components/RosterSummaryCard.tsx";
import { getComparator } from "./utils/sorting.ts";

export const Rosters: FunctionComponent = () => {
  const { rosters, updateRoster } = useRosterBuildingState();
  const { getAdjustedMetaData } = useRosterInformation();
  const [draggingRoster, setDraggingRoster] = useState<string>();
  const { setCurrentModal } = useAppState();
  const [filter, setFilter] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const rosterLinks: RosterSummaryCardProps[] = rosters
    .filter((roster) => !roster.group)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((roster) => {
      const metadata = getAdjustedMetaData(roster);
      return {
        roster: { ...roster, metadata },
      };
    });

  const rosterGroups = rosters
    .filter((roster) => !!roster.group)
    .sort((a, b) => a.group.localeCompare(b.group))
    .reduce(
      (groups, roster) => {
        groups[roster.group] = [...(groups[roster.group] || []), roster];
        return groups;
      },
      {} as Record<string, Roster[]>,
    );

  function onDragStart(start: DragStart) {
    setDraggingRoster(start.draggableId);
  }

  function onDragEnd(result: DropResult) {
    setDraggingRoster(null);

    if (!result.destination) return; // dropped outside a droppable container. Nothing to be done.

    if (result.source.droppableId === result.destination.droppableId) return; // dropped item on its self (same spot). Nothing needs to be done here.

    const [type, destinationId] = result.destination.droppableId.split(":");

    if (type === "group") {
      console.debug(
        `Add roster ${result.draggableId} to group ${destinationId}`,
      );
      updateRoster({
        ...rosters.find(({ id }) => id === result.draggableId),
        group: destinationId,
      });
      return;
    }

    console.debug(`Attempt create group...`);
    const rosterA = rosters.find(({ id }) => id === result.draggableId);
    const rosterB = rosters.find(({ id }) => id === destinationId);
    setCurrentModal(ModalTypes.CREATE_ROSTER_GROUP, {
      rosters: [rosterA, rosterB],
    });
  }

  const setSortParams = (field: SortField, order: SortOrder) => {
    const params = new URLSearchParams();
    params.set("sortBy", field);
    params.set("direction", order);
    setSearchParams(params, { preventScrollReset: true });
  };

  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      <Stack>
        <Typography variant="h4" className="middle-earth">
          My Rosters
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Note: You can create roster groups by simply dragging and dropping one
          roster onto another, or onto an existing group.
        </Typography>

        <Stack direction="row" gap={2} sx={{ py: 2, width: "90%" }}>
          <TextField
            id="database-filter-input"
            label="Filter"
            placeholder="Start typing to filter"
            value={filter}
            sx={{
              maxWidth: "80ch",
            }}
            fullWidth
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setFilter(event.target.value);
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear filters"
                      onClick={() => setFilter("")}
                      edge="end"
                      sx={{
                        display: filter.length > 0 ? "inherit" : "none",
                      }}
                    >
                      <CancelRounded />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <RosterSortButton
            setOrdering={setSortParams}
            order={searchParams.get("direction") as SortOrder}
            field={searchParams.get("sortBy") as SortField}
          />
        </Stack>

        {filter ? (
          <Stack direction="row" gap={4} sx={{ m: 1 }} flexWrap="wrap" flex={1}>
            {rosters
              .filter((roster) => {
                const f = filter.toLowerCase();
                return (
                  roster.name.toLowerCase().includes(f) ||
                  roster.armyList.toLowerCase().includes(f) ||
                  roster.group?.toLowerCase().includes(f)
                );
              })
              .map((roster) => ({ roster }))
              .sort(getComparator(searchParams))
              .map(({ roster }) => (
                <RosterSummaryCard key={roster.id} roster={roster} />
              ))}
          </Stack>
        ) : (
          <Stack
            direction="row"
            gap={2}
            sx={{ my: 0 }}
            flexWrap="wrap"
            flex={1}
          >
            <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
              {Object.entries(rosterGroups).map(
                ([groupName, rosters], index) => (
                  <Droppable key={index} droppableId={"group:" + groupName}>
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={
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
                              }
                        }
                      >
                        <RosterGroupCard name={groupName} rosters={rosters} />
                        <Box sx={{ "&>*": { height: "0px !important" } }}>
                          {provided.placeholder}
                        </Box>
                      </Box>
                    )}
                  </Droppable>
                ),
              )}

              {rosterLinks
                .sort(getComparator(searchParams))
                .map((card, index) => (
                  <Droppable
                    key={index}
                    droppableId={"roster:" + card.roster.id}
                  >
                    {(provided, snapshot) => {
                      return (
                        <Box
                          ref={provided.innerRef}
                          sx={
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
                                }
                          }
                        >
                          <Draggable draggableId={card.roster.id} index={index}>
                            {(draggableProvided, draggableSnapshot) => {
                              const { style, ...props } =
                                draggableProvided.draggableProps;
                              return (
                                <Box
                                  ref={draggableProvided.innerRef}
                                  {...draggableProvided.dragHandleProps}
                                  {...props}
                                  style={
                                    draggingRoster === card.roster.id
                                      ? style
                                      : {}
                                  }
                                >
                                  <Box
                                    sx={
                                      draggableSnapshot.isDragging
                                        ? {
                                            transform: "rotate(1.5deg)",
                                            boxShadow:
                                              "1rem 1rem 1rem #00000099",
                                            transition:
                                              "transform 0.3s ease, boxShadow 0.3s ease",
                                          }
                                        : {
                                            transition:
                                              "transform 0.3s ease, boxShadow 0.3s ease",
                                          }
                                    }
                                  >
                                    <RosterSummaryCard roster={card.roster} />
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
                ))}
            </DragDropContext>

            <Box sx={{ p: 1 }}>
              <CreateRosterCardButton />
            </Box>
          </Stack>
        )}
      </Stack>
    </Container>
  );
};
