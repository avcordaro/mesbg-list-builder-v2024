import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";
import { useEffect, useMemo, useRef } from "react";
import { useAuth } from "../../firebase/FirebaseAuthContext.tsx";
import { Roster } from "../../types/roster.ts";
import { useApi } from "./useApi.ts";

const SIX_SECONDS = 6000;

export const useRosterSync = () => {
  const auth = useAuth();
  const { updateRoster } = useApi();

  const previousRosterRef = useRef<Roster | null>(null);
  const debouncedSync = useMemo(
    () => {
      return debounce((nextRoster: Roster) => {
        syncRoster(nextRoster);
      }, SIX_SECONDS);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // only created once
  );

  async function syncRoster(roster: Roster) {
    try {
      await updateRoster(roster);
    } catch (error) {
      console.error("Failed to sync roster", error);
    }
  }

  function canSync(roster: Roster) {
    if (!roster) return false;
    if (!auth.user) return false;
    if (isEqual(roster, previousRosterRef.current)) return false;
    return true;
  }

  useEffect(() => {
    return () => {
      debouncedSync.cancel();
    };
  }, [debouncedSync]);

  return (roster: Roster) => {
    if (canSync(roster)) {
      previousRosterRef.current = roster;
      debouncedSync(roster);
    }
  };
};
