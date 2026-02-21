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
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize";

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

const headerBgLight = "rgba(139, 90, 43, 0.25)";
const headerBgDark = "rgba(180, 140, 90, 0.35)";
const headerBorder = "1px solid rgba(139, 90, 43, 0.5)";

export function ToWoundChartTable() {
  const theme = useTheme();
  const screen = useScreenSize();
  const isDark = theme.palette.mode === "dark";
  const headerBg = isDark ? headerBgDark : headerBgLight;
  console.log(screen);
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
            fontWeight: 700,
          },
          "& tbody tr:nth-of-type(even) td": {
            backgroundColor: (t) => t.palette.action.hover,
          },
          "& tbody tr:nth-of-type(odd) td": {
            backgroundColor: (t) =>
              t.palette.mode === "dark"
                ? t.palette.background.paper
                : t.palette.background.default,
          },
          "& tbody tr:nth-of-type(odd) th": {
            backgroundColor: headerBg,
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
              🎲
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
                sx={{ backgroundColor: headerBg }}
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
