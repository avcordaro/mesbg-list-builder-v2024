import { AddOutlined, RemoveOutlined } from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { FunctionComponent } from "react";
import { slugify } from "../../../utils/string.ts";
import { SquareIconButton } from "../icon-button/SquareIconButton.tsx";

type QuantityButtonsProps = {
  quantity: number;
  updateQuantity: (value: number) => void;
  unitName: string;
  warbandNum: number;
  index: number;
  collapsed?: boolean;
};
export const QuantityButtons: FunctionComponent<QuantityButtonsProps> = ({
  quantity,
  updateQuantity,
  warbandNum,
  index,
  unitName,
  collapsed,
}) => {
  const { palette } = useTheme();

  function handleIncrement() {
    updateQuantity(quantity + 1);
  }

  function handleDecrement() {
    updateQuantity(Math.max(quantity - 1, 1));
  }

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: collapsed ? "center" : "space-between",
        justifyContent: "space-between",
        transition: "align-items 0.3s",
      }}
      gap={2}
    >
      <SquareIconButton
        icon={<RemoveOutlined sx={{ fontSize: "1.5rem" }} />}
        iconColor={palette.primary.contrastText}
        backgroundColor={palette.primary.main}
        backgroundColorHover={palette.primary.dark}
        iconPadding="1"
        onClick={handleDecrement}
        disabled={quantity === 1}
        testId={`quantity--decrement--w${warbandNum}-i${index}`}
        testName={`quantity--decrement--${slugify(unitName)}`}
      />
      <SquareIconButton
        icon={<AddOutlined sx={{ fontSize: "1.5rem" }} />}
        iconColor={palette.primary.contrastText}
        backgroundColor={palette.primary.main}
        backgroundColorHover={palette.primary.dark}
        iconPadding="1"
        onClick={handleIncrement}
        testId={`quantity--increment--w${warbandNum}-i${index}`}
        testName={`quantity--increment--${slugify(unitName)}`}
      />
    </Stack>
  );
};
