import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize.ts";
import { GroupIcon } from "../group-icon/GroupIcon.tsx";
import { Link } from "../link/Link.tsx";
import { CARD_SIZE_IN_PX } from "../roster-card/RosterSummaryCard.tsx";
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
  const screen = useScreenSize();
  const spacing = screen.isTooSmall ? "40px" : "10px";
  const cardStyle = {
    left: spacing,
    top: spacing,
    p: 1,
    width: `calc(${screen.isTooSmall ? "100%" : `${CARD_SIZE_IN_PX}px`} - 2 * ${spacing})`,
    minWidth: `calc(${CARD_SIZE_IN_PX}px - 2 * ${spacing})`,
    aspectRatio: "1/1",
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
      <Box
        sx={{
          position: "relative",
          width: screen.isTooSmall ? "100%" : `${CARD_SIZE_IN_PX}px`,
          minWidth: `${CARD_SIZE_IN_PX}px`,
          aspectRatio: "1/1",
        }}
      >
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
                width: "300px", // Set a fixed width or max-width for overflow
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
                width: "200px", // Set a fixed width or max-width for overflow
                fontSize: "1rem",
              }}
            >
              {rosters} Rosters
            </Typography>
          </Stack>
        </Card>
        <Box
          sx={{
            position: "absolute",
            right: screen.isTooSmall ? 64 : 32,
            top: screen.isTooSmall ? 64 : 24,
          }}
        >
          <GroupOptionsPopoverMenu groupId={slug} />
        </Box>
      </Box>
    </Link>
  );
};
