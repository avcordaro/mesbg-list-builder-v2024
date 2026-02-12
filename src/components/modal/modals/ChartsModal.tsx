import { DialogContent } from "@mui/material";
import { useAppState } from "../../../state/app";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";
import { ToWoundChartTable } from "./ToWoundChartTable.tsx";

export function ChartsModal() {
  const {
    modalContext: { selectedChart },
  } = useAppState();
  const { mode } = useThemeContext();

  const isToWoundChart = selectedChart === "to-wound-chart";

  return (
    <DialogContent>
      <center>
        {isToWoundChart ? (
          <ToWoundChartTable />
        ) : (
          <img
            src={`${RESOURCES_URL}/images/charts/` + selectedChart + ".png"}
            alt={selectedChart}
            style={{
              maxWidth: "100%",
              border: "1px solid #6C757D",
              boxShadow: "0 0 5px 2px #6C757D",
              filter: mode === "dark" ? "invert(1)" : "",
            }}
          />
        )}
      </center>
    </DialogContent>
  );
}
