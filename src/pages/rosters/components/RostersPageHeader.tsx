import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { FaPatreon } from "react-icons/fa";
import { TbMobiledata, TbMobiledataOff } from "react-icons/tb";
import { GroupOptionsPopoverMenu } from "../../../components/common/roster-group-card/RosterGroupPopoverMenu.tsx";
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize.ts";
import { useLockContext } from "../../../hooks/lock/useLockContext.ts";
import { RosterGroup } from "../../../state/roster-building/groups";
import { PATREON_LINK } from "../../home/Home.tsx";
import { RostersBreadCrumbs } from "./RostersBreadCrumbs.tsx";

type RostersPageHeaderProps = {
  group?: RosterGroup;
};

export const RostersPageHeader: FunctionComponent<RostersPageHeaderProps> = ({
  group,
}) => {
  const screen = useScreenSize();
  const { lock, toggleLock } = useLockContext();
  return (
    <Stack>
      <Stack
        direction={screen.isMobile ? "column-reverse" : "row"}
        gap={2}
        justifyContent="space-between"
      >
        <Typography variant="h4" className="middle-earth">
          My Rosters
        </Typography>
        <Button
          variant="outlined"
          size="large"
          startIcon={<FaPatreon />}
          sx={{
            color: "#F96854",
            borderColor: "#F96854",
            p: 1,
            px: 3,
          }}
          onClick={() => window.open(PATREON_LINK, "_blank")}
        >
          Support us on patreon
        </Button>
      </Stack>
      {group ? (
        <>
          <Stack direction="row" alignItems="center">
            <Typography
              variant="h6"
              className="middle-earth"
              color="textSecondary"
            >
              {group.name}
            </Typography>
            <GroupOptionsPopoverMenu groupId={group.slug} redirect={true} />
          </Stack>
          <RostersBreadCrumbs group={group} />
        </>
      ) : (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Note: You can create roster groups by simply dragging and dropping one
          roster onto another, or onto an existing group.
        </Typography>
      )}

      {(screen.isMobile || screen.isTooSmall) && (
        <Button
          variant="contained"
          color="inherit"
          sx={{
            mt: 1,
            whiteSpace: "nowrap", // Prevent text from wrapping
            minWidth: "20ch",
            "&:hover": {
              backgroundColor: (theme) => theme.palette.grey[500],
            },
          }}
          startIcon={lock ? <TbMobiledataOff /> : <TbMobiledata />}
          onClick={() => toggleLock()}
        >
          {lock ? "Drag & Drop: Off" : "Drag & Drop: On"}
        </Button>
      )}
    </Stack>
  );
};
