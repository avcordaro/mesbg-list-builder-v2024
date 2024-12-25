import { QuickReferenceTable } from "../../../../components/common/roster/pdf/QuickReferenceTable.tsx";
import { useProfiles } from "../../../../hooks/useProfiles.ts";

export const StatsTable = () => {
  const profiles = useProfiles();

  return <QuickReferenceTable profiles={profiles.profiles} noCaption />;
};
