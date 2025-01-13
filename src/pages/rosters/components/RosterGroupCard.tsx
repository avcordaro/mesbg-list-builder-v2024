import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import fallbackLogo from "../../../assets/images/default.png";
import { Link } from "../../../components/common/link/Link.tsx";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";
import { Roster } from "../../../types/roster.ts";
import { GroupOptionsPopoverMenu } from "./RosterGroupPopoverMenu.tsx";

export type RosterSummaryCardProps = {
  name: string;
  rosters: Roster[];
};

export const RosterGroupCard: FunctionComponent<RosterSummaryCardProps> = ({
  name,
  rosters,
}) => {
  const { mode } = useThemeContext();
  const cardStyle = {
    width: "34ch",
    left: "3ch",
    top: "15px",
    p: 2,
    height: "320px",
    position: "absolute",
  };

  const maxStackSize = 7;
  const minStackSize = 3;
  const rotation = 1.5;

  const stackSize = Math.min(
    maxStackSize,
    Math.max(minStackSize, rosters.length),
  );

  const stack = new Array(stackSize)
    .fill(Number)
    .map((_, index) =>
      index % 2
        ? Math.random() * index * -rotation
        : Math.random() * index * rotation,
    )
    .reverse();

  return (
    <Link
      to={`/rosters/${name}`}
      style={{ textDecoration: "none", color: "inherit" }}
      data-test-id={"rosters--" + name + "--group-link"}
    >
      <Box sx={{ position: "relative", width: "40ch", height: "350px" }}>
        {stack.map((rot, i) => (
          <Card
            key={i}
            sx={[
              cardStyle,
              {
                transform: `rotate(${rot}deg)`,
              },
            ]}
            elevation={4}
          />
        ))}

        <Card
          sx={[cardStyle]}
          elevation={4}
          data-test-id="rosters--create-a-roster--button"
        >
          <Stack
            sx={{ height: "100%" }}
            justifyContent="center"
            alignItems="center"
            textAlign="center"
          >
            <Avatar
              alt="default faction logo"
              src={fallbackLogo}
              sx={{
                width: 150,
                height: 150,
                mb: 2,
                display: "inline-block",
                backgroundColor: "transparent",
                "& .MuiAvatar-img": {
                  filter: mode === "dark" ? "brightness(0) invert(1)" : "",
                },
              }}
            />
            <Typography
              variant="h6"
              className="middle-earth"
              sx={{
                whiteSpace: "nowrap", // Prevent text from wrapping
                overflow: "hidden", // Hide the overflowing text
                textOverflow: "ellipsis", // Show ellipsis when text overflows
                width: "240px", // Set a fixed width or max-width for overflow
              }}
            >
              {name}
            </Typography>
            <Typography
              variant="body2"
              className="middle-earth"
              sx={{
                whiteSpace: "nowrap", // Prevent text from wrapping
                overflow: "hidden", // Hide the overflowing text
                textOverflow: "ellipsis", // Show ellipsis when text overflows
                width: "240px", // Set a fixed width or max-width for overflow
              }}
            >
              {rosters.length} Rosters
            </Typography>
          </Stack>
        </Card>
        <Box
          sx={{
            position: "absolute",
            right: 32,
            top: 24,
          }}
        >
          <GroupOptionsPopoverMenu groupId={name} />
        </Box>
      </Box>
    </Link>
  );
};
