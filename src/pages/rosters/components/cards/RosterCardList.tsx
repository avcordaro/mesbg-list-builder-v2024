import { FunctionComponent } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Roster } from "../../../../types/roster";
import { getComparator } from "../../sorting/sorting.ts";
import { RosterDroppable } from "./RosterDroppable.tsx";

type RosterCardListProps = {
  rosters: Roster[];
  dragged?: string;
};

const getVisibleRosters = (rosters: Roster[], groupId: string) => {
  return !groupId
    ? rosters.filter((group) => !group.group)
    : rosters.filter((group) => group.group === groupId);
};

export const RosterCardList: FunctionComponent<RosterCardListProps> = ({
  rosters,
  dragged,
}) => {
  const [searchParams] = useSearchParams();

  const { groupId } = useParams();
  const visibleRosters = getVisibleRosters(rosters, groupId);

  return visibleRosters
    .sort(getComparator(searchParams))
    .map((roster, index) => (
      <RosterDroppable
        key={roster.id}
        roster={roster}
        index={index}
        isDragged={dragged}
      />
    ));
};
