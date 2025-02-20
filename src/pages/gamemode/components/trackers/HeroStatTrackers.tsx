import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { useGameModeState } from "../../../../state/gamemode";
import { HeroStatTracker } from "./HeroStatTracker.tsx";

export const HeroStatTrackers = () => {
  const { rosterId } = useParams();
  const { gameState, updateGameState } = useGameModeState();

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

  return (
    <>
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
      {trackers.map((tracker, index) => (
        <HeroStatTracker
          tracker={tracker}
          updateMwfw={updateMwfw}
          index={index}
          key={index}
        />
      ))}
    </>
  );
};
