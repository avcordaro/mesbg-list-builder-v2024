import { useAuth } from "../../firebase/FirebaseAuthContext.tsx";
import { useCollectionState } from "../../state/collection";
import { Collection, InventoryState } from "../../state/collection/inventory";
import { useRecentGamesState } from "../../state/recent-games";
import { PastGame } from "../../state/recent-games/history";
import { useRosterBuildingState } from "../../state/roster-building";
import { RosterGroup } from "../../state/roster-building/groups";
import { Roster } from "../../types/roster.ts";
import { useExport } from "../export/useExport.ts";

const isImported = (importedRoster: Roster): importedRoster is Roster =>
  !!(importedRoster as Roster)?.armyList;

export const useRefetch = () => {
  const auth = useAuth();
  const { importJsonRoster } = useExport();
  const resetRostersAndGroups = useRosterBuildingState((state) => state.reset);
  const resetRecentGames = useRecentGamesState((state) => state.reset);
  const resetCollection = useCollectionState((state) => state.reset);

  const getFromApi = (path: string) => {
    return fetch(`${API_URL}/${path}`, {
      headers: {
        Authorization: "Bearer " + auth.idToken,
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

  return {
    reloadRostersAndGroups,
    reloadRecentGames,
    reloadCollections,
  };
};
