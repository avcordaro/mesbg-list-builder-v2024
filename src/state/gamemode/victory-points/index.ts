import { Slice } from "../../Slice.ts";
import { GameModeState } from "../index.ts";

export type VictoryPointsState = {
  victoryPoints: number[][];
  setVictoryPoints: (vps: number[][]) => void;

  calculatedVictoryPoints: number[];
  setCalculatedVictoryPoints: (vps: [number, number]) => void;

  additionalVictoryPoints: number[];
  setAdditionalVictoryPoints: (vps: [number, number]) => void;
};

const initialState = {
  victoryPoints: [],
  calculatedVictoryPoints: [0, 0],
  additionalVictoryPoints: [0, 0],
};

export const victoryPointsSlice: Slice<GameModeState, VictoryPointsState> = (
  set,
) => ({
  ...initialState,

  setVictoryPoints: (vps: number[][]) =>
    set({ victoryPoints: vps }, undefined, "SET_VICTORY_POINTS"),

  setCalculatedVictoryPoints: (vps: [number, number]) =>
    set({ calculatedVictoryPoints: vps }, undefined, "SET_CALCULATED_VP"),
  setAdditionalVictoryPoints: (vps: [number, number]) =>
    set({ additionalVictoryPoints: vps }, undefined, "SET_ADDITIONAL_VP"),
});
