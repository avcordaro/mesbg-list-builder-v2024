import { Cancel } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import { FunctionComponent } from "react";
import fallbackLogo from "../../../assets/images/default.png";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";
import { SquareIconButton } from "../icon-button/SquareIconButton.tsx";

export type SelectUnitCardButtonProps = {
  warbandNum: number;
  index: number;
  title: string;
  onClick: () => void;
  remove?: () => void;
  collapsed?: boolean;
};

export const SelectUnitCardButton: FunctionComponent<
  SelectUnitCardButtonProps
> = ({ title, warbandNum, index, onClick, remove, collapsed }) => {
  const { mode } = useThemeContext();
  const { palette } = useTheme();
  return (
    <Paper
      onClick={onClick}
      elevation={3}
      sx={{
        pl: 2,
        pr: collapsed ? 2 : 2.5,
        py: collapsed ? 0.5 : 1.5,
        cursor: "pointer",
        "&:hover": {
          filter: "brightness(75%)",
        },
        backgroundColor: ({ palette }) =>
          mode === "dark" ? palette.grey["800"] : "",
      }}
      data-test-id={`select-unit--w${warbandNum}-i${index}`}
    >
      <Stack direction="row" spacing={3} alignItems="center" minWidth="100%">
        <Avatar
          alt={title}
          src={fallbackLogo}
          sx={{
            width: !collapsed ? 60 : 20,
            height: !collapsed ? 60 : 20,
            transition: "width .5s, height .5s",
            "& .MuiAvatar-img": {
              filter: mode === "dark" ? "invert(1)" : "",
            },
          }}
        />
        <Typography
          variant="body1"
          sx={{ flexGrow: 1, textAlign: "start", textTransform: "uppercase" }}
        >
          <b>{title}</b>
        </Typography>
        {remove && (
          <SquareIconButton
            icon={<Cancel sx={{ fontSize: "1.5rem" }} />}
            iconColor={palette.error.contrastText}
            backgroundColor={palette.error.main}
            backgroundColorHover={palette.error.dark}
            iconPadding="1"
            onClick={(e) => {
              e.stopPropagation();
              e.bubbles = false;
              remove();
            }}
            testId={`remove-unit--w${warbandNum}-i${index}`}
          />
        )}
      </Stack>
    </Paper>
  );
};
