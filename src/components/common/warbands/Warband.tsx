import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";
import { Warband as WarbandType } from "../../../types/roster.ts";
import { WarbandContent } from "./content/WarbandContent.tsx";
import { WarbandHeader } from "./header/WarbandHeader.tsx";

export type WarbandProps = {
  warband: WarbandType;
  collapseAll: (collapsed: boolean) => void;
};

export type WarbandActions = {
  collapseAll: (collapsed: boolean) => void;
};

export const Warband = forwardRef<WarbandActions, WarbandProps>(
  ({ warband, collapseAll }, ref) => {
    const { mode } = useThemeContext();
    const [collapsed, setCollapsed] = useState(false);

    function collapseWarband() {
      setCollapsed(!collapsed);
    }
    function collapseAllWarbands() {
      collapseAll(!collapsed);
    }

    useImperativeHandle(ref, () => ({
      collapseAll: (collapsed: boolean) => setCollapsed(collapsed),
    }));

    return (
      <Card
        variant="elevation"
        elevation={3}
        data-scroll-id={warband.id}
        sx={{
          backgroundColor: ({ palette }) =>
            mode === "dark" ? palette.grey["900"] : palette.grey.A700,
          p: 1,
        }}
      >
        <Stack gap={1}>
          <WarbandHeader
            warbandId={warband.id}
            meta={warband.meta}
            collapse={collapseWarband}
            collapseAll={collapseAllWarbands}
            collapsed={collapsed}
          />
          <WarbandContent warband={warband} collapsed={collapsed} />
        </Stack>
      </Card>
    );
  },
);
