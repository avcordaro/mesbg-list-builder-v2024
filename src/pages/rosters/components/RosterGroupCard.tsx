import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { GroupIcon } from "../../../components/common/group-icon/GroupIcon.tsx";
import { Link } from "../../../components/common/link/Link.tsx";
import { GroupOptionsPopoverMenu } from "./RosterGroupPopoverMenu.tsx";

export type RosterSummaryCardProps = {
  name: string;
  slug: string;
  rosters: number;
  icon?: string;
};

export const RosterGroupCard: FunctionComponent<RosterSummaryCardProps> = ({
  name,
  slug,
  rosters,
  icon,
}) => {
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

  const stackSize = Math.min(maxStackSize, Math.max(minStackSize, rosters));

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
      to={`/rosters/${slug}`}
      style={{ textDecoration: "none", color: "inherit" }}
      data-test-id={"rosters--" + slug + "--group-link"}
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
            <Box
              sx={{
                "& .MuiAvatar-root, svg": {
                  width: 100,
                  height: 100,
                },
              }}
            >
              <GroupIcon icon={icon} />
            </Box>
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
              {rosters} Rosters
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
          <GroupOptionsPopoverMenu groupId={slug} />
        </Box>
      </Box>
    </Link>
  );
};
