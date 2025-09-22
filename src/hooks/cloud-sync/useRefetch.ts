import { useCallback } from "react";
import { useAuth } from "../../firebase/FirebaseAuthContext.tsx";
import { useCollectionState } from "../../state/collection";
import { Collection, InventoryState } from "../../state/collection/inventory";
import { useGameModeState } from "../../state/gamemode";
import { Game } from "../../state/gamemode/gamestate";
import { useRecentGamesState } from "../../state/recent-games";
import { PastGame } from "../../state/recent-games/history";
import { useRosterBuildingState } from "../../state/roster-building";
import { RosterGroup } from "../../state/roster-building/groups";
import { useExport } from "../export/useExport.ts";

export const useRefetch = () => {
  const auth = useAuth();
  const { importJsonRoster, isImported } = useExport();
  const resetRostersAndGroups = useRosterBuildingState((state) => state.reset);
  const resetRecentGames = useRecentGamesState((state) => state.reset);
  const resetCollection = useCollectionState((state) => state.reset);
  const resetGamestate = useGameModeState((state) => state.reset);

  const getFromApi = async (path: string) => {
    const idToken = await auth.user.getIdToken();
    return fetch(`${API_URL}/${path}`, {
      headers: {
        Authorization: "Bearer " + idToken,
      },
    });
  };

  const reloadRostersAndGroups = async () => {
    const [rostersResponse, groupsResponse] = await Promise.all([
      getFromApi("rosters"),
      getFromApi("groups"),
    ]);
    const rosterData: unknown[] = await rostersResponse.json();
    const rosters = rosterData
      .map((response) => JSON.stringify(response))
      .map(importJsonRoster)
      .filter(isImported);
    const groups = (await groupsResponse.json()) as RosterGroup[];
    resetRostersAndGroups(rosters, groups);
  };

  const reloadGamestate = async () => {
    const response = await getFromApi("ongoing-games");
    const gamestates = (await response.json()) as ({ roster: string } & Game)[];
    const record = gamestates.reduce((acc, { roster, ...game }) => {
      acc[roster] = game;
      return acc;
    }, {});

    resetGamestate(record);
  };

  const reloadRecentGames = async () => {
    const response = await getFromApi("games");
    const recentGames = (await response.json()) as PastGame[];

    resetRecentGames(recentGames);
  };

  const reloadCollections = async () => {
    const response = await getFromApi("collection");
    const collection = (await response.json()) as {
      origin: string;
      model: string;
      collection: Collection[];
    }[];
    const inventory = collection.reduce(
      (acc, { origin, model, collection }) => {
        if (!acc[origin]) {
          acc[origin] = {};
        }
        acc[origin][model] = { collection };
        return acc;
      },
      {},
    ) as InventoryState["inventory"];
    resetCollection(inventory);
  };

  const reloadAll = useCallback(async () => {
    return Promise.all([
      reloadRostersAndGroups(),
      reloadGamestate(),
      reloadRecentGames(),
      reloadCollections(),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    reloadRostersAndGroups,
    reloadRecentGames,
    reloadCollections,
    reloadGamestate,
    reloadAll,
  };
};
