import { Slice } from "../../Slice.ts";
import { RosterBuildingState } from "../index.ts";

type BuilderSelectionState = {
  armyList: string;
  selectionType: "hero" | "unit" | "siege";
  selectionFocus: [string, string];
};

type BuilderSelectionActions = {
  updateBuilderSidebar: (update: BuilderSelectionState) => void;
};

export type BuilderState = BuilderSelectionState & BuilderSelectionActions;

export const initialBuilderState: BuilderSelectionState = {
  armyList: null,
  selectionType: "hero",
  selectionFocus: ["", ""],
};

export const builderSlice: Slice<RosterBuildingState, BuilderState> = (
  set,
) => ({
  ...initialBuilderState,

  updateBuilderSidebar: (update) =>
    set({ ...update }, undefined, "UPDATE_BUILDER_SELECTION_STATE"),
});
