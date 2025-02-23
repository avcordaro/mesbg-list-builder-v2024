import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { CancelRounded } from "@mui/icons-material";
import { Breadcrumbs, InputAdornment, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Link } from "../../components/common/link/Link.tsx";
import { useRosterInformation } from "../../hooks/useRosterInformation.ts";
import { useRosterBuildingState } from "../../state/roster-building";
import { useThemeContext } from "../../theme/ThemeContext.tsx";
import { CreateRosterCardButton } from "./components/CreateRosterCardButton.tsx";
import { GroupOptionsPopoverMenu } from "./components/RosterGroupPopoverMenu.tsx";
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

export const RosterGroup: FunctionComponent = () => {
  const { rosters, updateRoster } = useRosterBuildingState();
  const { getAdjustedMetaData } = useRosterInformation();
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const { palette } = useTheme();
  const { mode } = useThemeContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const rosterLinks: RosterSummaryCardProps[] = rosters
    .filter(
      (roster) =>
        roster.group === groupId &&
        (roster.name.toLowerCase().includes(filter.toLowerCase()) ||
          roster.armyList.toLowerCase().includes(filter.toLowerCase())),
    )
    .map((roster) => {
      const metadata = getAdjustedMetaData(roster);
      return { roster: { ...roster, metadata } };
    })
    .sort(getComparator(searchParams));

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

  const setSortParams = (field: SortField, order: SortOrder) => {
    const params = new URLSearchParams();
    params.set("sortBy", field);
    params.set("direction", order);
    setSearchParams(params, { preventScrollReset: true });
  };

  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Stack>
          <Stack flexGrow={1} gap={1}>
            <Typography variant="h4" className="middle-earth">
              My Rosters
            </Typography>
            <Stack direction="row" alignItems="center" sx={{ mt: -2 }}>
              <Typography
                variant="h6"
                className="middle-earth"
                color="textSecondary"
              >
                {groupId}
              </Typography>
              <GroupOptionsPopoverMenu groupId={groupId} redirect={true} />
            </Stack>

            <Breadcrumbs>
              <Link
                to="/rosters"
                style={{
                  textDecoration: "none",
                  color:
                    mode === "dark" ? palette.info.light : palette.info.main,
                }}
              >
                Rosters
              </Link>
              <Typography sx={{ color: "text.secondary" }}>
                {groupId}
              </Typography>
            </Breadcrumbs>
          </Stack>

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
            {rosterLinks.map((card, index) => (
              <Droppable
                droppableId={card.roster.id}
                key={index}
                isDropDisabled
              >
                {(provided) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps}>
                    <Draggable
                      draggableId={card.roster.id}
                      index={index}
                      key={index}
                    >
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                        >
                          <RosterSummaryCard key={index} roster={card.roster} />
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
