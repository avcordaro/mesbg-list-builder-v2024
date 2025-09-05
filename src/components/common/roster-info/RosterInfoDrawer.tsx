import Drawer from "@mui/material/Drawer";
import { useEffect, useState } from "react";
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize.ts";
import { DrawerHeader } from "../../../layout/Navigation.tsx";
import { Roster } from "../../../types/roster.ts";
import { RosterInformation } from "./RosterInformation.tsx";

export const drawerWidth = 55;

export const RosterInfoDrawer = ({
  roster,
  editable,
}: {
  roster: Roster;
  editable?: boolean;
}) => {
  const screen = useScreenSize();
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    if (!roster) return () => {};
    const handleOpenRosterInfo = () => {
      setInfoOpen(true);
    };

    window.addEventListener(
      "mlb-event--open-roster-info",
      handleOpenRosterInfo,
    );
    return () =>
      window.removeEventListener(
        "mlb-event--open-roster-info",
        handleOpenRosterInfo,
      );
  }, [roster]);

  return (
    <Drawer
      variant={screen.getSize() === "desktop" ? "permanent" : "temporary"}
      anchor="right"
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: `min(${drawerWidth}ch, 100%)`,
        },
      }}
      open={infoOpen}
    >
      {screen.isDesktop && <DrawerHeader />}
      <RosterInformation
        roster={roster}
        onClose={() => setInfoOpen(false)}
        editable={editable}
      />
    </Drawer>
  );
};
