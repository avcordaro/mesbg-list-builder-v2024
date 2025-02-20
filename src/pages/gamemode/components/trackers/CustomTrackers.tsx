import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";
import { useGameModeState } from "../../../../state/gamemode";
import { CustomTracker } from "./CustomTracker.tsx";

export const CustomTrackers = () => {
  const { rosterId } = useParams();

  const { gameState, updateGameState } = useGameModeState();

  const trackers = gameState[rosterId]?.customTrackers || [];

  const createTracker = () => {
    updateGameState(rosterId, {
      customTrackers: [
        ...trackers,
        {
          id: v4(),
          name: `Custom Tracker (${trackers.length + 1})`,
          value: 0,
        },
      ],
    });
  };

  return (
    <>
      {trackers.map((tracker) => (
        <CustomTracker tracker={tracker} key={tracker.id} />
      ))}
      <Button onClick={createTracker}>Add custom tracker</Button>
    </>
  );
};
