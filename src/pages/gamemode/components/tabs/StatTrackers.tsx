import { Stack } from "@mui/material";
import { HeroStatTrackers } from "../trackers/HeroStatTrackers.tsx";

export const StatTrackers = () => {
  return (
    <Stack gap={1}>
      <HeroStatTrackers />
    </Stack>
  );
};
