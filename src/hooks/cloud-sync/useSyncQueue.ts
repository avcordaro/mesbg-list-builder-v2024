import { useCallback, useState } from "react";
import { ModelInventory } from "../../state/collection/inventory";
import { Game } from "../../state/gamemode/gamestate";
import { PastGame } from "../../state/recent-games/history";
import { RosterGroup } from "../../state/roster-building/groups";
import { Roster } from "../../types/roster.ts";
import { slugify, withSuffix } from "../../utils/string.ts";
import { useApi } from "./useApi.ts";

export type EntityType =
  | "rosters"
  | "groups"
  | "games"
  | "gameHistory"
  | "collections";

export type Status = "pending" | "in-progress" | "done" | "failed";

export type SyncItemData =
  | Roster
  | RosterGroup
  | PastGame
  | { id: string; game: Game }
  | { origin: string; model: string; collection: ModelInventory };

export type SyncItem = {
  id: string;
  type: EntityType;
  data: SyncItemData;
  status: Status;
  error?: string;
};

export function useSyncQueue() {
  const [queue, setQueue] = useState<SyncItem[]>([]);
  const [completed, setCompleted] = useState(0);

  const api = useApi();
  const apiMap: Record<
    EntityType,
    (
      data: SyncItemData,
      mappedIds?: Record<string, string>,
    ) => Promise<void | string>
  > = {
    rosters: async (data: Roster) => {
      try {
        await api.createRoster(data, false);
      } catch (e) {
        if (e.statusCode === 409) {
          const newId = withSuffix(slugify(data.name));
          await api.createRoster({ ...data, id: newId });
          return newId;
        } else {
          throw e;
        }
      }
    },
    groups: async (data: RosterGroup, mappedIds) => {
      await api.createGroup({
        ...data,
        rosters: data.rosters.map((roster) => mappedIds[roster] ?? roster),
      });
    },
    games: async (data: { id: string; game: Game }) => {
      await api.createGamestate(data.id, data.game);
    },
    gameHistory: async (data: PastGame) => {
      await api.createGame(data);
    },
    collections: async (data: {
      origin: string;
      model: string;
      collection: ModelInventory;
    }) => {
      await api.upsertCollection(data.origin, data.model, data.collection);
    },
  };

  const total = queue.length;
  const progress = total > 0 ? completed / total : 0;

  const addItems = useCallback((items: Omit<SyncItem, "status">[]) => {
    setQueue((prev) => [
      ...prev,
      ...items.map((i) => ({ ...i, status: "pending" as const })),
    ]);
  }, []);

  const processQueue = useCallback(async () => {
    const idMap = {};
    for (const item of queue) {
      if (item.status === "pending") {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id ? { ...q, status: "in-progress" } : q,
          ),
        );
        try {
          const id = await apiMap[item.type](item.data, idMap);
          if (id) idMap[(item.data as Roster).id] = id;
          setQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, status: "done" } : q)),
          );
          setCompleted((c) => c + 1);
        } catch (err) {
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id
                ? { ...q, status: "failed", error: (err as Error).message }
                : q,
            ),
          );
          setCompleted((c) => c + 1);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue]);

  const retryFailed = useCallback(async () => {
    setQueue((prev) =>
      prev.map((q) =>
        q.status === "failed"
          ? { ...q, status: "pending", error: undefined }
          : q,
      ),
    );
    setCompleted((c) => c - prevFailedCount(queue)); // adjust completed count
  }, [queue]);

  return {
    queue,
    failedItems: queue.filter((item) => item.status === "failed"),
    progress,
    total,
    completed,
    addItems,
    processQueue,
    retryFailed,
  };
}

// helper
function prevFailedCount(queue: SyncItem[]) {
  return queue.filter((q) => q.status === "failed").length;
}
