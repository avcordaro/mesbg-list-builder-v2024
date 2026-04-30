import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CARD_SIZE_IN_PX } from "../../../components/common/roster-card/RosterSummaryCard.tsx";
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize.ts";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";

export const EmptyRostersMessage = () => {
  const { mode } = useThemeContext();
  const screen = useScreenSize();
  return (
    <Card
      sx={{
        minWidth: `${CARD_SIZE_IN_PX}px`,
        aspectRatio: "1/1",
        position: "relative",
        background: "none",
        border: "1px dashed white",
      }}
      elevation={4}
    >
      <Stack sx={{ p: 2, height: "100%" }} justifyContent="space-around">
        <center>
          <Typography
            variant="h6"
            className="middle-earth"
            sx={{
              whiteSpace: "nowrap", // Prevent text from wrapping
              overflow: "hidden", // Hide the overflowing text
              textOverflow: "ellipsis", // Show ellipsis when text overflows
              width: screen.isTooSmall
                ? `${CARD_SIZE_IN_PX}px`
                : `${CARD_SIZE_IN_PX / 1.5}px`, // Set a fixed width or max-width for overflow
            }}
          >
            No rosters yet.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              textDecoration: "underline",
              maxWidth: "32ch",
              textWrap: "pretty",
              color: ({ palette }) =>
                mode === "dark" ? palette.grey.A400 : palette.grey.A700,
            }}
          >
            Create your first roster/group using the + button on the bottom
            right
          </Typography>
        </center>
      </Stack>
    </Card>
  );
};
