import { RosterGroup } from "../state/roster-building/groups";
import { Roster } from "../types/roster.ts";

function getGroup(parentId: string, groups: RosterGroup[]): RosterGroup {
  return groups.find((group: RosterGroup) => group.slug === parentId);
}

const getParentGroups = (
  group: RosterGroup,
  others: RosterGroup[],
): RosterGroup[] => {
  if (!group?.parent) {
    return [];
  }
  const parent = getGroup(group.parent, others);
  return [...getParentGroups(parent, others), parent];
};

export function selectRosterGroup(roster: Roster) {
  return (state): RosterGroup =>
    roster.group &&
    state.groups.find(
      ({ id, slug }) => roster.group === id || roster.group === slug,
    );
}

export function selectParentGroups(group: RosterGroup) {
  return ({ groups }) => getParentGroups(group, groups);
}
