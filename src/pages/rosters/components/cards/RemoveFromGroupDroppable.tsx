import { Droppable } from "@hello-pangea/dnd";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { CARD_SIZE_IN_PX } from "../../../../components/common/roster-card/RosterSummaryCard.tsx";
import { useScreenSize } from "../../../../hooks/calculations-and-displays/useScreenSize.ts";
import { REMOVE_FOM_GROUP } from "../../useRostersDragAndDrop.ts";

type RemoveFromGroupDroppableProps = {
  visible: boolean;
};

export const RemoveFromGroupDroppable: FunctionComponent<
  RemoveFromGroupDroppableProps
> = ({ visible }) => {
  const screen = useScreenSize();

  if (!visible) return null;

  return (
    <Droppable droppableId={REMOVE_FOM_GROUP}>
      {(provided, snapshot) => (
        <Stack
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={[
            {
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
            Drag your <br />
            Roster or Group
            <br />
            here to remove it
            <br /> from this group.
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
  );
};
