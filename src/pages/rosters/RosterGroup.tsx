import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { CancelRounded } from "@mui/icons-material";
import { Breadcrumbs, Button, InputAdornment, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { FaPatreon } from "react-icons/fa";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { NewRosterButton } from "../../components/common/create-roster/NewRosterButton.tsx";
import { Link } from "../../components/common/link/Link.tsx";
import {
  CARD_SIZE_IN_PX,
  RosterSummaryCard,
  RosterSummaryCardProps,
} from "../../components/common/roster-card/RosterSummaryCard.tsx";
import { GroupOptionsPopoverMenu } from "../../components/common/roster-group-card/RosterGroupPopoverMenu.tsx";
import { useRosterInformation } from "../../hooks/calculations-and-displays/useRosterInformation.ts";
import { useScreenSize } from "../../hooks/calculations-and-displays/useScreenSize.ts";
import { useApi } from "../../hooks/cloud-sync/useApi.ts";
import { useRosterBuildingState } from "../../state/roster-building";
import { useThemeContext } from "../../theme/ThemeContext.tsx";
import { PATREON_LINK } from "../home/Home.tsx";
import {
  RosterSortButton,
  SortField,
  SortOrder,
} from "./sorting/RosterSortButton.tsx";
import { getComparator } from "./sorting/sorting.ts";

export const RosterGroup: FunctionComponent = () => {
  const { rosters, groups, updateRoster, updateGroup } =
    useRosterBuildingState();
  const { getAdjustedMetaData } = useRosterInformation();
  const { groupId: slug } = useParams();
  const screen = useScreenSize();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const { palette } = useTheme();
  const { mode } = useThemeContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const group = groups.find((group) => group.slug === slug);
  const api = useApi();

  if (!group) {
    return (
      <Box sx={{ m: 2 }}>
        <Typography variant="h4" className="middle-earth">
          Roster group not found!
        </Typography>
        <Typography sx={{ mb: 2 }}>
          One does not simply navigate to a group that does not exist.
        </Typography>
        <Typography>
          Please navigate back to <Link to="/rosters">My Rosters</Link> and
          select the group from there.
        </Typography>
      </Box>
    );
  }

  const rosterLinks: RosterSummaryCardProps[] = rosters
    .filter(
      (roster) =>
        group.rosters.includes(roster.id) &&
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
      updateGroup(group.id, {
        rosters: group.rosters.filter(
          (roster) => roster !== result.draggableId,
        ),
      });
      api.removeRosterFromGroup(group.slug, result.draggableId);

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
    <Container maxWidth={false} sx={{ my: 2 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Stack sx={{ pb: 10 }}>
          <Stack flexGrow={1} gap={1}>
            <Stack
              direction={screen.isMobile ? "column-reverse" : "row"}
              gap={2}
              justifyContent="space-between"
            >
              <Typography variant="h4" className="middle-earth">
                My Rosters
              </Typography>
              <Button
                variant="outlined"
                size="large"
                startIcon={<FaPatreon />}
                sx={{
                  color: "#F96854",
                  borderColor: "#F96854",
                  p: 1,
                  px: 3,
                }}
                onClick={() => window.open(PATREON_LINK, "_blank")}
              >
                Support us on patreon
              </Button>
            </Stack>
            <Stack direction="row" alignItems="center" sx={{ mt: -2 }}>
              <Typography
                variant="h6"
                className="middle-earth"
                color="textSecondary"
              >
                {group.name}
              </Typography>
              <GroupOptionsPopoverMenu groupId={slug} redirect={true} />
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
                {group.name}
              </Typography>
            </Breadcrumbs>
          </Stack>

          <Stack direction="row" gap={2} sx={{ pt: 2, width: "100%" }}>
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
                      width: screen.isMobile ? "100%" : `${CARD_SIZE_IN_PX}px`,
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
                key={card.roster.id}
                isDropDisabled
              >
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      width: screen.isTooSmall
                        ? "100%"
                        : `${CARD_SIZE_IN_PX}px`,
                      aspectRatio: "1/1",
                    }}
                  >
                    <Draggable
                      draggableId={card.roster.id}
                      key={card.roster.id}
                      index={index}
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

            <NewRosterButton />
          </Stack>
        </Stack>
      </DragDropContext>
    </Container>
  );
};
