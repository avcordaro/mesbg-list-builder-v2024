import { useAuth } from "../../firebase/FirebaseAuthContext";
import { Roster } from "../../types/roster.ts";
import { useExport } from "../export/useExport.ts";

export const useApi = () => {
  const auth = useAuth();
  const { convertRosterToJson } = useExport();

  const deleteRoster = (rosterId: string) => {
    if (!auth.idToken) return Promise.resolve(); // no auth - no remote delete.
    return fetch(`${API_URL}/rosters/${rosterId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + auth.idToken,
      },
    });
  };

  const createRoster = (roster: Roster) => {
    if (!auth.idToken) return Promise.resolve(); // no auth - no remote delete.
    return fetch(`${API_URL}/rosters`, {
      method: "POST",
      body: convertRosterToJson(roster),
      headers: {
        Authorization: "Bearer " + auth.idToken,
      },
    });
  };

  const updateRoster = (roster: Roster) => {
    if (!auth.idToken) return Promise.resolve(); // no auth - no remote delete.
    return fetch(`${API_URL}/rosters/${roster.id}`, {
      method: "PUT",
      body: convertRosterToJson(roster),
      headers: {
        Authorization: "Bearer " + auth.idToken,
      },
    });
  };

  return {
    createRoster,
    updateRoster,
    deleteRoster,
  };
};
