import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { useScreenSize } from "../../../../hooks/useScreenSize.ts";
import { Warband } from "../../../../types/roster.ts";

export type WarbandMetadataProps = {
  meta: Warband["meta"];
};

export const WarbandMetadata: FunctionComponent<WarbandMetadataProps> = ({
  meta: { num, points, units, maxUnits },
}) => {
  const screen = useScreenSize();
  return (
    <Stack
      direction={screen.isMobile ? "column" : "row"}
      gap={screen.isMobile ? 0 : 2}
      flexGrow={1}
      data-test-id={`warband-header--${num}--metadata`}
    >
      {!screen.isMobile && (
        <Typography color="white">
          Warband: <b>{num}</b>
        </Typography>
      )}
      <Typography color="white">
        Points: <b>{points}</b>
      </Typography>
      <Typography
        color={maxUnits !== "-" && units > maxUnits ? "warning" : "white"}
      >
        Units:{" "}
        <b>
          {units} / {maxUnits}
        </b>
      </Typography>
    </Stack>
  );
};
