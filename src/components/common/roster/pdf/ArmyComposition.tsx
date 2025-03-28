import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Fragment } from "react";
import { armyListData } from "../../../../assets/data.ts";
import { useRosterInformation } from "../../../../hooks/useRosterInformation.ts";
import { useUserPreferences } from "../../../../state/preference";
import { useThemeContext } from "../../../../theme/ThemeContext.tsx";
import {
  FreshUnit,
  isSelectedUnit,
  SelectedUnit,
} from "../../../../types/roster.ts";

function UnitRow({ unit }: { unit: FreshUnit | SelectedUnit }) {
  if (!isSelectedUnit(unit)) {
    return (
      <TableRow>
        <TableCell size="small" colSpan={2}>
          No Hero selected
        </TableCell>
      </TableRow>
    );
  }

  const options = unit?.options?.filter((option) => option.quantity > 0) || [];
  return (
    <TableRow>
      <TableCell size="small" width={12}>
        {unit.quantity}x
      </TableCell>
      <TableCell size="small">
        {unit.name}{" "}
        {options.length > 0 && (
          <>
            (
            {options
              ?.map(
                ({ quantity, max, name }) =>
                  `${max > 1 ? `${quantity} ` : ""}${name}`,
              )
              ?.join(", ")}
            )
          </>
        )}
      </TableCell>
    </TableRow>
  );
}

export const ArmyComposition = ({ noCaption }: { noCaption?: boolean }) => {
  const { roster, getAdjustedMetaData } = useRosterInformation();
  const { mode } = useThemeContext();
  const {
    preferences: { removePdfPageBreak },
  } = useUserPreferences();

  const warbands = roster.warbands.map((warband) => [
    warband.hero,
    ...warband.units.filter(isSelectedUnit),
  ]);

  const { might, units, points, bows, throwingWeapons, will, fate } =
    getAdjustedMetaData();
  const { break_point } = armyListData[roster.armyList];

  return (
    <Box id="pdf-army" className={removePdfPageBreak ? "" : "page-break"}>
      {noCaption !== true && (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Army Composition
          </Typography>
          <Stack
            direction="row"
            gap={2}
            sx={{ mb: 1 }}
            justifyContent="space-between"
          >
            <Typography>
              Points: <b>{points}</b>
            </Typography>
            <Typography>
              Units: <b>{units}</b>
            </Typography>
            <Typography>
              Bows: <b>{bows}</b>
            </Typography>{" "}
            <Typography>
              Throwing weapons: <b>{throwingWeapons}</b>
            </Typography>
          </Stack>{" "}
          <Stack
            direction="row"
            gap={2}
            sx={{ mb: 1 }}
            justifyContent="space-around"
          >
            <Typography>
              Might / Will / Fate:{" "}
              <b>
                {might} / {will} / {fate}
              </b>
            </Typography>
            <Typography>
              Break Point:{" "}
              <b>
                {units > 0 ? Math.floor(units * (break_point ?? 0.5)) + 1 : 0}{" "}
                dead
              </b>
            </Typography>
            <Typography>
              Quartered: <b>{Math.floor(0.25 * units)} alive</b>
            </Typography>
          </Stack>
        </>
      )}
      <TableContainer component="div">
        <Table>
          <TableBody>
            {warbands.map((warband, index) => (
              <Fragment key={index}>
                <TableRow>
                  <TableCell
                    size="small"
                    colSpan={2}
                    sx={{
                      textAlign: "center",
                      backgroundColor: mode === "dark" ? "#3F3F3F" : "#F3F3F3",
                    }}
                  >
                    Warband {index + 1}
                  </TableCell>
                </TableRow>
                {warband.map((unit, index) => (
                  <UnitRow unit={unit} key={index} />
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
