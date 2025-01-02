import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { mesbgData, profileData } from "../assets/data.ts";
import { SquareIconButton } from "../components/common/icon-button/SquareIconButton.tsx";
import { ModalTypes } from "../components/modal/modals.tsx";
import { useAppState } from "../state/app";
import { Unit } from "../types/mesbg-data.types.ts";
import { Profile } from "../types/profile-data.types.ts";

const DatabaseTableRow = ({
  row,
}: {
  row: { name: string; profile_origin: string; profile: Profile };
}) => {
  const { palette } = useTheme();
  const { setCurrentModal } = useAppState();
  const [open, setOpen] = useState(false);

  return (
    <TableRow>
      <TableCell>
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => setOpen(!open)}
        >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.profile_origin}</TableCell>
      <TableCell>
        <SquareIconButton
          icon={<BsFillPersonVcardFill />}
          iconColor={palette.primary.contrastText}
          backgroundColor={palette.grey.A700}
          backgroundColorHover={palette.grey["900"]}
          onClick={() => {
            setCurrentModal(ModalTypes.PROFILE_CARD, {
              unit: {
                name: row.name,
                profile_origin: row.profile_origin,
              },
              title: row.name,
            });
          }}
        />
      </TableCell>
      <TableCell>{row.profile.Mv}</TableCell>
      <TableCell>{row.profile.Fv}</TableCell>
      <TableCell>{row.profile.Sv}</TableCell>
      <TableCell>{row.profile.S}</TableCell>
      <TableCell>{row.profile.D}</TableCell>
      <TableCell>{row.profile.A}</TableCell>
      <TableCell>{row.profile.W}</TableCell>
      <TableCell>{row.profile.C}</TableCell>
      <TableCell>{row.profile.I}</TableCell>
    </TableRow>
  );
};

export const Database = () => {
  const rows = Object.values(
    Object.values(mesbgData).reduce((acc, currentValue) => {
      const name = currentValue.name;
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(currentValue);

      return acc;
    }, {}),
  ).flatMap((dataPoint: Unit[]) => {
    return {
      name: dataPoint[0].name,
      army_type: dataPoint[0].army_type,
      profile_origin: dataPoint[0].profile_origin,
      unit_type: [...new Set(dataPoint.map((p) => p.unit_type))],
      army_list: dataPoint.map((p) => p.army_list),
      options: [
        ...new Set(dataPoint.flatMap((p) => p.options).map((o) => o.name)),
      ],
      profile: profileData[dataPoint[0].profile_origin][dataPoint[0].name],
    };
  });
  console.log(rows);

  return (
    <Container maxWidth={false} sx={{ p: 2 }}>
      <Typography variant="h4" className="middle-earth" sx={{ mb: 2 }}>
        Profile database
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <Table sx={{ minWidth: 650 }} stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={4}>
                Profile
              </TableCell>
              <TableCell align="center" colSpan={12}>
                Stats
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Card</TableCell>
              <TableCell>Mv</TableCell>
              <TableCell>Fv</TableCell>
              <TableCell>Sv</TableCell>
              <TableCell>S</TableCell>
              <TableCell>D</TableCell>
              <TableCell>A</TableCell>
              <TableCell>W</TableCell>
              <TableCell>C</TableCell>
              <TableCell>I</TableCell>
              <TableCell>M</TableCell>
              <TableCell>W</TableCell>
              <TableCell>F</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((row) => (
                <DatabaseTableRow key={row.name} row={row} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
