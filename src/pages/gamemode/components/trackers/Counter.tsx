import { Add, Remove } from "@mui/icons-material";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { SquareIconButton } from "../../../../components/common/icon-button/SquareIconButton.tsx";

type MwfwUpdateCallback = (newValue: number) => void;

export const Counter: FunctionComponent<{
  value: number;
  maxValue: number;
  update: MwfwUpdateCallback;
  alive: boolean;
}> = (props) => {
  const increment = () => {
    props.update(props.value + 1);
  };
  const decrement = () => {
    props.update(props.value - 1);
  };

  return (
    <Stack direction="row" gap={2} alignItems="center">
      <SquareIconButton
        onClick={decrement}
        icon={<Remove />}
        iconColor="white"
        backgroundColor="lightgrey"
        iconPadding=".4rem"
        disabled={props.value <= 0 || !props.alive}
      />

      <Typography
        variant="body1"
        sx={{ fontSize: "1.4rem", fontWeight: "bolder" }}
        color={props.value === 0 ? "error" : "inherit"}
      >
        {props.value}
      </Typography>

      <SquareIconButton
        onClick={increment}
        icon={<Add />}
        iconColor="white"
        backgroundColor="lightgrey"
        iconPadding=".4rem"
        disabled={props.value >= props.maxValue || !props.alive}
      />
    </Stack>
  );
};
