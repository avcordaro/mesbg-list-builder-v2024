import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { gameStateSlice, GameState } from "./gamestate";
import { victoryPointsSlice, VictoryPointsState } from "./victory-points";

export type GameModeState = GameState & VictoryPointsState;

export const useGameModeState = create<
  GameModeState,
  [["zustand/devtools", unknown], ["zustand/persist", unknown]]
>(
  devtools(
    persist(
      (...args) => ({
        ...gameStateSlice(...args),
        ...victoryPointsSlice(...args),
      }),
      {
        name: "mlb-gamestate",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
