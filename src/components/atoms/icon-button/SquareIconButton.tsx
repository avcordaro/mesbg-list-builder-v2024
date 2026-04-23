import IconButton from "@mui/material/IconButton";
import { FunctionComponent, MouseEventHandler, ReactNode } from "react";

export type SquareIconButtonProps = {
  onClick: MouseEventHandler;
  icon: ReactNode;
  iconColor: string;
  iconSize?: string;
  iconPadding?: string;
  backgroundColor: string;
  backgroundColorHover?: string;
  disabled?: boolean;
  testId?: string;
  testName?: string;
};

export const SquareIconButton: FunctionComponent<SquareIconButtonProps> = (
  props,
) => {
  return (
    <IconButton
      onClick={props.onClick}
      disabled={props.disabled}
      sx={{
        borderRadius: 2,
        p: props.iconPadding ?? 1.5,
        color: props.iconColor,
        fontSize: props.iconSize ?? "1rem",
        backgroundColor: props.backgroundColor,
        "&:hover": {
          backgroundColor: props.backgroundColorHover || props.backgroundColor,
        },
      }}
      data-test-id={props.testId}
      data-test-unit-name={props.testName}
    >
      {props.icon}
    </IconButton>
  );
};
