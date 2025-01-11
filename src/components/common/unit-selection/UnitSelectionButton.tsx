import { Category, CategoryOutlined } from "@mui/icons-material";
import { Chip, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { useRosterInformation } from "../../../hooks/useRosterInformation.ts";
import { useAppState } from "../../../state/app";
import { useCollectionState } from "../../../state/collection";
import { useUserPreferences } from "../../../state/preference";
import { Unit } from "../../../types/mesbg-data.types.ts";
import { isSelectedUnit } from "../../../types/roster.ts";
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
  const { inventory } = useCollectionState();
  const { preferences } = useUserPreferences();
  const { roster } = useRosterInformation();

  const totalCollection =
    inventory[unit.profile_origin] &&
    inventory[unit.profile_origin][unit.name.replace(" (General)", "")]
      ? inventory[unit.profile_origin][
          unit.name.replace(" (General)", "")
        ].collection.reduce((a, b) => a + Number(b.amount), 0)
      : 0;
  const totalSelected = roster.warbands
    .flatMap((wb) => [wb.hero, ...wb.units])
    .filter(isSelectedUnit)
    .filter(
      (ru) =>
        ru.name.replace(" (General)", "") ===
          unit.name.replace(" (General)", "") &&
        ru.profile_origin === unit.profile_origin,
    )
    .reduce((a, b) => a + Number(b.quantity), 0);

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
              {!!preferences.collectionWarnings && (
                <Stack
                  component="span"
                  gap={0.5}
                  sx={{ pt: unit.unit_type !== "Warrior" ? 0.5 : 0 }}
                  direction="row"
                  alignItems="center"
                >
                  {totalCollection - totalSelected <= 0 ? (
                    <Category
                      sx={{ fontSize: "1rem" }}
                      color={
                        totalCollection - totalSelected < 0
                          ? "error"
                          : "warning"
                      }
                    />
                  ) : (
                    <CategoryOutlined
                      sx={{ fontSize: "1rem" }}
                      color={
                        totalCollection - totalSelected < 0
                          ? "error"
                          : totalCollection - totalSelected === 0
                            ? "warning"
                            : "inherit"
                      }
                    />
                  )}
                  <Typography
                    variant="body2"
                    color={
                      totalCollection - totalSelected < 0
                        ? "error"
                        : totalCollection - totalSelected === 0
                          ? "warning"
                          : "inherit"
                    }
                  >
                    {totalCollection === 0
                      ? "Not in collection"
                      : `Collection: ${totalCollection - totalSelected} left`}
                  </Typography>
                </Stack>
              )}
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
        </Stack>
      </Stack>
    </Paper>
  );
}
