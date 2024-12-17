import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { Fragment } from "react";
import { Profile } from "../../../../hooks/profile-utils/profile.type.ts";

interface QuickReferenceTableProps {
  profiles: Profile[];
}

const ReferenceRow = ({
  row,
  indent,
  prefix,
}: {
  row: Pick<
    Profile,
    | "name"
    | "Range"
    | "Mv"
    | "Fv"
    | "Sv"
    | "S"
    | "D"
    | "A"
    | "W"
    | "C"
    | "I"
    | "HM"
    | "HW"
    | "HF"
    | "type"
  >;
  indent?: boolean;
  prefix?: string;
}) => {
  return (
    <TableRow>
      <TableCell
        sx={{
          pl: indent ? 3 : 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          maxWidth: "24ch",
          textOverflow: "ellipsis",
        }}
        size="small"
      >
        {prefix}
        {row.name}
      </TableCell>
      <TableCell size="small">{row.Mv}</TableCell>
      <TableCell size="small">{row.Fv}</TableCell>
      <TableCell size="small">{row.Sv}</TableCell>
      <TableCell size="small">{row.S}</TableCell>
      <TableCell size="small">{row.D}</TableCell>
      <TableCell size="small">{row.A}</TableCell>
      <TableCell size="small">{row.W}</TableCell>
      <TableCell size="small">{row.C}</TableCell>
      <TableCell size="small">{row.I}</TableCell>
      <TableCell size="small">{row.HM ?? "-"}</TableCell>
      <TableCell size="small">{row.HW ?? "-"}</TableCell>
      <TableCell size="small">{row.HF ?? "-"}</TableCell>
    </TableRow>
  );
};

function AdditionalRows({
  parentProfile,
  skippedParentRow,
  profiles,
}: {
  parentProfile: Profile;
  skippedParentRow?: boolean;
  profiles: Profile[];
}) {
  const prefixes = {
    "Iron Shield": "Vault Warden - ",
    "Foe Spear": "Vault Warden - ",
  };

  return (
    parentProfile.additional_stats
      // Hide mounts, which are in a separate table
      ?.filter((stat) => stat.type !== "mount")

      // Hide additional profiles that are already displayed at top-level.
      ?.filter(
        (stat) => !profiles.find((profile) => profile.name === stat.name),
      )

      // Convert additional rows to table rows
      ?.map((additionalRow, aIndex) => (
        <ReferenceRow
          row={additionalRow}
          key={aIndex}
          indent={!skippedParentRow}
          prefix={skippedParentRow ? prefixes[additionalRow.name] : ""}
        />
      ))
  );
}

export const QuickReferenceTable = ({ profiles }: QuickReferenceTableProps) => {
  const mounts = profiles
    .flatMap(
      (profile) =>
        profile.additional_stats?.filter((stat) => stat.type === "mount") || [],
    )
    .filter(function (item: Profile, index: number, self: Profile[]) {
      return index === self.findIndex((other) => other.name === item.name);
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const siegeEngines = profiles.filter((row) => row.type === "Siege Engine");
  const additionProfilesFormSiegeEngines = siegeEngines
    .flatMap((profile) => profile?.additional_stats || [])
    .filter((p, i, s) => s.findIndex((o) => o.name === p.name) === i);

  const units = profiles
    .filter((row) => row.type !== "Siege Engine")
    .concat(additionProfilesFormSiegeEngines);

  return (
    <>
      <TableContainer id="pdf-quick-ref" component="div">
        <Typography variant="h5">Quick reference sheet</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
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
            {units.map((row, index) => {
              const skippedParentRow = [
                "Vault Warden Team",
                "Uruk-Hai Demolition Team",
              ].includes(row.name);

              return (
                <Fragment key={index}>
                  {!skippedParentRow && <ReferenceRow row={row} />}
                  <AdditionalRows
                    parentProfile={row}
                    skippedParentRow={skippedParentRow}
                    profiles={profiles}
                  />
                </Fragment>
              );
            })}
          </TableBody>
        </Table>

        {mounts.length > 0 && (
          <Table sx={{ mt: 2 }}>
            <Typography
              component="caption"
              style={{
                captionSide: "top",
                textAlign: "center",
                padding: "0px",
              }}
            >
              Mounts
            </Typography>
            <TableHead>
              <TableRow>
                <TableCell />
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
              {mounts.map((additionalRow, aIndex) => (
                <ReferenceRow row={additionalRow} key={aIndex} />
              ))}
            </TableBody>
          </Table>
        )}

        {siegeEngines.length > 0 && (
          <Table sx={{ mt: 2 }}>
            <Typography
              component="caption"
              style={{
                captionSide: "top",
                textAlign: "center",
                padding: "0px",
              }}
            >
              Siege engines
            </Typography>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Range</TableCell>
                <TableCell>S</TableCell>
                <TableCell>D</TableCell>
                <TableCell>W</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {siegeEngines.map((row, aIndex) => (
                <Fragment key={aIndex}>
                  <TableRow>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        maxWidth: "24ch",
                        textOverflow: "ellipsis",
                      }}
                      size="small"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell size="small">{row.Range}</TableCell>

                    <TableCell size="small">{row.S}</TableCell>
                    <TableCell size="small">{row.D}</TableCell>
                    <TableCell size="small">{row.W}</TableCell>
                  </TableRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </>
  );
};
