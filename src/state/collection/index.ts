import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { inventorySlice, InventoryState } from "./inventory";

export type CollectionState = InventoryState;

export const useCollectionState = create<
  CollectionState,
  [["zustand/devtools", unknown], ["zustand/persist", unknown]]
>(
  devtools(
    persist(
      (...args) => ({
        ...inventorySlice(...args),
      }),
      {
        name: "mlb-collection",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
