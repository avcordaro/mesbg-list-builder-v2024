import { Add, Remove } from "@mui/icons-material";
import { Paper, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { FaSkullCrossbones } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { SquareIconButton } from "../../../../components/common/icon-button/SquareIconButton.tsx";
import { UnitProfilePicture } from "../../../../components/common/images/UnitProfilePicture.tsx";
import { useScreenSize } from "../../../../hooks/useScreenSize.ts";
import { useGameModeState } from "../../../../state/gamemode";
import { Trackable } from "../../../../state/gamemode/gamestate";
import { useThemeContext } from "../../../../theme/ThemeContext.tsx";

const TRACKABLE = ["Might", "Will", "Fate", "Wounds"];

type MwfwUpdateCallback = (newValue: number) => void;

const Counter: FunctionComponent<{
  value: number;
  maxValue: number;
  update: MwfwUpdateCallback;
  alive: boolean;
}> = (props) => {
  const increment = () => {
    props.update(props.value + 1);
  };
  const decrement = () => {
    props.update(props.value - 1);
  };

  return (
    <Stack direction="row" gap={2} alignItems="center">
      <SquareIconButton
        onClick={decrement}
        icon={<Remove />}
        iconColor="white"
        backgroundColor="lightgrey"
        iconPadding=".4rem"
        disabled={props.value <= 0 || !props.alive}
      />

      <Typography
        variant="body1"
        sx={{ fontSize: "1.4rem", fontWeight: "bolder" }}
        color={props.value === 0 ? "error" : "inherit"}
      >
        {props.value}
      </Typography>

      <SquareIconButton
        onClick={increment}
        icon={<Add />}
        iconColor="white"
        backgroundColor="lightgrey"
        iconPadding=".4rem"
        disabled={props.value >= props.maxValue || !props.alive}
      />
    </Stack>
  );
};

export const StatTrackers = () => {
  const { rosterId } = useParams();
  const { gameState, updateGameState } = useGameModeState();
  const screen = useScreenSize();
  const { mode } = useThemeContext();

  const trackers = gameState[rosterId]?.trackables || [];

  function getTrackableDeaths() {
    const excludedTrackables = ["Shadowfax", "The White Warg"];
    return trackers
      .filter((tracker) => !excludedTrackables.includes(tracker.name))
      .filter((tracker) => tracker.xMWFW.split(":")[3] === "0").length;
  }

  function updateMwfw(
    newValue: number,
    trackerIndex: number,
    statIndex: number,
  ) {
    const tracker = trackers[trackerIndex];
    const trackables = tracker.xMWFW.split(":");
    trackables[statIndex] = String(newValue);
    const updatedTrackables = trackables.join(":");

    tracker.xMWFW = updatedTrackables;
    trackers[trackerIndex] = tracker;

    updateGameState(rosterId, {
      trackables: trackers,
      heroCasualties: getTrackableDeaths(),
    });
  }

  function isAlive(tracker: Trackable) {
    const [, , , wounds] = tracker.xMWFW.split(":");
    return wounds !== "0";
  }

  return (
    <Stack gap={1}>
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{
          textAlign: "center",
        }}
      >
        Note: Heroes and War Beasts are automatically added as a casualty when
        their wounds reach 0.
      </Typography>
      {trackers.map((tracker, index) => {
        const alive = isAlive(tracker);
        return (
          <Paper
            key={index}
            sx={[
              { p: 1 },
              alive
                ? {}
                : { backgroundColor: mode === "dark" ? "#000000" : "#EFEFEF" },
            ]}
            elevation={alive ? 5 : 0}
          >
            <Stack direction={screen.isMobile ? "column" : "row"}>
              <Stack alignItems="center" sx={{ position: "relative" }}>
                <UnitProfilePicture
                  army={tracker.profile_origin}
                  profile={tracker.name}
                  opacity={alive ? 100 : 45}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "20px",
                    color: "white",
                    opacity: 0.7,
                  }}
                >
                  {!alive && <FaSkullCrossbones fontSize="4rem" />}
                </Box>
              </Stack>
              <Stack flexGrow={1}>
                <Typography
                  variant="h6"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    width: "100%",
                    textOverflow: "ellipsis",
                    textAlign: screen.isMobile ? "center" : "start",
                    opacity: alive ? 1 : 0.45,
                    mb: screen.isMobile ? 2 : 0,
                    px: 2,
                  }}
                >
                  {tracker.name}
                </Typography>
                <Stack
                  direction={screen.isMobile ? "column" : "row"}
                  gap={screen.isMobile ? 1 : 0}
                  sx={{
                    ml: screen.isMobile ? 2 : 0,
                  }}
                  justifyContent="space-around"
                >
                  {tracker.xMWFW.split(":").map((value, statIndex) => {
                    const initialValue = tracker.MWFW.split(":")[statIndex];
                    return (
                      <Stack
                        justifyContent={
                          screen.isMobile ? "space-between" : "center"
                        }
                        alignItems="center"
                        direction={screen.isMobile ? "row" : "column"}
                        key={statIndex}
                        sx={{ opacity: alive ? 1 : 0.45 }}
                      >
                        <Typography
                          sx={{ fontSize: "1.1rem", mt: 0.5 }}
                          className="middle-earth"
                        >
                          {TRACKABLE[statIndex]}
                        </Typography>
                        <Counter
                          value={Number(value)}
                          maxValue={Number(initialValue)}
                          alive={alive || statIndex === 3}
                          update={(newValue) =>
                            updateMwfw(newValue, index, statIndex)
                          }
                        />
                      </Stack>
                    );
                  })}
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
};
