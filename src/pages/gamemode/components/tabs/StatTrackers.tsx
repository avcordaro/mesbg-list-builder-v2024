import { Stack } from "@mui/material";
import { CustomTrackers } from "../trackers/CustomTrackers.tsx";
import { HeroStatTrackers } from "../trackers/HeroStatTrackers.tsx";

export const StatTrackers = () => {
  return (
    <Stack gap={1}>
      <HeroStatTrackers />
      <CustomTrackers />
    </Stack>
  );
};
