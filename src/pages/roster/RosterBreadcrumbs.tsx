import { Breadcrumbs } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { Link } from "../../components/atoms/link/Link.tsx";
import { useRosterBuildingState } from "../../state/roster-building";
import { useThemeContext } from "../../theme/ThemeContext.tsx";
import { Roster as RosterType } from "../../types/roster.ts";
import { selectParentGroups, selectRosterGroup } from "../../utils/groups.ts";

export const RosterBreadcrumbs = ({ roster }: { roster: RosterType }) => {
  const { palette } = useTheme();
  const { mode } = useThemeContext();

  const group = useRosterBuildingState(selectRosterGroup(roster));
  const parents = useRosterBuildingState(selectParentGroups(group));

  return (
    <Breadcrumbs sx={{ mb: 1 }}>
      <Link
        to="/rosters"
        style={{
          textDecoration: "none",
        }}
      >
        My Rosters
      </Link>
      {parents.map((parent) => (
        <Link
          key={parent.slug}
          to={`/rosters/${parent.slug}`}
          style={{
            textDecoration: "none",
            color: mode === "dark" ? palette.info.light : palette.info.main,
          }}
        >
          {parent.name}
        </Link>
      ))}
      {group && (
        <Link
          to={`/rosters/${group.slug}`}
          style={{
            textDecoration: "none",
            color: mode === "dark" ? palette.info.light : palette.info.main,
          }}
        >
          {group.name}
        </Link>
      )}
      <Typography sx={{ color: "text.secondary" }}>{roster.name}</Typography>
    </Breadcrumbs>
  );
};
