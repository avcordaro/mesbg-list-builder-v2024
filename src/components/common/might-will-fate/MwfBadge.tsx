import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";
import { Unit } from "../../../types/mesbg-data.types.ts";

type MwfBadgeProps = { unit: Pick<Unit, "MWFW"> };

export const MwfBadge = ({ unit }: MwfBadgeProps) => {
  const { mode } = useThemeContext();
  if (!unit.MWFW || unit.MWFW.length === 0) {
    return null;
  }

  const [might, will, fate] = unit.MWFW[0][1].split(":");
  return (
    <Stack
      direction="row"
      component="div"
      sx={{
        m: 0,
        p: 0,
      }}
      data-test-id="mfw-badge"
    >
      <Typography
        variant="body2"
        component="div"
        sx={{
          backgroundColor: "grey",
          color: "white",
          borderRadius: "5px 0px 0px 5px",
          pl: "8px",
          pr: "8px",
          fontSize: "13px",
          fontWeight: "bold",
          border: "1px solid grey",
        }}
      >
        M W F
      </Typography>
      <Typography
        variant="body2"
        component="span"
        sx={{
          color: mode === "dark" ? "white" : "black",
          borderRadius: "0 5px 5px 0",
          pl: "8px",
          pr: "8px",
          fontSize: "13px",
          fontWeight: "bold",
          border: "1px solid grey",
        }}
      >
        {might} / {will} / {fate}
      </Typography>
    </Stack>
  );
};
