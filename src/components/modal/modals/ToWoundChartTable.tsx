import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { GiPerspectiveDiceSixFacesOne } from "react-icons/gi";

const TO_WOUND_DATA: string[][] = [
  ["4+", "5+", "5+", "6+", "6+", "6+/4+", "6+/5+", "6+/6+", "-", "-"],
  ["4+", "4+", "5+", "5+", "6+", "6+", "6+/4+", "6+/5+", "6+/6+", "-"],
  ["3+", "4+", "4+", "5+", "5+", "6+", "6+", "6+/4+", "6+/5+", "6+/6+"],
  ["3+", "3+", "4+", "4+", "5+", "5+", "6+", "6+", "6+/4+", "6+/5+"],
  ["3+", "3+", "3+", "4+", "4+", "5+", "5+", "6+", "6+", "6+/4+"],
  ["3+", "3+", "3+", "3+", "4+", "4+", "5+", "5+", "6+", "6+"],
  ["3+", "3+", "3+", "3+", "3+", "4+", "4+", "5+", "5+", "6+"],
  ["3+", "3+", "3+", "3+", "3+", "3+", "4+", "4+", "5+", "5+"],
  ["3+", "3+", "3+", "3+", "3+", "3+", "3+", "4+", "4+", "5+"],
  ["3+", "3+", "3+", "3+", "3+", "3+", "3+", "3+", "4+", "4+"],
];

export function ToWoundChartTable() {
  const theme = useTheme();
  const headerBg = theme.palette.grey[900];
  const headerTextColor = theme.palette.getContrastText(headerBg);
  const oddRowBg = theme.palette.grey[800];
  const evenRowBg = theme.palette.grey[700];
  const borderColor = theme.palette.divider;
  const headerBorder = `1px solid ${borderColor}`;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        mx: "auto",
      }}
    >
      <Box
        component="span"
        sx={{
          flexShrink: 0,
          width: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: headerBg,
          color: headerTextColor,
          border: headerBorder,
          borderRight: "none",
          borderTopLeftRadius: 4,
          borderBottomLeftRadius: 4,
        }}
      >
        <Typography
          component="span"
          sx={{
            display: "inline-block",
            transform: "rotate(-90deg)",
            whiteSpace: "nowrap",
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          STRENGTH
        </Typography>
      </Box>
      <Table
        size="small"
        sx={{
          flex: "1 1 auto",
          "& th, & td": {
            border: headerBorder,
            textAlign: "center",
            minWidth: 36,
            py: 0.75,
            px: 0.5,
          },
          "& th": {
            backgroundColor: headerBg,
            color: headerTextColor,
            fontWeight: 700,
          },
          "& tbody tr:nth-of-type(even) td": {
            backgroundColor: evenRowBg,
            color: headerTextColor,
          },
          "& tbody tr:nth-of-type(odd) td": {
            backgroundColor: oddRowBg,
            color: headerTextColor,
          },
          "& tbody tr th": {
            backgroundColor: headerBg,
            color: headerTextColor,
          },
          "& thead th:first-of-type": {
            borderTopLeftRadius: 0,
          },
        }}
        aria-label="To Wound Chart (27)"
      >
        <TableHead>
          <TableRow>
            <TableCell
              component="th"
              colSpan={11}
              scope="colgroup"
              sx={{ borderBottom: headerBorder }}
            >
              DEFENCE
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              component="th"
              scope="col"
              sx={{ borderRight: headerBorder }}
              aria-hidden
            >
              <GiPerspectiveDiceSixFacesOne size={20} />
            </TableCell>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
              <TableCell key={d} component="th" scope="col">
                {d}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {TO_WOUND_DATA.map((row, i) => (
            <TableRow key={i}>
              <TableCell
                component="th"
                scope="row"
                sx={{ backgroundColor: headerBg, color: headerTextColor }}
              >
                {i + 1}
              </TableCell>
              {row.map((cell, j) => (
                <TableCell key={j}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
