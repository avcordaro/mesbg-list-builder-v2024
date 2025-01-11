import { Cancel, ContentCopyOutlined, RestartAlt } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { FunctionComponent } from "react";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { slugify } from "../../../utils/string.ts";
import { SquareIconButton } from "../icon-button/SquareIconButton.tsx";

type CardActionButtonsProps = {
  duplicate?: () => void;
  remove?: () => void;
  reselect?: () => void;
  openProfileCard?: () => void;
  warbandNum: number;
  index: number;
  unitName: string;
};

export const CardActionButtons: FunctionComponent<CardActionButtonsProps> = ({
  duplicate,
  remove,
  reselect,
  openProfileCard,
  warbandNum,
  index,
  unitName,
}) => {
  const { palette } = useTheme();
  return (
    <Box sx={{ zIndex: 2 }}>
      <Stack direction="row" gap={2}>
        {!!openProfileCard && (
          <SquareIconButton
            icon={<BsFillPersonVcardFill />}
            iconColor={palette.primary.contrastText}
            backgroundColor={palette.grey.A700}
            backgroundColorHover={palette.grey["900"]}
            onClick={openProfileCard}
            testId={`open-profile-card--w${warbandNum}-i${index}`}
            testName={`open-profile-card--${slugify(unitName)}`}
          />
        )}
        {!!duplicate && (
          <SquareIconButton
            icon={<ContentCopyOutlined sx={{ fontSize: "1.5rem" }} />}
            iconColor={palette.info.contrastText}
            backgroundColor={palette.info.light}
            backgroundColorHover={palette.info.main}
            iconPadding="1"
            onClick={duplicate}
            testId={`duplicate-unit--w${warbandNum}-i${index}`}
            testName={`duplicate-unit--${slugify(unitName)}`}
          />
        )}
        {!!reselect && (
          <SquareIconButton
            icon={<RestartAlt sx={{ fontSize: "1.5rem" }} />}
            iconColor={palette.warning.contrastText}
            backgroundColor={palette.warning.main}
            backgroundColorHover={palette.warning.dark}
            iconPadding="1"
            onClick={reselect}
            testId={`reselect-unit--w${warbandNum}-i${index}`}
            testName={`reselect-unit--${slugify(unitName)}`}
          />
        )}

        {!!remove && (
          <SquareIconButton
            icon={<Cancel sx={{ fontSize: "1.5rem" }} />}
            iconColor={palette.error.contrastText}
            backgroundColor={palette.error.main}
            backgroundColorHover={palette.error.dark}
            iconPadding="1"
            onClick={remove}
            testId={`remove-unit--w${warbandNum}-i${index}`}
            testName={`remove-unit--${slugify(unitName)}`}
          />
        )}
      </Stack>
    </Box>
  );
};
