import { FunctionComponent, PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../firebase/FirebaseAuthContext.tsx";
import { GuardedRoute } from "../../routing/GuardedRoute.tsx";
import { InitialSyncRequest } from "./InitialSyncRequest.tsx";
import { SyncManager } from "./SyncManager.tsx";

export const WithCloudSync: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const auth = useAuth();
  const location = useLocation();

  // Not Logged in, just render the application...
  if (!auth.user) return children;

  return ["/sign-in", "/sign-up"].includes(location.pathname) ? (
    <GuardedRoute>
      <InitialSyncRequest />
    </GuardedRoute>
  ) : (
    <SyncManager>{children}</SyncManager>
  );
};
