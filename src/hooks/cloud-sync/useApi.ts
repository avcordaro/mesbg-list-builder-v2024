import { AlertTypes } from "../../components/notifications/alert-types.tsx";
import { useAuth } from "../../firebase/FirebaseAuthContext";
import { useAppState } from "../../state/app";
import { ModelInventory } from "../../state/collection/inventory";
import { Game } from "../../state/gamemode/gamestate";
import { PastGame } from "../../state/recent-games/history";
import { RosterGroup } from "../../state/roster-building/groups";
import { Roster } from "../../types/roster.ts";
import { useExport } from "../export/useExport.ts";

class ApiError extends Error {
  readonly statusCode: number;
  readonly response: Response;

  constructor(message: string, response: Response) {
    super(message);
    this.response = response;
    this.statusCode = response.status;
  }
}

export const useApi = () => {
  const auth = useAuth();
  const { convertRosterToJson } = useExport();
  const { triggerAlert } = useAppState();

  const request = async (
    url: string,
    method: "POST" | "PUT" | "PATCH" | "DELETE",
    body?: string,
    alertOnFailure: boolean = true,
  ) => {
    if (!auth.user) return Promise.resolve(); // no auth - no remote.
    const idToken = await auth.user.getIdToken();
    const response = await fetch(`${API_URL}${url}`, {
      method,
      body,
      headers: {
        Authorization: "Bearer " + idToken,
      },
    });
    if (!response.ok) {
      const { title, message } = await response.json();
      if (alertOnFailure)
        triggerAlert(AlertTypes.API_REQUEST_FAILED, { title, message });
      throw new ApiError(`API Request failed: ${message}`, response);
    }

    return response;
  };

  const deleteRoster = (rosterId: string) =>
    request(`/rosters/${rosterId}`, "DELETE");

  const createRoster = (roster: Roster, alertOnFailure: boolean = true) =>
    request("/rosters", "POST", convertRosterToJson(roster), alertOnFailure);

  const updateRoster = (roster: Roster) =>
    request(`/rosters/${roster.id}`, "PUT", convertRosterToJson(roster));

  const createGroup = (group: RosterGroup) =>
    request("/groups", "POST", JSON.stringify(group));

  const updateGroup = (group: Omit<RosterGroup, "rosters">) =>
    request(`/groups/${group.id}`, "PUT", JSON.stringify(group));

  const setParentGroup = (groupId: string, parent: string) =>
    request(`/groups/${groupId}/parent/${parent}`, "PATCH");

  const removeParentGroup = (groupId: string) =>
    request(`/groups/${groupId}/parent`, "DELETE");

  const addRosterToGroup = (groupId: string, rosterId: string) =>
    request(`/groups/${groupId}/add/${rosterId}`, "PATCH");

  const removeRosterFromGroup = (groupId: string, rosterId: string) =>
    request(`/groups/${groupId}/remove/${rosterId}`, "PATCH");

  const deleteGroup = (groupId: string, keepRosters: boolean) =>
    request(`/groups/${groupId}?keep-rosters=${keepRosters}`, "DELETE");

  const createGamestate = async (roster: string, game: Game) =>
    request("/ongoing-games", "POST", JSON.stringify({ roster, ...game }));

  const updateGamestate = (roster: string, game: Game) =>
    request(
      `/ongoing-games/${roster}`,
      "PUT",
      JSON.stringify({ roster, ...game }),
    );

  const deleteGamestate = (roster: string) =>
    request(`/ongoing-games/${roster}`, "DELETE");

  const createGame = async (game: PastGame) =>
    request("/games", "POST", JSON.stringify(game));

  const updateGame = (game: PastGame) =>
    request(`/games/${game.id}`, "PUT", JSON.stringify(game));

  const deleteGame = (gameId: string) => request(`/games/${gameId}`, "DELETE");

  const upsertCollection = async (
    group: string,
    model: string,
    collection: ModelInventory,
  ) =>
    request(
      `/collection/${group}/${model}`,
      "PUT",
      JSON.stringify(collection.collection),
    );

  const deleteFromCollection = (group: string, model: string) =>
    request(`/collection/${group}/${model}`, "DELETE");

  return {
    createRoster,
    updateRoster,
    deleteRoster,
    createGroup,
    updateGroup,
    setParentGroup,
    removeParentGroup,
    addRosterToGroup,
    removeRosterFromGroup,
    deleteGroup,
    createGame,
    updateGame,
    deleteGame,
    createGamestate,
    updateGamestate,
    deleteGamestate,
    upsertCollection,
    deleteFromCollection,
  };
};
