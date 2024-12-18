import {
  DragDropContext,
  Draggable,
  DragStart,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { AlertTitle } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent, useState } from "react";
import { ModalTypes } from "../../components/modal/modals.tsx";
import { useRosterInformation } from "../../hooks/useRosterInformation.ts";
import { useAppState } from "../../state/app";
import { useRosterBuildingState } from "../../state/roster-building";
import { Roster } from "../../types/roster.ts";
import { CreateRosterCardButton } from "./components/CreateRosterCardButton.tsx";
import { RosterGroupCard } from "./components/RosterGroupCard.tsx";
import {
  RosterSummaryCard,
  RosterSummaryCardProps,
} from "./components/RosterSummaryCard.tsx";

export const Rosters: FunctionComponent = () => {
  const { rosters, updateRoster } = useRosterBuildingState();
  const { getAdjustedMetaData } = useRosterInformation();
  const [draggingRoster, setDraggingRoster] = useState<string>();
  const { setCurrentModal } = useAppState();

  const rosterLinks: RosterSummaryCardProps[] = rosters
    .filter((roster) => !roster.group)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((roster) => {
      const metadata = getAdjustedMetaData(roster);
      return {
        id: roster.id,
        name: roster.name,
        armyList: roster.armyList,
        points: metadata.points,
        units: metadata.units,
        warbands: roster.warbands.length,
        bows: metadata.bows,
        throwing_weapons: metadata.throwingWeapons,
        might: metadata.might,
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

        <Alert severity="warning" sx={{ maxWidth: "98ch", my: 2, ml: 0.5 }}>
          <AlertTitle>
            <Typography sx={{ maxWidth: "80ch" }}>
              <strong>
                You are currently looking at a &quot;Work in Progress&quot;
                build.
              </strong>
            </Typography>
          </AlertTitle>
          <Stack sx={{ maxWidth: "80ch" }} gap={2}>
            <Typography>
              The MESBG List Builder for the new &apos;24 edition of MESBG is
              still in a work in progress state. This means that there are still
              missing profiles and there can be errors.
            </Typography>
            <Typography>
              Feel free to help us test and report any errors you see or find to
              us via:{" "}
              <a href="mailto:support@mesbg-list-builder.com?subject=MESBG List Builder (v2024) - Bug/Correction">
                support@mesbg-list-builder.com
              </a>
            </Typography>
          </Stack>
        </Alert>

        <Stack direction="row" gap={2} sx={{ my: 0 }} flexWrap="wrap" flex={1}>
          <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            {Object.entries(rosterGroups).map(([groupName, rosters], index) => (
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
            ))}

            {rosterLinks.map((roster, index) => (
              <Droppable key={index} droppableId={"roster:" + roster.id}>
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
                      <Draggable draggableId={roster.id} index={index}>
                        {(draggableProvided, draggableSnapshot) => {
                          const { style, ...props } =
                            draggableProvided.draggableProps;
                          return (
                            <Box
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.dragHandleProps}
                              {...props}
                              style={draggingRoster === roster.id ? style : {}}
                            >
                              <Box
                                sx={
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
                                      }
                                }
                              >
                                <RosterSummaryCard {...roster} />
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
      </Stack>
    </Container>
  );
};
