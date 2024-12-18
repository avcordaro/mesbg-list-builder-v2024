import { RouteObject } from "react-router-dom";
import { AppFallback } from "../components/error-boundary/AppFallback.tsx";
import { App } from "../layout/App.tsx";
import { About } from "../pages/About.tsx";
import { Gamemode } from "../pages/Gamemode.tsx";
import { Settings } from "../pages/Settings.tsx";
import { Roster } from "../pages/builder/Roster.tsx";
import { SavedGameResults } from "../pages/match-history/SavedGameResults.tsx";
import { RosterGroup } from "../pages/rosters/RosterGroup.tsx";
import { Rosters } from "../pages/rosters/Rosters.tsx";
import { RedirectTo } from "./RedirectTo.tsx";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <AppFallback />,
    children: [
      {
        path: "rosters",
        element: <Rosters />,
        errorElement: <AppFallback />,
      },
      {
        path: "rosters/:groupId",
        element: <RosterGroup />,
        errorElement: <AppFallback />,
      },
      {
        path: "roster/:id",
        element: <Roster />,
        errorElement: <AppFallback />,
      },
      {
        path: "roster/:id/gamemode",
        element: <Gamemode />,
        errorElement: <AppFallback />,
      },
      {
        path: "match-history",
        element: <SavedGameResults />,
        errorElement: <AppFallback />,
      },
      {
        path: "about",
        element: <About />,
        errorElement: <AppFallback />,
      },
      {
        path: "settings",
        element: <Settings />,
        errorElement: <AppFallback />,
      },
      {
        path: "*",
        element: <RedirectTo path="/rosters" />,
        errorElement: <AppFallback />,
      },
      {
        path: "",
        element: <RedirectTo path="/rosters" />,
        errorElement: <AppFallback />,
      },
    ],
  },
  {
    path: "/*",
    element: <RedirectTo path="/rosters" />,
    errorElement: <AppFallback />,
  },
];
