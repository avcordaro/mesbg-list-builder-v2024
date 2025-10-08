import { RouteObject } from "react-router-dom";
import { PdfView } from "../components/common/roster-pdf/PdfView.tsx";
import { App } from "../layout/App.tsx";
import { AppFallback } from "../layout/error-boundary/AppFallback.tsx";
import { Changelog } from "../pages/Changelog.tsx";
import { Collection } from "../pages/Collection.tsx";
import { Settings } from "../pages/Settings.tsx";
import { About } from "../pages/about/About.tsx";
import { SignIn } from "../pages/account/SignIn.tsx";
import { SignUp } from "../pages/account/SignUp.tsx";
import { Database } from "../pages/database/Database.tsx";
import { ProfileCardDemoPage } from "../pages/demo/ProfileCardDemoPage.tsx";
import { Gamemode } from "../pages/gamemode/Gamemode.tsx";
import { Home } from "../pages/home/Home.tsx";
import { SavedGameResults } from "../pages/match-history/SavedGameResults.tsx";
import { Roster } from "../pages/roster/Roster.tsx";
import { Rosters } from "../pages/rosters/Rosters.tsx";
import { SharedRoster } from "../pages/shared/Roster.tsx";
import { RedirectTo } from "./RedirectTo.tsx";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <AppFallback />,
    children: [
      {
        path: "",
        element: <Home />,
        errorElement: <AppFallback />,
      },
      {
        path: "rosters",
        element: <Rosters />,
        errorElement: <AppFallback />,
      },
      {
        path: "rosters/:groupId",
        element: <Rosters />,
        errorElement: <AppFallback />,
      },
      {
        path: "roster/:rosterId",
        element: <Roster />,
        errorElement: <AppFallback />,
      },
      {
        path: "gamemode/:rosterId",
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
        path: "collection",
        element: <Collection />,
        errorElement: <AppFallback />,
      },
      {
        path: "changelog",
        element: <Changelog />,
        errorElement: <AppFallback />,
      },
      {
        path: "sign-in",
        element: <SignIn />,
        errorElement: <AppFallback />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
        errorElement: <AppFallback />,
      },
      {
        path: "shared/roster/:sid",
        element: <SharedRoster />,
        errorElement: <AppFallback />,
      },
      {
        path: "demo/profile-cards",
        element: <ProfileCardDemoPage />,
        errorElement: <AppFallback />,
      },
      {
        path: "*",
        element: <RedirectTo path="/" />,
        errorElement: <AppFallback />,
      },
      {
        path: "",
        element: <RedirectTo path="/" />,
        errorElement: <AppFallback />,
      },
    ],
  },
  {
    path: "/*",
    element: <RedirectTo path="/" />,
    errorElement: <AppFallback />,
  },
];
