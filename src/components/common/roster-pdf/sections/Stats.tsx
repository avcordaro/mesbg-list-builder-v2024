import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Profile } from "../../../../hooks/profiles/profile-utils/profile.type.ts";

export const Stats = ({ profile }: { profile: Profile }) => {
  const skippedParentRow = [
    "Vault Warden Team",
    "Uruk-Hai Demolition Team",
    "Bard's Family",
  ].includes(profile.name);
  return (
    <TableContainer component="div" sx={{ mb: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {profile.additional_stats && <TableCell />}
            <TableCell>Mv</TableCell>
            <TableCell>Fv</TableCell>
            <TableCell>Sv</TableCell>
            <TableCell>S</TableCell>
            <TableCell>D</TableCell>
            <TableCell>A</TableCell>
            <TableCell>W</TableCell>
            <TableCell>C</TableCell>
            <TableCell>I</TableCell>
            {(profile.HM || profile.HW || profile.HF) && (
              <>
                <TableCell>M</TableCell>
                <TableCell>W</TableCell>
                <TableCell>F</TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {!skippedParentRow && (
            <TableRow>
              {profile.additional_stats && (
                <TableCell>{profile.name}</TableCell>
              )}
              <TableCell>{profile.Mv}</TableCell>
              <TableCell>{profile.Fv}</TableCell>
              <TableCell>{profile.Sv}</TableCell>
              <TableCell>{profile.S}</TableCell>
              <TableCell>{profile.D}</TableCell>
              <TableCell>{profile.A}</TableCell>
              <TableCell>{profile.W}</TableCell>
              <TableCell>{profile.C}</TableCell>
              <TableCell>{profile.I}</TableCell>
              {(profile.HM || profile.HW || profile.HF) && (
                <>
                  <TableCell>{profile.HM ?? "-"}</TableCell>
                  <TableCell>{profile.HW ?? "-"}</TableCell>
                  <TableCell>{profile.HF ?? "-"}</TableCell>
                </>
              )}
            </TableRow>
          )}
          {profile.additional_stats?.map((stats, index) => (
            <TableRow key={index}>
              <TableCell>{stats.name}</TableCell>
              <TableCell>{stats.Mv}</TableCell>
              <TableCell>{stats.Fv}</TableCell>
              <TableCell>{stats.Sv}</TableCell>
              <TableCell>{stats.S}</TableCell>
              <TableCell>{stats.D}</TableCell>
              <TableCell>{stats.A}</TableCell>
              <TableCell>{stats.W}</TableCell>
              <TableCell>{stats.C}</TableCell>
              <TableCell>{stats.I}</TableCell>
              {(stats.HM ||
                stats.HW ||
                stats.HF ||
                profile.HM ||
                profile.HW ||
                profile.HF) && (
                <>
                  <TableCell>{stats.HM ?? "-"}</TableCell>
                  <TableCell>{stats.HW ?? "-"}</TableCell>
                  <TableCell>{stats.HF ?? "-"}</TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
