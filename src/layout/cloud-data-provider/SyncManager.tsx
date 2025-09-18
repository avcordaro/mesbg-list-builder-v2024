import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { CustomAlert } from "../../components/common/alert/CustomAlert.tsx";
import { useAuth } from "../../firebase/FirebaseAuthContext.tsx";
import { GamestateCloudSyncProvider } from "../../hooks/cloud-sync/GamestateCloudSyncProvider.tsx";
import { RosterCloudSyncProvider } from "../../hooks/cloud-sync/RosterCloudSyncProvider.tsx";
import { useRefetch } from "../../hooks/cloud-sync/useRefetch.ts";

export const SyncManager: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const auth = useAuth();
  const { reloadAll } = useRefetch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (auth.idToken) {
      setLoading(true);
      reloadAll()
        .then(() => setLoading(false))
        .catch((error) => {
          console.error(error);
          setError(true);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.idToken]);

  return loading ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100svw",
        height: "calc(100svh - 65px)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress color="inherit" size={100} thickness={2} />
      <Typography variant="overline">Reloading application data...</Typography>
    </Box>
  ) : error ? (
    <Container maxWidth="md" sx={{ p: 3 }}>
      <CustomAlert severity="error" title="An error occurred!">
        Something went wrong while loading your data from the API. Please try
        logging out & in. If the problem persists, please contact us via{" "}
        <a href="mailto:support@mesbg-list-builder.com?subject=MESBG List Builder (v2024) - Bug/Correction">
          support@mesbg-list-builder.com
        </a>{" "}
        or <a href="https://discord.gg/MZfUgRtV56">discord</a>.
      </CustomAlert>

      <Button
        sx={{ my: 2 }}
        onClick={auth.signOut}
        color="inherit"
        variant="outlined"
        fullWidth
      >
        Log out
      </Button>
    </Container>
  ) : (
    <RosterCloudSyncProvider>
      <GamestateCloudSyncProvider>{children}</GamestateCloudSyncProvider>
    </RosterCloudSyncProvider>
  );
};
