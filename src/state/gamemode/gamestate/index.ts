import { Roster } from "../../../types/roster.ts";
import { Slice } from "../../Slice.ts";
import { GameModeState } from "../index.ts";
import { createGameState } from "./create-game-state.ts";

export type Trackable = {
  name: string;
  profile_origin: string;
  MWFW: string;
  xMWFW: string;
  leader: boolean;
};

export type Game = {
  trackables: Trackable[];
  casualties: number;
  heroCasualties: number;
  started: number;
  lastUpdated: number;
};

export type GameState = {
  startNewGame: (roster: Roster) => void;
  gameState?: Record<string, Game>;
  updateGameState: (id: string, update: Partial<Game>) => void;
};

const initialState = {
  gameState: {},
};

export const gameStateSlice: Slice<GameModeState, GameState> = (set) => ({
  ...initialState,

  startNewGame: (roster: Roster) =>
    set(
      ({ gameState }) => ({
        gameState: {
          ...gameState,
          [roster.id]: {
            ...createGameState(roster),
            started: Date.now(),
            lastUpdated: Date.now(),
          },
        },
      }),
      undefined,
      "START_GAME",
    ),
  updateGameState: (id, update) =>
    set(
      ({ gameState }) => ({
        gameState: {
          ...gameState,
          [id]: {
            ...gameState[id],
            ...update,
            lastUpdated: Date.now(),
          },
        },
      }),
      undefined,
      "UPDATE_GAME_STATE",
    ),
});
