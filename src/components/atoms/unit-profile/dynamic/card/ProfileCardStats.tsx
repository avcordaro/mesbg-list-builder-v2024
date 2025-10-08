import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useCard } from "./useCard.ts";

const cellStyles = {
  color: "black",
  border: 0,
  px: 1,
  width: "4ch",
  textAlign: "center",
};

export const ProfileCardStats = () => {
  const { stats } = useCard();
  const hasMWF = stats.M || stats.W || stats.F;
  return (
    <Table
      size="small"
      sx={{
        my: 1,
        td: cellStyles,
        th: {
          ...cellStyles,
          backgroundColor: "rgba(255, 225,180,0.7)",
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
          <TableCell />
          <TableCell>{hasMWF && "M"}</TableCell>
          <TableCell>{hasMWF && "W"}</TableCell>
          <TableCell>{hasMWF && "F"}</TableCell>
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
          <TableCell />
          <TableCell>{stats.M}</TableCell>
          <TableCell>{stats.W}</TableCell>
          <TableCell>{stats.F}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
