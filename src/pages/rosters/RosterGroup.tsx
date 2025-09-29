// import {
//   DragDropContext,
//   Draggable,
//   Droppable,
//   DropResult,
// } from "@hello-pangea/dnd";
// import Box from "@mui/material/Box";
// import Container from "@mui/material/Container";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
// import { FunctionComponent, useState } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { NewRosterButton } from "../../components/atoms/new-roster-button/NewRosterButton.tsx";
// import {
//   CARD_SIZE_IN_PX,
//   RosterSummaryCard,
//   RosterSummaryCardProps,
// } from "../../components/common/roster-card/RosterSummaryCard.tsx";
// import { useRosterInformation } from "../../hooks/calculations-and-displays/useRosterInformation.ts";
// import { useScreenSize } from "../../hooks/calculations-and-displays/useScreenSize.ts";
// import { useApi } from "../../hooks/cloud-sync/useApi.ts";
// import { useRosterBuildingState } from "../../state/roster-building";
// import { GroupNotFound } from "../not-found/GroupNotFound.tsx";
// import { RostersPageHeader } from "./components/RostersPageHeader.tsx";
// import { RostersSearchFilter } from "./components/RostersSearchFilter.tsx";
// import { getComparator } from "./sorting/sorting.ts";
// import { REMOVE_FOM_GROUP } from "./useRostersDragAndDrop.ts";
//
// export const RosterGroup: FunctionComponent = () => {
//   const { rosters, groups, updateRoster, updateGroup } =
//     useRosterBuildingState();
//   const { getAdjustedMetaData } = useRosterInformation();
//   const screen = useScreenSize();
//   const navigate = useNavigate();
//   const [filter, setFilter] = useState("");
//
//   const [searchParams] = useSearchParams();
//
//   const { groupId: slug } = useParams();
//   const group = groups.find((group) => group.slug === slug);
//   const api = useApi();
//
//   if (!group) {
//     return <GroupNotFound />;
//   }
//
//   const rosterLinks: RosterSummaryCardProps[] = rosters
//     .filter(
//       (roster) =>
//         group.rosters.includes(roster.id) &&
//         (roster.name.toLowerCase().includes(filter.toLowerCase()) ||
//           roster.armyList.toLowerCase().includes(filter.toLowerCase())),
//     )
//     .sort(getComparator(searchParams));
//
//   function onDragEnd(result: DropResult) {
//     if (
//       result.destination &&
//       result.destination.droppableId === REMOVE_FOM_GROUP
//     ) {
//       updateRoster({
//         ...rosters.find(({ id }) => id === result.draggableId),
//         group: null,
//       });
//       updateGroup(group.id, {
//         rosters: group.rosters.filter(
//           (roster) => roster !== result.draggableId,
//         ),
//       });
//       api.removeRosterFromGroup(group.slug, result.draggableId);
//
//       if (rosterLinks.length === 1) {
//         // just removed the last roster from the group;
//         navigate("/rosters", { viewTransition: true });
//       }
//     }
//   }
//
//   return (
//     <Container maxWidth={false} sx={{ my: 2 }}>
//       <DragDropContext onDragEnd={onDragEnd}>
//         <Stack sx={{ pb: 10 }}>
//           <RostersPageHeader group={group} />
//           <RostersSearchFilter filter={filter} setFilter={setFilter} />
//           <Stack
//             direction="row"
//             gap={2}
//             sx={{ my: 2 }}
//             flexWrap="wrap"
//             flex={1}
//           >
//
//             {rosterLinks.map((card, index) => (
//               <Droppable
//                 droppableId={card.roster.id}
//                 key={card.roster.id}
//                 isDropDisabled
//               >
//                 {(provided) => (
//                   <Box
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     sx={{
//                       width: screen.isTooSmall
//                         ? "100%"
//                         : `${CARD_SIZE_IN_PX}px`,
//                       aspectRatio: "1/1",
//                     }}
//                   >
//                     <Draggable
//                       draggableId={card.roster.id}
//                       key={card.roster.id}
//                       index={index}
//                     >
//                       {(provided) => (
//                         <Box
//                           ref={provided.innerRef}
//                           {...provided.dragHandleProps}
//                           {...provided.draggableProps}
//                         >
//                           <RosterSummaryCard key={index} roster={card.roster} />
//                         </Box>
//                       )}
//                     </Draggable>
//                     {provided.placeholder}
//                   </Box>
//                 )}
//               </Droppable>
//             ))}
//
//             <NewRosterButton />
//           </Stack>
//         </Stack>
//       </DragDropContext>
//     </Container>
//   );
// };
