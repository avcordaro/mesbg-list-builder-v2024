import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FunctionComponent } from "react";
import {
  cellStyles,
  mwfShieldStyles,
} from "../../profile-card/ProfileCardStats.styles.tsx";
import { Stats } from "../../profile-card/types.ts";

export type AdditionalStatsProps = {
  stats: Stats;
};

export const AdditionalStats: FunctionComponent<AdditionalStatsProps> = ({
  stats,
}) => {
  const hasMWF = stats.M || stats.W || stats.F;
  return (
    <Table
      size="small"
      sx={{
        my: 1,
        td: {
          ...cellStyles,
          pt: 1,
        },
        th: {
          ...cellStyles,
          backgroundColor: "#F3E7D7",
          fontWeight: "bold",
        },
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell>Mv</TableCell>
          <TableCell>Fv</TableCell>
          <TableCell>Sv</TableCell>
          <TableCell>S</TableCell>
          <TableCell>D</TableCell>
          <TableCell>A</TableCell>
          <TableCell>W</TableCell>
          <TableCell>C</TableCell>
          <TableCell>I</TableCell>
          {hasMWF && (
            <>
              <TableCell />
              <TableCell>{hasMWF && "M"}</TableCell>
              <TableCell>{hasMWF && "W"}</TableCell>
              <TableCell>{hasMWF && "F"}</TableCell>
            </>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>{stats.mv}</TableCell>
          <TableCell>{stats.fv}</TableCell>
          <TableCell>{stats.sv}</TableCell>
          <TableCell>{stats.s}</TableCell>
          <TableCell>{stats.d}</TableCell>
          <TableCell>{stats.a}</TableCell>
          <TableCell>{stats.w}</TableCell>
          <TableCell>{stats.c}</TableCell>
          <TableCell>{stats.i}</TableCell>
          {hasMWF && (
            <>
              <TableCell />
              <TableCell sx={mwfShieldStyles}>{stats.M}</TableCell>
              <TableCell sx={mwfShieldStyles}>{stats.W}</TableCell>
              <TableCell sx={mwfShieldStyles}>{stats.F}</TableCell>
            </>
          )}
        </TableRow>
      </TableBody>
    </Table>
  );
};
