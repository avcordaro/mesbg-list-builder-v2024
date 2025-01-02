import { RouteObject } from "react-router-dom";
import { PdfView } from "../components/common/roster/PdfView.tsx";
import { AppFallback } from "../components/error-boundary/AppFallback.tsx";
import { App } from "../layout/App.tsx";
import { About } from "../pages/About.tsx";
import { Settings } from "../pages/Settings.tsx";
import { Roster } from "../pages/builder/Roster.tsx";
import { Database } from "../pages/database/Database.tsx";
import { Gamemode } from "../pages/gamemode/Gamemode.tsx";
import { SelectRoster } from "../pages/gamemode/SelectRoster.tsx";
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
        path: "roster/:rosterId",
        element: <Roster />,
        errorElement: <AppFallback />,
      },
      {
        path: "gamemode/start",
        element: <SelectRoster />,
        errorElement: <AppFallback />,
      },
      {
        path: "gamemode/-/:rosterId",
        element: <Gamemode />,
        errorElement: <AppFallback />,
      },
      {
        path: "roster/:rosterId/pdf-printable",
        element: <PdfView />,
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
        path: "database",
        element: <Database />,
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
