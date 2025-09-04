import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CustomAlert } from "../../components/common/alert/CustomAlert.tsx";
import { useExport } from "../../hooks/export/useExport.ts";
import { Roster } from "../../types/roster.ts";

export const SharedRoster = () => {
  const { sid } = useParams();
  const { importJsonRoster, isImported } = useExport();
  const [loaded, setLoaded] = useState(false);
  const [roster, setRoster] = useState<Roster | null>(null);
  const [error, setError] = useState<string>(null);

  useEffect(() => {
    const fetchSharedRoster = async () => {
      setLoaded(false);
      try {
        const response = await fetch(`${API_URL}/shared/roster/${sid}`);
        const responseBody = await response.text();
        const rosterData = importJsonRoster(responseBody);
        if (isImported) {
          setRoster(rosterData as Roster);
        } else {
          setError((rosterData as { reason: string }).reason);
        }
      } catch (e) {
        console.error(e);
      }
      setLoaded(true);
    };

    fetchSharedRoster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sid]);

  return (
    <Container maxWidth={false}>
      {error && (
        <CustomAlert title="Error" severity="error">
          Something went wrong while retrieving the shared roster: {error}
        </CustomAlert>
      )}
      {!loaded ? (
        <Box>
          <CircularProgress color="inherit" size={100} thickness={2} />
        </Box>
      ) : (
        <pre>{JSON.stringify(roster, null, 4)}</pre>
      )}
    </Container>
  );
};
