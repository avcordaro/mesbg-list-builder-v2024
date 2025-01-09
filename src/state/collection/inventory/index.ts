import { Slice } from "../../Slice.ts";
import { CollectionState } from "../index.ts";

export type Collection = {
  options: string[] | string;
  mount: string;
  amount: string;
};
export type ModelInventory = {
  collection: Collection[];
};
/**
 * @example
 * // The inventory will look as followed
 * {
 *   "Elven Kingdoms": {
 *     "Elrond": {
 *       "collection": [
 *         {
 *           "options": [
 *             "Generic"
 *           ],
 *           "mount": "Horse",
 *           "amount": "2"
 *         }
 *       ]
 *     }
 *   }
 * }
 */
type Inventory = Record<string, Record<string, ModelInventory>>;

export type InventoryState = {
  inventory: Inventory;

  upsertInventory: (
    group: string,
    name: string,
    inventory: ModelInventory,
  ) => void;

  deleteEntry: (group: string, name: string) => void;
};

const initialState = {
  inventory: {},
};

export const inventorySlice: Slice<CollectionState, InventoryState> = (
  set,
) => ({
  ...initialState,

  upsertInventory: (group, name, modelInventoryUpdate) =>
    set(
      ({ inventory }) => ({
        inventory: {
          ...inventory,
          [group]: {
            ...inventory[group],
            [name]: modelInventoryUpdate,
          },
        },
      }),
      undefined,
      "UPSERT_INVENTORY",
    ),

  deleteEntry: (group, name) =>
    set(
      ({ inventory }) => {
        const mutatedInventory = { ...inventory };

        delete mutatedInventory[group][name];
        // Check if group is empty and delete it if it is
        if (Object.keys(mutatedInventory[group]).length === 0) {
          delete mutatedInventory[group];
        }

        return { inventory: mutatedInventory };
      },
      undefined,
      "DELETE_ENTRY",
    ),
});
