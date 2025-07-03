import Box from "@mui/material/Box";
import { AdditionalRules } from "../../../../components/common/roster-info/sections/AdditionalRules.tsx";
import { SpecialRules } from "../../../../components/common/roster-info/sections/SpecialRules.tsx";
import { Warnings } from "../../../../components/common/roster-info/sections/Warnings.tsx";
import { useRosterInformation } from "../../../../hooks/useRosterInformation.ts";

export const RosterInfoTab = () => {
  const { roster } = useRosterInformation();
  return (
    <Box sx={{ maxWidth: "calc(100vw - 64px - 4*24px )" }}>
      <Warnings />
      <AdditionalRules roster={roster} />
      <SpecialRules roster={roster} editable={false} />
    </Box>
  );
};
