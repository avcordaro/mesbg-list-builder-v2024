import { Button, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";
import { useScreenSize } from "../../../../hooks/useScreenSize.ts";
import { useGameModeState } from "../../../../state/gamemode";
import { CustomTracker } from "./CustomTracker.tsx";

export const CustomTrackers = () => {
  const { rosterId } = useParams();
  const screen = useScreenSize();

  const { gameState, updateGameState } = useGameModeState();

  const trackers = gameState[rosterId]?.customTrackers || [];

  const createTracker = () => {
    updateGameState(rosterId, {
      customTrackers: [
        ...trackers,
        {
          id: v4(),
          name: `Custom Tracker (${trackers.filter((t) => !t.permanent).length + 1})`,
          value: 0,
        },
      ],
    });
  };

  return (
    <>
      <Stack
        gap={1}
        direction={screen.isMobile ? "column" : "row"}
        justifyContent="space-around"
        flexWrap="wrap"
      >
        {trackers.map((tracker) => (
          <CustomTracker tracker={tracker} key={tracker.id} />
        ))}
      </Stack>
      <Button onClick={createTracker}>Add custom tracker</Button>
    </>
  );
};
