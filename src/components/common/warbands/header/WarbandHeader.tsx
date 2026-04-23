import Stack from "@mui/material/Stack";
import { FunctionComponent } from "react";
import {
  WarbandActionButtonsProps,
  WarbandActionButtons,
} from "./WarbandActionButtons.tsx";
import { WarbandMetadata, WarbandMetadataProps } from "./WarbandMetadata.tsx";

export type WarbandHeaderProps = WarbandMetadataProps &
  WarbandActionButtonsProps;

export const WarbandHeader: FunctionComponent<WarbandHeaderProps> = (props) => {
  return (
    <Stack direction="row" alignItems="center" sx={{ px: 1 }}>
      <WarbandMetadata meta={props.meta} />
      <WarbandActionButtons {...props} />
    </Stack>
  );
};
