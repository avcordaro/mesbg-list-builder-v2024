import { FunctionComponent } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Roster } from "../../../../types/roster";
import { getComparator } from "../../sorting/sorting.ts";
import { useRosterSearch } from "../useRosterSearch.ts";
import { RosterDroppable } from "./RosterDroppable.tsx";

type RosterCardListProps = {
  rosters: Roster[];
  dragged?: string;
  filter?: string;
};

const getRosterInGroup = (rosters: Roster[], groupId: string) => {
  return !groupId
    ? rosters.filter((group) => !group.group)
    : rosters.filter((group) => group.group === groupId);
};

export const RosterCardList: FunctionComponent<RosterCardListProps> = ({
  rosters,
  dragged,
  filter,
}) => {
  const { groupId } = useParams();
  const [searchParams] = useSearchParams();
  const { filterRosters } = useRosterSearch();

  const visibleRosters = filter
    ? filterRosters(rosters, filter)
    : getRosterInGroup(rosters, groupId);

  return visibleRosters
    .sort(getComparator(searchParams))
    .map((roster, index) => (
      <RosterDroppable
        key={roster.id}
        roster={roster}
        index={index}
        isDragged={dragged}
        isDisabled={!!filter}
      />
    ));
};
