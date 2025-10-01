import { Breadcrumbs } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { FunctionComponent } from "react";
import { Link } from "../../../components/atoms/link/Link.tsx";
import { useRosterBuildingState } from "../../../state/roster-building";
import { RosterGroup } from "../../../state/roster-building/groups";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";
import { selectParentGroups } from "../../../utils/groups.ts";

interface RosterBreadCrumbsProps {
  group?: RosterGroup;
}

export const RostersBreadCrumbs: FunctionComponent<RosterBreadCrumbsProps> = ({
  group,
}) => {
  const { palette } = useTheme();
  const { mode } = useThemeContext();
  const parents = useRosterBuildingState(selectParentGroups(group));

  return (
    <Breadcrumbs>
      <Link
        to="/rosters"
        style={{
          textDecoration: "none",
          color: mode === "dark" ? palette.info.light : palette.info.main,
        }}
      >
        Rosters
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
      <Typography sx={{ color: "text.secondary" }}>{group.name}</Typography>
    </Breadcrumbs>
  );
};
