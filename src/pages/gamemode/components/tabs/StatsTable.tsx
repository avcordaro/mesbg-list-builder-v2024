import Box from "@mui/material/Box";
import { QuickReferenceTable } from "../../../../components/common/roster-pdf/sections/QuickReferenceTable.tsx";
import { useProfiles } from "../../../../hooks/profiles/useProfiles.ts";

export const StatsTable = () => {
  const profiles = useProfiles();

  return (
    <Box sx={{ maxWidth: "calc(100vw - 64px - 4*24px )" }}>
      <QuickReferenceTable profiles={profiles.profiles} noCaption />
    </Box>
  );
};
