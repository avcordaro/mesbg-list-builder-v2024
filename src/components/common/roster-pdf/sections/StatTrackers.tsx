import {
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useRosterInformation } from "../../../../hooks/calculations-and-displays/useRosterInformation.ts";
import { createGameState } from "../../../../state/gamemode/gamestate/create-game-state.ts";
import { useThemeContext } from "../../../../theme/ThemeContext.tsx";
import { CheckboxList } from "../../../atoms/trackers/CheckboxList.tsx";

export const StatTrackers = () => {
  const { mode } = useThemeContext();
  const { roster } = useRosterInformation();
  const { trackables, customTrackers } = createGameState(roster);

  const rows = trackables.map((hero) => {
    const [might, will, fate, wounds] = hero.MWFW.split(":");
    return {
      name: hero.name,
      might,
      will,
      fate,
      wounds,
    };
  });

  const additionalWoundTrackers = customTrackers.map((extraTracker) => {
    return {
      name: extraTracker.name,
      wounds: extraTracker.value,
    };
  });

  const cellStyling: SxProps<Theme> = {
    border: 0,
    borderRight: 1,
    borderBottom: 1,
    borderColor: (theme) => theme.palette.grey["300"],
    borderStyle: "solid",
  };

  return (
    <Box id="pdf-stat-trackers" className="page-break">
      <Typography variant="h5">Might / Will / Fate trackers</Typography>
      <TableContainer component="div" sx={{ py: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell size="small" sx={cellStyling} />
              <TableCell size="small" align="center" sx={cellStyling}>
                Might
              </TableCell>
              <TableCell size="small" align="center" sx={cellStyling}>
                Will
              </TableCell>
              <TableCell size="small" align="center" sx={cellStyling}>
                Fate
              </TableCell>
              <TableCell size="small" align="center" sx={cellStyling}>
                Wounds
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={cellStyling}>{row.name}</TableCell>
                <TableCell sx={cellStyling}>
                  <CheckboxList amount={row.might} mode={mode} />
                </TableCell>
                <TableCell sx={cellStyling}>
                  <CheckboxList amount={row.will} mode={mode} />
                </TableCell>
                <TableCell sx={cellStyling}>
                  <CheckboxList amount={row.fate} mode={mode} />
                </TableCell>
                <TableCell sx={cellStyling}>
                  <CheckboxList amount={row.wounds} mode={mode} />
                </TableCell>
              </TableRow>
            ))}
            {additionalWoundTrackers.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={cellStyling}>{row.name}</TableCell>
                <TableCell sx={cellStyling} />
                <TableCell sx={cellStyling} />
                <TableCell sx={cellStyling} />
                <TableCell sx={cellStyling}>
                  <CheckboxList amount={row.wounds.toString()} mode={mode} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
