import { FunctionComponent } from "react";
import { useSearchParams } from "react-router-dom";
import { Roster } from "../../../../types/roster";
import { getComparator } from "../../sorting/sorting.ts";
import { RosterDroppable } from "./RosterDroppable.tsx";
import { useRosterFilter } from "./useRosterFilter.ts";

type RosterCardListProps = {
  rosters: Roster[];
  dragged?: string;
  filter?: string;
  deleting: boolean;
  selectedRosters: string[];
  selectRoster: (value: string) => void;
};

export const RosterCardList: FunctionComponent<RosterCardListProps> = ({
  rosters,
  dragged,
  filter,
  deleting,
  selectRoster,
  selectedRosters,
}) => {
  const [searchParams] = useSearchParams();
  const visibleRosters = useRosterFilter(rosters, filter);

  return visibleRosters
    .sort(getComparator(searchParams))
    .map((roster, index) => (
      <RosterDroppable
        key={roster.id}
        roster={roster}
        index={index}
        isDragged={dragged}
        isDisabled={!!filter}
        isDeleting={deleting}
        isMarkedForDeletion={selectedRosters.includes(roster.id)}
        markForDeletion={() => selectRoster(roster.id)}
      />
    ));
};
