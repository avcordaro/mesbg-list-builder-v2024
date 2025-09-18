import {
  EntityType,
  SyncItemData,
} from "../../../hooks/cloud-sync/useSyncQueue.ts";

export type SyncItem = {
  id: string;
  type: EntityType;
  sync: boolean;
  data: SyncItemData;
};
