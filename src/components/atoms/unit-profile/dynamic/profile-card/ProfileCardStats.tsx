import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { cellStyles, mwfShieldStyles } from "./ProfileCardStats.styles";
import { useCard } from "./useCard";

const SiegeStats = () => {
  const { stats } = useCard();
  return (
    <>
      <TableHead>
        <TableRow>
          <TableCell>Range</TableCell>
          <TableCell />
          <TableCell>S</TableCell>
          <TableCell>D</TableCell>
          <TableCell>W</TableCell>
          <TableCell colSpan={3} />
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>{stats.range}</TableCell>
          <TableCell />
          <TableCell>{stats.s}</TableCell>
          <TableCell>{stats.d}</TableCell>
          <TableCell>{stats.w}</TableCell>
          <TableCell colSpan={3} />
        </TableRow>
      </TableBody>
    </>
  );
};

const UnitStats = () => {
  const { stats } = useCard();
  const hasMWF = stats.M || stats.W || stats.F;
  return (
    <>
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
          <TableCell sx={hasMWF ? mwfShieldStyles : {}}>{stats.M}</TableCell>
          <TableCell sx={hasMWF ? mwfShieldStyles : {}}>{stats.W}</TableCell>
          <TableCell sx={hasMWF ? mwfShieldStyles : {}}>{stats.F}</TableCell>
        </TableRow>
      </TableBody>
    </>
  );
};

export const ProfileCardStats = () => {
  const { stats } = useCard();
  return (
    <Table
      size="small"
      sx={{
        my: 1,
        maxWidth: "50ch",
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
      {stats.range ? <SiegeStats /> : <UnitStats />}
    </Table>
  );
};
