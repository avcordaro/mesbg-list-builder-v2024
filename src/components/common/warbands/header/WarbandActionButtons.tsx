import {
  Cancel,
  ContentCopyOutlined,
  RestartAlt,
  UnfoldLess,
  UnfoldLessDouble,
  UnfoldMore,
  UnfoldMoreDouble,
} from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { useRosterInformation } from "../../../../hooks/useRosterInformation.ts";
import { useWarbandMutations } from "../../../../hooks/useWarbandMutations.ts";
import { useUserPreferences } from "../../../../state/preference";
import { Warband } from "../../../../types/roster.ts";
import { SquareIconButton } from "../../icon-button/SquareIconButton.tsx";

export type WarbandActionButtonsProps = {
  warbandId: string;
  collapsed?: boolean;
  collapse: () => void;
  collapseAll: () => void;
  meta: Warband["meta"];
};

export const WarbandActionButtons: FunctionComponent<
  WarbandActionButtonsProps
> = ({
  warbandId,
  meta: { num: warbandNum },
  collapsed,
  collapse,
  collapseAll,
}) => {
  const { palette } = useTheme();
  const { rosterId: armyId } = useParams();
  const mutations = useWarbandMutations(armyId, warbandId);
  const { getAdjustedMetaData } = useRosterInformation();
  const { leaderCompulsory, leader } = getAdjustedMetaData();
  const { preferences } = useUserPreferences();
  const hasCompulsoryLeader =
    leaderCompulsory &&
    leader === warbandId &&
    !preferences.allowCompulsoryGeneralDelete;
  const iconStyle = { fontSize: "1.5rem" };
  const iconPadding = ".5rem";
  return (
    <Stack direction="row" gap={2}>
      {hasCompulsoryLeader ? (
        <SquareIconButton
          icon={<RestartAlt sx={iconStyle} />}
          iconColor={palette.warning.contrastText}
          iconPadding={iconPadding}
          backgroundColor={palette.warning.main}
          backgroundColorHover={palette.warning.dark}
          onClick={mutations.emptyWarband}
          testId={`warband-header--${warbandNum}--restart-warband-action`}
        />
      ) : (
        <SquareIconButton
          icon={<Cancel sx={iconStyle} />}
          iconColor={palette.error.contrastText}
          iconPadding={iconPadding}
          backgroundColor={palette.error.main}
          backgroundColorHover={palette.error.dark}
          onClick={mutations.removeWarband}
          testId={`warband-header--${warbandNum}--delete-warband-action`}
        />
      )}

      <SquareIconButton
        icon={<ContentCopyOutlined sx={iconStyle} />}
        iconColor={palette.info.contrastText}
        iconPadding={iconPadding}
        backgroundColor={palette.info.light}
        backgroundColorHover={palette.info.main}
        onClick={mutations.duplicateWarband}
        testId={`warband-header--${warbandNum}--duplicate-warband-action`}
      />
      <SquareIconButton
        icon={
          collapsed ? (
            <UnfoldMoreDouble sx={iconStyle} />
          ) : (
            <UnfoldLessDouble sx={iconStyle} />
          )
        }
        iconColor={palette.primary.contrastText}
        iconPadding={iconPadding}
        backgroundColor={palette.grey.A400}
        backgroundColorHover={palette.grey["500"]}
        onClick={collapseAll}
        testId={`warband-header--${warbandNum}--collapse-all-action`}
      />
      <SquareIconButton
        icon={
          collapsed ? (
            <UnfoldMore sx={iconStyle} />
          ) : (
            <UnfoldLess sx={iconStyle} />
          )
        }
        iconColor={palette.primary.contrastText}
        iconPadding={iconPadding}
        backgroundColor={palette.grey.A400}
        backgroundColorHover={palette.grey["500"]}
        onClick={collapse}
        testId={`warband-header--${warbandNum}--collapse-self-action`}
      />
    </Stack>
  );
};
