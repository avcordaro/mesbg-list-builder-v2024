import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize.ts";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";
import { Roster } from "../../../types/roster.ts";
import { FactionIcon } from "../../atoms/faction-icon/FactionIcon.tsx";
import { WithRibbon } from "../unit-selection/WithRibbon.tsx";
import { KeyValue } from "./KeyValue.tsx";
import { RosterPopoverMenu } from "./RosterPopoverMenu.tsx";
import { CARD_SIZE_IN_PX } from "./RosterSummaryCard.tsx";

interface RosterCardFrontProps {
  roster?: Roster;
  legacy?: boolean;
  markedForDeletion?: boolean;
}

export const RosterCardFront = ({
  roster,
  legacy,
  markedForDeletion,
}: RosterCardFrontProps) => {
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
      <WithRibbon label="Legacy" hideRibbon={!legacy}>
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
            <FactionIcon faction={roster.armyList} size={75} />
            <Typography
              variant="body2"
              sx={{
                textDecoration: "underline",
                color: ({ palette }) =>
                  mode === "dark" ? palette.grey.A400 : palette.grey.A700,
              }}
            >
              <i>{roster.armyList}</i>
            </Typography>
          </center>

          <Box
            sx={{
              my: 2,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: ".5rem",
            }}
          >
            <KeyValue label="Points" value={roster.metadata.points} />
            <KeyValue label="Units" value={roster.metadata.units} />
            <KeyValue label="Warbands" value={roster.warbands.length} />
            <KeyValue label="Might" value={roster.metadata.might} />
            <KeyValue label="Bows" value={roster.metadata.bows} />
            <KeyValue
              label="Thr. Weap"
              value={roster.metadata.throwingWeapons}
            />
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
      </WithRibbon>
    </Card>
  );
};
