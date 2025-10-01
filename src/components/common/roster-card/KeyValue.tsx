import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const KeyValue = ({ label, value }) => {
  return (
    <Chip
      label={
        <Stack justifyContent="space-between" direction="row">
          <Typography>{label}</Typography>
          <Typography>{value}</Typography>
        </Stack>
      }
      sx={{
        width: "100%",
        justifyContent: "start",
        "& span": { display: "block", width: "100%" },
      }}
    />
  );
};
