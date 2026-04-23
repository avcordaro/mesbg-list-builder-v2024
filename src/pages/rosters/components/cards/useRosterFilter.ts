import { useParams } from "react-router-dom";
import { Roster } from "../../../../types/roster.ts";
import { useRosterSearch } from "../useRosterSearch.ts";

const IGNORE_GROUPS = "~ignore-groups";

export const useRosterFilter = (rosters: Roster[], filter: string) => {
  const { groupId } = useParams();
  const { filterRosters } = useRosterSearch();

  const rostersInGroup = getRosterInGroup(rosters, groupId);

  if (!filter) {
    return rostersInGroup;
  }

  if (filter === IGNORE_GROUPS) {
    return rosters;
  }

  if (filter.startsWith(IGNORE_GROUPS)) {
    const updatedFilterString = filter.replace(IGNORE_GROUPS, "").replace("&", "").trim();
    return filterRosters(rosters, updatedFilterString);
  }

  return filterRosters(rostersInGroup, filter);
};

function getRosterInGroup(rosters: Roster[], groupId: string) {
  return !groupId ? rosters.filter((group) => !group.group) : rosters.filter((group) => group.group === groupId);
}
