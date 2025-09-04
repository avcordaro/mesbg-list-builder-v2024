import { v4 } from "uuid";
import { Slice } from "../../Slice.ts";
import { RosterBuildingState } from "../index.ts";

export type RosterGroup = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  rosters: string[];
};

type RosterGroupStateActions = {
  createGroup: (group: Omit<RosterGroup, "id">) => string;
  updateGroup: (id: string, update: Partial<Omit<RosterGroup, "id">>) => void;
  disbandGroup: (id: RosterGroup["id"]) => void;
  deleteGroup: (id: RosterGroup["id"]) => void;
};

export type RosterGroupState = {
  groups: RosterGroup[];
} & RosterGroupStateActions;

export const initialBuilderState = {
  groups: [],
};

export const groupSlice: Slice<RosterBuildingState, RosterGroupState> = (
  set,
  get,
) => ({
  ...initialBuilderState,

  createGroup: (group) => {
    const id = v4();
    set(
      ({ groups }) => ({
        groups: [...groups, { ...group, id }],
        rosters: get().rosters.map((roster) =>
          group.rosters.includes(roster.id) ? { ...roster, group: id } : roster,
        ),
      }),
      undefined,
      "CREATE_ROSTER_GROUP",
    );
    return id;
  },

  updateGroup: (id, update) =>
    set(
      ({ groups }) => ({
        groups: groups.map((group) =>
          group.id === id ? { ...group, ...update } : group,
        ),
        rosters: get().rosters.map((roster) =>
          update.rosters?.includes(roster.id)
            ? { ...roster, group: id }
            : roster,
        ),
      }),
      undefined,
      "UPDATE_ROSTER_GROUP",
    ),

  disbandGroup: (id) =>
    set(
      ({ groups }) => {
        const group = groups.find((group) => group.id === id);
        return {
          groups: groups.filter((group) => group.id !== id),
          rosters: get().rosters.map((roster) =>
            group.rosters.includes(roster.id)
              ? { ...roster, group: null }
              : roster,
          ),
        };
      },
      undefined,
      "DISBAND_ROSTER_GROUP",
    ),

  deleteGroup: (id) =>
    set(
      ({ groups }) => {
        const group = groups.find((group) => group.id === id);
        return {
          groups: groups.filter((group) => group.id !== id),
          rosters: get().rosters.filter(
            (roster) => !group.rosters.includes(roster.id),
          ),
        };
      },
      undefined,
      "DELETE_ROSTER_GROUP",
    ),
});
