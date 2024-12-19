import deepEqual from "fast-deep-equal";
import { temporal, TemporalState } from "zundo";
import { create, StoreApi, useStore } from "zustand";

import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { builderSlice, BuilderState } from "./builder-selection";
import { rosterSlice, RosterState } from "./roster";

export type RosterBuildingState = RosterState & BuilderState;

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
          ...rosterSlice(...args),
          ...builderSlice(...args),
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
        partialize: (state) => ({
          rosters: state.rosters,
        }),
      },
    ),
  ),
);

export const useTemporalRosterBuildingState = <T>(
  selector: (state: TemporalState<RosterBuildingState>) => T,
) => useStore(useRosterBuildingState.temporal, selector);
