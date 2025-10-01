import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { FaPatreon } from "react-icons/fa";
import { GroupOptionsPopoverMenu } from "../../../components/common/roster-group-card/RosterGroupPopoverMenu.tsx";
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize.ts";
import { RosterGroup } from "../../../state/roster-building/groups/index.ts";
import { PATREON_LINK } from "../../home/Home.tsx";
import { RostersBreadCrumbs } from "./RostersBreadCrumbs.tsx";

type RostersPageHeaderProps = {
  group?: RosterGroup;
};

export const RostersPageHeader: FunctionComponent<RostersPageHeaderProps> = ({
  group,
}) => {
  const screen = useScreenSize();
  return (
    <Stack>
      <Stack
        direction={screen.isMobile ? "column-reverse" : "row"}
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
    </Stack>
  );
};
