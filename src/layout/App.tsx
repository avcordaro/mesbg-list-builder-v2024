import { useEffect } from "react";
import { Outlet as ReactRouterOutlet } from "react-router-dom";
import { Alerts } from "../components/alerts/Alerts.tsx";
import { DrawerContainer } from "../components/drawer/DrawerContainer.tsx";
import { ModalContainer } from "../components/modal/ModalContainer.tsx";
import { useGameModeState } from "../state/gamemode";
import { useUserPreferences } from "../state/preference";
import { useRecentGamesState } from "../state/recent-games";
import { useRosterBuildingState } from "../state/roster-building";
import { Navigation } from "./Navigation.tsx";

export const App = () => {
  useEffect(() => {
    // Syncs the local storage with when it is changed in a different window or tab.
    function handleStorageSync(e: StorageEvent) {
      if (e.newValue === e.oldValue) return;

      localStorage.setItem(e.key, e.newValue);
      useRosterBuildingState.persist.rehydrate();
      useRecentGamesState.persist.rehydrate();
      useGameModeState.persist.rehydrate();
      useUserPreferences.persist.rehydrate();
    }

    window.addEventListener("storage", handleStorageSync);
    return () => {
      window.removeEventListener("storage", handleStorageSync);
    };
  }, []);

  return (
    <Navigation>
      <main>
        <Alerts />
        <ReactRouterOutlet />
      </main>
      <aside>
        <DrawerContainer />
        <ModalContainer />
      </aside>
    </Navigation>
  );
};
