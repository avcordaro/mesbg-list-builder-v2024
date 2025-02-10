import { Stack, TextField } from "@mui/material";
import { FunctionComponent } from "react";

type BannerVPsProps = {
  value: number[];
  setValue: (value: number[]) => void;
};

export const BannerVPs: FunctionComponent<BannerVPsProps> = ({
  value,
  setValue,
}) => {
  return (
    <Stack gap={2}>
      <TextField
        fullWidth
        label="Banners remaining"
        name="banners"
        value={value[0]}
        type="number"
        slotProps={{ htmlInput: { min: 0 } }}
        onChange={(event) => setValue([Number(event.target.value), value[1]])}
        size="small"
        required
      />
      <TextField
        fullWidth
        label="Opponents banners remaining"
        name="opponentBanners"
        value={value[1]}
        type="number"
        slotProps={{ htmlInput: { min: 0 } }}
        onChange={(event) => setValue([value[0], Number(event.target.value)])}
        size="small"
        required
      />
    </Stack>
  );
};
