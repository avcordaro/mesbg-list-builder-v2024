import { Container, Typography, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { useAuth } from "../../firebase/FirebaseAuthContext.tsx";
import { EntityType } from "../../hooks/cloud-sync/useSyncQueue.ts";
import { RedirectTo } from "../../routing/RedirectTo.tsx";
import { useCollectionState } from "../../state/collection";
import { ModelInventory } from "../../state/collection/inventory";
import { useGameModeState } from "../../state/gamemode";
import { Game } from "../../state/gamemode/gamestate";
import { useRecentGamesState } from "../../state/recent-games";
import { PastGame } from "../../state/recent-games/history";
import { useRosterBuildingState } from "../../state/roster-building";
import { RosterGroup } from "../../state/roster-building/groups";
import { Roster } from "../../types/roster.ts";
import { SyncProgress } from "./initial/SyncProgress.tsx";
import { SyncableSelectionTable } from "./initial/SyncableSelectionTable.tsx";
import { SyncItem } from "./initial/sync-item.ts";

const toDate = (time: number) =>
  new Date(time)
    .toLocaleDateString("en-UK", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })
    .replace(/ /g, "-");

const buildListOfUnsyncedItems = (
  rosters: Roster[],
  groups: RosterGroup[],
  games: Record<string, Game>,
  inventory: { [x: string]: Record<string, ModelInventory> },
  gameHistory: PastGame[],
): SyncItem[] => [
  ...rosters.map((r) => ({
    id: `${r.name} (${r.armyList})`,
    type: "rosters" as EntityType,
    sync: true,
    data: r,
  })),
  ...groups.map((g) => ({
    id: g.name,
    type: "groups" as EntityType,
    sync: true,
    data: g,
  })),
  ...Object.entries(games).map(([rosterId, gm]) => {
    const gameRoster = rosters.find((roster) => roster.id === rosterId);
    return {
      id: `Game for ${gameRoster.name} started on ${toDate(gm.started)}`,
      type: "games" as EntityType,
      sync: true,
      data: { id: rosterId, game: gm },
    };
  }),
  ...gameHistory.map((gh) => ({
    id: `The game on ${gh.gameDate} against ${gh.opponentName}`,
    type: "gameHistory" as EntityType,
    sync: true,
    data: gh,
  })),
  ...Object.entries(inventory).flatMap(([origin, models]) =>
    Object.entries(models)
      .map(([model, collection]) => ({
        origin,
        model,
        collection,
      }))
      .map((c) => ({
        id: c.model + " (" + c.origin + ")",
        type: "collections" as EntityType,
        sync: true,
        data: c,
      })),
  ),
];

export const InitialSyncRequest = () => {
  const { user } = useAuth();
  const { rosters, groups } = useRosterBuildingState();
  const { gameState } = useGameModeState();
  const { recentGames } = useRecentGamesState();
  const { inventory } = useCollectionState();

  const [syncing, setSyncing] = useState(false);
  const [unsyncedItems, setUnsyncedItems] = useState(
    buildListOfUnsyncedItems(
      rosters,
      groups,
      gameState,
      inventory,
      recentGames,
    ),
  );

  const itemsToSync = useMemo(
    () => unsyncedItems.filter((item) => item.sync),
    [unsyncedItems],
  );

  const toggleCheckbox = (row: SyncItem, index: number) => {
    const updated = [...unsyncedItems];
    updated[index] = { ...row, sync: !row.sync };
    setUnsyncedItems(updated);
  };

  const toggleAllCheckboxes = () => {
    const allSelected = unsyncedItems.every((item) => item.sync);
    setUnsyncedItems(
      unsyncedItems.map((item) => ({ ...item, sync: !allSelected })),
    );
  };

  const startSyncing = () => setSyncing(true);

  return unsyncedItems.length === 0 ? (
    <RedirectTo path="/rosters" />
  ) : (
    <Container maxWidth="md" sx={{ mt: 2, mb: 5 }}>
      <Stack gap={1}>
        <Typography variant="h5" component="div">
          Welcome {user.displayName}!
        </Typography>
        {syncing ? (
          <SyncProgress items={itemsToSync} />
        ) : (
          <SyncableSelectionTable
            unsyncedItems={unsyncedItems}
            toggleAllCheckboxes={toggleAllCheckboxes}
            toggleCheckbox={toggleCheckbox}
            startSyncing={startSyncing}
          />
        )}
      </Stack>
    </Container>
  );
};
