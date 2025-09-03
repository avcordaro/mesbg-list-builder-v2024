import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { useAuth } from "../firebase/FirebaseAuthContext.tsx";
import { useRefetch } from "../hooks/cloud-sync/useRefetch.ts";

export const WithCloudSync: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const auth = useAuth();
  const reload = useRefetch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.idToken) {
      setLoading(true);
      Promise.all([
        reload.reloadRostersAndGroups(),
        reload.reloadRecentGames(),
        reload.reloadCollections(),
      ]).then(() => {
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.idToken]);

  // Not Logged in, just render the application...
  if (!auth.user) return children;

  return loading ? (
    <Box
      sx={{
        display: "flex",
        width: "100svw",
        height: "100svh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress color="inherit" size={100} thickness={2} />
    </Box>
  ) : (
    children
  );
};
