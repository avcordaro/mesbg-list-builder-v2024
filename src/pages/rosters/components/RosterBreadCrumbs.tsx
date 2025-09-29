import { Breadcrumbs } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { FunctionComponent } from "react";
import { Link } from "../../../components/atoms/link/Link.tsx";
import { RosterGroup } from "../../../state/roster-building/groups";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";

interface RosterBreadCrumbsProps {
  group?: RosterGroup;
}

export const RosterBreadCrumbs: FunctionComponent<RosterBreadCrumbsProps> = ({
  group,
}) => {
  const { palette } = useTheme();
  const { mode } = useThemeContext();

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
      <Typography sx={{ color: "text.secondary" }}>{group.name}</Typography>
    </Breadcrumbs>
  );
};
