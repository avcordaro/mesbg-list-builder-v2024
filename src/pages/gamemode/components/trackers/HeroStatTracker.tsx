import { Paper, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { FaSkullCrossbones } from "react-icons/fa";
import { UnitProfilePicture } from "../../../../components/common/images/UnitProfilePicture.tsx";
import { useScreenSize } from "../../../../hooks/calculations-and-displays/useScreenSize.ts";
import { Trackable } from "../../../../state/gamemode/gamestate";
import { useThemeContext } from "../../../../theme/ThemeContext.tsx";
import { Counter } from "./Counter.tsx";
import { EditableTrackerLabel } from "./EditableTrackerLabel.tsx";

const TRACKABLE = ["Might", "Will", "Fate", "Wounds"];

type HeroStatTrackerProps = {
  tracker: Trackable;
  updateMwfw?: (
    newValue: number,
    trackerIndex: number,
    statIndex: number,
  ) => void;
  updateName: (newName: string, trackerIndex: number) => void;
  index: number;
};
export const HeroStatTracker: FunctionComponent<HeroStatTrackerProps> = ({
  tracker,
  updateMwfw,
  updateName,
  index,
}) => {
  const screen = useScreenSize();
  const { mode } = useThemeContext();

  function isAlive(tracker: Trackable) {
    const [, , , wounds] = tracker.xMWFW.split(":");
    return wounds !== "0";
  }

  const alive = isAlive(tracker);

  return (
    <Paper
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
          <Stack
            alignItems={screen.isMobile ? "center" : "start"}
            sx={{
              opacity: alive ? 1 : 0.45,
              mb: screen.isMobile ? 2 : 0,
              px: 2,
            }}
          >
            <EditableTrackerLabel
              label={tracker.custom_name ?? tracker.name}
              updateLabel={(newValue) => updateName(newValue, index)}
            />
          </Stack>
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
                  justifyContent={screen.isMobile ? "space-between" : "center"}
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
};
