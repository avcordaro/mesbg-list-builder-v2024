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
import { Game } from "../../state/gamemode/gamestate";
import { useApi } from "./useApi";

const GamestateSyncContext = createContext<
  (roster: string, gamestate: Game) => void
>(() => {});

// eslint-disable-next-line react-refresh/only-export-components
export const useGamestateSync = () => useContext(GamestateSyncContext);

export const GamestateCloudSyncProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  console.debug("Using the roster sync provider...");
  const auth = useAuth();
  const { updateGamestate } = useApi();
  const previousRosterRef = useRef<Game | null>(null);

  async function syncGamestate(rosterId: string, game: Game) {
    try {
      console.debug("Syncing roster...");
      await updateGamestate(rosterId, game);
    } catch (error) {
      console.error("Failed to sync roster", error);
    }
  }

  const debouncedSync = useMemo(
    () =>
      debounce((rosterId: string, nextGamestate: Game) => {
        syncGamestate(rosterId, nextGamestate);
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

  function sync(rosterId: string, game: Game) {
    console.debug("Attempting sync game...");
    if (!rosterId || !game || !auth.user) return;
    if (isEqual(game, previousRosterRef.current)) return;
    previousRosterRef.current = game;
    console.debug("Starting debounce...");
    debouncedSync(rosterId, game);
  }

  return (
    <GamestateSyncContext.Provider value={sync}>
      {children}
    </GamestateSyncContext.Provider>
  );
};
