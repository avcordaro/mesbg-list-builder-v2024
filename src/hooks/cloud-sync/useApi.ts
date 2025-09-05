import { useAuth } from "../../firebase/FirebaseAuthContext";
import { ModelInventory } from "../../state/collection/inventory";
import { PastGame } from "../../state/recent-games/history";
import { RosterGroup } from "../../state/roster-building/groups";
import { Roster } from "../../types/roster.ts";
import { useExport } from "../export/useExport.ts";

export const useApi = () => {
  const auth = useAuth();
  const { convertRosterToJson } = useExport();

  const deleteRoster = (rosterId: string) => {
    if (!auth.idToken) return Promise.resolve(); // no auth - no remote.
    return fetch(`${API_URL}/rosters/${rosterId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + auth.idToken,
      },
    });
  };

  const createRoster = (roster: Roster) => {
    if (!auth.idToken) return Promise.resolve(); // no auth - no remote.
    return fetch(`${API_URL}/rosters`, {
      method: "POST",
      body: convertRosterToJson(roster),
      headers: {
        Authorization: "Bearer " + auth.idToken,
      },
    });
  };

  const updateRoster = (roster: Roster) => {
    if (!auth.idToken) return Promise.resolve(); // no auth - no remote.
    return fetch(`${API_URL}/rosters/${roster.id}`, {
      method: "PUT",
      body: convertRosterToJson(roster),
      headers: {
        Authorization: "Bearer " + auth.idToken,
      },
    });
  };

  const createGroup = (group: RosterGroup) => {
    if (!auth.idToken) return Promise.resolve(); // no auth - no remote.
    return fetch(`${API_URL}/groups`, {
      method: "POST",
      body: JSON.stringify(group),
      headers: {
        Authorization: "Bearer " + auth.idToken,
      },
    });
  };

  const addRosterToGroup = (groupId: string, rosterId: string) => {
    if (!auth.idToken) return Promise.resolve(); // no auth - no remote.
    return fetch(`${API_URL}/groups/${groupId}/add/${rosterId}`, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + auth.idToken,
      },
    });
  };

  const removeRosterFromGroup = (groupId: string, rosterId: string) => {
    if (!auth.idToken) return Promise.resolve(); // no auth - no remote.
    return fetch(`${API_URL}/groups/${groupId}/remove/${rosterId}`, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + auth.idToken,
      },
    });
  };

  const deleteGroup = (groupId: string, keepRosters: boolean) => {
    if (!auth.idToken) return Promise.resolve(); // no auth - no remote.
    return fetch(`${API_URL}/groups/${groupId}?keep-rosters=${keepRosters}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + auth.idToken,
      },
    });
  };

  const createGame = (game: PastGame) => {
    if (!auth.idToken) return Promise.resolve(); // no auth - no remote.
    return fetch(`${API_URL}/games`, {
      method: "POST",
      body: JSON.stringify(game),
      headers: {
        Authorization: "Bearer " + auth.idToken,
      },
    });
  };

  const updateGame = (game: PastGame) => {
    if (!auth.idToken) return Promise.resolve(); // no auth - no remote.
    return fetch(`${API_URL}/games/${game.id}`, {
      method: "PUT",
      body: JSON.stringify(game),
      headers: {
        Authorization: "Bearer " + auth.idToken,
      },
    });
  };

  const deleteGame = (gameId: string) => {
    if (!auth.idToken) return Promise.resolve(); // no auth - no remote.
    return fetch(`${API_URL}/games/${gameId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + auth.idToken,
      },
    });
  };

  const upsertCollection = (
    group: string,
    model: string,
    collection: ModelInventory,
  ) => {
    if (!auth.idToken) return Promise.resolve(); // no auth - no remote.
    return fetch(`${API_URL}/collection/${group}/${model}`, {
      method: "PUT",
      body: JSON.stringify(collection.collection),
      headers: {
        Authorization: "Bearer " + auth.idToken,
      },
    });
  };

  const deleteFromCollection = (group: string, model: string) => {
    if (!auth.idToken) return Promise.resolve(); // no auth - no remote.
    return fetch(`${API_URL}/collection/${group}/${model}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + auth.idToken,
      },
    });
  };

  return {
    createRoster,
    updateRoster,
    deleteRoster,
    createGroup,
    addRosterToGroup,
    removeRosterFromGroup,
    deleteGroup,
    createGame,
    updateGame,
    deleteGame,
    upsertCollection,
    deleteFromCollection,
  };
};
