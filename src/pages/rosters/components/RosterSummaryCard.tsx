import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { armyListData } from "../../../assets/data.ts";
import { FactionLogo } from "../../../components/common/images/FactionLogo.tsx";
import { Link } from "../../../components/common/link/Link.tsx";
import { WithRibbon } from "../../../components/common/unit-selection/WithRibbon.tsx";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";
import { isSelectedUnit, Roster } from "../../../types/roster.ts";
import { RosterPopoverMenu } from "./RosterPopoverMenu.tsx";

export const CARD_SIZE_IN_PX = 300;

export type RosterSummaryCardProps = {
  roster: Roster;
};

const KeyValue = ({ label, value }) => {
  return (
    <Chip
      label={
        <Stack justifyContent="space-between" direction="row">
          <Typography>{label}</Typography>
          <Typography>{value}</Typography>
        </Stack>
      }
      sx={{
        width: "100%",
        justifyContent: "start",
        "& span": { display: "block", width: "100%" },
      }}
    />
  );
};

export const RosterSummaryCard: FunctionComponent<RosterSummaryCardProps> = ({
  roster,
}) => {
  const { mode } = useThemeContext();
  const isLegacy =
    armyListData[roster.armyList]?.legacy ||
    !!roster.warbands
      .flatMap((wb) => [wb.hero, ...wb.units])
      .filter(isSelectedUnit)
      .find((unit) => unit.legacy);

  return (
    <Link
      to={`/roster/${roster.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
      data-test-id={"rosters--" + roster.id + "--link"}
    >
      <Card
        sx={{
          width: "100%",
          minWidth: `${CARD_SIZE_IN_PX}px`,
          aspectRatio: "1/1",
          position: "relative",
        }}
        elevation={4}
      >
        <WithRibbon label="Legacy" hideRibbon={!isLegacy}>
          <Stack sx={{ p: 2, height: "100%" }} justifyContent="space-around">
            <center>
              <Typography
                variant="h6"
                className="middle-earth"
                sx={{
                  whiteSpace: "nowrap", // Prevent text from wrapping
                  overflow: "hidden", // Hide the overflowing text
                  textOverflow: "ellipsis", // Show ellipsis when text overflows
                  width: `${CARD_SIZE_IN_PX / 2}px`, // Set a fixed width or max-width for overflow
                }}
              >
                {roster.name}
              </Typography>
              <FactionLogo faction={roster.armyList} size={75} />
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
    </Link>
  );
};
