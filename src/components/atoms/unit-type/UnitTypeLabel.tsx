import Chip from "@mui/material/Chip";
import { FunctionComponent } from "react";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";

export type UnitTypeLabelProps = {
  unitType: string;
};

export const UnitTypeLabel: FunctionComponent<UnitTypeLabelProps> = ({
  unitType,
}) => {
  const { mode } = useThemeContext();
  return (
    <Chip
      label={unitType}
      size="small"
      sx={{
        backgroundColor: mode === "dark" ? "grey" : "black",
        color: "white",
        fontWeight: "bold",
      }}
      data-test-id="unit-type"
    />
  );
};
