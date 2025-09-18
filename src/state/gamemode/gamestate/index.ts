import { Roster } from "../../../types/roster.ts";
import { Slice } from "../../Slice.ts";
import { GameModeState } from "../index.ts";
import { createGameState } from "./create-game-state.ts";

export type Trackable = {
  name: string;
  custom_name?: string;
  profile_origin: string;
  MWFW: string;
  xMWFW: string;
  leader: boolean;
};

export type CustomTracker = {
  id: string;
  name: string;
  value: number;
  maxValue?: number;
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
  startNewGame: (roster: Roster) => Game;
  gameState?: Record<string, Game>;
  updateGameState: (id: string, update: Partial<Game>) => void;
  endGame: (id: string) => void;

  reset: (state?: Record<string, Game>) => void;
};

const initialState = {
  gameState: {},
};

export const gameStateSlice: Slice<GameModeState, GameState> = (set) => ({
  ...initialState,

  startNewGame: (roster: Roster) => {
    const newGame = {
      ...createGameState(roster),
      started: Date.now(),
      lastUpdated: Date.now(),
      rosterMetadata: roster.metadata,
    };
    set(
      ({ gameState }) => ({
        gameState: {
          ...gameState,
          [roster.id]: newGame,
        },
      }),
      undefined,
      "START_GAME",
    );
    return newGame;
  },
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

  reset: (gameState: Record<string, Game> = {}) => {
    set({ gameState }, undefined, "CLEAR_STATE");
  },
});
