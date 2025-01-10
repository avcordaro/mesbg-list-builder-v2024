import { TableSortLabel } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { MouseEvent } from "react";
import { useScreenSize } from "../../../hooks/useScreenSize.ts";
import { ArmyType, Option, UnitType } from "../../../types/mesbg-data.types.ts";
import { Profile } from "../../../types/profile-data.types.ts";
import { Order } from "../utils/sorting.ts";
import { DatabaseTableRow } from "./DatabaseTableRow.tsx";

export type DatabaseRowData = {
  army_list: string[];
  F: string;
  profile: Profile;
  Mv: number;
  unit_type: UnitType[];
  M: string;
  profile_origin: string;
  searchString: string;
  W: string;
  name: string;
  option_mandatory: boolean;
  options: Option[];
  army_type: ArmyType;
  MWFW: string[][];
};

interface DatabaseTableProps {
  order: Order;
  orderBy: string;
  createSortHandler: (property: string) => (event: MouseEvent<unknown>) => void;
  rows: DatabaseRowData[];
}

export const DatabaseTable = ({
  order,
  orderBy,
  createSortHandler,
  rows,
}: DatabaseTableProps) => {
  const screen = useScreenSize();
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} stickyHeader size="small">
        <TableHead
          sx={{
            "& > tr > th": {
              backgroundColor: (theme) => theme.palette.grey.A200,
            },
          }}
        >
          <TableRow>
            <TableCell />
            <TableCell>
              <TableSortLabel
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={createSortHandler("name")}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "profile_origin"}
                direction={orderBy === "profile_origin" ? order : "asc"}
                onClick={createSortHandler("profile_origin")}
              >
                Origin
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">Card</TableCell>
            {screen.isDesktop && (
              <>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "Mv"}
                    direction={orderBy === "Mv" ? order : "asc"}
                    onClick={createSortHandler("Mv")}
                  >
                    Mv / Range
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "profile.Fv"}
                    direction={orderBy === "profile.Fv" ? order : "asc"}
                    onClick={createSortHandler("profile.Fv")}
                  >
                    Fv
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "profile.Sv"}
                    direction={orderBy === "profile.Sv" ? order : "asc"}
                    onClick={createSortHandler("profile.Sv")}
                  >
                    Sv
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "profile.S"}
                    direction={orderBy === "profile.S" ? order : "asc"}
                    onClick={createSortHandler("profile.S")}
                  >
                    S
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "profile.D"}
                    direction={orderBy === "profile.D" ? order : "asc"}
                    onClick={createSortHandler("profile.D")}
                  >
                    D
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "profile.A"}
                    direction={orderBy === "profile.A" ? order : "asc"}
                    onClick={createSortHandler("profile.A")}
                  >
                    A
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "profile.W"}
                    direction={orderBy === "profile.W" ? order : "asc"}
                    onClick={createSortHandler("profile.W")}
                  >
                    W
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "profile.C"}
                    direction={orderBy === "profile.C" ? order : "asc"}
                    onClick={createSortHandler("profile.C")}
                  >
                    C
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "profile.I"}
                    direction={orderBy === "profile.I" ? order : "asc"}
                    onClick={createSortHandler("profile.I")}
                  >
                    I
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "M"}
                    direction={orderBy === "M" ? order : "asc"}
                    onClick={createSortHandler("M")}
                  >
                    M
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "W"}
                    direction={orderBy === "W" ? order : "asc"}
                    onClick={createSortHandler("W")}
                  >
                    W
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "F"}
                    direction={orderBy === "F" ? order : "asc"}
                    onClick={createSortHandler("F")}
                  >
                    F
                  </TableSortLabel>
                </TableCell>
              </>
            )}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <DatabaseTableRow
              key={`${row.name}-${row.profile_origin}`}
              row={row}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
