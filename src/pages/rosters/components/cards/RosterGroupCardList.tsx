import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { RosterGroup } from "../../../../state/roster-building/groups";
import { RosterGroupDroppable } from "./RosterGroupDroppable.tsx";

type RosterGroupCardListProps = {
  groups: RosterGroup[];
};

const getVisibleGroups = (groups: RosterGroup[], groupId?: string) => {
  return !groupId
    ? groups.filter((group) => !group.parent)
    : groups.filter((group) => group.parent === groupId);
};

export const RosterGroupCardList: FunctionComponent<
  RosterGroupCardListProps
> = ({ groups }) => {
  const { groupId } = useParams();
  const visibleGroups = getVisibleGroups(groups, groupId);

  return visibleGroups.map((group) => (
    <RosterGroupDroppable group={group} key={group.id} />
  ));
};
