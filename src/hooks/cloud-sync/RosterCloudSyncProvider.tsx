import { Portal, Slide } from "@mui/material";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";
import {
  createContext,
  MouseEvent,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "../../firebase/FirebaseAuthContext";
import { Roster } from "../../types/roster";
import { useApi } from "./useApi";

type SyncContext = {
  sync: (roster: Roster) => void;
  syncPending: boolean;
};

const RosterSyncContext = createContext<SyncContext>({
  sync: () => {},
  syncPending: false,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useRosterSync = () => useContext(RosterSyncContext);

export const RosterCloudSyncProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const auth = useAuth();
  const { updateRoster } = useApi();
  const previousRosterRef = useRef<Roster | null>(null);
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState<number>(0);
  const startRef = useRef<number | null>(null);
  const delay = 10_000;

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
        setOpen(false);
        syncRoster(nextRoster);
      }, delay),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const flush = () => {
    debouncedSync.flush();
    setOpen(false);
    setRemaining(0);
  };

  /**
   * Effect that flushes the debounce whenever the provider unloads.
   * This is useful when they stay within the app but navigate away
   * from the roster builder screen; IE starting a gamemode.
   */
  useEffect(() => {
    return () => {
      console.debug("Flushing debounce...");
      flush();
    };
  }, [debouncedSync]);

  /**
   * Effect that flushes the debounce whenever webapp closes. This
   * is useful whenever someone makes changes and then within the
   * debounce time navigates to another site or closes the PWA.
   */
  useEffect(() => {
    const handleBeforeUnload = () => {
      flush();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      flush();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [debouncedSync]);

  useEffect(() => {
    if (!open) return;

    const intervalId = setInterval(() => {
      if (startRef.current !== null) {
        const elapsed = Date.now() - startRef.current;
        const timeLeft = Math.max(0, delay - elapsed);
        setRemaining(timeLeft);
        if (timeLeft === 0) {
          clearInterval(intervalId);
        }
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [open]);

  function sync(roster: Roster) {
    console.info("Attempting sync roster...");
    if (!roster || !auth.user) return;
    if (isEqual(roster, previousRosterRef.current)) return;
    previousRosterRef.current = roster;

    console.info("Starting debounce...");
    startRef.current = Date.now();
    setRemaining(delay);
    setOpen(true);

    debouncedSync(roster);
  }

  const handleClose = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    flush();
  };

  return (
    <RosterSyncContext.Provider value={{ sync, syncPending: open }}>
      {children}
      <Portal>
        <Snackbar
          open={open}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          TransitionComponent={Slide}
          message={`Syncing roster in ${Math.ceil(remaining / 1000)}s`}
          action={
            <Button color="primary" size="small" onClick={handleClose}>
              sync now!
            </Button>
          }
          sx={{ backgroundColor: "transparent", zIndex: 1000 }}
          ContentProps={{
            sx: {
              backgroundColor: (theme) => theme.palette.background.paper,
              color: (theme) => theme.palette.text.primary,
            },
          }}
        />
      </Portal>
    </RosterSyncContext.Provider>
  );
};
