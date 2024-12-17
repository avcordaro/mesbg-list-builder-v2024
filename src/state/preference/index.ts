import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { PreferenceState, userPreferences } from "./user-preferences";

export type UserPrefState = PreferenceState;

export const useUserPreferences = create<
  UserPrefState,
  [["zustand/devtools", unknown], ["zustand/persist", unknown]]
>(
  devtools(
    persist(
      (...args) => ({
        ...userPreferences(...args),
      }),
      {
        name: "mlb-preferences",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
