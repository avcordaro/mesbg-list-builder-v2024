import { v4 } from "uuid";
import { slugify, withSuffix } from "../../utils/string.ts";
import { BuilderState } from "./builder-selection";
import { RosterGroupState } from "./groups";
import { RosterBuildingState } from "./index.ts";
import { RosterState } from "./roster";

export const migrations = (
  oldState: unknown,
  version: number,
): RosterBuildingState => {
  console.debug(`Migrating persisted state from version ${version}`, {
    oldState,
  });

  let migratedState = oldState;
  if (version <= 0) {
    console.debug("Migrating to v1");
    migratedState = v1Migration(oldState as RosterState & BuilderState);
    console.log("Migration v1;", { migratedState });
  }

  console.log("Migration completed", { newState: migratedState });
  return migratedState as RosterBuildingState;
};

/**
 * Migration #1 alters the way how groups work. Groups in v0 were a string as part of a roster.
 * This was restrictive in a way that extension was impossible. Moving group data into an array of
 * objects with all the data of said group (including a list of rosters part of that group) allows
 * adding things like an Icon or a Slug.
 *
 * After this migration the roster.group field is filled with the ID of the group & a list of groups
 * with id, name, slug and list of rosters is added.
 */
const v1Migration = (
  state: RosterState & BuilderState,
): RosterState & BuilderState & RosterGroupState => {
  const grouped: Record<string, string[]> = state.rosters.reduce(
    (acc, item) => {
      if (!item.group) return acc;
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item.id);
      return acc;
    },
    {},
  );

  const groups: RosterGroupState["groups"] = Object.entries(grouped).map(
    ([name, rosters]) => ({
      id: v4(),
      name: name,
      slug: withSuffix(slugify(name)),
      rosters: rosters,
    }),
  );

  const rosters = state.rosters.map((roster) =>
    roster.group
      ? {
          ...roster,
          group: groups.find((group) => group.name === roster.group)?.id,
        }
      : roster,
  );

  return { rosters, groups } as RosterState & BuilderState & RosterGroupState;
};
