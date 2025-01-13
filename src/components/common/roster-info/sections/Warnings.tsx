import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { useRosterWarnings } from "../../../../hooks/useRosterWarnings.ts";
import { CustomAlert } from "../../alert/CustomAlert.tsx";
import { RosterInformationSection } from "../RosterInformationSection.tsx";

export const Warnings: FunctionComponent = () => {
  const activeWarnings = useRosterWarnings();
  if (activeWarnings.length === 0) return <></>;

  return (
    <RosterInformationSection title="Warnings">
      <Stack gap={2}>
        {activeWarnings.map(({ warning }, index) => (
          <CustomAlert key={index} severity="error" title="">
            <Typography>{warning}</Typography>
          </CustomAlert>
        ))}
      </Stack>
    </RosterInformationSection>
  );
};
