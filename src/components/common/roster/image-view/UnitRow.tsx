import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";

export const UnitRow = ({
  quantity,
  name,
  options,
  points,
  unique,
}: {
  quantity: number | string;
  name: string;
  options: string;
  points: number;
  unique: boolean;
}) => {
  return (
    <Stack direction="row" gap={1} justifyContent="space-between">
      <Typography>
        <strong>
          {!unique && <>{quantity}</>} {name}
        </strong>{" "}
        {options && (
          <span style={{ whiteSpace: "nowrap" }}>with {options}</span>
        )}
      </Typography>
      <Typography sx={{ minWidth: "7ch", textAlign: "end" }}>
        <b>{points} pts</b>
      </Typography>
    </Stack>
  );
};
