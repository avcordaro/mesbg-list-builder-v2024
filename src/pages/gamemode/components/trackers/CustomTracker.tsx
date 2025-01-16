import { Paper, Stack } from "@mui/material";
import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { useScreenSize } from "../../../../hooks/calculations-and-displays/useScreenSize.ts";
import { useGameModeState } from "../../../../state/gamemode";
import { CustomTracker as CustomTrackerType } from "../../../../state/gamemode/gamestate";
import { Counter } from "./Counter.tsx";
import { EditableTrackerLabel } from "./EditableTrackerLabel.tsx";

type CustomTrackerProps = {
  tracker: CustomTrackerType;
};

export const CustomTracker: FunctionComponent<CustomTrackerProps> = ({
  tracker,
}) => {
  const { rosterId } = useParams();
  const screen = useScreenSize();
  const { gameState, updateGameState } = useGameModeState();

  // list of all trackers for updating the state without losing data.
  const trackers = gameState[rosterId]?.customTrackers || [];

  const updateTrackerValue = (newValue: number) => {
    updateGameState(rosterId, {
      customTrackers: trackers.map((otherTracker) =>
        otherTracker.id !== tracker.id
          ? otherTracker
          : { ...otherTracker, value: newValue },
      ),
    });
  };

  const updateTrackerLabel = (newLabel: string) => {
    updateGameState(rosterId, {
      customTrackers: trackers.map((otherTracker) =>
        otherTracker.id !== tracker.id
          ? otherTracker
          : { ...otherTracker, name: newLabel },
      ),
    });
  };

  const removeTracker = () => {
    updateGameState(rosterId, {
      customTrackers: trackers.filter(({ id }) => tracker.id !== id),
    });
  };

  return (
    <Paper
      key={tracker.id}
      sx={[
        { p: 0.5, pb: 1.5 },
        screen.isTablet
          ? { flex: "1 1 33%", minWidth: "33%" }
          : { flex: "1 1 25%", minWidth: "25%" },
      ]}
      elevation={5}
    >
      <Stack
        justifyContent={screen.isMobile ? "space-between" : "center"}
        alignItems="center"
        gap={1}
      >
        <EditableTrackerLabel
          label={tracker.name}
          updateLabel={updateTrackerLabel}
          removeTracker={removeTracker}
        />
        <Counter
          value={tracker.value}
          maxValue={tracker.maxValue}
          update={updateTrackerValue}
        />
      </Stack>
    </Paper>
  );
};
