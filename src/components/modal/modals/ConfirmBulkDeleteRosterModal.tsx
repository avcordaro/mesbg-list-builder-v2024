import { Button, DialogActions, DialogContent } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useCallback, useState } from "react";
import { useApi } from "../../../hooks/cloud-sync/useApi.ts";
import { useAppState } from "../../../state/app";
import { useGameModeState } from "../../../state/gamemode";
import { useRosterBuildingState } from "../../../state/roster-building";
import { pluralize } from "../../../utils/string.ts";
import { CustomAlert } from "../../atoms/alert/CustomAlert.tsx";
import { LinearProgressWithLabel } from "../../atoms/linear-progress/LinearProgressWithLabel.tsx";

export const ConfirmBulkDeleteRosterModal = () => {
  const {
    closeModal,
    modalContext: { rosters, confirm },
  } = useAppState();
  const rostersById = useRosterBuildingState(({ rosters }) =>
    Object.fromEntries(rosters.map((roster) => [roster.id, roster])),
  );
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { deleteRoster: localDelete } = useRosterBuildingState();
  const { deleteRoster: remoteDelete } = useApi();
  const { endGame } = useGameModeState();

  const deleteRoster = async (rosterId: string) => {
    await remoteDelete(rosterId);
    endGame(rosterId);
    localDelete(rostersById[rosterId]);
  };

  const updateProgress = useCallback(
    (newProgress: number) => setProgress(newProgress),
    [progress],
  );

  const handleConfirmDelete = async (e) => {
    e.preventDefault();

    setLoading(true);
    for (let i = 0; i < rosters.length; i++) {
      try {
        const roster = rosters[i];
        await deleteRoster(roster);
      } catch (err) {
        console.error(err);
      }
      updateProgress(Math.round(((i + 1) / rosters.length) * 100));
    }

    confirm();
    setTimeout(() => closeModal(), 1200);
  };

  return (
    <>
      <DialogContent sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
        {loading ? (
          <LinearProgressWithLabel value={progress} />
        ) : (
          <>
            <CustomAlert
              severity="warning"
              title={`Deleting ${rosters.length} ${pluralize("roster")(rosters.length)}`}
            >
              <Typography>
                You have selected {rosters.length}{" "}
                {pluralize("roster")(rosters.length)} for deletion. Confirming
                this action will permanently delete them!
              </Typography>
            </CustomAlert>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell size="small">Name</TableCell>
                    <TableCell size="small">Army</TableCell>
                    <TableCell size="small" align="right">
                      Points
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rosters.map((id) => (
                    <TableRow key={id}>
                      <TableCell size="small">{rostersById[id].name}</TableCell>
                      <TableCell size="small">
                        {rostersById[id].armyList}
                      </TableCell>
                      <TableCell size="small" align="right">
                        {rostersById[id].metadata.points}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="text"
          onClick={closeModal}
          data-test-id="dialog--cancel-button"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirmDelete}
          color="error"
          data-test-id="dialog--submit-button"
          disabled={loading}
        >
          Delete {rosters.length} {pluralize("roster")(rosters.length)}
        </Button>
      </DialogActions>
    </>
  );
};
