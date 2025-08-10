import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { SiegeEquipment } from "../../../types/mesbg-data.types.ts";
import { UnitProfilePicture } from "../images/UnitProfilePicture.tsx";

export type UnitSelectionButtonProps = {
  equipment: SiegeEquipment;
  showRole?: boolean;
  onClick: () => void;
};

export function SiegeSelectionButton({
  equipment,
  showRole = false,
  onClick,
}: UnitSelectionButtonProps) {
  const { palette } = useTheme();

  return (
    <Paper
      onClick={onClick}
      elevation={3}
      sx={{
        p: 2,
        cursor: "pointer",
        border: 1,
        borderColor: palette.grey.A400,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <UnitProfilePicture
          army={equipment.profile_origin}
          profile={equipment.name}
        />

        <Stack direction="column" alignItems="start" flexGrow={1}>
          <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
            <Box flexGrow={1}>
              <Typography sx={{ pl: 0.5 }} variant="body1">
                <strong>
                  {equipment.name} {showRole && `(${equipment.siege_role})`}
                </strong>
                <br />
                Points: {equipment.base_points}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
