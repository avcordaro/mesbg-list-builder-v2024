import { useRosterBuildingState } from "../../../state/roster-building";

export const useRosterGroupStats = (slug: string) => {
  const groups = useRosterBuildingState(({ groups }) => groups);

  const groupBySlug = Object.fromEntries(groups.map((g) => [g.slug, g]));

  const childrenMap = {};
  for (const g of groups) {
    if (g.parent) {
      if (!childrenMap[g.parent]) childrenMap[g.parent] = [];
      childrenMap[g.parent].push(g.slug);
    }
  }

  function recurse(currentSlug: string) {
    const group = groupBySlug[currentSlug];
    let rosterCount = group.rosters.length;
    let groupCount = 0;

    if (childrenMap[currentSlug]) {
      for (const childSlug of childrenMap[currentSlug]) {
        groupCount += 1; // count the child group
        const childResult = recurse(childSlug);
        rosterCount += childResult.rosterCount;
        groupCount += childResult.groupCount; // add child's group count
      }
    }

    return { rosterCount, groupCount };
  }

  return recurse(slug);
};
