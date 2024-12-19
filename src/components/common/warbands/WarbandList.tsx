import { DragDropContext } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
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
        {warbands.map((warband, index) => (
          <Warband
            key={warband.id}
            warband={warband}
            ref={refs.current[index]}
            collapseAll={collapseAll}
          />
        ))}
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
