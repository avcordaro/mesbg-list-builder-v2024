import { FunctionComponent } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { RosterGroup } from "../../../../state/roster-building/groups";
import { getGroupComparator } from "../../sorting/sorting.ts";
import { RosterGroupDroppable } from "./RosterGroupDroppable.tsx";

type RosterGroupCardListProps = {
  groups: RosterGroup[];
  dragged?: string;
  filter?: string;
};

const getVisibleGroups = (groups: RosterGroup[], groupId?: string) => {
  return !groupId ? groups.filter((group) => !group.parent) : groups.filter((group) => group.parent === groupId);
};

export const RosterGroupCardList: FunctionComponent<RosterGroupCardListProps> = ({ groups, dragged, filter }) => {
  const { groupId } = useParams();
  const [searchParams] = useSearchParams();

  const visibleGroups = getVisibleGroups(groups, groupId).filter(
    (group) => !filter || group.name.toLowerCase().includes(filter),
  );

  return visibleGroups
    .sort(getGroupComparator(searchParams))
    .map((group, index) => <RosterGroupDroppable group={group} key={group.id} index={index} isDragged={dragged} />);
};
