import { Stack } from "@mui/material";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { useRosterWarnings } from "../../../../hooks/useRosterWarnings.ts";
import { RosterInformationSection } from "../RosterInformationSection.tsx";

export const Warnings: FunctionComponent = () => {
  const activeWarnings = useRosterWarnings();
  if (activeWarnings.length === 0) return <></>;

  return (
    <RosterInformationSection title="Warnings">
      <Stack gap={2}>
        {activeWarnings.map(({ warning }, index) => (
          <Alert key={index} icon={false} severity="error">
            <Typography>{warning}</Typography>
          </Alert>
        ))}
      </Stack>
    </RosterInformationSection>
  );
};
