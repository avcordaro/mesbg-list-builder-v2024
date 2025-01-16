import { AdditionalRules } from "../../../../components/common/roster-info/sections/AdditionalRules.tsx";
import { SpecialRules } from "../../../../components/common/roster-info/sections/SpecialRules.tsx";
import { Warnings } from "../../../../components/common/roster-info/sections/Warnings.tsx";
import { useRosterInformation } from "../../../../hooks/useRosterInformation.ts";

export const RosterInfoTab = () => {
  const { roster } = useRosterInformation();
  return (
    <>
      <Warnings />
      <AdditionalRules roster={roster} />
      <SpecialRules roster={roster} editable={false} />
    </>
  );
};
