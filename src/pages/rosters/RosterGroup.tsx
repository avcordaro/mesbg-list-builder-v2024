import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Breadcrumbs } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRosterInformation } from "../../hooks/useRosterInformation.ts";
import { useRosterBuildingState } from "../../state/roster-building";
import { CreateRosterCardButton } from "./components/CreateRosterCardButton.tsx";
import {
  RosterSummaryCard,
  RosterSummaryCardProps,
} from "./components/RosterSummaryCard.tsx";

export const RosterGroup: FunctionComponent = () => {
  const { rosters, updateRoster } = useRosterBuildingState();
  const { getAdjustedMetaData } = useRosterInformation();
  const { groupId } = useParams();
  const navigate = useNavigate();

  const rosterLinks: RosterSummaryCardProps[] = rosters
    .filter((roster) => roster.group === groupId)
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

  const removeFromGroup = "remove-from-group";

  function onDragEnd(result: DropResult) {
    if (
      result.destination &&
      result.destination.droppableId === removeFromGroup
    ) {
      updateRoster({
        ...rosters.find(({ id }) => id === result.draggableId),
        group: null,
      });

      if (rosterLinks.length === 1) {
        // just removed the last roster from the group;
        navigate("/rosters", { viewTransition: true });
      }
    }
  }

  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Stack>
          <Stack direction="row">
            <Stack flexGrow={1}>
              <Typography variant="h4" className="middle-earth">
                My Rosters
              </Typography>
              <Breadcrumbs>
                <Link
                  to="/rosters"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  Rosters
                </Link>
                <Typography sx={{ color: "text.secondary" }}>
                  {groupId}
                </Typography>
              </Breadcrumbs>
            </Stack>
          </Stack>

          <Stack
            direction="row"
            gap={2}
            sx={{ my: 2 }}
            flexWrap="wrap"
            flex={1}
          >
            <Droppable droppableId={removeFromGroup}>
              {(provided, snapshot) => (
                <Stack
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={[
                    {
                      p: 1,
                      border: 2,
                      width: "40ch",
                      borderStyle: "dashed",
                      borderColor: (theme) => theme.palette.text.disabled,
                    },
                    snapshot.isDraggingOver
                      ? {
                          backgroundColor: "#f6f6f6",
                        }
                      : {},
                  ]}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{ width: "24ch", textAlign: "center" }}
                  >
                    Drag and drop your roster here to remove it from the group.
                  </Typography>
                  <Box
                    sx={{
                      "&>*": {
                        width: "0px !important",
                        height: "0px !important",
                      },
                    }}
                  >
                    {provided.placeholder}
                  </Box>
                </Stack>
              )}
            </Droppable>
            {rosterLinks.map((roster, index) => (
              <Droppable droppableId={roster.id} key={index} isDropDisabled>
                {(provided) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps}>
                    <Draggable
                      draggableId={roster.id}
                      index={index}
                      key={index}
                    >
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                        >
                          <RosterSummaryCard key={index} {...roster} />
                        </Box>
                      )}
                    </Draggable>
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            ))}

            <CreateRosterCardButton />
          </Stack>
        </Stack>
      </DragDropContext>
    </Container>
  );
};
