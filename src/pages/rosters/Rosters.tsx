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
import { ChangeEvent, FunctionComponent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { NewRosterButton } from "../../components/atoms/new-roster-button/NewRosterButton.tsx";
import {
  CARD_SIZE_IN_PX,
  RosterSummaryCard,
  RosterSummaryCardProps,
} from "../../components/common/roster-card/RosterSummaryCard.tsx";
import { RosterGroupCard } from "../../components/common/roster-group-card/RosterGroupCard.tsx";
import { ModalTypes } from "../../components/modal/modals.tsx";
import { useRosterInformation } from "../../hooks/calculations-and-displays/useRosterInformation.ts";
import { useScreenSize } from "../../hooks/calculations-and-displays/useScreenSize.ts";
import { useApi } from "../../hooks/cloud-sync/useApi.ts";
import { useAppState } from "../../state/app";
import { useRosterBuildingState } from "../../state/roster-building";
import { RostersPageHeader } from "./components/RostersPageHeader.tsx";
import {
  RosterSortButton,
  SortField,
  SortOrder,
} from "./sorting/RosterSortButton.tsx";
import { getComparator } from "./sorting/sorting.ts";

export const Rosters: FunctionComponent = () => {
  const { rosters, groups, updateGroup } = useRosterBuildingState();
  const { getAdjustedMetaData } = useRosterInformation();
  const screen = useScreenSize();
  const [draggingRoster, setDraggingRoster] = useState<string>();
  const { setCurrentModal } = useAppState();
  const [filter, setFilter] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const api = useApi();

  const rosterLinks: RosterSummaryCardProps[] = rosters
    .filter((roster) => !roster.group)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((roster) => {
      const metadata = getAdjustedMetaData(roster);
      return {
        roster: { ...roster, metadata },
      };
    });

  const rosterGroups = groups.sort((a, b) => a.name.localeCompare(b.name));

  function onDragStart(start: DragStart) {
    setDraggingRoster(start.draggableId);
  }

  function addRosterToGroup(groupId: string, rosterId: string) {
    console.debug(`Add roster ${rosterId} to group ${groupId}`);
    updateGroup(groupId, {
      rosters: [
        ...groups.find((group) => group.id === groupId).rosters,
        rosterId,
      ],
    });
    const groupSlug = groups.find((group) => group.id === groupId)?.slug;
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

  const setSortParams = (field: SortField, order: SortOrder) => {
    const params = new URLSearchParams();
    params.set("sortBy", field);
    params.set("direction", order);
    setSearchParams(params, { preventScrollReset: true });
  };

  return (
    <Container maxWidth={false} sx={{ my: 2 }}>
      <Stack>
        <RostersPageHeader />
        <Stack direction="row" gap={2} sx={{ py: 2 }}>
          <TextField
            id="database-filter-input"
            label="Filter"
            placeholder="Start typing to filter"
            value={filter}
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
              {rosterGroups.map((group) => (
                <Droppable key={group.id} droppableId={"group:" + group.id}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={[
                        {
                          width: screen.isTooSmall
                            ? "100%"
                            : `${CARD_SIZE_IN_PX}px`,
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
              ))}

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
                          sx={[
                            {
                              width: screen.isTooSmall
                                ? "100%"
                                : `${CARD_SIZE_IN_PX}px`,
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
                                            boxShadow:
                                              "1rem 1rem 1rem #00000099",
                                            transition:
                                              "transform 0.3s ease, boxShadow 0.3s ease",
                                          }
                                        : {
                                            transition:
                                              "transform 0.3s ease, boxShadow 0.3s ease",
                                          },
                                    ]}
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
              <NewRosterButton />
            </Box>
          </Stack>
        )}
      </Stack>
    </Container>
  );
};
