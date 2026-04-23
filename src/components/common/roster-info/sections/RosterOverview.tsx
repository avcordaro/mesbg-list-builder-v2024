import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { armyListData } from "../../../../assets/data.ts";
import { useRosterInformation } from "../../../../hooks/calculations-and-displays/useRosterInformation.ts";
import { RosterInformationProps } from "../RosterInformation.tsx";
import { RosterInformationSection } from "../RosterInformationSection.tsx";

const formatSigned = (value: number) => `${value > 0 ? "+" : ""}${value}`;

function getPoint(units: number, divider: number, deadOffset = 0) {
  if (units <= 0) {
    return [0, 0];
  }

  const dead = Math.floor(units * divider) + deadOffset;
  const alive = units - dead;
  return [dead, alive];
}

export const RosterOverview: FunctionComponent<RosterInformationProps> = ({
  roster,
}) => {
  const { getAdjustedMetaData } = useRosterInformation();
  const armyListMetadata = armyListData[roster.armyList];
  const metadata = getAdjustedMetaData(roster);

  const [breakPointDead, breakPointAlive] = getPoint(
    metadata.units + (metadata.addUnits ?? 0),
    armyListMetadata.break_point ?? 0.5,
    1,
  );
  const [quarterAlive, quarterDead] = getPoint(
    metadata.units + (metadata.addUnits ?? 0),
    0.25,
  );

  const bowLimit = Math.ceil(metadata.bowLimit * armyListMetadata.bow_limit);
  const throwLimit = Math.ceil(
    metadata.throwLimit * armyListMetadata.throw_limit,
  );

  const pointsNumerator = metadata.addPoints
    ? `${metadata.points}${formatSigned(metadata.addPoints)}`
    : metadata.points;
  const totalPoints = metadata.points + metadata.addPoints;

  const rows = [
    {
      label: "Points",
      value: metadata.maxPoints
        ? `${pointsNumerator} / ${metadata.maxPoints}`
        : pointsNumerator,
      valid: !metadata.maxPoints || totalPoints <= metadata.maxPoints,
    },
    {
      label: "Units",
      value: metadata.addUnits
        ? `${metadata.units}${formatSigned(metadata.addUnits)}`
        : metadata.units,
    },
    {
      label: "Break point",
      value: (
        <>
          {breakPointDead} dead / {breakPointAlive} alive
        </>
      ),
    },
    {
      label: "Quartered",
      value: (
        <>
          {quarterDead} dead / {quarterAlive} alive
        </>
      ),
    },
    {
      label: (
        <>
          Bow limit (<i>{armyListMetadata.bow_limit * 100}%</i>)
        </>
      ),
      value: (
        <>
          {metadata.bows} ({bowLimit} limit)
        </>
      ),
      valid: bowLimit >= metadata.bows,
    },
    {
      label: (
        <>
          Throwing W. limit (<i>{armyListMetadata.throw_limit * 100}%</i>)
        </>
      ),
      value: (
        <>
          {metadata.throwingWeapons} ({throwLimit} limit)
        </>
      ),
      valid: throwLimit >= metadata.throwingWeapons,
    },
    {
      label: "Might / Will / Fate",
      value: (
        <>
          {metadata.might}
          <small>M</small> / {metadata.will}
          <small>W</small> / {metadata.fate}
          <small>F</small>
        </>
      ),
    },
  ];

  return (
    <RosterInformationSection title="Roster overview">
      <TableContainer>
        <Table size="small">
          <TableBody sx={{ "* > p": { fontSize: "0.9rem !important" } }}>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography color={row.valid !== false ? "inherit" : "error"}>
                    <b>{row.label}</b>
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color={row.valid !== false ? "inherit" : "error"}>
                    {row.value}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </RosterInformationSection>
  );
};
