import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { siegeEquipmentData } from "../../../assets/data.ts";
import { useRosterInformation } from "../../../hooks/useRosterInformation.ts";
import { SiegeEquipment } from "../../../types/mesbg-data.types.ts";
import { SiegeSelectionButton } from "./SiegeSelectionButton.tsx";

export type UnitSelectionListProps = {
  selectEquipment: (equipment: SiegeEquipment) => void;
};

export const SiegeSelectionList: FunctionComponent<UnitSelectionListProps> = ({
  selectEquipment,
}) => {
  const { getAdjustedMetaData } = useRosterInformation();
  const { siegeRoster, siegeRole } = getAdjustedMetaData();

  if (!siegeRoster) {
    return (
      <Stack gap={1.5}>
        <Alert severity="error" icon={false}>
          The current roster is not eligible for siege equipment. Create a new
          roster and mark it as a siege roster.
        </Alert>
      </Stack>
    );
  }

  const equipment = Object.values(siegeEquipmentData).filter(
    (equipment) => equipment.siege_role === siegeRole,
  );

  return (
    <Stack gap={1.5}>
      <Typography color="textSecondary">
        <small>
          Equipment to be used for siege games. The full details can be found in
          the &apos;Sieges&apos; section of the main rulebook (pages 146 to
          148).
        </small>
      </Typography>
      {equipment.map((item) => (
        <SiegeSelectionButton
          key={item.model_id}
          equipment={item}
          onClick={() => selectEquipment(item)}
        />
      ))}
    </Stack>
  );
};
