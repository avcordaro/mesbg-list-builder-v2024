import { v4 as uuid } from "uuid";
import { Roster, Warband } from "../../../types/roster.ts";
import { Slice } from "../../Slice.ts";
import { RosterGroup } from "../groups";
import { RosterBuildingState } from "../index.ts";

type RosterFunctions = {
  createRoster: (roster: Roster) => void;
  updateRoster: (roster: Roster, originalRosterId?: string) => void;
  deleteRoster: (roster: Roster) => void;

  reset: (rosters?: Roster[], groups?: RosterGroup[]) => void;
};

export type RosterState = {
  rosters: Roster[];
} & RosterFunctions;

export const emptyWarband: Warband = {
  id: uuid(),
  hero: null,
  meta: {
    num: 1,
    points: 0,
    units: 0,
    heroes: 0,
    maxUnits: "-",
    bows: 0,
    bowLimit: 0,
    throwingWeapons: 0,
    throwLimit: 0,
  },
  units: [],
};

export const emptyRoster: Roster = {
  version: BUILD_VERSION,
  id: "",
  name: "",
  armyList: "",
  warbands: [emptyWarband],
  metadata: {
    leader: "",
    might: 0,
    will: 0,
    fate: 0,
    points: 0,
    units: 0,
    bows: 0,
    bowLimit: 0,
    throwingWeapons: 0,
    throwLimit: 0,
    heroes: 0,
    siegeRoster: false,
  },
};

const initialState = {
  rosters: [],
};

export const rosterSlice: Slice<RosterBuildingState, RosterState> = (
  set,
  get,
) => ({
  ...initialState,

  createRoster: (roster) => {
    set(
      (state) => ({
        rosters: [...state.rosters, roster],
        groups: get().groups.map((group) =>
          roster.group && roster.group === group.id
            ? { ...group, rosters: [...group.rosters, roster.id] }
            : group,
        ),
      }),
      undefined,
      "CREATE_ROSTER",
    );
  },

  updateRoster: (updatedRoster, originalRosterId = updatedRoster.id) => {
    set(
      (state) => ({
        rosters: state.rosters.map((roster) =>
          roster.id === originalRosterId ? updatedRoster : roster,
        ),
      }),
      undefined,
      "UPDATE_ROSTER",
    );
  },

  deleteRoster: (roster) => {
    set(
      (state) => ({
        rosters: state.rosters.filter(({ id }) => roster.id !== id),
        groups: get().groups.map((group) =>
          roster.group && roster.group === group.id
            ? {
                ...group,
                rosters: group.rosters.filter(
                  (rosterId) => rosterId !== roster.id,
                ),
              }
            : group,
        ),
      }),
      undefined,
      "DELETE_ROSTER",
    );
  },

  reset: (rosters: Roster[] = [], groups: RosterGroup[] = []) =>
    set({ rosters, groups }, undefined, "CLEAR_STATE"),
});
