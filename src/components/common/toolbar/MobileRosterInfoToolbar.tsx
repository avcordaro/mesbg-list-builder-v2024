import { Stack } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { armyListData } from "../../../assets/data.ts";
import { useRosterInformation } from "../../../hooks/calculations-and-displays/useRosterInformation.ts";
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize.ts";

export const ROSTER_INFO_BAR_HEIGHT = 40;

export const MobileRosterInfoToolbar = () => {
  const screen = useScreenSize();
  const { roster, getAdjustedMetaData } = useRosterInformation();
  const metadata = getAdjustedMetaData();

  const armyListMetadata = armyListData[roster.armyList];
  const bowLimit = Math.ceil(metadata.bowLimit * armyListMetadata.bow_limit);
  const throwLimit = Math.ceil(
    metadata.throwLimit * armyListMetadata.throw_limit,
  );

  return (
    <>
      {!screen.isDesktop && (
        <Toolbar
          sx={{
            backgroundColor: "#1c1c1e",
            color: "white",
            borderTop: "3px solid #4c4c4e",
            minHeight: `${ROSTER_INFO_BAR_HEIGHT}px !important`,
          }}
        >
          <Stack direction="row" gap={1} flexWrap="wrap" sx={{ m: "auto" }}>
            <Typography
              color={
                !!metadata.maxPoints && metadata.points > metadata.maxPoints
                  ? "warning"
                  : "inherit"
              }
            >
              <span>
                Pts: <b>{metadata.points}</b>
              </span>
            </Typography>
            <Typography>
              Units: <b>{metadata.units}</b>
            </Typography>
            <Typography
              color={metadata.bows > bowLimit ? "warning" : "inherit"}
            >
              Bow:{" "}
              <b style={{ display: "inline-flex", gap: "2px" }}>
                <span>{metadata.bows}</span>
                {screen.isTablet && <span>/{bowLimit}</span>}
              </b>
            </Typography>
            <Typography
              color={
                metadata.throwingWeapons > throwLimit ? "warning" : "inherit"
              }
            >
              Thr. Weap:{" "}
              <b style={{ display: "inline-flex", gap: "2px" }}>
                <span>{metadata.throwingWeapons}</span>
                {screen.isTablet && <span>/{throwLimit}</span>}
              </b>
            </Typography>
          </Stack>
        </Toolbar>
      )}
    </>
  );
};
