import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize.ts";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";
import { isSelectedUnit, Roster } from "../../../types/roster.ts";
import { KeyValue } from "./KeyValue.tsx";
import { RosterPopoverMenu } from "./RosterPopoverMenu.tsx";
import { CARD_SIZE_IN_PX } from "./RosterSummaryCard.tsx";

interface RosterCardBackProps {
  roster?: Roster;
  markedForDeletion?: boolean;
}

export const RosterCardBack = ({
  roster,
  markedForDeletion,
}: RosterCardBackProps) => {
  const { mode } = useThemeContext();
  const screen = useScreenSize();

  return (
    <Card
      sx={{
        width: "100%",
        minWidth: `${CARD_SIZE_IN_PX}px`,
        aspectRatio: "1/1",
        position: "relative",
        backgroundColor: markedForDeletion
          ? mode === "dark"
            ? "rgb(123,19,19)"
            : "#ffe3e3"
          : "inherit",
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
            {roster.name}
          </Typography>
        </center>

        <Box
          sx={{
            my: 2,
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: ".5rem",
          }}
        >
          {roster.warbands
            .filter((wb) => isSelectedUnit(wb.hero))
            .filter((_, i) => i < 5)
            .map((wb) => (
              <KeyValue
                key={wb.id}
                label={wb.hero.name.split(",")[0]}
                value={`${wb.meta.units}/${wb.meta.maxUnits} units`}
              />
            ))}
          {roster.warbands.length > 5 && (
            <center>
              <Typography>...</Typography>
            </center>
          )}
        </Box>
      </Stack>
      <Box
        sx={{
          position: "absolute",
          right: 2,
          top: 9,
        }}
      >
        <RosterPopoverMenu roster={roster} />
      </Box>
    </Card>
  );
};
