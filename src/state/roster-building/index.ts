import deepEqual from "fast-deep-equal";
import { temporal, TemporalState } from "zundo";
import { create, StoreApi, useStore } from "zustand";

import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { builderSlice, BuilderState } from "./builder-selection";
import { groupSlice, RosterGroupState } from "./groups";
import { migrations } from "./migrations.ts";
import { rosterSlice, RosterState } from "./roster";

export type RosterBuildingState = RosterState & BuilderState & RosterGroupState;

export const useRosterBuildingState = create<
  RosterBuildingState,
  [
    ["zustand/devtools", unknown],
    ["zustand/persist", unknown],
    ["temporal", StoreApi<TemporalState<Partial<RosterBuildingState>>>],
  ]
>(
  devtools(
    persist(
      temporal(
        (...args) => ({
          ...builderSlice(...args),
          ...rosterSlice(...args),
          ...groupSlice(...args),
        }),
        {
          partialize: (state) => ({
            rosters: state.rosters,
          }),
          equality: (pastState, currentState) =>
            deepEqual(pastState, currentState),
          limit: 20,
        },
      ),
      {
        name: "mlb-rosters",
        storage: createJSONStorage(() => localStorage),
        version: 1,
        partialize: (state) => ({
          rosters: state.rosters,
          groups: state.groups,
        }),
        migrate: (state, version) => migrations(state, version),
      },
    ),
  ),
);

export const useTemporalRosterBuildingState = <T>(
  selector: (state: TemporalState<RosterBuildingState>) => T,
) => useStore(useRosterBuildingState.temporal, selector);
