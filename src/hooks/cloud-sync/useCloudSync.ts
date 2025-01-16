import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";
import { useRef } from "react";
import { useAuth } from "../../firebase/FirebaseAuthContext.tsx";
import { Roster } from "../../types/roster.ts";

export const useRosterSync = () => {
  const auth = useAuth();

  const previousRosterRef = useRef(null);
  const debouncedSync = debounce((nextRoster) => syncRoster(nextRoster), 1000);

  async function syncRoster(roster: Roster) {
    try {
      console.log("Syncing to cloud...", roster);
    } catch (error) {
      console.error("Failed to sync roster", error);
    }
  }

  function canSync(roster: Roster) {
    if (!roster) {
      console.warn("No roster to sync...");
      return false;
    }
    if (!auth.user) {
      console.debug("No user to sync roster for...");
      return false;
    }

    if (isEqual(roster, previousRosterRef.current)) {
      console.debug("Roster did not change since last call.");
      return false;
    }

    return true;
  }

  return (roster: Roster) => {
    if (canSync(roster)) {
      previousRosterRef.current = roster;
      debouncedSync(roster);
    }
  };
};
