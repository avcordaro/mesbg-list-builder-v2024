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

export type CustomTracker = {
  id: string;
  name: string;
  value: number;
};

export type Game = {
  trackables: Trackable[];
  customTrackers: CustomTracker[];
  casualties: number;
  heroCasualties: number;
  started: number;
  lastUpdated: number;
  rosterMetadata: Roster["metadata"];
};

export type GameState = {
  startNewGame: (roster: Roster) => void;
  gameState?: Record<string, Game>;
  updateGameState: (id: string, update: Partial<Game>) => void;
  endGame: (id: string) => void;
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
            rosterMetadata: roster.metadata,
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

  endGame: (id) =>
    set(
      ({ gameState }) => {
        const newState = { ...gameState };
        delete newState[id];
        return {
          gameState: newState,
        };
      },
      undefined,
      "UPDATE_GAME_STATE",
    ),
});
