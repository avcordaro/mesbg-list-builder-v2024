import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../firebase/FirebaseAuthContext.tsx";
import { RedirectTo } from "./RedirectTo.tsx";

export const GuardedRoute = ({ children }: PropsWithChildren) => {
  const { idToken } = useAuth();
  const location = useLocation();

  // Check if programmatic navigation included "allow" flag
  const cameFromApp = location.state?.allowNavigation === true;

  if (idToken && !cameFromApp) {
    // Block direct access if already signed in
    return <RedirectTo path="/rosters" />;
  }

  return <>{children}</>;
};
