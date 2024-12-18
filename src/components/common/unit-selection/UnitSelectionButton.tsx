import { Chip, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { useAppState } from "../../../state/app";
import { Unit } from "../../../types/mesbg-data.types.ts";
import { ModalTypes } from "../../modal/modals.tsx";
import { UnitProfilePicture } from "../images/UnitProfilePicture.tsx";
import { MwfBadge } from "../might-will-fate/MwfBadge.tsx";

export type UnitSelectionButtonProps = {
  unit: Pick<
    Unit,
    | "army_list"
    | "name"
    | "profile_origin"
    | "base_points"
    | "MWFW"
    | "unit_type"
    | "options"
  >;
  onClick: () => void;
};

export function UnitSelectionButton({
  unit,
  onClick,
}: UnitSelectionButtonProps) {
  const { palette } = useTheme();
  const { setCurrentModal } = useAppState();

  const points = unit.options
    .filter((o) => o.included)
    .reduce((a, b) => a + b.points * b.quantity, unit.base_points);

  const handleCardClick = (e) => {
    e.stopPropagation();
    setCurrentModal(ModalTypes.PROFILE_CARD, {
      unit: unit,
      title: unit.name,
    });
  };

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
        <UnitProfilePicture army={unit.profile_origin} profile={unit.name} />

        <Stack direction="column" alignItems="start" flexGrow={1}>
          <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
            <Box flexGrow={1}>
              <Typography sx={{ pl: 0.5 }} variant="body1">
                <strong>{unit.name}</strong>
                <br />
                Points: {points}
              </Typography>
              <Stack gap={0.5}>
                <Box>
                  {unit.unit_type !== "Warrior" && (
                    <Chip
                      label={unit.unit_type}
                      size="small"
                      sx={{
                        backgroundColor: "black",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                  )}
                </Box>
                <MwfBadge unit={unit} />
              </Stack>
            </Box>
            <Box sx={{ minWidth: "50px" }}>
              <IconButton
                onClick={handleCardClick}
                sx={{
                  borderRadius: 2,
                  p: 1.5,
                  color: "white",
                  backgroundColor: palette.grey.A700,
                  "&:hover": {
                    backgroundColor: palette.grey["900"],
                  },
                }}
              >
                <BsFillPersonVcardFill />
              </IconButton>
            </Box>
          </Stack>

          <Stack gap={1} direction="row" flexWrap="wrap" sx={{ mt: 1 }}></Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
