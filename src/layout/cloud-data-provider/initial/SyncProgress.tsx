import { Done, Error, PauseCircle } from "@mui/icons-material";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomAlert } from "../../../components/common/alert/CustomAlert.tsx";
import { LinearProgressWithLabel } from "../../../components/common/linear-progress/LinearProgressWithLabel.tsx";
import { useSyncQueue } from "../../../hooks/cloud-sync/useSyncQueue.ts";
import { SyncItem } from "./sync-item.ts";

interface SyncProgressProps {
  items: SyncItem[];
}

export const SyncProgress = ({ items }: SyncProgressProps) => {
  const navigate = useNavigate();
  const { queue, failedItems, progress, addItems, processQueue, retryFailed } =
    useSyncQueue();

  // Track already-queued items by "type:id"
  const addedKeysRef = useRef<Set<string>>(new Set());

  const [processing, setProcessing] = useState(false);
  const startProcessing = () => setProcessing(true);

  useEffect(() => {
    if (items && items.length) {
      const newItems = items.filter((item) => {
        const key = `${item.type}:${item.id}`;
        return !addedKeysRef.current.has(key);
      });

      if (newItems.length) {
        addItems(newItems);
        newItems.forEach((item) => {
          const key = `${item.type}:${item.id}`;
          addedKeysRef.current.add(key);
        });
        startProcessing();
      }
    }
  }, [items, addItems]);

  useEffect(() => {
    if (processing) {
      processQueue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processing]);

  useEffect(() => {
    if (processing && progress >= 1) {
      setProcessing(false);
    }
  }, [progress, processing]);

  return (
    <>
      <Typography>
        We noticed you still have some data saved locally on your device. Let’s
        sync it to your account so you can always access it, no matter where you
        log in.
      </Typography>
      {progress !== 1 ? (
        <CustomAlert severity="warning" title="Uploading data...">
          We’re syncing your data to your account. Please wait until the
          progress is complete before continuing. Leaving this page early may
          cause some of your data to be lost.
        </CustomAlert>
      ) : failedItems.length > 0 ? (
        <>
          <CustomAlert severity="error" title="Failed items">
            Some of the items were not correctly saved. You can retry syncing
            those items or ignore the error and create the data again if
            necessary.
          </CustomAlert>
          <Button
            onClick={() => {
              retryFailed();
              setProcessing(true);
            }}
          >
            Retry failed items
          </Button>
        </>
      ) : (
        <>
          <CustomAlert severity="success" title="Upload complete">
            Your data has been successfully added to your account. You can now
            return to the application.
          </CustomAlert>
          <Button
            onClick={() => {
              navigate("/rosters");
            }}
          >
            Continue to the app
          </Button>
        </>
      )}

      <LinearProgressWithLabel value={Math.round(progress * 100)} />
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          size="small"
          aria-label="table with all the unsynced items"
        >
          <TableBody>
            {queue.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ width: "4rem" }}>
                  {row.status === "done" ? (
                    <Done color="success" />
                  ) : row.status === "failed" ? (
                    <Error color="error" />
                  ) : (
                    <PauseCircle color="action" />
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    <small>
                      <i>{row.type}:</i>
                    </small>{" "}
                    {row.id}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="small"
                    fontSize=".8rem"
                  >
                    {row.error}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
