import { Delete, DeleteForever } from "@mui/icons-material";
import { Badge, Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const RosterBulkDeleteButton = ({
  toggleBulkDelete,
  isDeleting,
  selectedRosters,
}: {
  toggleBulkDelete: () => void;
  isDeleting: boolean;
  selectedRosters: string[];
}) => {
  return (
    <>
      <Badge badgeContent={selectedRosters.length} color="error">
        <Button
          sx={{ width: "5ch" }}
          variant="outlined"
          color={
            isDeleting
              ? selectedRosters.length > 0
                ? "error"
                : "warning"
              : "inherit"
          }
          aria-label="bulk delete"
          onClick={toggleBulkDelete}
        >
          <Stack alignItems="center" sx={{ pt: 0.4 }}>
            {!isDeleting ? <Delete /> : <DeleteForever />}
            <Typography variant="subtitle1" sx={{ fontSize: "0.65rem" }}>
              bulk
            </Typography>
          </Stack>
        </Button>
      </Badge>
    </>
  );
};
