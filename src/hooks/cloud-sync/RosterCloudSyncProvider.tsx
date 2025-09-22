import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useAuth } from "../../firebase/FirebaseAuthContext";
import { Roster } from "../../types/roster";
import { useApi } from "./useApi";

const RosterSyncContext = createContext<(roster: Roster) => void>(() => {});

// eslint-disable-next-line react-refresh/only-export-components
export const useRosterSync = () => useContext(RosterSyncContext);

export const RosterCloudSyncProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  console.debug("Using the roster sync provider...");
  const auth = useAuth();
  const { updateRoster } = useApi();
  const previousRosterRef = useRef<Roster | null>(null);

  async function syncRoster(roster: Roster) {
    try {
      console.debug("Syncing roster...");
      await updateRoster(roster);
    } catch (error) {
      console.error("Failed to sync roster", error);
    }
  }

  const debouncedSync = useMemo(
    () =>
      debounce((nextRoster: Roster) => {
        syncRoster(nextRoster);
      }, 10_000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /**
   * Effect that flushes the debounce whenever the provider unloads.
   * This is useful when they stay within the app but navigate away
   * from the roster builder screen; IE starting a gamemode.
   */
  useEffect(() => {
    return () => {
      console.debug("Flushing debounce...");
      debouncedSync.flush();
    };
  }, [debouncedSync]);

  /**
   * Effect that flushes the debounce whenever webapp closes. This
   * is useful whenever someone makes changes and then within the
   * debounce time navigates to another site or closes the PWA.
   */
  useEffect(() => {
    const handleBeforeUnload = () => {
      debouncedSync.flush();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      debouncedSync.flush();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [debouncedSync]);

  function sync(roster: Roster) {
    console.debug("Attempting sync roster...");
    if (!roster || !auth.user) return;
    if (isEqual(roster, previousRosterRef.current)) return;
    previousRosterRef.current = roster;
    console.debug("Starting debounce...");
    debouncedSync(roster);
  }

  return (
    <RosterSyncContext.Provider value={sync}>
      {children}
    </RosterSyncContext.Provider>
  );
};
